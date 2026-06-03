import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { db } from '@/lib/db';
import { verifyJWT } from '@/lib/jwt';
import bcrypt from 'bcryptjs';

async function checkAuth() {
  const cookieStore = await cookies();
  const token = cookieStore.get('edifice_session')?.value;
  return token ? verifyJWT(token) : null;
}

const ALLOWED_MANAGE_ROLES = ['super_admin', 'ceo', 'manager'];

// GET: List all staff (Admin/CEO/Manager only)
export async function GET() {
  try {
    const admin = await checkAuth();
    if (!admin || !ALLOWED_MANAGE_ROLES.includes(admin.role)) {
      return NextResponse.json({ detail: 'Unauthorized' }, { status: 401 });
    }

    const users = await db.user.findMany({
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        emailHost: true,
        emailPort: true,
        emailUsername: true,
        smtpHost: true,
        smtpPort: true,
        createdAt: true,
      }
    });

    return NextResponse.json({ success: true, data: users });
  } catch (error) {
    console.error('List staff error:', error);
    return NextResponse.json({ detail: 'Internal server error' }, { status: 500 });
  }
}

// POST: Create new staff member
export async function POST(request: Request) {
  try {
    const admin = await checkAuth();
    if (!admin || !ALLOWED_MANAGE_ROLES.includes(admin.role)) {
      return NextResponse.json({ detail: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { email, password, name, role } = body;

    if (!email || !password || !role) {
      return NextResponse.json({ detail: 'Email, password, and role are required' }, { status: 400 });
    }

    // Check if email already exists
    const existing = await db.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json({ detail: 'Email already registered' }, { status: 400 });
    }

    const passwordHash = bcrypt.hashSync(password, 10);

    const user = await db.user.create({
      data: {
        email,
        name: name || '',
        passwordHash,
        role,
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
      }
    });

    return NextResponse.json({ success: true, data: user }, { status: 201 });
  } catch (error) {
    console.error('Create staff error:', error);
    return NextResponse.json({ detail: 'Internal server error' }, { status: 500 });
  }
}
