// app/login/page.tsx
'use client';

import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();
  const supabase = createClient();

  const handleGoogleLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/books` },
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-10 rounded-3xl shadow-xl w-full max-w-md text-center">
        <h1 className="text-4xl font-bold text-emerald-600 mb-2">📚 Nenne Library</h1>
        <p className="text-gray-600 mb-8">Family Book Collection</p>

        <button
          onClick={handleGoogleLogin}
          className="w-full bg-black text-white py-4 rounded-2xl font-medium hover:bg-gray-800 transition"
        >
          Continue with Google
        </button>

        <p className="text-xs text-gray-500 mt-8">
          Only Family members can manage books
        </p>
      </div>
    </div>
  );
}