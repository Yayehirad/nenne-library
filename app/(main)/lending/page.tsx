// app/(main)/lending/page.tsx
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import LendingClient from './LendingClient';

export default async function LendingPage() {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const { data: userData } = await supabase
    .from('users')
    .select('role')
    .eq('id', user.id)
    .single();

  if (userData?.role !== 'family') {
    return (
      <div className="p-8 max-w-7xl mx-auto text-center">
        <h1 className="text-4xl font-bold mb-4">Lending</h1>
        <p className="text-red-600">This page is only visible to Family members.</p>
      </div>
    );
  }

  const { data: lending } = await supabase
    .from('borrow_requests')
    .select(`
      id,
      status,
      request_date,
      book_id,
      requester_id,
      requester_name,
      requester_email,
      books!book_id (title, author)
    `)
    .eq('status', 'approved')
    .order('request_date', { ascending: false });

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <h1 className="text-4xl font-bold mb-2">Lending</h1>
      <p className="text-gray-600 mb-8">Currently borrowed books</p>
      <LendingClient lending={lending || []} />
    </div>
  );
}