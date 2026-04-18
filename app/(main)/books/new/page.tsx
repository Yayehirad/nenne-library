// app/(main)/books/new/page.tsx
import { createClient } from '@/lib/supabase/server';
import NewBookForm from '@/components/NewBookForm';

export default async function NewBookPage() {
  const supabase = await createClient();

  // Fetch genres
  const { data: genreData } = await supabase
    .from('books')
    .select('genre')
    .not('genre', 'is', null);

  const genres = Array.from(
    new Set(genreData?.map((row) => row.genre?.trim()).filter(Boolean))
  ).sort();

  // Fetch locations
  const { data: locationData } = await supabase
    .from('books')
    .select('location')
    .not('location', 'is', null);

  const locations = Array.from(
    new Set(locationData?.map((row) => row.location?.trim()).filter(Boolean))
  ).sort();

  return (
    <div className="max-w-2xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8">Add New Book</h1>
      <NewBookForm 
        genres={genres} 
        locations={locations} 
      />
    </div>
  );
}