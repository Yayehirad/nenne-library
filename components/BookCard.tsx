// components/BookCard.tsx
'use client';

import { createClient } from '@/lib/supabase/client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import BookDetailModal from './BookDetailModal';
import BorrowModal from './BorrowModal';
import { Edit, Trash2 } from 'lucide-react';

export default function BookCard({ book, isFamily }: { book: any; isFamily: boolean }) {
  const supabase = createClient();
  const router = useRouter();

  const [showDetail, setShowDetail] = useState(false);
  const [showBorrow, setShowBorrow] = useState(false);

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm('🗑️ Are you sure you want to permanently delete this book?')) return;

    const { error } = await supabase
      .from('books')
      .delete()
      .eq('id', book.id);

    if (error) {
      alert('Error deleting book: ' + error.message);
    } else {
      alert('✅ Book deleted successfully');
      router.refresh();
    }
  };

  return (
    <>
      <div 
        onClick={() => setShowDetail(true)}
        className="bg-white border rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition cursor-pointer group relative"
      >
        <div className="p-6">
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <h3 className="font-semibold text-lg leading-tight line-clamp-2">{book.title}</h3>
              <p className="text-gray-600 text-sm mt-1">{book.author}</p>
            </div>

            {/* Family-only buttons (hover only) */}
            {isFamily && (
              <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition absolute top-4 right-4">
                <Link
                  href={`/books/${book.id}/edit`}
                  onClick={(e) => e.stopPropagation()}
                  className="p-2 text-blue-600 hover:bg-blue-100 rounded-xl"
                >
                  <Edit size={18} />
                </Link>
                <button
                  onClick={handleDelete}
                  className="p-2 text-red-600 hover:bg-red-100 rounded-xl"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            )}
          </div>

          {/* Status + Genre */}
          <div className="flex gap-2 mt-4">
            <span className={`text-xs px-3 py-1 rounded-full font-medium ${
              book.status === 'available' 
                ? 'bg-green-100 text-green-700' 
                : 'bg-orange-100 text-orange-700'
            }`}>
              {book.status === 'available' ? '✅ Available' : '📖 Borrowed'}
            </span>
            {book.genre && (
              <span className="text-xs px-3 py-1 bg-gray-100 text-gray-700 rounded-full font-medium">
                {book.genre}
              </span>
            )}
          </div>

          {/* Request to Borrow Button */}
          {book.status === 'available' && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowBorrow(true);
              }}
              className="mt-6 w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium rounded-2xl transition"
            >
              Request to Borrow
            </button>
          )}
        </div>
      </div>

      {/* Modals */}
      {showDetail && (
        <BookDetailModal book={book} onClose={() => setShowDetail(false)} />
      )}

      {showBorrow && (
        <BorrowModal book={book} onClose={() => setShowBorrow(false)} />
      )}
    </>
  );
}