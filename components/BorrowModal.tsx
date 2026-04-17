// components/BorrowModal.tsx
'use client';

import { createClient } from '@/lib/supabase/client';
import { useState } from 'react';
import { Button } from '@/components/ui/button';

export default function BorrowModal({ book, onClose }: { book: any; onClose: () => void }) {
  const supabase = createClient();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleRequest = async () => {
    setLoading(true);

    const { error } = await supabase
      .from('borrow_requests')
      .insert({
        book_id: book.id,
        requester_id: (await supabase.auth.getUser()).data.user?.id,
        status: 'pending',
      });

    if (error) {
      setMessage('Failed to send request. Please try again.');
    } else {
      setMessage('✅ Request sent successfully! A family member will review it.');
      setTimeout(() => {
        onClose();
      }, 1800);
    }
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
      <div className="bg-white rounded-3xl p-8 max-w-md w-full mx-4">
        <h2 className="text-2xl font-bold mb-1">Request to Borrow</h2>
        <p className="text-gray-600 mb-6">{book.title}</p>

        <Button
          onClick={handleRequest}
          disabled={loading}
          className="w-full py-6 text-lg"
        >
          {loading ? 'Sending request...' : 'Confirm Request'}
        </Button>

        {message && (
          <p className={`text-center mt-4 ${message.includes('✅') ? 'text-green-600' : 'text-red-500'}`}>
            {message}
          </p>
        )}

        <button
          onClick={onClose}
          className="mt-6 text-gray-500 hover:text-gray-700 text-sm w-full"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}