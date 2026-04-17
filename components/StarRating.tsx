// components/StarRating.tsx
'use client';

import { useState } from 'react';
import { Star } from 'lucide-react';

export default function StarRating({ 
  value = 0, 
  onChange 
}: { 
  value?: number; 
  onChange?: (rating: number) => void;
}) {
  const [hover, setHover] = useState(0);

  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          size={28}
          className={`cursor-pointer transition-colors ${
            (hover || value) >= star 
              ? 'fill-yellow-400 text-yellow-400' 
              : 'text-gray-300 hover:text-yellow-300'
          }`}
          onClick={() => onChange?.(star)}
          onMouseEnter={() => setHover(star)}
          onMouseLeave={() => setHover(0)}
        />
      ))}
    </div>
  );
}