import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifyJWT } from '@/lib/jwt';
import fs from 'fs';
import path from 'path';

async function checkAuth() {
  const cookieStore = await cookies();
  const token = cookieStore.get('edifice_session')?.value;
  return token ? verifyJWT(token) : null;
}

export async function POST(request: Request) {
  try {
    const admin = await checkAuth();
    if (!admin) {
      return NextResponse.json({ detail: 'Unauthorized' }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ detail: 'No file provided' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Generate unique name
    const originalName = file.name;
    const extension = originalName.split('.').pop() || 'jpg';
    const filename = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${extension}`;

    let uploadUrl = '';

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    const bucketName = 'edifice-media';

    // Attempt Supabase Storage Upload
    if (supabaseUrl && serviceRoleKey) {
      try {
        // Ensure bucket exists
        await fetch(`${supabaseUrl}/storage/v1/bucket`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${serviceRoleKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            id: bucketName,
            name: bucketName,
            public: true,
          }),
        });

        // Upload the object
        const uploadRes = await fetch(`${supabaseUrl}/storage/v1/object/${bucketName}/${filename}`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${serviceRoleKey}`,
            'Content-Type': file.type || 'application/octet-stream',
          },
          body: buffer,
        });

        if (uploadRes.ok) {
          uploadUrl = `${supabaseUrl}/storage/v1/object/public/${bucketName}/${filename}`;
          console.log('Successfully uploaded image to Supabase:', uploadUrl);
        } else {
          const errorText = await uploadRes.text();
          console.error('Supabase storage upload failed:', errorText);
        }
      } catch (err) {
        console.error('Supabase storage exception occurred:', err);
      }
    }

    // Fallback to local uploads directory (useful for local development/testing)
    if (!uploadUrl) {
      try {
        const uploadDir = path.join(process.cwd(), 'public', 'uploads');
        if (!fs.existsSync(uploadDir)) {
          fs.mkdirSync(uploadDir, { recursive: true });
        }
        const filepath = path.join(uploadDir, filename);
        fs.writeFileSync(filepath, buffer);
        uploadUrl = `/uploads/${filename}`;
        console.log('Fallback: Saved image to local server filesystem:', uploadUrl);
      } catch (err) {
        console.error('Local file write error:', err);
        return NextResponse.json({ detail: 'Failed to write file locally' }, { status: 500 });
      }
    }

    return NextResponse.json({ success: true, url: uploadUrl });
  } catch (error) {
    console.error('Upload handler error:', error);
    return NextResponse.json({ detail: 'Internal server error' }, { status: 500 });
  }
}
