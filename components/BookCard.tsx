// components/BookCard.tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import BorrowModal from './BorrowModal';
import BookDetailModal from './BookDetailModal';
import { Star } from 'lucide-react';

export default function BookCard({ book }: { book: any }) {
  const [showDetail, setShowDetail] = useState(false);
  const [showBorrow, setShowBorrow] = useState(false);

  if (!book) return null;

  const status = (book.status || '').toLowerCase();
  const isAvailable = status === 'available';

  // Average rating from reading_log
  const avgRating = book.avg_rating 
    ? parseFloat(book.avg_rating) 
    : 0;

  return (
    <>
      <div 
        onClick={() => setShowDetail(true)}
        className="bg-white border border-gray-200 rounded-3xl p-6 hover:shadow-xl transition-all hover:-translate-y-1 h-full flex flex-col cursor-pointer"
      >
        <div className="flex-1">
          <h3 className="font-semibold text-lg leading-tight text-gray-900 line-clamp-2 mb-2">
            {book.title}
          </h3>
          <p className="text-gray-600">{book.author}</p>
          <p className="text-sm text-gray-500 mt-4">{book.location}</p>
        </div>

        <div className="mt-6 flex flex-wrap gap-3 items-center">
          {/* Status */}
          <span className={`px-4 py-1 text-xs font-medium rounded-full ${
            isAvailable ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'
          }`}>
            {isAvailable ? "Available" : "Borrowed"}
          </span>

          {/* Genre */}
          {book.genre && (
            <span className="px-4 py-1 text-xs font-medium bg-gray-100 text-gray-700 rounded-full">
              {book.genre}
            </span>
          )}

          {/* Average Rating */}
          {avgRating > 0 && (
            <div className="flex items-center gap-1 text-amber-500 text-sm font-medium ml-auto">
              <Star size={16} fill="currentColor" />
              <span>{avgRating.toFixed(1)}</span>
            </div>
          )}

          {/* Buttons */}
          <div className="ml-auto flex gap-2">
            {isAvailable && (
              <button
                onClick={(e) => { e.stopPropagation(); setShowBorrow(true); }}
                className="bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium px-5 py-2.5 rounded-2xl transition"
              >
                Request
              </button>
            )}

            <Link href={`/books/${book.id}/edit`} onClick={(e) => e.stopPropagation()}>
              <button className="bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium px-5 py-2.5 rounded-2xl transition">
                ✏️
              </button>
            </Link>
          </div>
        </div>
      </div>

      {showDetail && <BookDetailModal book={book} onClose={() => setShowDetail(false)} />}
      {showBorrow && <BorrowModal book={book} onClose={() => setShowBorrow(false)} />}
    </>
  );
}