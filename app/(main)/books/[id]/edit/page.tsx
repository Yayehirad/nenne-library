// app/(main)/books/[id]/edit/page.tsx
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import EditBookForm from '@/components/EditBookForm';

export default async function EditBookPage({ 
  params 
}: { 
  params: Promise<{ id: string }> 
}) {
  const { id } = await params;   // ← This is the important fix

  const supabase = await createClient();

  const { data: book, error } = await supabase
    .from('books')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !book) {
    redirect('/books');
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Edit Book</h1>
      <EditBookForm book={book} />
    </div>
  );
}