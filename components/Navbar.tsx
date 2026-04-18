// components/Navbar.tsx
'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { useState, useEffect } from 'react';
import { LogOut, BookOpen } from 'lucide-react';

export default function Navbar() {
  const router = useRouter();
  const supabase = createClient();

  const [userName, setUserName] = useState<string>('');
  const [isFamily, setIsFamily] = useState<boolean>(false);

  useEffect(() => {
    const loadUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Get name + role from public.users table
      const { data } = await supabase
        .from('users')
        .select('name, email, role')
        .eq('id', user.id)
        .single();

      if (data) {
        setUserName(data.name || data.email || 'User');
        setIsFamily(data.role === 'family');
      }
    };

    loadUser();
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  return (
    <nav className="border-b bg-white sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        
        {/* Logo */}
        <Link href="/books" className="flex items-center gap-3 text-2xl font-bold text-emerald-600">
          <BookOpen size={32} />
          Nenne Library
        </Link>

        {/* Navigation Links */}
        <div className="flex items-center gap-8 text-sm font-medium">
          <Link href="/books" className="hover:text-emerald-600">Books</Link>
          <Link href="/my-requests" className="hover:text-emerald-600">My Requests</Link>
          <Link href="/lending" className="hover:text-emerald-600">Lending</Link>
          <Link href="/reading-log" className="hover:text-emerald-600">Reading Log</Link>
        </div>

        {/* User info + badge + Sign out */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3">
            {/* Badge */}
            <span className={`text-xs font-medium px-3 py-1 rounded-full ${
              isFamily 
                ? 'bg-emerald-100 text-emerald-700' 
                : 'bg-gray-100 text-gray-600'
            }`}>
              {isFamily ? 'Family' : 'Other reader'}
            </span>

            {/* Name / Email */}
            <div className="text-sm font-medium text-gray-700">
              {userName}
            </div>
          </div>

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