import React, { useState, useEffect } from 'react';
import './App.css';
import BookList from './BookList';
import BookForm from './BookForm';
import { openDB, getAllBooks, addBook, updateBook, deleteBook } from './indexedDB';

function App() {
  const [books, setBooks] = useState([]);
  const [currentBook, setCurrentBook] = useState(null); // For editing

  useEffect(() => {
    const fetchBooks = async () => {
      await openDB(); // Ensure DB is open
      const allBooks = await getAllBooks();
      setBooks(allBooks);
    };
    fetchBooks();
  }, []);

  const handleAddBook = async (book) => {
    const newBookId = await addBook(book);
    const newBook = { ...book, id: newBookId };
    setBooks([...books, newBook]);
  };

  const handleUpdateBook = async (book) => {
    await updateBook(book);
    setBooks(books.map(b => (b.id === book.id ? book : b)));
    setCurrentBook(null); // Clear current book after update
  };

  const handleDeleteBook = async (id) => {
    await deleteBook(id);
    setBooks(books.filter(book => book.id !== id));
  };

  const handleEditBook = (book) => {
    setCurrentBook(book);
  };

  const handleFormSubmit = (bookData) => {
    if (currentBook) {
      handleUpdateBook({ ...currentBook, ...bookData });
    } else {
      handleAddBook(bookData);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Book Management App</h1>
      </header>
      <main>
        <BookForm
          onSubmit={handleFormSubmit}
          currentBook={currentBook}
          setCurrentBook={setCurrentBook} // To allow BookForm to clear the form
        />
        <BookList
          books={books}
          onDelete={handleDeleteBook}
          onEdit={handleEditBook}
        />
      </main>
    </div>
  );
}

export default App;
