import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { db } from '@/lib/db';
import { verifyJWT } from '@/lib/jwt';

async function checkAuth() {
  const cookieStore = await cookies();
  const token = cookieStore.get('edifice_session')?.value;
  return token ? verifyJWT(token) : null;
}

// GET: List all properties (public)
export async function GET() {
  try {
    const properties = await db.property.findMany({
      orderBy: { orderIndex: 'asc' },
      include: { units: true }
    });

    return NextResponse.json({ success: true, data: properties });
  } catch (error) {
    console.error('Fetch properties error:', error);
    return NextResponse.json(
      { detail: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST: Create a new property (admin)
export async function POST(request: Request) {
  try {
    const admin = await checkAuth();
    if (!admin) {
      return NextResponse.json({ detail: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const {
      id,
      name,
      slug,
      location,
      description,
      fullDescription,
      startingPrice,
      currency,
      status,
      type,
      bedrooms,
      bathrooms,
      sizeRange,
      mainImage,
      mapUrl,
      youtubeUrl,
      featured,
      seoTitle,
      seoDescription,
      orderIndex,
    } = body;

    if (!id || !name || !slug) {
      return NextResponse.json(
        { detail: 'ID, Name, and Slug are required' },
        { status: 400 }
      );
    }

    // Check if slug is unique
    const existing = await db.property.findUnique({ where: { slug } });
    if (existing) {
      return NextResponse.json(
        { detail: 'Slug must be unique' },
        { status: 400 }
      );
    }

    const property = await db.property.create({
      data: {
        id,
        name,
        slug,
        location: location || '',
        description: description || '',
        fullDescription: fullDescription || '',
        startingPrice: parseFloat(startingPrice) || 0,
        currency: currency || 'USD',
        status: status || 'Active',
        type: type || 'Apartment',
        bedrooms: bedrooms || '',
        bathrooms: bathrooms || '',
        sizeRange: sizeRange || '',
        mainImage: mainImage || '/assets/images/logo.png',
        mapUrl: mapUrl || '',
        youtubeUrl: youtubeUrl || '',
        featured: !!featured,
        seoTitle: seoTitle || name,
        seoDescription: seoDescription || description || '',
        orderIndex: parseInt(orderIndex) || 0,
      },
    });

    return NextResponse.json({ success: true, data: property }, { status: 201 });
  } catch (error) {
    console.error('Property creation error:', error);
    return NextResponse.json(
      { detail: 'Internal server error' },
      { status: 500 }
    );
  }
}
