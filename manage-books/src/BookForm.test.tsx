import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
// import '@testing-library/jest-dom'; // Should be available globally via vitest.setup.ts
import BookForm from './BookForm';
import type { Book, BookData } from './types'; // Changed import to ./types

describe('BookForm', () => {
  const mockOnSubmit = vi.fn<(book: BookData) => void>(); // Use BookData
  const mockSetCurrentBook = vi.fn<(book: Book | null) => void>();
  let alertSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    mockOnSubmit.mockClear();
    mockSetCurrentBook.mockClear();
    // Mock window.alert for tests that trigger it
    alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {});
  });

  afterEach(() => {
    alertSpy.mockRestore(); // Restore original window.alert after each test
  });

  it('renders correctly with input fields and an "Add Book" button', () => {
    render(<BookForm onSubmit={mockOnSubmit} currentBook={null} setCurrentBook={mockSetCurrentBook} />);
    
    expect(screen.getByLabelText(/title/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/author/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/year/i)).toBeInTheDocument(); // Changed from isbn to year
    expect(screen.getByRole('button', { name: /add book/i })).toBeInTheDocument();
  });

  it('updates input fields when user types', () => {
    render(<BookForm onSubmit={mockOnSubmit} currentBook={null} setCurrentBook={mockSetCurrentBook} />);
    
    const titleInput = screen.getByLabelText(/title/i) as HTMLInputElement;
    const authorInput = screen.getByLabelText(/author/i) as HTMLInputElement;
    const yearInput = screen.getByLabelText(/year/i) as HTMLInputElement; // Changed from isbn

    fireEvent.change(titleInput, { target: { value: 'New Title' } });
    fireEvent.change(authorInput, { target: { value: 'New Author' } });
    fireEvent.change(yearInput, { target: { value: '2023' } }); // Changed to year

    expect(titleInput.value).toBe('New Title');
    expect(authorInput.value).toBe('New Author');
    expect(yearInput.value).toBe('2023'); // Stored as string in input type=number
  });

  it('calls onSubmit with correct data when form is submitted for a new book', () => {
    render(<BookForm onSubmit={mockOnSubmit} currentBook={null} setCurrentBook={mockSetCurrentBook} />);
    
    fireEvent.change(screen.getByLabelText(/title/i), { target: { value: 'Test Title' } });
    fireEvent.change(screen.getByLabelText(/author/i), { target: { value: 'Test Author' } });
    fireEvent.change(screen.getByLabelText(/year/i), { target: { value: '2024' } }); // Changed to year
    
    fireEvent.click(screen.getByRole('button', { name: /add book/i }));
    
    expect(mockOnSubmit).toHaveBeenCalledTimes(1);
    expect(mockOnSubmit).toHaveBeenCalledWith({
      title: 'Test Title',
      author: 'Test Author',
      year: 2024, // Expect number
    });
    expect(mockSetCurrentBook).toHaveBeenCalledWith(null); // Form should be cleared
  });

  it('pre-fills form fields if currentBook prop is provided and shows "Update Book" button', () => {
    // BookForm expects currentBook to have a 'year' property
    const currentBookData: Book = { id:1, title: 'Existing Title', author: 'Existing Author', year: 2020 };
    render(<BookForm onSubmit={mockOnSubmit} currentBook={currentBookData} setCurrentBook={mockSetCurrentBook} />);
    
    expect((screen.getByLabelText(/title/i) as HTMLInputElement).value).toBe('Existing Title');
    expect((screen.getByLabelText(/author/i) as HTMLInputElement).value).toBe('Existing Author');
    expect((screen.getByLabelText(/year/i) as HTMLInputElement).value).toBe('2020'); // Changed to year
    expect(screen.getByRole('button', { name: /update book/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /cancel edit/i })).toBeInTheDocument();
  });

  it('calls onSubmit with updated data when form is submitted for an existing book', () => {
    const currentBookData: Book = { id: 1, title: 'Old Title', author: 'Old Author', year: 2021 };
    render(<BookForm onSubmit={mockOnSubmit} currentBook={currentBookData} setCurrentBook={mockSetCurrentBook} />);
    
    fireEvent.change(screen.getByLabelText(/title/i), { target: { value: 'Updated Title' } });
    fireEvent.change(screen.getByLabelText(/year/i), { target: { value: '2022' } }); // Also update year
    fireEvent.click(screen.getByRole('button', { name: /update book/i }));
    
    expect(mockOnSubmit).toHaveBeenCalledTimes(1);
    // BookForm submits the full currentBook merged with changes.
    // App.tsx's handleFormSubmit takes Omit<Book, 'id'>, so it receives {title, author, year}
    // but BookForm's onSubmit prop currently takes BookFormInput {title, author, year}
    // This means the component itself constructs this object from its state.
    expect(mockOnSubmit).toHaveBeenCalledWith({ 
      title: 'Updated Title', 
      author: 'Old Author', // Author wasn't changed in this specific interaction in the form
      year: 2022,           // Year was changed
    });
    expect(mockSetCurrentBook).toHaveBeenCalledWith(null);
  });

  it('clears form and calls setCurrentBook(null) when cancel edit is clicked', () => {
    const currentBookData: Book = { id: 2, title: 'Existing Title', author: 'Existing Author', year: 2021 };
    render(<BookForm onSubmit={mockOnSubmit} currentBook={currentBookData} setCurrentBook={mockSetCurrentBook} />);

    expect((screen.getByLabelText(/title/i) as HTMLInputElement).value).toBe('Existing Title');

    fireEvent.click(screen.getByRole('button', { name: /cancel edit/i }));

    expect((screen.getByLabelText(/title/i) as HTMLInputElement).value).toBe('');
    expect((screen.getByLabelText(/author/i) as HTMLInputElement).value).toBe('');
    expect((screen.getByLabelText(/year/i) as HTMLInputElement).value).toBe(''); // Changed to year
    expect(mockSetCurrentBook).toHaveBeenCalledTimes(1);
    expect(mockSetCurrentBook).toHaveBeenCalledWith(null);
  });
  
  it('shows an alert if submitting with empty required fields', () => {
    render(<BookForm onSubmit={mockOnSubmit} currentBook={null} setCurrentBook={mockSetCurrentBook} />);
    
    fireEvent.click(screen.getByRole('button', { name: /add book/i }));
    
    expect(alertSpy).toHaveBeenCalledWith('Please fill in all fields');
    expect(mockOnSubmit).not.toHaveBeenCalled();
  });
});
