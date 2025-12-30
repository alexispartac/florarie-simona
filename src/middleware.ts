// Create this file at /src/middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  
  // If it's an API route for admin, check the auth header
  if (path.startsWith('/api/admin') && !path.includes('verify-password')) {
    const authHeader = request.headers.get('authorization');
    
    if (authHeader !== `Bearer ${process.env.ADMIN_API_KEY}`) {
      return new NextResponse(
        JSON.stringify({ success: false, error: 'Unauthorized' }),
        { status: 401, headers: { 'content-type': 'application/json' } }
      );
    }
  }

  // For client-side admin routes, we'll handle redirection in the layout component
  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/api/admin/:path*'],
};