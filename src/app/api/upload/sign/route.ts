import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifyJWT } from '@/lib/jwt';

// Returns a one-time signed upload URL so the browser can send large files
// (e.g. hero videos) straight to Supabase Storage. Going through /api/upload
// would hit Vercel's 4.5 MB request body limit.

async function checkAuth() {
  const cookieStore = await cookies();
  const token = cookieStore.get('edifice_session')?.value;
  return token ? verifyJWT(token) : null;
}

const BUCKET = 'edifice-media';

export async function POST(request: Request) {
  try {
    const admin = await checkAuth();
    if (!admin) {
      return NextResponse.json({ detail: 'Unauthorized' }, { status: 401 });
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!supabaseUrl || !serviceRoleKey) {
      return NextResponse.json({ detail: 'Storage is not configured' }, { status: 500 });
    }

    const { filename } = await request.json();
    const rawExt = String(filename || '').split('.').pop() || 'bin';
    const extension = rawExt.toLowerCase().replace(/[^a-z0-9]/g, '').slice(0, 8) || 'bin';
    const objectPath = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${extension}`;

    // Ensure the public bucket exists (ignored if it already does)
    await fetch(`${supabaseUrl}/storage/v1/bucket`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${serviceRoleKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id: BUCKET, name: BUCKET, public: true }),
    });

    const signRes = await fetch(`${supabaseUrl}/storage/v1/object/upload/sign/${BUCKET}/${objectPath}`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${serviceRoleKey}`,
        'Content-Type': 'application/json',
      },
      body: '{}',
    });

    if (!signRes.ok) {
      console.error('Supabase signed upload URL failed:', await signRes.text());
      return NextResponse.json({ detail: 'Could not prepare upload' }, { status: 502 });
    }

    const { url } = await signRes.json(); // "/object/upload/sign/<bucket>/<path>?token=..."

    return NextResponse.json({
      success: true,
      uploadUrl: `${supabaseUrl}/storage/v1${url}`,
      publicUrl: `${supabaseUrl}/storage/v1/object/public/${BUCKET}/${objectPath}`,
    });
  } catch (error) {
    console.error('Signed upload handler error:', error);
    return NextResponse.json({ detail: 'Internal server error' }, { status: 500 });
  }
}
