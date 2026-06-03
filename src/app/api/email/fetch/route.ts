import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { db } from '@/lib/db';
import { verifyJWT } from '@/lib/jwt';
import { decrypt } from '@/lib/encryption';
import { ImapFlow } from 'imapflow';
// @ts-ignore
import { simpleParser } from 'mailparser';

async function checkAuth() {
  const cookieStore = await cookies();
  const token = cookieStore.get('edifice_session')?.value;
  return token ? verifyJWT(token) : null;
}

export async function GET(request: Request) {
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

    const { searchParams } = new URL(request.url);
    const folderParam = searchParams.get('folder') || 'INBOX';
    const isSentFolder = folderParam.toUpperCase() === 'SENT';

    // If credentials are not fully set, return empty list with error
    if (!user.emailHost || !user.emailUsername || !user.emailPassword) {
      return NextResponse.json({ 
        success: true, 
        isMocked: true, 
        errorMsg: 'Mail client credentials are not configured. Click Staff Directory to configure your SMTP/IMAP settings.',
        data: [] 
      });
    }

    // Connect to actual IMAP server
    const decryptedPassword = decrypt(user.emailPassword);
    if (!decryptedPassword) {
      return NextResponse.json({ 
        success: true, 
        isMocked: true, 
        errorMsg: 'Decryption key mismatch (No password configured). Please re-save your email password in the Staff Directory.',
        data: [] 
      });
    }
    
    const client = new ImapFlow({
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

    await client.connect();
    
    // Find target folder path dynamically on the IMAP server
    let targetFolder = 'INBOX';
    if (isSentFolder) {
      const mailboxes = await client.list();
      // Try to find folder matching "Sent", "Sent Messages", "Sent Items" etc.
      const sentBox = mailboxes.find(m => 
        m.path.toUpperCase() === 'SENT' || 
        m.path.toUpperCase().includes('SENT') ||
        m.name.toUpperCase().includes('SENT')
      );
      targetFolder = sentBox ? sentBox.path : 'INBOX';
    }

    const lock = await client.getMailboxLock(targetFolder);
    
    try {
      const status = await client.status(targetFolder, { messages: true });
      const totalMessages = status.messages ?? 0;

      if (totalMessages === 0) {
        return NextResponse.json({ success: true, isMocked: false, data: [] });
      }

      // Fetch the last 15 messages (ranges are 1-based, e.g. 10:25)
      const rangeStart = Math.max(1, totalMessages - 14);
      const range = `${rangeStart}:${totalMessages}`;
      const messages = [];

      for await (const msg of client.fetch(range, { envelope: true, source: true })) {
        try {
          const parsed = await simpleParser(msg.source);
          messages.push({
            uid: msg.uid,
            seq: msg.seq,
            subject: parsed.subject || 'No Subject',
            from: parsed.from?.text || msg.envelope?.from?.[0]?.name || msg.envelope?.from?.[0]?.address || 'Unknown',
            fromAddress: parsed.from?.value?.[0]?.address || msg.envelope?.from?.[0]?.address || '',
            date: parsed.date || msg.envelope?.date || new Date().toISOString(),
            body: parsed.text || '',
            html: parsed.html || '',
            snippet: parsed.text ? parsed.text.substring(0, 120).replace(/\s+/g, ' ') : '',
          });
        } catch (parseErr) {
          console.error(`Failed to parse message uid ${msg.uid}:`, parseErr);
          messages.push({
            uid: msg.uid,
            seq: msg.seq,
            subject: msg.envelope?.subject || 'No Subject',
            from: msg.envelope?.from?.[0]?.name || msg.envelope?.from?.[0]?.address || 'Unknown',
            fromAddress: msg.envelope?.from?.[0]?.address || '',
            date: msg.envelope?.date || new Date().toISOString(),
            body: 'Parsing error occurred on this message content.',
            html: '',
            snippet: 'Parsing error occurred on this message content.',
          });
        }
      }

      // Sort by date descending (newest first)
      messages.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

      return NextResponse.json({ success: true, isMocked: false, data: messages });
    } finally {
      lock.release();
      await client.logout();
    }
  } catch (error: any) {
    console.error('Fetch emails error:', error);
    return NextResponse.json({ 
      success: true, 
      isMocked: true, 
      errorMsg: error?.message || 'Failed to connect to the mail server.',
      data: [] 
    });
  }
}
