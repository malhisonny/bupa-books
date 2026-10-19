interface BookGroupProps {
  heading: string;
  books: string[];
}

export function BookGroup({ heading, books }: BookGroupProps) {
  return (
    <section className="book-group">
      <h2>{heading}</h2>
      {books.length === 0 ? (
        <p className="empty">No books found.</p>
      ) : (
        <ul>
          {books.map((name, index) => (
            <li key={`${name}-${index}`}>{name}</li>
          ))}
        </ul>
      )}
    </section>
  );
}
