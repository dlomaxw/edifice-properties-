import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { db } from '@/lib/db';
import { verifyJWT } from '@/lib/jwt';
import { encrypt } from '@/lib/encryption';
import bcrypt from 'bcryptjs';

async function checkAuth() {
  const cookieStore = await cookies();
  const token = cookieStore.get('edifice_session')?.value;
  return token ? verifyJWT(token) : null;
}

const ALLOWED_MANAGE_ROLES = ['super_admin', 'ceo', 'manager'];

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
      name, email, role, password, 
      emailHost, emailPort, emailUsername, emailPassword, 
      smtpHost, smtpPort 
    } = body;

    const isSelf = admin.userId === id;
    const isManager = ALLOWED_MANAGE_ROLES.includes(admin.role);

    if (!isSelf && !isManager) {
      return NextResponse.json({ detail: 'Forbidden' }, { status: 403 });
    }

    const currentUser = await db.user.findUnique({ where: { id } });
    if (!currentUser) {
      return NextResponse.json({ detail: 'User not found' }, { status: 404 });
    }

    // Role updates can only be performed by managers, and users cannot change their own roles
    let finalRole = currentUser.role;
    if (role && isManager && !isSelf) {
      finalRole = role;
    }

    const updateData: any = {
      name: name !== undefined ? name : currentUser.name,
      email: email !== undefined ? email : currentUser.email,
      role: finalRole,
    };

    if (password) {
      updateData.passwordHash = bcrypt.hashSync(password, 10);
    }

    // Handle email settings
    if (emailHost !== undefined) updateData.emailHost = emailHost;
    if (emailPort !== undefined) updateData.emailPort = parseInt(emailPort) || null;
    if (emailUsername !== undefined) updateData.emailUsername = emailUsername;
    if (emailPassword) {
      // Encrypt the password before storing in DB
      updateData.emailPassword = encrypt(emailPassword);
    }
    if (smtpHost !== undefined) updateData.smtpHost = smtpHost;
    if (smtpPort !== undefined) updateData.smtpPort = parseInt(smtpPort) || null;

    const updatedUser = await db.user.update({
      where: { id },
      data: updateData,
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

    return NextResponse.json({ success: true, data: updatedUser });
  } catch (error) {
    console.error('Update staff error:', error);
    return NextResponse.json({ detail: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const admin = await checkAuth();
    if (!admin || !ALLOWED_MANAGE_ROLES.includes(admin.role)) {
      return NextResponse.json({ detail: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;

    // Prevent deleting yourself
    if (admin.userId === id) {
      return NextResponse.json({ detail: 'Cannot delete own account' }, { status: 400 });
    }

    const currentUser = await db.user.findUnique({ where: { id } });
    if (!currentUser) {
      return NextResponse.json({ detail: 'User not found' }, { status: 404 });
    }

    await db.user.delete({ where: { id } });

    return NextResponse.json({ success: true, message: 'Staff member deleted successfully' });
  } catch (error) {
    console.error('Delete staff error:', error);
    return NextResponse.json({ detail: 'Internal server error' }, { status: 500 });
  }
}
