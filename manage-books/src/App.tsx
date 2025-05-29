import React, { useState, useEffect } from 'react';
import './App.css';
import BookList from './BookList';
import BookForm from './BookForm';
import { openDB, getAllBooks, addBook, updateBook, deleteBook } from './indexedDB';
import type { Book, BookData } from './types'; // Import shared types

function App(): JSX.Element {
  const [books, setBooks] = useState<Book[]>([]); // Use imported Book
  const [currentBook, setCurrentBook] = useState<Book | null>(null); // Use imported Book

  useEffect(() => {
    const fetchBooks = async () => {
      await openDB(); // Ensure DB is open
      const allBooks: Book[] = await getAllBooks(); // Ensure getAllBooks returns Book[]
      setBooks(allBooks);
    };
    fetchBooks();
  }, []);

  const handleAddBook = async (bookData: BookData) => { // Use BookData
    const newBookId = await addBook(bookData);
    // Assuming addBook returns the ID, and we construct the full Book object
    const newBook: Book = { ...bookData, id: newBookId };
    setBooks([...books, newBook]);
  };

  const handleUpdateBook = async (bookToUpdate: Book) => { // Use Book
    await updateBook(bookToUpdate);
    setBooks(books.map(b => (b.id === bookToUpdate.id ? bookToUpdate : b)));
    setCurrentBook(null); // Clear current book after update
  };

  const handleDeleteBook = async (id: number) => {
    await deleteBook(id);
    setBooks(books.filter(book => book.id !== id));
  };

  const handleEditBook = (book: Book) => { // Use Book
    setCurrentBook(book);
  };

  const handleFormSubmit = (bookFormData: BookData) => { // Use BookData from form
    if (currentBook && typeof currentBook.id === 'number') {
      // When updating, currentBook has an id. We merge form data with it.
      handleUpdateBook({ ...bookFormData, id: currentBook.id });
    } else {
      handleAddBook(bookFormData);
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
