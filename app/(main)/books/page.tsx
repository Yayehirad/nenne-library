// app/(main)/books/page.tsx
import { createClient } from '@/lib/supabase/server';
import BookSearch from '@/components/BookSearch';

export default async function BooksPage() {
  const supabase = await createClient();

  const { data: books } = await supabase
    .from('books')
    .select('*')
    .order('title', { ascending: true });

  // Get unique and sorted genres
  const genres = Array.from(
    new Set(
      books
        ?.map((book) => book.genre)
        .filter(Boolean)
        .map((g) => g.trim())
    )
  ).sort();

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-4xl font-bold">Our Library</h1>
          <p className="text-gray-600">Total books: {books?.length || 0}</p>
        </div>
      </div>

      <BookSearch books={books || []} genres={genres} />
    </div>
  );
}