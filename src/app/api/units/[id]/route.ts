import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { db } from '@/lib/db';
import { verifyJWT } from '@/lib/jwt';

async function checkAuth() {
  const cookieStore = await cookies();
  const token = cookieStore.get('edifice_session')?.value;
  return token ? verifyJWT(token) : null;
}

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
      price,
      size,
      bedrooms,
      bathrooms,
      status,
      description,
      floorPlanImage,
    } = body;

    const currentUnit = await db.unit.findUnique({
      where: { id },
    });

    if (!currentUnit) {
      return NextResponse.json({ detail: 'Unit not found' }, { status: 404 });
    }

    const updatedUnit = await db.unit.update({
      where: { id },
      data: {
        name: name !== undefined ? name : currentUnit.name,
        price: price !== undefined ? parseFloat(price) : currentUnit.price,
        size: size !== undefined ? size : currentUnit.size,
        bedrooms: bedrooms !== undefined ? parseInt(bedrooms) : currentUnit.bedrooms,
        bathrooms: bathrooms !== undefined ? parseInt(bathrooms) : currentUnit.bathrooms,
        status: status !== undefined ? status : currentUnit.status,
        description: description !== undefined ? description : currentUnit.description,
        floorPlanImage: floorPlanImage !== undefined ? floorPlanImage : currentUnit.floorPlanImage,
      },
    });

    return NextResponse.json({ success: true, data: updatedUnit });
  } catch (error) {
    console.error('Unit update error:', error);
    return NextResponse.json(
      { detail: 'Internal server error' },
      { status: 500 }
    );
  }
}

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

    const currentUnit = await db.unit.findUnique({
      where: { id },
    });

    if (!currentUnit) {
      return NextResponse.json({ detail: 'Unit not found' }, { status: 404 });
    }

    await db.unit.delete({
      where: { id },
    });

    return NextResponse.json({ success: true, message: 'Unit deleted successfully' });
  } catch (error) {
    console.error('Unit delete error:', error);
    return NextResponse.json(
      { detail: 'Internal server error' },
      { status: 500 }
    );
  }
}
