import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

export default withAuth(
  function middleware(req) {
    // Check if user is trying to access admin routes
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
        // Allow public routes
        if (
          req.nextUrl.pathname.startsWith('/login') ||
          req.nextUrl.pathname.startsWith('/api/auth')
        ) {
          return true;
        }
        // Require auth for all other routes
        return token !== null;
      }
    }
  }
);

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|public/).*)'
  ]
};
