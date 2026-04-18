'use client';

import { createClient } from '@/lib/supabase/client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function BorrowModal({ book, onClose }: { book: any; onClose: () => void }) {
  const supabase = createClient();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleRequest = async () => {
    setLoading(true);
    setError('');

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      setError('You must be logged in');
      setLoading(false);
      return;
    }

    const { data: userInfo } = await supabase
      .from('users')
      .select('name, email')
      .eq('id', user.id)
      .single();

    const { error: insertError } = await supabase
      .from('borrow_requests')
      .insert({
        book_id: book.id,
        requester_id: user.id,
        requester_name: userInfo?.name || '',
        requester_email: userInfo?.email || '',
        status: 'pending'
      });

    if (insertError) {
      setError(insertError.message);
    } else {
      alert('✅ Request sent successfully!');
      onClose();
      router.refresh();
    }
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl max-w-md w-full p-8">
        <h2 className="text-2xl font-bold mb-2">Request to Borrow</h2>
        <p className="text-gray-600 mb-6">{book.title}</p>

        {error && <div className="bg-red-100 text-red-700 p-4 rounded-2xl mb-6">{error}</div>}

        <button
          onClick={handleRequest}
          disabled={loading}
          className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-2xl mb-3"
        >
          {loading ? 'Sending...' : 'Confirm Request'}
        </button>

        <button onClick={onClose} className="w-full py-4 border text-gray-700 font-medium rounded-2xl hover:bg-gray-50">
          Cancel
        </button>
      </div>
    </div>
  );
}