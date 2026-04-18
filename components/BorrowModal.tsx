'use client';

import { createClient } from '@/lib/supabase/client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function BorrowModal({ book, onClose }: { book: any; onClose: () => void }) {
  const supabase = createClient();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleRequest = async () => {
    setLoading(true);

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      alert('Please log in');
      setLoading(false);
      return;
    }

    const { error } = await supabase
      .from('borrow_requests')
      .insert({
        book_id: book.id,
        requester_id: user.id,
        requester_name: 'User',
        status: 'pending'
      });

    if (error) alert('Error: ' + error.message);
    else {
      alert('✅ Request sent successfully!');
      onClose();
      window.location.reload(); // Hard reload to update everything
    }
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl max-w-md w-full p-8">
        <h2 className="text-2xl font-bold mb-2">Request to Borrow</h2>
        <p className="text-gray-600 mb-6">{book.title}</p>

        <button
          onClick={handleRequest}
          disabled={loading}
          className="w-full py-4 bg-emerald-600 text-white rounded-2xl mb-3"
        >
          {loading ? 'Sending...' : 'Confirm Request'}
        </button>

        <button onClick={onClose} className="w-full py-4 border rounded-2xl">
          Cancel
        </button>
      </div>
    </div>
  );
}