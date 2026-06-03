import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { db } from '@/lib/db';
import { verifyJWT } from '@/lib/jwt';
import { decrypt } from '@/lib/encryption';
import nodemailer from 'nodemailer';
import { ImapFlow } from 'imapflow';

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

    const smtpPort = user.smtpPort || 465;
    const transporter = nodemailer.createTransport({
      host: user.smtpHost,
      port: smtpPort,
      secure: smtpPort === 465, // True for 465, false for 587/other
      auth: {
        user: user.emailUsername,
        pass: decryptedPassword,
      },
      tls: {
        rejectUnauthorized: false // Helps avoid SSL verification issues on custom domains
      }
    });

    const htmlBody = message.replace(/\n/g, '<br />');

    // Send mail
    await transporter.sendMail({
      from: `"${user.name || 'Edifice Staff'}" <${user.emailUsername}>`,
      to,
      subject,
      text: message,
      html: htmlBody,
    });

    console.log(`Actual Email Sent Successfully!\nFrom: ${user.emailUsername}\nTo: ${to}\nSubject: ${subject}`);

    // Append to IMAP Sent Folder dynamically to ensure syncing
    if (user.emailHost) {
      try {
        const imapClient = new ImapFlow({
          host: user.emailHost,
          port: user.emailPort || 993,
          secure: true,
          auth: {
            user: user.emailUsername,
            pass: decryptedPassword,
          },
          tls: {
            rejectUnauthorized: false
          },
          logger: false,
        });

        await imapClient.connect();

        // Find sent folder dynamically on the IMAP server
        const mailboxes = await imapClient.list();
        const sentBox = mailboxes.find(m => 
          m.path.toUpperCase() === 'SENT' || 
          m.path.toUpperCase().includes('SENT') ||
          m.name.toUpperCase().includes('SENT')
        );
        const targetSentFolder = sentBox ? sentBox.path : 'Sent';

        const rawMimeMessage = [
          `From: "${user.name || 'Edifice Staff'}" <${user.emailUsername}>`,
          `To: ${to}`,
          `Subject: ${subject}`,
          `Date: ${new Date().toUTCString()}`,
          `MIME-Version: 1.0`,
          `Content-Type: text/html; charset=utf-8`,
          ``,
          htmlBody
        ].join('\r\n');

        await imapClient.append(targetSentFolder, rawMimeMessage, ['\\Seen']);
        await imapClient.logout();
        console.log(`Email successfully appended to IMAP folder: ${targetSentFolder}`);
      } catch (imapErr) {
        console.error('Failed to append copy to IMAP Sent folder:', imapErr);
      }
    }

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
