import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifyJWT } from '@/lib/jwt';

export async function GET() {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('edifice_session');

    if (!sessionCookie) {
      return NextResponse.json({ authenticated: false }, { status: 200 });
    }

    const payload = verifyJWT(sessionCookie.value);

    if (!payload) {
      return NextResponse.json({ authenticated: false }, { status: 200 });
    }

    return NextResponse.json({ authenticated: true, user: payload }, { status: 200 });
  } catch (error) {
    console.error('Session API error:', error);
    return NextResponse.json({ authenticated: false }, { status: 500 });
  }
}
