import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { db } from '@/lib/db';
import { verifyJWT } from '@/lib/jwt';

async function checkAuth() {
  const cookieStore = await cookies();
  const token = cookieStore.get('edifice_session')?.value;
  return token ? verifyJWT(token) : null;
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const propertyId = searchParams.get('propertyId');

    const where: any = {};
    if (propertyId) {
      where.propertyId = propertyId;
    }

    const units = await db.unit.findMany({
      where,
      orderBy: { price: 'asc' },
    });

    return NextResponse.json({ success: true, data: units });
  } catch (error) {
    console.error('Fetch units error:', error);
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
    const {
      propertyId,
      name,
      price,
      size,
      bedrooms,
      bathrooms,
      status,
      description,
      floorPlanImage,
    } = body;

    if (!propertyId || !name || !price) {
      return NextResponse.json(
        { detail: 'Property ID, Name, and Price are required' },
        { status: 400 }
      );
    }

    const unit = await db.unit.create({
      data: {
        propertyId,
        name,
        price: parseFloat(price),
        size: size || '',
        bedrooms: parseInt(bedrooms) || 1,
        bathrooms: parseInt(bathrooms) || 1,
        status: status || 'Available',
        description: description || '',
        floorPlanImage: floorPlanImage || '/assets/images/1.webp',
      },
    });

    return NextResponse.json({ success: true, data: unit }, { status: 201 });
  } catch (error) {
    console.error('Unit creation error:', error);
    return NextResponse.json(
      { detail: 'Internal server error' },
      { status: 500 }
    );
  }
}
