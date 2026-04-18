// components/BookSearch.tsx
'use client';

import { useState, useMemo } from 'react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import BookCard from './BookCard';

export default function BookSearch({ 
  books, 
  genres, 
  locations,
  isFamily 
}: { 
  books: any[]; 
  genres: { genre: string; count: number }[]; 
  locations: string[]; 
  isFamily: boolean;
}) {
  const [search, setSearch] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('All Genres');

  const filteredBooks = useMemo(() => {
    return books.filter((book) => {
      const matchesSearch = !search || 
        book.title?.toLowerCase().includes(search.toLowerCase()) ||
        book.author?.toLowerCase().includes(search.toLowerCase());

      const matchesGenre = selectedGenre === 'All Genres' || book.genre === selectedGenre;

      return matchesSearch && matchesGenre;
    });
  }, [books, search, selectedGenre]);

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <Input
            placeholder="Search by title or author..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-12 text-base"
          />
        </div>

        <Select value={selectedGenre} onValueChange={setSelectedGenre}>
          <SelectTrigger className="w-full md:w-72 h-12">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="All Genres">All Genres</SelectItem>
            {genres.map(({ genre, count }) => (
              <SelectItem key={genre} value={genre}>
                {genre} ({count})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredBooks.map((book) => (
          <BookCard key={book.id} book={book} isFamily={isFamily} />
        ))}
      </div>

      {filteredBooks.length === 0 && (
        <p className="text-center text-gray-500 py-12">No books found.</p>
      )}
    </div>
  );
}