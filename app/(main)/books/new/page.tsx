// app/(main)/books/new/page.tsx
import { createClient } from '@/lib/supabase/server';
import NewBookForm from '@/components/NewBookForm';

export default async function NewBookPage() {
  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Add New Book</h1>
      <NewBookForm />
    </div>
  );
}