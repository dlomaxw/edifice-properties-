import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { db } from '@/lib/db';
import { verifyJWT } from '@/lib/jwt';

async function checkAuth() {
  const cookieStore = await cookies();
  const token = cookieStore.get('edifice_session')?.value;
  return token ? verifyJWT(token) : null;
}

export async function PATCH(
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
    const { status, assignedSalesperson, notes } = body;

    const currentEnquiry = await db.enquiry.findUnique({
      where: { id },
    });

    if (!currentEnquiry) {
      return NextResponse.json({ detail: 'Enquiry not found' }, { status: 404 });
    }

    const updatedEnquiry = await db.enquiry.update({
      where: { id },
      data: {
        status: status !== undefined ? status : currentEnquiry.status,
        assignedSalesperson:
          assignedSalesperson !== undefined
            ? assignedSalesperson
            : currentEnquiry.assignedSalesperson,
        notes: notes !== undefined ? notes : currentEnquiry.notes,
      },
    });

    return NextResponse.json({ success: true, data: updatedEnquiry });
  } catch (error) {
    console.error('Enquiry update error:', error);
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

    const currentEnquiry = await db.enquiry.findUnique({
      where: { id },
    });

    if (!currentEnquiry) {
      return NextResponse.json({ detail: 'Enquiry not found' }, { status: 404 });
    }

    await db.enquiry.delete({
      where: { id },
    });

    return NextResponse.json({ success: true, message: 'Enquiry deleted successfully' });
  } catch (error) {
    console.error('Enquiry delete error:', error);
    return NextResponse.json(
      { detail: 'Internal server error' },
      { status: 500 }
    );
  }
}
