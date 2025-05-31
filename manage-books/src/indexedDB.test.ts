// import FDBFactory from 'fake-indexeddb/lib/FDBFactory'; // Removed for relying on global setup
import { openDB, addBook, getAllBooks, updateBook, deleteBook } from './indexedDB';
import { describe, it, expect, beforeEach } from 'vitest'; // Removed afterEach
import type { Book, BookData } from './types'; // Import shared types

const DB_NAME = 'BookDB';
const STORE_NAME = 'books';

// No specific beforeEach/afterEach for FDBFactory needed here if relying on global setup.
// fake-indexeddb/auto should provide a fresh DB state per test file.
// The openDB function in indexedDB.ts caches its 'db' instance.
// For tests within this file, this means they might interact with the same DB instance,
// which is often desired for sequential testing (add, then get, then update, then delete).
// If full isolation between tests in *this same file* is needed, openDB would need a reset mechanism.

describe('IndexedDB Helper Functions', () => {
  // It's good practice to ensure the database is "fresh" before each test in this file,
  // especially if tests are order-dependent or modify the same data.
  // Since fake-indexeddb/auto resets per file, and openDB caches, we might need
  // a way to clear the specific store or re-initialize openDB's cache if tests conflict.
  // For now, assuming tests are either independent or written to handle sequential state.
  // A simple approach for some level of isolation if needed:
  beforeEach(async () => {
    // Clear all books before each test to ensure a clean slate for "getAllBooks" etc.
    // This doesn't reset the DB schema but clears data.
    const allBooks = await getAllBooks();
    for (const book of allBooks) {
      if (book.id) { // Ensure book.id is defined before trying to delete
        await deleteBook(book.id);
      }
    }
  });


  describe('openDB', () => {
    it('should open the database and create the object store if it does not exist', async () => {
      const db = await openDB();
      expect(db).toBeDefined();
      expect(db.name).toBe(DB_NAME);
      expect(db.objectStoreNames.contains(STORE_NAME)).toBe(true);
      
      const transaction = db.transaction(STORE_NAME, 'readonly');
      const store = transaction.objectStore(STORE_NAME);
      expect(store.keyPath).toBe('id');
      expect(store.autoIncrement).toBe(true);
    });

    it('should return the existing database instance if already opened within the same test context', async () => {
      const db1 = await openDB();
      const db2 = await openDB();
      expect(db1).toBe(db2); 
    });
  });

  describe('addBook', () => {
    it('should add a book to the store and return its new id', async () => {
      const book: BookData = { title: 'Test Book 1', author: 'Author 1', year: 2023 };
      const id = await addBook(book);
      expect(id).toBeDefined();
      expect(typeof id).toBe('number');
      
      const db = await openDB();
      const transaction = db.transaction(STORE_NAME, 'readonly');
      const store = transaction.objectStore(STORE_NAME);
      const savedBook = await new Promise<Book | undefined>((resolve, reject) => {
        const request = store.get(id);
        request.onsuccess = () => resolve(request.result as Book | undefined);
        request.onerror = () => reject(request.error);
      });
      
      expect(savedBook).toBeDefined();
      if (savedBook) {
        expect(savedBook.title).toBe(book.title);
        expect(savedBook.id).toBe(id);
      }
    });
  });

  describe('getAllBooks', () => {
    it('should retrieve all books from the store', async () => {
      await addBook({ title: 'Book A', author: 'Author A', year: 2021 });
      await addBook({ title: 'Book B', author: 'Author B', year: 2022 });
      
      const allBooks = await getAllBooks();
      expect(allBooks.length).toBe(2);
      // Order might not be guaranteed, so check for presence or sort before asserting specific order
      expect(allBooks.some(b => b.title === 'Book A')).toBe(true);
      expect(allBooks.some(b => b.title === 'Book B')).toBe(true);
    });

    it('should return an empty array if no books are in the store', async () => {
      const allBooks = await getAllBooks();
      expect(allBooks.length).toBe(0);
    });
  });

  describe('updateBook', () => {
    it('should update an existing book in the store', async () => {
      const initialBook: BookData = { title: 'Old Title', author: 'Old Author', year: 2020 };
      const id = await addBook(initialBook);
      if (typeof id !== 'number') throw new Error("Failed to get ID for initial book");
      
      const updatedBookData: Book = { id: id, title: 'New Title', author: 'New Author', year: 2021 };
      await updateBook(updatedBookData);
      
      const db = await openDB();
      const transaction = db.transaction(STORE_NAME, 'readonly');
      const store = transaction.objectStore(STORE_NAME);
      const fetchedBook = await new Promise<Book | undefined>((resolve, reject) => {
        const request = store.get(id);
        request.onsuccess = () => resolve(request.result as Book | undefined);
        request.onerror = () => reject(request.error);
      });
      
      expect(fetchedBook).toBeDefined();
      if (fetchedBook) {
        expect(fetchedBook.title).toBe('New Title');
        expect(fetchedBook.author).toBe('New Author');
        expect(fetchedBook.year).toBe(2021);
      }
    });
  });

  describe('deleteBook', () => {
    it('should delete a book from the store by its id', async () => {
      const book1: BookData = { title: 'To Delete', author: 'Author X', year: 2000 };
      const book2: BookData = { title: 'To Keep', author: 'Author Y', year: 2001 };
      const idToDelete = await addBook(book1);
      if (typeof idToDelete !== 'number') throw new Error("Failed to get ID for book1");
      await addBook(book2);
      
      await deleteBook(idToDelete);
      
      const allBooks = await getAllBooks();
      expect(allBooks.length).toBe(1);
      expect(allBooks[0].title).toBe('To Keep');
    });
  });
});
