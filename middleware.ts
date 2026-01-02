import { NextRequest, NextResponse } from 'next/server';
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

const redis = Redis.fromEnv();

const ratelimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(10, '1 m'), // 30 requests per minute
});

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  /* ---------- RATE LIMIT (page refresh / URL access) ---------- */
  const ip =
    req.headers.get('x-forwarded-for')?.split(',')[0] ?? 'unknown';

  const { success, reset } = await ratelimit.limit(ip);

  if (!success) {
    return new NextResponse('Too many requests', {
      status: 429,
      headers: {
        'Retry-After': reset.toString(),
      },
    });
  }

  /* ---------- ADMIN AUTH ---------- */
  if (pathname.startsWith('/admin')) {
    const login = req.cookies.get('login');

    if (!login) {
      return NextResponse.redirect(
        new URL('/homepage', req.url)
      );
    }
  }

  return NextResponse.next();
}

/* ---------- CONFIG ---------- */
export const config = {
  matcher: [
    '/homepage',                 // homepage refresh
    '/product/:path*',
    '/checkout/:path*',
    '/cart',
    '/admin/:path*',     // admin (auth + rate limit)
  ],
};