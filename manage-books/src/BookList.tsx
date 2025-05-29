import React from 'react';
import BookItem from './BookItem'; // Assuming BookItem.tsx is in the same directory
import type { Book } from './types'; // Import shared type

interface BookListProps {
  books: Book[]; // Use imported Book
  onEdit: (book: Book) => void; // Use imported Book
  onDelete: (id: number) => void;
}

const BookList: React.FC<BookListProps> = ({ books, onEdit, onDelete }) => {
  if (!books || books.length === 0) {
    return <p>No books available. Add some!</p>;
  }

  return (
    <div>
      <h2>Book List</h2>
      {books.map(book => (
        <BookItem
          key={book.id}
          book={book}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
};

export default BookList;
