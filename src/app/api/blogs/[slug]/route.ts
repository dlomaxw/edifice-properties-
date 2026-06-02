import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { db } from '@/lib/db';
import { verifyJWT } from '@/lib/jwt';

async function checkAuth() {
  const cookieStore = await cookies();
  const token = cookieStore.get('edifice_session')?.value;
  return token ? verifyJWT(token) : null;
}

// GET: Specific blog by slug or ID
export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const blog = await db.blog.findFirst({
      where: {
        OR: [{ id: slug }, { slug }],
      },
    });

    if (!blog) {
      return NextResponse.json({ detail: 'Blog post not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: blog });
  } catch (error) {
    console.error('Fetch blog error:', error);
    return NextResponse.json(
      { detail: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT: Update specific blog (admin)
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const admin = await checkAuth();
    if (!admin) {
      return NextResponse.json({ detail: 'Unauthorized' }, { status: 401 });
    }

    const { slug } = await params;
    const body = await request.json();
    const { title, featuredImage, content, category, author, seoTitle, seoDescription, tags } = body;

    const currentBlog = await db.blog.findFirst({
      where: {
        OR: [{ id: slug }, { slug }],
      },
    });

    if (!currentBlog) {
      return NextResponse.json({ detail: 'Blog post not found' }, { status: 404 });
    }

    const updatedBlog = await db.blog.update({
      where: { id: currentBlog.id },
      data: {
        title: title !== undefined ? title : currentBlog.title,
        featuredImage: featuredImage !== undefined ? featuredImage : currentBlog.featuredImage,
        content: content !== undefined ? content : currentBlog.content,
        category: category !== undefined ? category : currentBlog.category,
        author: author !== undefined ? author : currentBlog.author,
        seoTitle: seoTitle !== undefined ? seoTitle : currentBlog.seoTitle,
        seoDescription: seoDescription !== undefined ? seoDescription : currentBlog.seoDescription,
        tags: tags !== undefined ? tags : currentBlog.tags,
      },
    });

    return NextResponse.json({ success: true, data: updatedBlog });
  } catch (error) {
    console.error('Blog update error:', error);
    return NextResponse.json(
      { detail: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE: Delete specific blog (admin)
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const admin = await checkAuth();
    if (!admin) {
      return NextResponse.json({ detail: 'Unauthorized' }, { status: 401 });
    }

    const { slug } = await params;

    const currentBlog = await db.blog.findFirst({
      where: {
        OR: [{ id: slug }, { slug }],
      },
    });

    if (!currentBlog) {
      return NextResponse.json({ detail: 'Blog post not found' }, { status: 404 });
    }

    await db.blog.delete({
      where: { id: currentBlog.id },
    });

    return NextResponse.json({ success: true, message: 'Blog post deleted successfully' });
  } catch (error) {
    console.error('Blog delete error:', error);
    return NextResponse.json(
      { detail: 'Internal server error' },
      { status: 500 }
    );
  }
}
