import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { createServerClient } from '@supabase/ssr';

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // Refresh session if expired
  const {
    data: { session },
  } = await supabase.auth.getSession();

  // Protect admin routes (except login)
  if (
    request.nextUrl.pathname.startsWith('/admin') &&
    !request.nextUrl.pathname.startsWith('/admin/login') &&
    !request.nextUrl.pathname.startsWith('/api/')
  ) {
    if (!session) {
      const redirectUrl = new URL('/admin/login', request.url);
      return NextResponse.redirect(redirectUrl);
    }
  }

  // Protect sales routes (except login)
  if (
    request.nextUrl.pathname.startsWith('/sales') &&
    !request.nextUrl.pathname.startsWith('/sales/login') &&
    !request.nextUrl.pathname.startsWith('/api/')
  ) {
    if (!session) {
      const redirectUrl = new URL('/sales/login', request.url);
      return NextResponse.redirect(redirectUrl);
    }
  }

  // API routes - don't redirect, just refresh session
  // The API routes handle their own auth responses

  // Redirect logged-in users away from admin login page
  if (request.nextUrl.pathname === '/admin/login' && session) {
    return NextResponse.redirect(new URL('/admin', request.url));
  }

  // Redirect logged-in users away from sales login page
  if (request.nextUrl.pathname === '/sales/login' && session) {
    return NextResponse.redirect(new URL('/sales', request.url));
  }

  return response;
}

export const config = {
  matcher: ['/admin/:path*', '/api/admin/:path*', '/sales/:path*', '/api/sales/:path*'],
};
