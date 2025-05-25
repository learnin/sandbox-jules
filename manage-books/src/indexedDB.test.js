import FDBFactory from 'fake-indexeddb/lib/FDBFactory';
import { openDB, addBook, getAllBooks, updateBook, deleteBook } from './indexedDB';

const DB_NAME = 'BookDB';
const STORE_NAME = 'books';

// Setup a fresh fake IndexedDB before each test
beforeEach(() => {
  // Resets the environment for each test by using a new factory
  indexedDB = new FDBFactory(); 
});

// Clean up after each test if necessary (though FDBFactory usually handles this)
afterEach(() => {
  // You might want to close any open DB connections if your openDB function doesn't handle it well
  // For this example, FDBFactory handles cleanup.
});

describe('IndexedDB Helper Functions', () => {
  describe('openDB', () => {
    it('should open the database and create the object store if it does not exist', async () => {
      const db = await openDB();
      expect(db).toBeDefined();
      expect(db.name).toBe(DB_NAME);
      expect(db.objectStoreNames.contains(STORE_NAME)).toBe(true);
      
      // Verify store configuration (optional, but good for completeness)
      const transaction = db.transaction(STORE_NAME, 'readonly');
      const store = transaction.objectStore(STORE_NAME);
      expect(store.keyPath).toBe('id');
      expect(store.autoIncrement).toBe(true);
      db.close(); // Close the db connection
    });

    it('should return the existing database instance if already opened', async () => {
      const db1 = await openDB();
      const db2 = await openDB();
      expect(db1).toBe(db2); // Should be the same instance
      db1.close();
    });
  });

  describe('addBook', () => {
    it('should add a book to the store and return its new id', async () => {
      const book = { title: 'Test Book 1', author: 'Author 1', isbn: '11111' };
      const id = await addBook(book);
      expect(id).toBeDefined();
      
      const db = await openDB();
      const transaction = db.transaction(STORE_NAME, 'readonly');
      const store = transaction.objectStore(STORE_NAME);
      const savedBook = await new Promise((resolve, reject) => {
        const request = store.get(id);
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
      });
      
      expect(savedBook.title).toBe(book.title);
      expect(savedBook.id).toBe(id);
      db.close();
    });
  });

  describe('getAllBooks', () => {
    it('should retrieve all books from the store', async () => {
      await addBook({ title: 'Book A', author: 'Author A', isbn: 'AAA' });
      await addBook({ title: 'Book B', author: 'Author B', isbn: 'BBB' });
      
      const allBooks = await getAllBooks();
      expect(allBooks.length).toBe(2);
      expect(allBooks[0].title).toBe('Book A');
      expect(allBooks[1].title).toBe('Book B');
      
      const db = await openDB(); // ensure db is open for closing
      db.close();
    });

    it('should return an empty array if no books are in the store', async () => {
      const allBooks = await getAllBooks();
      expect(allBooks.length).toBe(0);
      const db = await openDB();
      db.close();
    });
  });

  describe('updateBook', () => {
    it('should update an existing book in the store', async () => {
      const initialBook = { title: 'Old Title', author: 'Old Author', isbn: '00000' };
      const id = await addBook(initialBook);
      
      const updatedBookData = { id: id, title: 'New Title', author: 'New Author', isbn: '00001' };
      await updateBook(updatedBookData);
      
      const db = await openDB();
      const transaction = db.transaction(STORE_NAME, 'readonly');
      const store = transaction.objectStore(STORE_NAME);
      const fetchedBook = await new Promise((resolve, reject) => {
        const request = store.get(id);
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
      });
      
      expect(fetchedBook.title).toBe('New Title');
      expect(fetchedBook.author).toBe('New Author');
      db.close();
    });
  });

  describe('deleteBook', () => {
    it('should delete a book from the store by its id', async () => {
      const book1 = { title: 'To Delete', author: 'Author X', isbn: 'XXX' };
      const book2 = { title: 'To Keep', author: 'Author Y', isbn: 'YYY' };
      const idToDelete = await addBook(book1);
      await addBook(book2);
      
      await deleteBook(idToDelete);
      
      const allBooks = await getAllBooks();
      expect(allBooks.length).toBe(1);
      expect(allBooks[0].title).toBe('To Keep');
      
      const db = await openDB();
      db.close();
    });
  });
});
