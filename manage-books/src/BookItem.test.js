import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import BookItem from './BookItem';

describe('BookItem', () => {
  const mockBook = {
    id: 1,
    title: 'Sample Book Title',
    author: 'Sample Author',
    isbn: '123-4567890123',
  };
  const mockOnEdit = jest.fn();
  const mockOnDelete = jest.fn();

  beforeEach(() => {
    mockOnEdit.mockClear();
    mockOnDelete.mockClear();
  });

  it('renders book details correctly', () => {
    render(<BookItem book={mockBook} onEdit={mockOnEdit} onDelete={mockOnDelete} />);
    
    expect(screen.getByText(mockBook.title)).toBeInTheDocument();
    expect(screen.getByText(`Author: ${mockBook.author}`)).toBeInTheDocument();
    expect(screen.getByText(`ISBN: ${mockBook.isbn}`)).toBeInTheDocument();
    expect(screen.getByText(`ID: ${mockBook.id}`)).toBeInTheDocument();
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
    render(<BookItem book={null} onEdit={mockOnEdit} onDelete={mockOnDelete} />);
    expect(screen.getByText('No book data!')).toBeInTheDocument();
  });
});
