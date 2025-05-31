import React, { useState, useEffect, ChangeEvent, FormEvent } from 'react';

// Assuming Book is defined in App.tsx or a shared types file
// For now, let's define it here if not imported.
// import React, { useState, useEffect, ChangeEvent, FormEvent } from 'react'; // Removed duplicate
import type { Book, BookData } from './types'; // Import shared types

interface BookFormProps {
  onSubmit: (bookData: BookData) => void; // Use imported BookData
  currentBook: Book | null;               // Use imported Book
  setCurrentBook: (book: Book | null) => void; // Use imported Book
}

const BookForm: React.FC<BookFormProps> = ({ onSubmit, currentBook, setCurrentBook }) => {
  const [title, setTitle] = useState<string>('');
  const [author, setAuthor] = useState<string>('');
  const [year, setYear] = useState<string>(''); // Store as string to allow empty input, parse on submit

  useEffect(() => {
    if (currentBook) {
      setTitle(currentBook.title);
      setAuthor(currentBook.author);
      setYear(currentBook.year.toString()); // Set year from currentBook
    } else {
      // Clear form if no current book
      setTitle('');
      setAuthor('');
      setYear('');
    }
  }, [currentBook]);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!title || !author || !year) { // Check for year
      alert('Please fill in all fields');
      return;
    }
    const yearAsNumber = parseInt(year, 10);
    if (isNaN(yearAsNumber)) {
      alert('Please enter a valid year.');
      return;
    }
    onSubmit({ title, author, year: yearAsNumber }); // Submit year
    // Clear form fields after submission
    setTitle('');
    setAuthor('');
    setYear('');
    if (setCurrentBook) setCurrentBook(null);
  };

  const handleCancelEdit = () => {
    setTitle('');
    setAuthor('');
    setYear(''); // Clear year
    if (setCurrentBook) setCurrentBook(null);
  }

  return (
    <form onSubmit={handleSubmit} noValidate> {/* Added noValidate */}
      <h2>{currentBook ? 'Edit Book' : 'Add Book'}</h2>
      <div>
        <label htmlFor="title">Title:</label>
        <input id="title" type="text" value={title} onChange={(e: ChangeEvent<HTMLInputElement>) => setTitle(e.target.value)} required />
      </div>
      <div>
        <label htmlFor="author">Author:</label>
        <input id="author" type="text" value={author} onChange={(e: ChangeEvent<HTMLInputElement>) => setAuthor(e.target.value)} required />
      </div>
      <div>
        <label htmlFor="year">Year:</label>
        <input id="year" type="number" value={year} onChange={(e: ChangeEvent<HTMLInputElement>) => setYear(e.target.value)} required />
      </div>
      <button type="submit">{currentBook ? 'Update Book' : 'Add Book'}</button>
      {currentBook && <button type="button" onClick={handleCancelEdit}>Cancel Edit</button>}
    </form>
  );
};

export default BookForm;
