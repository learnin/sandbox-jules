import React from 'react';
import type { Book } from './types'; // Import shared type

interface BookItemProps {
  book: Book; // Use imported Book
  onEdit: (book: Book) => void; // Use imported Book
  onDelete: (id: number) => void;
}

const BookItem: React.FC<BookItemProps> = ({ book, onEdit, onDelete }) => {
  // The check for !book might be removed if BookList guarantees book is always provided.
  // For now, keeping it as a safeguard.
  if (!book) {
    return <div>No book data!</div>;
  }

  // Destructure year instead of isbn
  const { id, title, author, year } = book;

  return (
    <div style={{ border: '1px solid #ccc', margin: '10px', padding: '10px' }}>
      <h3>{title}</h3>
      <p>Author: {author}</p>
      <p>Year: {year}</p> {/* Changed from ISBN to Year */}
      <p><small>ID: {id}</small></p>
      <button onClick={() => onEdit(book)}>Edit</button>
      <button onClick={() => onDelete(id)}>Delete</button>
    </div>
  );
};

export default BookItem;
