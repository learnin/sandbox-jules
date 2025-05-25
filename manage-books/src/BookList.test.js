import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import BookList from './BookList';
// Mock BookItem to simplify BookList tests and focus on BookList's logic
jest.mock('./BookItem', () => (props) => (
  <div data-testid="book-item">
    <span>{props.book.title}</span>
    <button onClick={() => props.onEdit(props.book)}>Edit</button>
    <button onClick={() => props.onDelete(props.book.id)}>Delete</button>
  </div>
));

describe('BookList', () => {
  const mockBooks = [
    { id: 1, title: 'Book One', author: 'Author One', isbn: '111' },
    { id: 2, title: 'Book Two', author: 'Author Two', isbn: '222' },
  ];
  const mockOnEdit = jest.fn();
  const mockOnDelete = jest.fn();

  it('renders a list of BookItem components when books are provided', () => {
    render(<BookList books={mockBooks} onEdit={mockOnEdit} onDelete={mockOnDelete} />);
    
    const bookItems = screen.getAllByTestId('book-item');
    expect(bookItems.length).toBe(2);
    expect(screen.getByText('Book One')).toBeInTheDocument();
    expect(screen.getByText('Book Two')).toBeInTheDocument();
  });

  it('renders "No books available. Add some!" message when the book list is empty', () => {
    render(<BookList books={[]} onEdit={mockOnEdit} onDelete={mockOnDelete} />);
    expect(screen.getByText('No books available. Add some!')).toBeInTheDocument();
  });

  it('renders "No books available. Add some!" message when books prop is null or undefined', () => {
    render(<BookList books={null} onEdit={mockOnEdit} onDelete={mockOnDelete} />);
    expect(screen.getByText('No books available. Add some!')).toBeInTheDocument();
  });

  // Since BookItem is mocked, we can't directly test if onEdit/onDelete on BookItem are called.
  // Those interactions are tested in BookItem.test.js.
  // Here, we ensure that BookList passes the correct props to the mocked BookItem.
  // This is implicitly covered by jest.mock and the rendering of mocked children.
  // If we wanted to be more explicit, we could check the props of the mock.
  it('passes onEdit and onDelete props to BookItem components', () => {
    render(<BookList books={mockBooks} onEdit={mockOnEdit} onDelete={mockOnDelete} />);
    
    // Example: Clicking edit on the first mocked BookItem
    // This relies on the mock implementation correctly setting up the onClick.
    const editButtons = screen.getAllByRole('button', { name: /edit/i });
    fireEvent.click(editButtons[0]);
    expect(mockOnEdit).toHaveBeenCalledWith(mockBooks[0]);

    const deleteButtons = screen.getAllByRole('button', { name: /delete/i });
    fireEvent.click(deleteButtons[1]);
    expect(mockOnDelete).toHaveBeenCalledWith(mockBooks[1].id);
  });
});
