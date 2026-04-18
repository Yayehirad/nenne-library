'use client';

import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';

export default function LendingClient({ lending }: { lending: any[] }) {
  const supabase = createClient();
  const router = useRouter();

  const markAsReturned = async (requestId: string, bookId: string) => {
    if (!confirm('Mark as returned and make available?')) return;

    await supabase.from('borrow_requests').update({ 
      status: 'returned', 
      returned_date: new Date().toISOString() 
    }).eq('id', requestId);

    await supabase.from('books').update({ status: 'available' }).eq('id', bookId);

    alert('✅ Book returned successfully!');
    window.location.reload();
  };

  return (
    <div className="bg-white rounded-3xl shadow-sm border overflow-hidden">
      <table className="w-full">
        <thead className="bg-gray-50 border-b">
          <tr>
            <th className="text-left py-5 px-8">Book</th>
            <th className="text-left py-5 px-8">Borrowed by</th>
            <th className="text-left py-5 px-8">Date</th>
            <th className="text-right py-5 px-8">Action</th>
          </tr>
        </thead>
        <tbody>
          {lending.map((item) => (
            <tr key={item.id} className="border-b hover:bg-gray-50">
              <td className="py-5 px-8 font-medium">{item.books?.title}</td>
              <td className="py-5 px-8">{item.requester_name || item.requester_email}</td>
              <td className="py-5 px-8 text-gray-500">
                {item.request_date ? new Date(item.request_date).toLocaleDateString('en-AU') : '—'}
              </td>
              <td className="py-5 px-8 text-right">
                <button onClick={() => markAsReturned(item.id, item.book_id)} className="px-6 py-2 bg-emerald-600 text-white rounded-2xl">
                  Mark as Returned
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}