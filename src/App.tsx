import { useMemo, useState } from 'react';
import { BookGroup } from './components/BookGroup';
import { useBookOwners } from './hooks/useBookOwners';
import { groupBooks } from './utils/groupBooks';
import type { BookFilter } from './types';
import './App.css';

export default function App() {
  const { owners, status, load } = useBookOwners();
  const [filter, setFilter] = useState<BookFilter>('all');

  const grouped = useMemo(() => (owners ? groupBooks(owners, filter) : null), [owners, filter]);
  const prefix = filter === 'hardcover' ? 'Hardcover Books' : 'Books';

  // "Get Books" always fetches fresh data; "Hardcover only" reuses loaded data if we have it.
  const handleGetBooks = () => {
    setFilter('all');
    void load();
  };

  const handleHardcoverOnly = () => {
    setFilter('hardcover');
    if (!owners) void load();
  };

  const hasLoaded = status !== 'idle';

  return (
    <div className="app">
      <header className="app-header">
        <h1>Bupa Books</h1>
      </header>

      <main className="app-main">
        <div className="actions">
          <button
            type="button"
            onClick={handleGetBooks}
            aria-pressed={hasLoaded && filter === 'all'}
          >
            Get Books
          </button>
          <button
            type="button"
            onClick={handleHardcoverOnly}
            aria-pressed={hasLoaded && filter === 'hardcover'}
          >
            Hardcover only
          </button>
        </div>

        <div aria-live="polite">
          {status === 'loading' && <p className="message">Loading books…</p>}

          {status === 'error' && (
            <div className="message error" role="alert">
              <p>We couldn’t load the books. Please check your connection and try again.</p>
              <button type="button" onClick={() => void load()}>
                Try again
              </button>
            </div>
          )}

          {status === 'success' && grouped && (
            <div className="results">
              <BookGroup heading={`${prefix} owned by Adults`} books={grouped.adults} />
              <BookGroup heading={`${prefix} owned by Children`} books={grouped.children} />
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
