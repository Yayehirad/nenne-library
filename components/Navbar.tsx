'use client';

import Link from 'next/link';
import { LogOut, BookOpen } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';

export default function Navbar() {
  const router = useRouter();
  const supabase = createClient();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  return (
    <nav className="border-b bg-white">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        <Link href="/" className="flex items-center gap-2 text-2xl font-bold text-emerald-600">
          <BookOpen size={28} />
          Nenne Library
        </Link>

        <div className="flex gap-6">
          <Link href="/books">Books</Link>
          <Link href="/my-requests">My Requests</Link>
          <Link href="/lending">Lending</Link>
          <Link href="/reading-log">Reading Log</Link>
          <button onClick={handleSignOut} className="text-red-600">Sign out</button>
        </div>
      </div>
    </nav>
  );
}