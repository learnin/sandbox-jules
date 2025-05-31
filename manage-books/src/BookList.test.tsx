import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
// import '@testing-library/jest-dom'; // Should be available globally via vitest.setup.ts
import BookList from './BookList';

// Define Book interface (should match the one in App.tsx / BookItem.tsx)
interface Book {
  id: number;
  title: string;
  author: string;
  year: number; // Standardized to year
}

// Mock BookItem to simplify BookList tests and focus on BookList's logic
vi.mock('./BookItem', () => ({
  // Default export for React components is usually an object with a default property
  default: (props: { book: Book, onEdit: (book: Book) => void, onDelete: (id: number) => void }) => (
    <div data-testid="book-item">
      <span>{props.book.title}</span>
      <button onClick={() => props.onEdit(props.book)}>Edit</button>
      <button onClick={() => props.onDelete(props.book.id)}>Delete</button>
    </div>
  )
}));

describe('BookList', () => {
  const mockBooks: Book[] = [
    { id: 1, title: 'Book One', author: 'Author One', year: 2021 }, // Changed isbn to year
    { id: 2, title: 'Book Two', author: 'Author Two', year: 2022 }, // Changed isbn to year
  ];
  const mockOnEdit = vi.fn<(book: Book) => void>();
  const mockOnDelete = vi.fn<(id: number) => void>();

  it('renders a list of BookItem components when books are provided', () => {
    render(<BookList books={mockBooks} onEdit={mockOnEdit} onDelete={mockOnDelete} />);
    
    const bookItems = screen.getAllByTestId('book-item');
    expect(bookItems.length).toBe(2);
    expect(screen.getByText('Book One')).toBeInTheDocument(); // Title is in the mocked BookItem
    expect(screen.getByText('Book Two')).toBeInTheDocument(); // Title is in the mocked BookItem
  });

  it('renders "No books available. Add some!" message when the book list is empty', () => {
    render(<BookList books={[]} onEdit={mockOnEdit} onDelete={mockOnDelete} />);
    expect(screen.getByText('No books available. Add some!')).toBeInTheDocument();
  });

  it('renders "No books available. Add some!" message when books prop is null or undefined', () => {
    // @ts-expect-error testing null case for books prop
    render(<BookList books={null} onEdit={mockOnEdit} onDelete={mockOnDelete} />);
    expect(screen.getByText('No books available. Add some!')).toBeInTheDocument();
  });

  it('passes onEdit and onDelete props to BookItem components and they can be called', () => {
    render(<BookList books={mockBooks} onEdit={mockOnEdit} onDelete={mockOnDelete} />);
    
    const editButtons = screen.getAllByRole('button', { name: /edit/i });
    fireEvent.click(editButtons[0]); // Click edit on the first book
    expect(mockOnEdit).toHaveBeenCalledTimes(1);
    expect(mockOnEdit).toHaveBeenCalledWith(mockBooks[0]);

    const deleteButtons = screen.getAllByRole('button', { name: /delete/i });
    fireEvent.click(deleteButtons[1]); // Click delete on the second book
    expect(mockOnDelete).toHaveBeenCalledTimes(1);
    expect(mockOnDelete).toHaveBeenCalledWith(mockBooks[1].id);
  });
});
