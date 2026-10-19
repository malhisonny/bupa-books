import type { Book, BookFilter, BookOwner, GroupedBooks } from '../types';

export const ADULT_MIN_AGE = 18;

const isHardcover = (book: Book): boolean =>
  typeof book.type === 'string' && book.type.trim().toLowerCase() === 'hardcover';

const sortAlphabetically = (names: string[]): string[] =>
  [...names].sort((a, b) => a.localeCompare(b, 'en', { sensitivity: 'base' }));

/**
 * Groups book names by owner age category (Adults 18+, Children 17 and below),
 * optionally keeping only hardcover books, sorted A-Z within each group.
 */
export function groupBooks(owners: BookOwner[], filter: BookFilter): GroupedBooks {
  const adults: string[] = [];
  const children: string[] = [];

  for (const owner of owners) {
    // Owners without a usable age cannot be categorised, so they are skipped.
    if (!Number.isFinite(owner.age)) continue;

    const target = owner.age >= ADULT_MIN_AGE ? adults : children;

    for (const book of owner.books ?? []) {
      if (filter === 'hardcover' && !isHardcover(book)) continue;
      target.push(book.name);
    }
  }

  return { adults: sortAlphabetically(adults), children: sortAlphabetically(children) };
}
