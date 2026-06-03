import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { db } from '@/lib/db';
import { verifyJWT } from '@/lib/jwt';
import { decrypt } from '@/lib/encryption';
import nodemailer from 'nodemailer';

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

    const user = await db.user.findUnique({
      where: { id: admin.userId }
    });

    if (!user) {
      return NextResponse.json({ detail: 'User not found' }, { status: 404 });
    }

    const body = await request.json();
    const { to, subject, message } = body;

    if (!to || !subject || !message) {
      return NextResponse.json({ detail: 'Missing recipient, subject, or message content' }, { status: 400 });
    }

    // If SMTP host/username is not configured, simulate successful email send
    if (!user.smtpHost || !user.emailUsername || !user.emailPassword) {
      console.log(`Mock Email Sent Successfully!\nFrom: ${user.email}\nTo: ${to}\nSubject: ${subject}\nMessage: ${message}`);
      return NextResponse.json({ 
        success: true, 
        isMocked: true, 
        message: 'Message sent successfully (Offline/Simulated mode)' 
      });
    }

    // Connect to actual SMTP and send
    const decryptedPassword = decrypt(user.emailPassword);

    const transporter = nodemailer.createTransport({
      host: user.smtpHost,
      port: user.smtpPort || 465,
      secure: user.smtpPort === 465, // True for 465, false for 587/other
      auth: {
        user: user.emailUsername,
        pass: decryptedPassword,
      },
      tls: {
        rejectUnauthorized: false // Helps avoid SSL verification issues on custom domains
      }
    });

    // Send mail
    await transporter.sendMail({
      from: `"${user.name || 'Edifice Staff'}" <${user.emailUsername}>`,
      to,
      subject,
      text: message,
      html: message.replace(/\n/g, '<br />'), // Simple text-to-html conversion
    });

    console.log(`Actual Email Sent Successfully!\nFrom: ${user.emailUsername}\nTo: ${to}\nSubject: ${subject}`);
    return NextResponse.json({ 
      success: true, 
      isMocked: false, 
      message: 'Message sent successfully via SMTP server' 
    });
  } catch (error: any) {
    console.error('Send email error:', error);
    return NextResponse.json({ 
      detail: error?.message || 'Failed to send email. Check your SMTP server settings.' 
    }, { status: 500 });
  }
}
