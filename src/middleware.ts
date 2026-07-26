import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const host = request.headers.get('host') || '';
  const sessionToken = request.cookies.get('edifice_session')?.value;

  // 1. Canonicalize Vercel / non-primary domains to edificepropertiesug.com in production
  if (host.includes('.vercel.app')) {
    const targetUrl = new URL(`https://edificepropertiesug.com${pathname}${search}`);
    const response = NextResponse.redirect(targetUrl, 301);
    response.headers.set('X-Robots-Tag', 'noindex, nofollow');
    return response;
  }

  // 2. Redirect legacy WordPress paths to clean Next.js pages
  if (
    pathname.startsWith('/wp-content') ||
    pathname.startsWith('/wp-admin') ||
    pathname.startsWith('/wp-includes') ||
    pathname.startsWith('/wp-json')
  ) {
    const targetUrl = new URL(`https://edificepropertiesug.com`, request.url);
    return NextResponse.redirect(targetUrl, 301);
  }

  if (pathname === '/about-us' || pathname === '/about-us/') {
    const targetUrl = new URL(`https://edificepropertiesug.com/about`, request.url);
    return NextResponse.redirect(targetUrl, 301);
  }

  if (pathname.includes('elite-palazzonaguru-2')) {
    const targetUrl = new URL(`https://edificepropertiesug.com/properties/horizon-residency`, request.url);
    return NextResponse.redirect(targetUrl, 301);
  }

  // 3. Protect admin routes (except login and API)
  if (pathname.startsWith('/admin') && pathname !== '/admin/login') {
    if (!sessionToken) {
      const url = request.nextUrl.clone();
      url.pathname = '/admin/login';
      return NextResponse.redirect(url);
    }
  }

  // Redirect from login if already authenticated
  if (pathname === '/admin/login') {
    if (sessionToken) {
      const url = request.nextUrl.clone();
      url.pathname = '/admin';
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, icon.png, assets (public assets)
     */
    '/((?!_next/static|_next/image|favicon.ico|icon.png|assets/).*)',
  ],
};
