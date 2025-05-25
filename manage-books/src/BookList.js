import React from 'react';
import BookItem from './BookItem';

const BookList = ({ books, onEdit, onDelete }) => {
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
