export interface Book {
  id: number; // id is always present for retrieved or updated books
  title: string;
  author: string;
  year: number;
}

export type BookData = Omit<Book, 'id'>; // For adding new books, id is optional or not present
