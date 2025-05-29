import type { Book, BookData } from './types'; // Import shared types

const DB_NAME = 'BookDB';
const STORE_NAME = 'books';
const DB_VERSION = 1;

let db: IDBDatabase | undefined;

export const openDB = (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    if (db) {
      resolve(db);
      return;
    }

    const request: IDBOpenDBRequest = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = (event) => {
      console.error('Database error:', (event.target as IDBOpenDBRequest).error);
      reject((event.target as IDBOpenDBRequest).error);
    };

    request.onsuccess = (event) => {
      db = (event.target as IDBOpenDBRequest).result;
      resolve(db as IDBDatabase);
    };

    request.onupgradeneeded = (event) => {
      const currentDb = (event.target as IDBOpenDBRequest).result;
      if (!currentDb.objectStoreNames.contains(STORE_NAME)) {
        currentDb.createObjectStore(STORE_NAME, { keyPath: 'id', autoIncrement: true });
      }
    };
  });
};

export const addBook = (book: BookData): Promise<number> => {
  return new Promise(async (resolve, reject) => {
    const currentDb = await openDB();
    const transaction = currentDb.transaction([STORE_NAME], 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    const request: IDBRequest<IDBValidKey> = store.add(book);

    request.onerror = (event) => {
      console.error('Error adding book:', (event.target as IDBRequest).error);
      reject((event.target as IDBRequest).error);
    };

    request.onsuccess = (event) => {
      resolve((event.target as IDBRequest).result as number); // Returns the key of the new object
    };
  });
};

export const getAllBooks = (): Promise<Book[]> => {
  return new Promise(async (resolve, reject) => {
    const currentDb = await openDB();
    const transaction = currentDb.transaction([STORE_NAME], 'readonly');
    const store = transaction.objectStore(STORE_NAME);
    const request: IDBRequest<Book[]> = store.getAll(); // Ensure this returns Book[] as per shared type

    request.onerror = (event) => {
      console.error('Error getting all books:', (event.target as IDBRequest).error);
      reject((event.target as IDBRequest).error);
    };

    request.onsuccess = (event) => {
      resolve((event.target as IDBRequest).result as Book[]); // Cast to Book[]
    };
  });
};

export const updateBook = (book: Book): Promise<number> => { // Expects Book with id
  return new Promise(async (resolve, reject) => {
    // The Book type now requires id, so this check might be redundant if types are strictly followed
    // However, keeping it for runtime safety if needed.
    if (typeof book.id === 'undefined') { 
      return reject(new Error("Book ID is required for update."));
    }
    const currentDb = await openDB();
    const transaction = currentDb.transaction([STORE_NAME], 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    const request: IDBRequest<IDBValidKey> = store.put(book); // Overwrites or adds if id doesn't exist

    request.onerror = (event) => {
      console.error('Error updating book:', (event.target as IDBRequest).error);
      reject((event.target as IDBRequest).error);
    };

    request.onsuccess = (event) => {
      resolve((event.target as IDBRequest).result as number); // Returns the key of the updated object
    };
  });
};

export const deleteBook = (id: number): Promise<void> => {
  return new Promise(async (resolve, reject) => {
    const currentDb = await openDB();
    const transaction = currentDb.transaction([STORE_NAME], 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    const request: IDBRequest = store.delete(id);

    request.onerror = (event) => {
      console.error('Error deleting book:', (event.target as IDBRequest).error);
      reject((event.target as IDBRequest).error);
    };

    request.onsuccess = (event) => {
      resolve(); // No specific result on successful deletion
    };
  });
};
