import React from 'react';

const BookItem = ({ book, onEdit, onDelete }) => {
  if (!book) {
    return <div>No book data!</div>;
  }

  const { id, title, author, isbn } = book;

  return (
    <div style={{ border: '1px solid #ccc', margin: '10px', padding: '10px' }}>
      <h3>{title}</h3>
      <p>Author: {author}</p>
      <p>ISBN: {isbn}</p>
      <p><small>ID: {id}</small></p>
      <button onClick={() => onEdit(book)}>Edit</button>
      <button onClick={() => onDelete(id)}>Delete</button>
    </div>
  );
};

export default BookItem;
