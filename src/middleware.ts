import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

export default withAuth(
  function middleware(req) {
    // Admin routes protection
    if (req.nextUrl.pathname.startsWith('/admin')) {
      if (req.nextauth.token?.role !== 'ADMIN') {
        return NextResponse.redirect(new URL('/dashboard', req.url));
      }
    }
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized({ req, token }) {
        // Public routes - no auth needed
        const publicPaths = ['/login', '/api/auth', '/api/seed', '/_next', '/favicon.ico'];
        if (publicPaths.some(path => req.nextUrl.pathname.startsWith(path))) {
          return true;
        }
        // All other routes require authentication
        return token !== null;
      }
    }
  }
);

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.).*)']
};
