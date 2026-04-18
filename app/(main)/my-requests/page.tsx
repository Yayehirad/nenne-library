// app/(main)/my-requests/page.tsx
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import MyRequestsClient from './MyRequestsClient';

export default async function MyRequestsPage() {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const { data: userData } = await supabase
    .from('users')
    .select('role')
    .eq('id', user.id)
    .single();

  const isFamily = userData?.role === 'family';

  const { data: requests } = await supabase
    .from('borrow_requests')
    .select(`
      id,
      status,
      request_date,
      book_id,
      requester_id,
      requester_name,
      requester_email,
      books!book_id (title)
    `)
    .order('request_date', { ascending: false });

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <h1 className="text-4xl font-bold mb-2">My Requests</h1>
      <p className="text-gray-600 mb-8">All book borrow requests in the family library</p>

      <MyRequestsClient 
        requests={requests || []} 
        isFamily={isFamily} 
      />
    </div>
  );
}