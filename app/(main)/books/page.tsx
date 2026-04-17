// app/(main)/books/page.tsx
import { createClient } from '@/lib/supabase/server';

export default async function BooksPage() {
  const supabase = await createClient();

  const { data: books, error } = await supabase
    .from('books')
    .select('*')
    .order('title', { ascending: true });

  if (error) {
    console.error('Error loading books:', error);
  }

  return (
    <div>
      <h1 className="text-4xl font-bold mb-8">📚 Our Library</h1>
      <p className="text-gray-600 mb-8">Total books: {books?.length || 0}</p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {books?.map((book: any) => (
          <div key={book.id} className="bg-white p-6 rounded-xl border shadow-sm hover:shadow-md transition">
            <h3 className="font-semibold text-lg line-clamp-2">{book.title}</h3>
            <p className="text-gray-600 mt-1">{book.author}</p>
            <p className="text-sm text-gray-500 mt-3">{book.location}</p>
            
            <div className="mt-4">
              <span className={`inline-block px-4 py-1 text-xs rounded-full font-medium
                ${book.status === 'available' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>
                {book.status || 'Unknown'}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}