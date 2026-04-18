// components/Navbar.tsx
'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { LogOut, BookOpen } from 'lucide-react';

export default function Navbar() {
  const router = useRouter();
  const supabase = createClient();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  return (
    <nav className="border-b bg-white sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link href="/books" className="flex items-center gap-3 text-2xl font-bold text-emerald-600">
          <BookOpen size={32} />
          Nenne Library
        </Link>

        <div className="flex items-center gap-8 text-sm font-medium">
          <Link href="/books">Books</Link>
          <Link href="/my-requests">My Requests</Link>
          <Link href="/lending">Lending</Link>
          <Link href="/reading-log">Reading Log</Link>

          <button
            onClick={handleSignOut}
            className="flex items-center gap-2 text-red-600 hover:text-red-700 font-medium"
          >
            <LogOut size={18} />
            Sign out
          </button>
        </div>
      </div>
    </nav>
  );
}