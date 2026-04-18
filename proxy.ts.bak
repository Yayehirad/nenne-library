// proxy.ts
import { updateSession } from '@/lib/supabase/proxy';
import { createServerClient } from '@supabase/ssr';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function proxy(request: NextRequest) {
  // First, let Supabase handle session/cookie updates
  let response = await updateSession(request);

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value;
        },
      },
    }
  );

  const { data: { user } } = await supabase.auth.getUser();

  const pathname = request.nextUrl.pathname;

  // Allow access to login page and root
  if (pathname === '/login' || pathname === '/') {
    if (user && pathname === '/login') {
      // If already logged in, go to books
      return NextResponse.redirect(new URL('/books', request.url));
    }
    return response;
  }

  // Protect all other pages (books, lending, etc.)
  if (!user) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return response;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};