import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import BookForm from './BookForm';

describe('BookForm', () => {
  const mockOnSubmit = jest.fn();
  const mockSetCurrentBook = jest.fn();

  beforeEach(() => {
    mockOnSubmit.mockClear();
    mockSetCurrentBook.mockClear();
  });

  it('renders correctly with input fields and an "Add Book" button', () => {
    render(<BookForm onSubmit={mockOnSubmit} />);
    
    expect(screen.getByLabelText(/title/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/author/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/isbn/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /add book/i })).toBeInTheDocument();
  });

  it('updates input fields when user types', () => {
    render(<BookForm onSubmit={mockOnSubmit} />);
    
    const titleInput = screen.getByLabelText(/title/i);
    const authorInput = screen.getByLabelText(/author/i);
    const isbnInput = screen.getByLabelText(/isbn/i);

    fireEvent.change(titleInput, { target: { value: 'New Title' } });
    fireEvent.change(authorInput, { target: { value: 'New Author' } });
    fireEvent.change(isbnInput, { target: { value: '12345' } });

    expect(titleInput.value).toBe('New Title');
    expect(authorInput.value).toBe('New Author');
    expect(isbnInput.value).toBe('12345');
  });

  it('calls onSubmit with correct data when form is submitted for a new book', () => {
    render(<BookForm onSubmit={mockOnSubmit} setCurrentBook={mockSetCurrentBook} />);
    
    fireEvent.change(screen.getByLabelText(/title/i), { target: { value: 'Test Title' } });
    fireEvent.change(screen.getByLabelText(/author/i), { target: { value: 'Test Author' } });
    fireEvent.change(screen.getByLabelText(/isbn/i), { target: { value: '98765' } });
    
    fireEvent.click(screen.getByRole('button', { name: /add book/i }));
    
    expect(mockOnSubmit).toHaveBeenCalledTimes(1);
    expect(mockOnSubmit).toHaveBeenCalledWith({
      title: 'Test Title',
      author: 'Test Author',
      isbn: '98765',
    });
    expect(mockSetCurrentBook).toHaveBeenCalledWith(null); // Form should be cleared
  });

  it('pre-fills form fields if currentBook prop is provided and shows "Update Book" button', () => {
    const currentBook = { title: 'Existing Title', author: 'Existing Author', isbn: '00000' };
    render(<BookForm onSubmit={mockOnSubmit} currentBook={currentBook} setCurrentBook={mockSetCurrentBook} />);
    
    expect(screen.getByLabelText(/title/i).value).toBe('Existing Title');
    expect(screen.getByLabelText(/author/i).value).toBe('Existing Author');
    expect(screen.getByLabelText(/isbn/i).value).toBe('00000');
    expect(screen.getByRole('button', { name: /update book/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /cancel edit/i })).toBeInTheDocument();
  });

  it('calls onSubmit with updated data when form is submitted for an existing book', () => {
    const currentBook = { id: 1, title: 'Old Title', author: 'Old Author', isbn: '12121' };
    render(<BookForm onSubmit={mockOnSubmit} currentBook={currentBook} setCurrentBook={mockSetCurrentBook} />);
    
    fireEvent.change(screen.getByLabelText(/title/i), { target: { value: 'Updated Title' } });
    fireEvent.click(screen.getByRole('button', { name: /update book/i }));
    
    expect(mockOnSubmit).toHaveBeenCalledTimes(1);
    expect(mockOnSubmit).toHaveBeenCalledWith({
      title: 'Updated Title', // Only title was changed
      author: 'Old Author',
      isbn: '12121',
    });
     expect(mockSetCurrentBook).toHaveBeenCalledWith(null);
  });

  it('clears form and calls setCurrentBook(null) when cancel edit is clicked', () => {
    const currentBook = { title: 'Existing Title', author: 'Existing Author', isbn: '00000' };
    render(<BookForm onSubmit={mockOnSubmit} currentBook={currentBook} setCurrentBook={mockSetCurrentBook} />);

    expect(screen.getByLabelText(/title/i).value).toBe('Existing Title'); // Ensure it's pre-filled

    fireEvent.click(screen.getByRole('button', { name: /cancel edit/i }));

    expect(screen.getByLabelText(/title/i).value).toBe(''); // Should be cleared
    expect(screen.getByLabelText(/author/i).value).toBe('');
    expect(screen.getByLabelText(/isbn/i).value).toBe('');
    expect(mockSetCurrentBook).toHaveBeenCalledTimes(1);
    expect(mockSetCurrentBook).toHaveBeenCalledWith(null);
  });
  
  it('shows an alert if submitting with empty required fields', () => {
    window.alert = jest.fn(); // Mock window.alert
    render(<BookForm onSubmit={mockOnSubmit} />);
    
    fireEvent.click(screen.getByRole('button', { name: /add book/i }));
    
    expect(window.alert).toHaveBeenCalledWith('Please fill in all fields');
    expect(mockOnSubmit).not.toHaveBeenCalled();
    window.alert.mockRestore(); // Restore original window.alert
  });
});
