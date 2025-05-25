import React, { useState, useEffect } from 'react';

const BookForm = ({ onSubmit, currentBook, setCurrentBook }) => {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [isbn, setIsbn] = useState('');

  useEffect(() => {
    if (currentBook) {
      setTitle(currentBook.title);
      setAuthor(currentBook.author);
      setIsbn(currentBook.isbn);
    } else {
      // Clear form if no current book (e.g., after an update or for a new book)
      setTitle('');
      setAuthor('');
      setIsbn('');
    }
  }, [currentBook]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title || !author || !isbn) {
      alert('Please fill in all fields');
      return;
    }
    onSubmit({ title, author, isbn });
    // Clear form fields after submission
    setTitle('');
    setAuthor('');
    setIsbn('');
    if (setCurrentBook) setCurrentBook(null); // Clear currentBook in App.js
  };

  const handleCancelEdit = () => {
    setTitle('');
    setAuthor('');
    setIsbn('');
    if (setCurrentBook) setCurrentBook(null);
  }

  return (
    <form onSubmit={handleSubmit}>
      <h2>{currentBook ? 'Edit Book' : 'Add Book'}</h2>
      <div>
        <label>Title:</label>
        <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required />
      </div>
      <div>
        <label>Author:</label>
        <input type="text" value={author} onChange={(e) => setAuthor(e.target.value)} required />
      </div>
      <div>
        <label>ISBN:</label>
        <input type="text" value={isbn} onChange={(e) => setIsbn(e.target.value)} required />
      </div>
      <button type="submit">{currentBook ? 'Update Book' : 'Add Book'}</button>
      {currentBook && <button type="button" onClick={handleCancelEdit}>Cancel Edit</button>}
    </form>
  );
};

export default BookForm;
