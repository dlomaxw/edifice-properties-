import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { db } from '@/lib/db';
import { verifyJWT } from '@/lib/jwt';
import nodemailer from 'nodemailer';
import { decrypt } from '@/lib/encryption';

// POST: Public submission of contact/enquiry forms
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      firstName,
      lastName,
      phone,
      email,
      preferredProperty,
      preferredUnitType,
      budgetRange,
      buyerType,
      message,
      pageSource,
      deviceType,
    } = body;

    if (!firstName || !phone || !email) {
      return NextResponse.json(
        { detail: 'First name, phone number, and email are required' },
        { status: 400 }
      );
    }

    const enquiry = await db.enquiry.create({
      data: {
        firstName,
        lastName: lastName || '',
        phone,
        email,
        preferredProperty: preferredProperty || 'General Inquiry',
        preferredUnitType: preferredUnitType || 'Any',
        budgetRange: budgetRange || 'Any',
        buyerType: buyerType || 'Home buyer',
        message: message || '',
        pageSource: pageSource || 'Website',
        deviceType: deviceType || 'unknown',
      },
    });

    // Send email notification to sales@edificepropertiesug.com
    try {
      const salesUser = await db.user.findUnique({
        where: { email: 'sales@edificepropertiesug.com' }
      });

      if (salesUser && salesUser.smtpHost && salesUser.emailUsername && salesUser.emailPassword) {
        const decryptedPassword = decrypt(salesUser.emailPassword);
        const transporter = nodemailer.createTransport({
          host: salesUser.smtpHost,
          port: salesUser.smtpPort || 465,
          secure: salesUser.smtpPort === 465,
          auth: {
            user: salesUser.emailUsername,
            pass: decryptedPassword,
          },
          tls: {
            rejectUnauthorized: false
          }
        });

        const mailSubject = `New Interest Registered: ${firstName} ${lastName || ''} - ${preferredProperty || 'General'}`;
        const mailText = `New interest submission details:
---------------------------------
Name: ${firstName} ${lastName || ''}
Phone: ${phone}
Email: ${email}
Property: ${preferredProperty || 'General'}
Unit Type: ${preferredUnitType || 'Any'}
Location: ${message ? message.replace('Location preference: ', '') : 'Not Specified'}
Source: ${pageSource || 'Registered Interest Popup'}
Date: ${new Date().toLocaleString()}`;

        await transporter.sendMail({
          from: `"${salesUser.name || 'Edifice Staff'}" <${salesUser.emailUsername}>`,
          to: salesUser.emailUsername,
          subject: mailSubject,
          text: mailText,
          html: mailText.replace(/\n/g, '<br />'),
        });
        console.log('Enquiry email notification sent successfully to sales!');
      } else {
        console.log(`Mock Email Sent (Sales settings not configured) for: ${firstName} ${lastName || ''}`);
      }
    } catch (emailErr) {
      console.error('Failed to send email notification for enquiry:', emailErr);
    }

    return NextResponse.json({ success: true, data: enquiry }, { status: 201 });
  } catch (error: any) {
    console.error('Enquiry creation error:', error);
    return NextResponse.json(
      { detail: 'Failed to submit enquiry. Please try again.' },
      { status: 500 }
    );
  }
}

// GET: Admin list of all enquiries
export async function GET(request: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('edifice_session')?.value;
    const admin = token ? verifyJWT(token) : null;

    if (!admin) {
      return NextResponse.json({ detail: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const property = searchParams.get('property');

    const where: any = {};
    if (status && status !== 'All') {
      where.status = status;
    }
    if (property && property !== 'All') {
      where.preferredProperty = property;
    }

    const enquiries = await db.enquiry.findMany({
      where,
      orderBy: { dateCreated: 'desc' },
    });

    return NextResponse.json({ success: true, data: enquiries });
  } catch (error) {
    console.error('Enquiries fetch error:', error);
    return NextResponse.json(
      { detail: 'Internal server error' },
      { status: 500 }
    );
  }
}
