// components/BookSearch.tsx
'use client';

import { useState, useMemo } from 'react';
import BookCard from './BookCard';
import { Input } from '@/components/ui/input';

export default function BookSearch({
  initialBooks,
  genres,
}: {
  initialBooks: any[];
  genres: string[];
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGenre, setSelectedGenre] = useState<string | null>(null);

  const filteredBooks = useMemo(() => {
    return initialBooks
      .filter((book): book is any => book != null) // remove undefined/null
      .filter((book) => {
        const matchesSearch =
          !searchTerm ||
          book.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          book.author?.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesGenre = !selectedGenre || book.genre === selectedGenre;

        return matchesSearch && matchesGenre;
      });
  }, [initialBooks, searchTerm, selectedGenre]);

  return (
    <div>
      <div className="mb-8">
        <Input
          type="text"
          placeholder="Search by title or author..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="rounded-2xl py-6 text-lg"
        />
      </div>

      <div className="flex flex-wrap gap-2 mb-8">
        <button
          onClick={() => setSelectedGenre(null)}
          className={`px-6 py-2.5 rounded-2xl text-sm font-medium transition ${
            selectedGenre === null
              ? 'bg-emerald-600 text-white shadow-md'
              : 'bg-white border-2 border-gray-300 hover:border-gray-400 text-gray-700'
          }`}
        >
          All Genres
        </button>

        {genres.map((genre) => (
          <button
            key={genre}
            onClick={() => setSelectedGenre(genre)}
            className={`px-6 py-2.5 rounded-2xl text-sm font-medium transition ${
              selectedGenre === genre
                ? 'bg-emerald-600 text-white shadow-md'
                : 'bg-white border-2 border-gray-300 hover:border-gray-400 text-gray-700'
            }`}
          >
            {genre}
          </button>
        ))}
      </div>

      {filteredBooks.length === 0 ? (
        <p className="text-center text-gray-500 py-12">No books found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredBooks.map((book: any) => (
            <BookCard key={book.id} book={book} />
          ))}
        </div>
      )}
    </div>
  );
}