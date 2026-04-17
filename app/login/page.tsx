// app/(main)/layout.tsx
import { createClient } from '@/lib/supabase/server';
import Navbar from '@/components/Navbar';
import { redirect } from 'next/navigation';
import { Suspense } from 'react';

async function AuthCheck({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  return <>{children}</>;
}

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="max-w-7xl mx-auto px-6 py-8">
        <Suspense fallback={<div className="text-center py-12">Loading library...</div>}>
          <AuthCheck>
            {children}
          </AuthCheck>
        </Suspense>
      </main>
    </div>
  );
}