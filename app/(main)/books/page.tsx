// app/(main)/books/page.tsx
import { createClient } from '@/lib/supabase/server';
import BookSearch from '@/components/BookSearch';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

export default async function BooksPage() {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();

  // Check if current user is Family
  let isFamily = false;
  if (user) {
    const { data } = await supabase
      .from('users')
      .select('role')
      .eq('id', user.id)
      .single();
    isFamily = data?.role === 'family';
  }

  const { data: books } = await supabase
    .from('books')
    .select('*')
    .order('title', { ascending: true });

  // Genres with count
  const { data: genreData } = await supabase
    .from('books')
    .select('genre')
    .not('genre', 'is', null);

  const genreMap = new Map<string, number>();
  genreData?.forEach((row) => {
    const g = row.genre?.trim();
    if (g) genreMap.set(g, (genreMap.get(g) || 0) + 1);
  });

  const genres = Array.from(genreMap.entries())
    .map(([genre, count]) => ({ genre, count }))
    .sort((a, b) => a.genre.localeCompare(b.genre));

  // Locations
  const { data: locationData } = await supabase
    .from('books')
    .select('location')
    .not('location', 'is', null);

  const locations = Array.from(
    new Set(locationData?.map((row) => row.location?.trim()).filter(Boolean))
  ).sort();

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-4xl font-bold">Our Library</h1>
          <p className="text-gray-600">Total books: {books?.length || 0}</p>
        </div>

        <Link href="/books/new">
          <Button className="flex items-center gap-2">
            <Plus size={20} />
            Add New Book
          </Button>
        </Link>
      </div>

      <BookSearch 
        books={books || []} 
        genres={genres} 
        locations={locations}
        isFamily={isFamily}   // ← Passed down once
      />
    </div>
  );
}