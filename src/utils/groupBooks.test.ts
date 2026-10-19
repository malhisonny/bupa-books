import { groupBooks } from './groupBooks';
import type { BookOwner } from '../types';

const owners: BookOwner[] = [
  {
    name: 'Jane',
    age: 23,
    books: [
      { name: 'Zebra Tales', type: 'Hardcover' },
      { name: 'apple pie', type: 'Paperback' },
    ],
  },
  { name: 'Tim', age: 17, books: [{ name: 'Moon Book', type: 'Hardcover' }] },
  { name: 'Sam', age: 18, books: [{ name: 'Mango', type: 'hardcover' }] },
  { name: 'NoBooks', age: 40, books: null },
  { name: 'NoAge', age: Number.NaN, books: [{ name: 'Ignored', type: 'Hardcover' }] },
];

describe('groupBooks', () => {
  it('splits owners at the age 18 boundary', () => {
    const result = groupBooks(owners, 'all');
    expect(result.children).toEqual(['Moon Book']);
    expect(result.adults).toContain('Mango');
  });

  it('sorts alphabetically, ignoring case', () => {
    expect(groupBooks(owners, 'all').adults).toEqual(['apple pie', 'Mango', 'Zebra Tales']);
  });

  it('keeps only hardcover books when filtered (case-insensitive)', () => {
    expect(groupBooks(owners, 'hardcover')).toEqual({
      adults: ['Mango', 'Zebra Tales'],
      children: ['Moon Book'],
    });
  });

  it('handles owners with null books and skips owners with no valid age', () => {
    const result = groupBooks(owners, 'all');
    expect(result.adults).not.toContain('Ignored');
    expect(groupBooks([], 'all')).toEqual({ adults: [], children: [] });
  });
});
