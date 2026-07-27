import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const LEGACY_301_REDIRECTS: Record<string, string> = {
  '/elite-palazzonaguru-2': '/properties/horizon-residency',
  '/elite-palazzonaguru-2/': '/properties/horizon-residency',
  '/elite-palazzonaguru-2-2': '/properties/embassy-towers',
  '/elite-palazzonaguru-2-2/': '/properties/embassy-towers',
  '/elite-palazzonaguru': '/properties/elite-palazzo-naguru',
  '/elite-palazzonaguru/': '/properties/elite-palazzo-naguru',
  '/horizon-residency': '/properties/horizon-residency',
  '/horizon-residency/': '/properties/horizon-residency',
  '/embassy-towers': '/properties/embassy-towers',
  '/embassy-towers/': '/properties/embassy-towers',
  '/signature-residency': '/properties/signature-residency',
  '/signature-residency/': '/properties/signature-residency',
  '/atlantic-apartments': '/properties/atlantic-apartments',
  '/atlantic-apartments/': '/properties/atlantic-apartments',
  '/urban-view-apartments': '/properties/urban-view-apartments',
  '/urban-view-apartments/': '/properties/urban-view-apartments',
  '/contact-us': '/contact',
  '/contact-us/': '/contact',
  '/about-us': '/about',
  '/about-us/': '/about',
  '/buying-process/': '/buying-process',
  '/home': '/',
  '/home/': '/',
};

export function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const host = request.headers.get('host') || '';
  const forwardedHost = request.headers.get('x-forwarded-host') || '';
  const sessionToken = request.cookies.get('edifice_session')?.value;

  // 1. Canonicalize Vercel / non-primary preview domains to edificepropertiesug.com in production
  if (host.includes('.vercel.app') || forwardedHost.includes('.vercel.app')) {
    const targetUrl = new URL(`https://edificepropertiesug.com${pathname}${search}`);
    const response = NextResponse.redirect(targetUrl, 301);
    response.headers.set('X-Robots-Tag', 'noindex, nofollow, noarchive');
    return response;
  }

  // 2. Redirect legacy WordPress endpoints or exact legacy URL paths to clean Next.js pages
  if (LEGACY_301_REDIRECTS[pathname]) {
    const targetPath = LEGACY_301_REDIRECTS[pathname];
    const targetUrl = new URL(`https://edificepropertiesug.com${targetPath}${search}`);
    return NextResponse.redirect(targetUrl, 301);
  }

  if (
    pathname.startsWith('/wp-content') ||
    pathname.startsWith('/wp-admin') ||
    pathname.startsWith('/wp-includes') ||
    pathname.startsWith('/wp-json') ||
    pathname.endsWith('.php')
  ) {
    const targetUrl = new URL(`https://edificepropertiesug.com`, request.url);
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

  const response = NextResponse.next();
  // Ensure main domain always declares canonical headers
  response.headers.set('X-Robots-Tag', 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1');
  return response;
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
