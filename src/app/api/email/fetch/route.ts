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

// Generate role-specific realistic mock emails as fallback
function getMockEmails(role: string, email: string) {
  const dateObj = new Date();
  
  const commonMocks = [
    {
      uid: 101,
      subject: 'Welcome to your Edifice Corporate Workspace Mail',
      from: 'Edifice System Guard <noreply@edifice.ug>',
      fromAddress: 'noreply@edifice.ug',
      date: new Date(dateObj.getTime() - 2 * 3600000).toISOString(), // 2 hours ago
      body: `Hello ${email},\n\nWelcome to the Edifice Properties Kampala internal mail client panel. You are logged in with the role of: ${role.toUpperCase()}.\n\nThis panel allows you to read and reply to emails directly from your corporate email address. If you haven't connected your email server yet, please click the "Mailbox Settings" button at the top to configure your private IMAP/SMTP credentials.\n\nBest Regards,\nEdifice Devops Team.`,
      snippet: 'Welcome to the Edifice Properties Kampala internal mail client panel. You are logged in...',
    }
  ];

  if (role === 'ceo' || role === 'super_admin' || role === 'manager') {
    return [
      {
        uid: 102,
        subject: 'Weekly Consolidated Performance & Sales Report',
        from: 'Sales Ledger Automator <reports@edifice.ug>',
        fromAddress: 'reports@edifice.ug',
        date: new Date(dateObj.getTime() - 4 * 3600000).toISOString(),
        body: `Dear Management,\n\nHere is the weekly summary report for Edifice Properties developments:\n\n- Horizon Residency: 4 units reserved, 1 closed this week. Lead conversion rate is 18.4%.\n- Embassy Towers: 2 units closed. 2BHK inventory is now sold out.\n- Elite Palazzo Naguru: Ground excavation completed successfully. Foundation core drilling is active.\n\nTotal revenue projected for closed deals: $456,000.\n\nPlease log in to the Reports Panel to view the interactive charts and graphs.\n\nBest,\nEdifice Automated Reports.`,
        snippet: 'Here is the weekly summary report for Edifice Properties developments: Horizon Residency...',
      },
      ...commonMocks
    ];
  }

  if (role === 'sales') {
    return [
      {
        uid: 103,
        subject: 'Inquiry regarding Horizon Residency 2BHK pricing and payment terms',
        from: 'Moses Mukasa <moses.mukasa@gmail.com>',
        fromAddress: 'moses.mukasa@gmail.com',
        date: new Date(dateObj.getTime() - 1 * 3600000).toISOString(),
        body: `Hello Sales Team,\n\nI am a Ugandan currently living in the UK. I am planning to invest in a 2BHK unit at Horizon Residency in Bugolobi. Could you please send me the latest pricing catalog and explain your installment payment plans?\n\nI will be visiting Kampala next month and would like to schedule a site walk through.\n\nThank you,\nMoses Mukasa\n+44 7911 123456`,
        snippet: 'I am a Ugandan currently living in the UK. I am planning to invest in a 2BHK unit at Horizon...',
      },
      {
        uid: 104,
        subject: 'Elite Palazzo Naguru - Penthouse booking question',
        from: 'Amina Alibhai <amina@alibhaisecurities.co.ug>',
        fromAddress: 'amina@alibhaisecurities.co.ug',
        date: new Date(dateObj.getTime() - 6 * 3600000).toISOString(),
        body: `Hi Edifice Sales,\n\nI saw your new listing for Elite Palazzo in Naguru. I am interested in the master penthouse suites. Are there booking holds available for corporate buyers? What guarantees do you offer for clear titles?\n\nKindly call me on my office number at +256 701 555888.\n\nRegards,\nAmina.`,
        snippet: 'I saw your new listing for Elite Palazzo in Naguru. I am interested in the master penthouse...',
      },
      ...commonMocks
    ];
  }

  if (role === 'accounting') {
    return [
      {
        uid: 105,
        subject: 'Proof of Booking Deposit Payment - Horizon Unit 3BHK-B',
        from: 'John Tumusiime (Sales) <sales@edifice.ug>',
        fromAddress: 'sales@edifice.ug',
        date: new Date(dateObj.getTime() - 3 * 3600000).toISOString(),
        body: `Hi Accounts,\n\nAttached is the bank draft confirmation for the booking deposit of Horizon Unit 3BHK-B by buyer Mr. Edward Ssewankambo.\n\nAmount: $10,000 (Ten thousand USD)\nBank: Stanbic Bank Uganda\n\nPlease verify receipt on our ledger and issue the official booking receipt.\n\nThanks,\nJohn (Sales).`,
        snippet: 'Attached is the bank draft confirmation for the booking deposit of Horizon Unit 3BHK-B...',
      },
      {
        uid: 106,
        subject: 'Invoice: Naguru Hilltop Foundation Core Drilling Earthworks',
        from: 'Cementers Uganda Limited <invoices@cementers.co.ug>',
        fromAddress: 'invoices@cementers.co.ug',
        date: new Date(dateObj.getTime() - 8 * 3600000).toISOString(),
        body: `Dear Edifice Accounts,\n\nPlease find attached Invoice #CUL-2026-089 for piling excavation and foundation concrete work completed on the Elite Palazzo Naguru site during May 2026.\n\nTotal Due: UGX 180,000,000\nPayment Terms: Net 15 days.\n\nKindly process the release of funds.\n\nSincerely,\nFinances Desk\nCementers Ltd.`,
        snippet: 'Please find attached Invoice #CUL-2026-089 for piling excavation and foundation concrete...',
      },
      ...commonMocks
    ];
  }

  return commonMocks;
}

function getMockSentEmails(role: string, email: string) {
  const dateObj = new Date();
  return [
    {
      uid: 201,
      subject: 'Re: Inquiry regarding Horizon Residency 2BHK pricing',
      from: `You <${email}>`,
      fromAddress: email,
      date: new Date(dateObj.getTime() - 30 * 60000).toISOString(),
      body: `Hello Moses,\n\nThank you for reaching out. Yes, we have standard installment plans available for Horizon Residency starting from 10% booking hold. I have attached our latest price list and brochure.\n\nI would be happy to schedule a site tour for you next month when you visit Kampala.\n\nBest regards,\nEdifice Sales Team.`,
      snippet: 'Thank you for reaching out. Yes, we have standard installment plans available for Horizon Residency...',
    },
    {
      uid: 202,
      subject: 'Scheduled Site Visit Booking Confirmation - Elite Palazzo Naguru',
      from: `You <${email}>`,
      fromAddress: email,
      date: new Date(dateObj.getTime() - 2 * 3600000).toISOString(),
      body: `Dear Amina,\n\nWe have scheduled your VIP site walk through for Elite Palazzo in Naguru next Tuesday at 11:00 AM. Our lead sales specialist will guide you and show you the foundation progress and penthouse site layouts.\n\nPlease let us know if this time fits your schedule.\n\nWarm regards,\nEdifice Sales Desk.`,
      snippet: 'We have scheduled your VIP site walk through for Elite Palazzo in Naguru next Tuesday at 11:00 AM...',
    }
  ];
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

    // If credentials are not fully set, return role-specific mock inbox/sent list
    if (!user.emailHost || !user.emailUsername || !user.emailPassword) {
      return NextResponse.json({ 
        success: true, 
        isMocked: true, 
        data: isSentFolder ? getMockSentEmails(user.role, user.email) : getMockEmails(user.role, user.email) 
      });
    }

    // Connect to actual IMAP server
    const decryptedPassword = decrypt(user.emailPassword);
    
    const client = new ImapFlow({
      host: user.emailHost,
      port: user.emailPort || 993,
      secure: true,
      auth: {
        user: user.emailUsername,
        pass: decryptedPassword,
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
    const admin = await checkAuth();
    if (admin) {
      const user = await db.user.findUnique({ where: { id: admin.userId } });
      if (user) {
        const { searchParams } = new URL(request.url);
        const isSentFolder = (searchParams.get('folder') || '').toUpperCase() === 'SENT';
        return NextResponse.json({ 
          success: true, 
          isMocked: true, 
          errorMsg: error?.message || 'Failed to connect to the mail server. Showing offline/cached messages.',
          data: isSentFolder ? getMockSentEmails(user.role, user.email) : getMockEmails(user.role, user.email) 
        });
      }
    }
    return NextResponse.json({ detail: 'Failed to connect to IMAP server' }, { status: 500 });
  }
}
