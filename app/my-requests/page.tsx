// app/(main)/my-requests/page.tsx
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import MyRequestsClient from './MyRequestsClient';

export default async function MyRequestsPage() {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  // Check if user is Family
  const { data: userData } = await supabase
    .from('users')
    .select('role')
    .eq('id', user.id)
    .single();

  const isFamily = userData?.role === 'family';

  // Fetch all borrow requests with book title and requester info
  const { data: requests } = await supabase
    .from('borrow_requests')
    .select(`
      id,
      status,
      created_at,
      books (
        title
      ),
      users (
        name,
        email
      )
    `)
    .order('created_at', { ascending: false });

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