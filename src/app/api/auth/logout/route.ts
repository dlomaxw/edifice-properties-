import { NextResponse } from 'next/server';

export async function POST() {
  const response = NextResponse.json({ success: true }, { status: 200 });

  // Clear cookie
  response.cookies.delete('edifice_session');

  return response;
}
