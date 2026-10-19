export interface Book {
  name: string;
  type: string;
}

export interface BookOwner {
  name: string;
  age: number;
  books: Book[] | null;
}

export type BookFilter = 'all' | 'hardcover';

export interface GroupedBooks {
  adults: string[];
  children: string[];
}
