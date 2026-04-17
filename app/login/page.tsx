// app/login/page.tsx
'use client';

import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();
  const supabase = createClient();

  const handleGoogleSignIn = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/books`,
      },
    });

    if (error) console.error(error);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-950">
      <div className="bg-white p-10 rounded-2xl shadow-xl w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-emerald-600">📚 Nenne Library</h1>
          <p className="text-gray-600 mt-2">Family Book Collection</p>
        </div>

        <button
          onClick={handleGoogleSignIn}
          className="w-full bg-black hover:bg-gray-800 text-white font-medium py-4 rounded-xl transition flex items-center justify-center gap-3"
        >
          Continue with Google
        </button>

        <p className="text-center text-xs text-gray-500 mt-6">
          Only Family members can add or manage books
        </p>
      </div>
    </div>
  );
}