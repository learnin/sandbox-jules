const DB_NAME = 'BookDB';
const STORE_NAME = 'books';
const DB_VERSION = 1;

let db;

export const openDB = () => {
  return new Promise((resolve, reject) => {
    if (db) {
      resolve(db);
      return;
    }

    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = (event) => {
      console.error('Database error:', event.target.errorCode);
      reject(event.target.errorCode);
    };

    request.onsuccess = (event) => {
      db = event.target.result;
      resolve(db);
    };

    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id', autoIncrement: true });
      }
    };
  });
};

export const addBook = (book) => {
  return new Promise(async (resolve, reject) => {
    const db = await openDB();
    const transaction = db.transaction([STORE_NAME], 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.add(book);

    request.onerror = (event) => {
      console.error('Error adding book:', event.target.errorCode);
      reject(event.target.errorCode);
    };

    request.onsuccess = (event) => {
      resolve(event.target.result); // Returns the key of the new object
    };
  });
};

export const getAllBooks = () => {
  return new Promise(async (resolve, reject) => {
    const db = await openDB();
    const transaction = db.transaction([STORE_NAME], 'readonly');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.getAll();

    request.onerror = (event) => {
      console.error('Error getting all books:', event.target.errorCode);
      reject(event.target.errorCode);
    };

    request.onsuccess = (event) => {
      resolve(event.target.result);
    };
  });
};

export const updateBook = (book) => {
  return new Promise(async (resolve, reject) => {
    const db = await openDB();
    const transaction = db.transaction([STORE_NAME], 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.put(book); // Overwrites or adds if id doesn't exist

    request.onerror = (event) => {
      console.error('Error updating book:', event.target.errorCode);
      reject(event.target.errorCode);
    };

    request.onsuccess = (event) => {
      resolve(event.target.result); // Returns the key of the updated object
    };
  });
};

export const deleteBook = (id) => {
  return new Promise(async (resolve, reject) => {
    const db = await openDB();
    const transaction = db.transaction([STORE_NAME], 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.delete(id);

    request.onerror = (event) => {
      console.error('Error deleting book:', event.target.errorCode);
      reject(event.target.errorCode);
    };

    request.onsuccess = (event) => {
      resolve(); // No specific result on successful deletion
    };
  });
};
