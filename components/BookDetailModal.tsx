// components/BookDetailModal.tsx
'use client';

import { createClient } from '@/lib/supabase/client';
import { useState, useEffect } from 'react';
import { Star, X } from 'lucide-react';

export default function BookDetailModal({ book, onClose }: { book: any; onClose: () => void }) {
  const supabase = createClient();
  const [reviews, setReviews] = useState<any[]>([]);
  const [avgRating, setAvgRating] = useState(0);
  const [totalReviews, setTotalReviews] = useState(0);

  useEffect(() => {
    const fetchReviews = async () => {
      const { data } = await supabase
        .from('reading_log')
        .select(`
          rating,
          notes,
          created_at,
          users (name)
        `)
        .eq('book_id', book.id)
        .order('created_at', { ascending: false });

      setReviews(data || []);

      if (data && data.length > 0) {
        const total = data.reduce((sum: number, item: any) => sum + (item.rating || 0), 0);
        setAvgRating(parseFloat((total / data.length).toFixed(1)));
        setTotalReviews(data.length);
      }
    };

    fetchReviews();
  }, [book.id]);

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-hidden shadow-2xl flex flex-col">

        {/* Header */}
        <div className="px-8 py-6 border-b flex items-start justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{book.title}</h2>
            <p className="text-gray-600 mt-1">{book.author}</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X size={28} />
          </button>
        </div>

        <div className="p-8 overflow-auto flex-1 space-y-8">
          
          {/* Average Rating */}
          <div className="flex items-center gap-4">
            <span className="text-6xl font-semibold text-amber-500">{avgRating || '—'}</span>
            <div>
              <div className="flex text-amber-400">
                {[1,2,3,4,5].map(i => (
                  <Star key={i} size={28} fill={i <= Math.round(avgRating) ? "currentColor" : "none"} />
                ))}
              </div>
              <p className="text-sm text-gray-500 mt-1">
                {totalReviews} {totalReviews === 1 ? 'review' : 'reviews'}
              </p>
            </div>
          </div>

          {/* Book Info */}
          <div className="grid grid-cols-2 gap-x-12 gap-y-6">
            <div>
              <p className="text-gray-500 text-sm mb-1">Location</p>
              <p className="font-medium text-gray-900">{book.location || '—'}</p>
            </div>
            <div>
              <p className="text-gray-500 text-sm mb-1">Status</p>
              <p className={`font-medium ${book.status === 'available' ? 'text-green-600' : 'text-orange-600'}`}>
                {book.status === 'available' ? '✅ Available' : '📖 Borrowed'}
              </p>
            </div>
          </div>

          {/* Description */}
          {book.description && (
            <div>
              <p className="text-gray-500 text-sm mb-2">Description</p>
              <p className="text-gray-800 leading-relaxed">{book.description}</p>
            </div>
          )}

          {/* Other Reviews */}
          <div>
            <p className="text-gray-500 font-medium mb-4">What others said ({totalReviews})</p>
            
            {reviews.length === 0 ? (
              <p className="text-gray-400 italic">No reviews yet. Be the first to review this book!</p>
            ) : (
              <div className="space-y-7">
                {reviews.map((review, i) => (
                  <div key={i} className="border-l-2 border-gray-200 pl-5">
                    <div className="flex justify-between items-center">
                      <p className="font-medium text-gray-800">
                        {review.users?.name || 'Anonymous'}
                      </p>
                      <div className="flex text-amber-400">
                        {[1,2,3,4,5].map(s => (
                          <Star key={s} size={18} fill={s <= review.rating ? "currentColor" : "none"} />
                        ))}
                      </div>
                    </div>
                    {review.notes && (
                      <p className="mt-3 text-gray-700">"{review.notes}"</p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer - Fixed visibility */}
        <div className="p-6 border-t bg-gray-50">
          <button
            onClick={onClose}
            className="w-full py-6 text-lg font-medium bg-white border border-gray-300 hover:bg-gray-100 rounded-2xl transition text-gray-700"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}