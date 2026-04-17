// app/(main)/books/page.tsx
import { createClient } from '@/lib/supabase/server';
import BookSearch from '@/components/BookSearch';

export default async function BooksPage() {
  const supabase = await createClient();

  const { data: books } = await supabase
    .from('books')
    .select(`
      *,
      reading_log (
        rating
      )
    `)
    .order('title', { ascending: true });

  // Calculate average rating for each book
  const booksWithAvg = books?.map((book: any) => {
    const ratings = book.reading_log?.map((log: any) => log.rating) || [];
    const avg = ratings.length > 0 
      ? ratings.reduce((a: number, b: number) => a + b, 0) / ratings.length 
      : 0;
    return { ...book, avg_rating: avg };
  }) || [];

  const uniqueGenres = Array.from(
    new Set(booksWithAvg.map((b: any) => b.genre).filter(Boolean))
  ).sort();

  return (
    <div>
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-4xl font-bold text-gray-900">Our Library</h1>
          <p className="text-gray-600 mt-1">Total books: {booksWithAvg.length}</p>
        </div>
      </div>

      <BookSearch 
        initialBooks={booksWithAvg} 
        genres={uniqueGenres} 
      />
    </div>
  );
}