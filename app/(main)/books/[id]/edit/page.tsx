// app/(main)/books/[id]/edit/page.tsx
import { createClient } from '@/lib/supabase/server';
import EditBookForm from '@/components/EditBookForm';
import { redirect } from 'next/navigation';

export default async function EditBookPage({ params }: { params: { id: string } }) {
  const supabase = await createClient();
  const { id } = await params;

  // Fetch the book
  const { data: book, error } = await supabase
    .from('books')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !book) {
    redirect('/books');
  }

  // Fetch clean genres and locations
  const { data: genreData } = await supabase
    .from('books')
    .select('genre')
    .not('genre', 'is', null);

  const genres = Array.from(
    new Set(genreData?.map((row) => row.genre?.trim()).filter(Boolean))
  ).sort();

  const { data: locationData } = await supabase
    .from('books')
    .select('location')
    .not('location', 'is', null);

  const locations = Array.from(
    new Set(locationData?.map((row) => row.location?.trim()).filter(Boolean))
  ).sort();

  return (
    <div className="max-w-2xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8">Edit Book</h1>
      <EditBookForm 
        book={book} 
        genres={genres} 
        locations={locations} 
        onSuccess={() => redirect('/books')} 
      />
    </div>
  );
}