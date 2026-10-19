import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from './App';

const data = [
  {
    name: 'Jane',
    age: 23,
    books: [
      { name: 'Zebra', type: 'Hardcover' },
      { name: 'Apple', type: 'Paperback' },
    ],
  },
  { name: 'Tim', age: 10, books: [{ name: 'Moon', type: 'Hardcover' }] },
];

const mockFetch = (ok = true) =>
  vi.fn().mockResolvedValue({ ok, status: ok ? 200 : 500, json: async () => data });

afterEach(() => vi.unstubAllGlobals());

describe('App', () => {
  it('shows all books grouped by age category after clicking Get Books', async () => {
    vi.stubGlobal('fetch', mockFetch());
    render(<App />);

    await userEvent.click(screen.getByRole('button', { name: 'Get Books' }));

    expect(
      await screen.findByRole('heading', { name: 'Books owned by Adults' }),
    ).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Books owned by Children' })).toBeInTheDocument();
    expect(screen.getByText('Apple')).toBeInTheDocument();
  });

  it('shows only hardcover books with updated headings', async () => {
    vi.stubGlobal('fetch', mockFetch());
    render(<App />);

    await userEvent.click(screen.getByRole('button', { name: 'Hardcover only' }));

    expect(
      await screen.findByRole('heading', { name: 'Hardcover Books owned by Adults' }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { name: 'Hardcover Books owned by Children' }),
    ).toBeInTheDocument();
    expect(screen.getByText('Zebra')).toBeInTheDocument();
    expect(screen.queryByText('Apple')).not.toBeInTheDocument();
  });

  it('shows an error message when the request fails', async () => {
    vi.stubGlobal('fetch', mockFetch(false));
    render(<App />);

    await userEvent.click(screen.getByRole('button', { name: 'Get Books' }));

    expect(await screen.findByRole('alert')).toHaveTextContent(/couldn’t load the books/i);
    expect(screen.getByRole('button', { name: 'Try again' })).toBeInTheDocument();
  });
});
