import type { BookOwner } from '../types';

const API_URL: string = import.meta.env.VITE_API_URL ?? '/api/v1/bookowners';

export async function fetchBookOwners(signal?: AbortSignal): Promise<BookOwner[]> {
  const response = await fetch(API_URL, {
    signal,
    headers: { Accept: 'application/json' },
  });

  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`);
  }

  const data: unknown = await response.json();
  if (!Array.isArray(data)) {
    throw new Error('Unexpected response format');
  }

  return data as BookOwner[];
}
