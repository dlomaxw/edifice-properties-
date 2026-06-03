import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { db } from '@/lib/db';
import { verifyJWT } from '@/lib/jwt';

async function checkAuth() {
  const cookieStore = await cookies();
  const token = cookieStore.get('edifice_session')?.value;
  return token ? verifyJWT(token) : null;
}

// GET: Specific property by ID/slug (public)
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const property = await db.property.findFirst({
      where: {
        OR: [{ id }, { slug: id }],
      },
      include: { units: true, images: { orderBy: { createdAt: 'asc' } } },
    });

    if (!property) {
      return NextResponse.json({ detail: 'Property not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: property });
  } catch (error) {
    console.error('Fetch property error:', error);
    return NextResponse.json(
      { detail: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT: Update specific property (admin)
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const admin = await checkAuth();
    if (!admin) {
      return NextResponse.json({ detail: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const {
      name,
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
      images,
    } = body;

    const currentProperty = await db.property.findUnique({
      where: { id },
    });

    if (!currentProperty) {
      return NextResponse.json({ detail: 'Property not found' }, { status: 404 });
    }

    // Sync gallery images if provided
    if (images !== undefined && Array.isArray(images)) {
      await db.$transaction([
        db.propertyImage.deleteMany({ where: { propertyId: id } }),
        db.propertyImage.createMany({
          data: images.map((img: any) => ({
            propertyId: id,
            url: img.url,
            category: img.category,
            label: img.label,
            description: img.description || '',
          }))
        })
      ]);
    }

    const updatedProperty = await db.property.update({
      where: { id },
      data: {
        name: name !== undefined ? name : currentProperty.name,
        location: location !== undefined ? location : currentProperty.location,
        description: description !== undefined ? description : currentProperty.description,
        fullDescription:
          fullDescription !== undefined ? fullDescription : currentProperty.fullDescription,
        startingPrice:
          startingPrice !== undefined ? parseFloat(startingPrice) : currentProperty.startingPrice,
        currency: currency !== undefined ? currency : currentProperty.currency,
        status: status !== undefined ? status : currentProperty.status,
        type: type !== undefined ? type : currentProperty.type,
        bedrooms: bedrooms !== undefined ? bedrooms : currentProperty.bedrooms,
        bathrooms: bathrooms !== undefined ? bathrooms : currentProperty.bathrooms,
        sizeRange: sizeRange !== undefined ? sizeRange : currentProperty.sizeRange,
        mainImage: mainImage !== undefined ? mainImage : currentProperty.mainImage,
        mapUrl: mapUrl !== undefined ? mapUrl : currentProperty.mapUrl,
        youtubeUrl: youtubeUrl !== undefined ? youtubeUrl : currentProperty.youtubeUrl,
        featured: featured !== undefined ? !!featured : currentProperty.featured,
        seoTitle: seoTitle !== undefined ? seoTitle : currentProperty.seoTitle,
        seoDescription:
          seoDescription !== undefined ? seoDescription : currentProperty.seoDescription,
        orderIndex: orderIndex !== undefined ? parseInt(orderIndex) : currentProperty.orderIndex,
      },
      include: { units: true, images: true }
    });

    return NextResponse.json({ success: true, data: updatedProperty });
  } catch (error) {
    console.error('Property update error:', error);
    return NextResponse.json(
      { detail: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE: Delete specific property (admin)
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const admin = await checkAuth();
    if (!admin) {
      return NextResponse.json({ detail: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;

    const currentProperty = await db.property.findUnique({
      where: { id },
    });

    if (!currentProperty) {
      return NextResponse.json({ detail: 'Property not found' }, { status: 404 });
    }

    await db.property.delete({
      where: { id },
    });

    return NextResponse.json({ success: true, message: 'Property deleted successfully' });
  } catch (error) {
    console.error('Property delete error:', error);
    return NextResponse.json(
      { detail: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PATCH: Wrapper forwarding to PUT
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  return PUT(request, { params });
}
