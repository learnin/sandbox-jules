import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
// import '@testing-library/jest-dom'; // Should be available globally via vitest.setup.ts
import BookItem from './BookItem';

// Assuming Book interface is defined in App.tsx or a shared types file
// { id: number; title: string; author: string; year: number; }
interface Book {
  id: number;
  title: string;
  author: string;
  year: number;
}

describe('BookItem', () => {
  const mockBook: Book = {
    id: 1,
    title: 'Sample Book Title',
    author: 'Sample Author',
    year: 2023, // Changed from isbn to year
  };
  const mockOnEdit = vi.fn<(book: Book) => void>();
  const mockOnDelete = vi.fn<(id: number) => void>();

  beforeEach(() => {
    mockOnEdit.mockClear();
    mockOnDelete.mockClear();
  });

  it('renders book details correctly', () => {
    render(<BookItem book={mockBook} onEdit={mockOnEdit} onDelete={mockOnDelete} />);
    
    expect(screen.getByText(mockBook.title)).toBeInTheDocument();
    expect(screen.getByText(`Author: ${mockBook.author}`)).toBeInTheDocument();
    expect(screen.getByText(`Year: ${mockBook.year}`)).toBeInTheDocument(); // Changed from ISBN to Year
    expect(screen.getByText(`ID: ${mockBook.id}`)).toBeInTheDocument(); // ID display might be part of your component
    expect(screen.getByRole('button', { name: /edit/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /delete/i })).toBeInTheDocument();
  });

  it('calls onEdit with the book data when "Edit" button is clicked', () => {
    render(<BookItem book={mockBook} onEdit={mockOnEdit} onDelete={mockOnDelete} />);
    
    fireEvent.click(screen.getByRole('button', { name: /edit/i }));
    
    expect(mockOnEdit).toHaveBeenCalledTimes(1);
    expect(mockOnEdit).toHaveBeenCalledWith(mockBook);
  });

  it('calls onDelete with the book id when "Delete" button is clicked', () => {
    render(<BookItem book={mockBook} onEdit={mockOnEdit} onDelete={mockOnDelete} />);
    
    fireEvent.click(screen.getByRole('button', { name: /delete/i }));
    
    expect(mockOnDelete).toHaveBeenCalledTimes(1);
    expect(mockOnDelete).toHaveBeenCalledWith(mockBook.id);
  });

  it('renders "No book data!" if book prop is null or undefined', () => {
    // @ts-expect-error testing null case for book prop
    render(<BookItem book={null} onEdit={mockOnEdit} onDelete={mockOnDelete} />);
    expect(screen.getByText('No book data!')).toBeInTheDocument();
  });
});
