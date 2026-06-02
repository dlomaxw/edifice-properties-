import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { db } from '@/lib/db';
import { verifyJWT } from '@/lib/jwt';

async function checkAuth() {
  const cookieStore = await cookies();
  const token = cookieStore.get('edifice_session')?.value;
  return token ? verifyJWT(token) : null;
}

export async function GET() {
  try {
    const blogs = await db.blog.findMany({
      orderBy: { dateCreated: 'desc' },
    });

    return NextResponse.json({ success: true, data: blogs });
  } catch (error) {
    console.error('Fetch blogs error:', error);
    return NextResponse.json(
      { detail: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const admin = await checkAuth();
    if (!admin) {
      return NextResponse.json({ detail: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { title, slug, featuredImage, content, category, author, seoTitle, seoDescription, tags } = body;

    if (!title || !slug || !content) {
      return NextResponse.json(
        { detail: 'Title, slug, and content are required' },
        { status: 400 }
      );
    }

    // Check if slug is unique
    const existing = await db.blog.findUnique({ where: { slug } });
    if (existing) {
      return NextResponse.json(
        { detail: 'Slug must be unique' },
        { status: 400 }
      );
    }

    const blog = await db.blog.create({
      data: {
        title,
        slug,
        featuredImage: featuredImage || '/assets/images/horizon.png',
        content,
        category: category || 'Company news',
        author: author || admin.name || 'Edifice Properties',
        seoTitle: seoTitle || title,
        seoDescription: seoDescription || content.replace(/<[^>]+>/g, '').substring(0, 160),
        tags: tags || '',
      },
    });

    return NextResponse.json({ success: true, data: blog }, { status: 201 });
  } catch (error) {
    console.error('Blog creation error:', error);
    return NextResponse.json(
      { detail: 'Internal server error' },
      { status: 500 }
    );
  }
}
