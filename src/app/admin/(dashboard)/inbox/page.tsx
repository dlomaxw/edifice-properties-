'use client';

import React, { useState, useEffect, useRef } from 'react';
import { 
  Mail, Send, Trash2, RefreshCw, Search, PenSquare, Settings, 
  AlertTriangle, Check, CornerUpLeft, User, Inbox, Loader2, ArrowLeft, 
  ChevronRight, X, ExternalLink
} from 'lucide-react';

interface EmailMessage {
  uid: number;
  seq?: number;
  subject: string;
  from: string;
  fromAddress: string;
  date: string;
  body: string;
  html?: string;
  snippet: string;
}

export default function AdminInboxPage() {
  const [emails, setEmails] = useState<EmailMessage[]>([]);
  const [filteredEmails, setFilteredEmails] = useState<EmailMessage[]>([]);
  const [selectedEmail, setSelectedEmail] = useState<EmailMessage | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [isMocked, setIsMocked] = useState(false);
  const [activeFolder, setActiveFolder] = useState<'inbox' | 'sent' | 'trash'>('inbox');
  const [searchQuery, setSearchQuery] = useState('');

  // Composition State
  const [showCompose, setShowCompose] = useState(false);
  const [composeTo, setComposeTo] = useState('');
  const [composeSubject, setComposeSubject] = useState('');
  const [composeMessage, setComposeMessage] = useState('');
  const [sendingMail, setSendingMail] = useState(false);
  const [sendSuccess, setSendSuccess] = useState('');
  const [sendError, setSendError] = useState('');

  // Quick Reply State
  const [replyText, setReplyText] = useState('');
  const [sendingReply, setSendingReply] = useState(false);

  // Load emails
  const loadEmails = async (isSilent = false) => {
    if (!isSilent) setLoading(true);
    else setRefreshing(true);
    
    setErrorMsg('');
    try {
      const res = await fetch('/api/email/fetch');
      const json = await res.json();
      
      if (!res.ok) {
        throw new Error(json.detail || 'Failed to sync with the mail server');
      }

      if (json.success) {
        setEmails(json.data || []);
        setIsMocked(!!json.isMocked);
        if (json.errorMsg) {
          setErrorMsg(json.errorMsg);
        }
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Error occurred while loading mailbox');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadEmails();
  }, []);

  // Filter and search
  useEffect(() => {
    let result = [...emails];

    // Search query matching
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(e => 
        e.subject.toLowerCase().includes(query) || 
        e.from.toLowerCase().includes(query) || 
        e.body.toLowerCase().includes(query)
      );
    }

    setFilteredEmails(result);
    
    // Auto-select first email if none is selected
    if (result.length > 0 && !selectedEmail) {
      setSelectedEmail(result[0]);
    } else if (result.length === 0) {
      setSelectedEmail(null);
    }
  }, [emails, searchQuery, selectedEmail]);

  // Handle Compose outbound email
  const handleSendEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!composeTo || !composeSubject || !composeMessage) {
      setSendError('Please fill in all composition fields');
      return;
    }

    setSendingMail(true);
    setSendError('');
    setSendSuccess('');

    try {
      const res = await fetch('/api/email/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: composeTo,
          subject: composeSubject,
          message: composeMessage
        })
      });

      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.detail || 'Failed to dispatch email');
      }

      if (json.success) {
        setSendSuccess(json.message || 'Email sent successfully!');
        setComposeTo('');
        setComposeSubject('');
        setComposeMessage('');
        // Close modal after 1.5 seconds
        setTimeout(() => {
          setShowCompose(false);
          setSendSuccess('');
        }, 1500);
      }
    } catch (err: any) {
      setSendError(err.message || 'Error occurred sending email');
    } finally {
      setSendingMail(false);
    }
  };

  // Handle Quick Reply
  const handleQuickReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEmail || !replyText.trim()) return;

    setSendingReply(true);
    try {
      const res = await fetch('/api/email/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: selectedEmail.fromAddress || selectedEmail.from,
          subject: selectedEmail.subject.startsWith('Re:') ? selectedEmail.subject : `Re: ${selectedEmail.subject}`,
          message: replyText
        })
      });

      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.detail || 'Failed to dispatch reply');
      }

      if (json.success) {
        alert(json.message || 'Reply sent successfully!');
        setReplyText('');
      }
    } catch (err: any) {
      alert(err.message || 'Error occurred sending reply');
    } finally {
      setSendingReply(false);
    }
  };

  const formatDate = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      return new Intl.DateTimeFormat('en-US', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }).format(date);
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="h-[calc(100vh-8.5rem)] flex flex-col gap-4 max-w-7xl mx-auto w-full relative">
      {/* Warning/Offline Alert */}
      {errorMsg && (
        <div className="px-5 py-3.5 bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-semibold rounded-2xl flex items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2">
            <AlertTriangle size={16} />
            <span>{errorMsg}</span>
          </div>
          <button 
            onClick={() => loadEmails(true)}
            className="text-[10px] uppercase tracking-wider underline hover:text-white transition-colors"
          >
            Retry Connection
          </button>
        </div>
      )}

      {isMocked && !errorMsg && (
        <div className="px-5 py-3 bg-zinc-900 border border-white/5 text-zinc-400 text-xs rounded-2xl flex items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2">
            <Settings size={14} className="text-[#dfc28c]" />
            <span>Showing offline demo emails. Click edit configurations in the <a href="/admin/staff" className="text-[#dfc28c] underline font-bold">Staff Directory</a> to connect your SMTP/IMAP credentials.</span>
          </div>
        </div>
      )}

      {/* Main Mailbox Grid Container */}
      <div className="flex-1 bg-zinc-900 border border-white/5 rounded-3xl overflow-hidden flex shadow-md">
        
        {/* Left Side: Navigation Folders */}
        <aside className="w-52 border-r border-white/5 flex flex-col justify-between p-4 shrink-0 hidden md:flex">
          <div className="flex flex-col gap-4">
            <button
              onClick={() => setShowCompose(true)}
              className="w-full py-3 bg-[#dfc28c] hover:bg-[#d4af37] text-[#020c1b] rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-colors cursor-pointer shadow"
            >
              <PenSquare size={14} />
              <span>Compose</span>
            </button>

            <nav className="flex flex-col gap-1">
              <button
                onClick={() => setActiveFolder('inbox')}
                className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold tracking-wide transition-all ${
                  activeFolder === 'inbox' 
                    ? 'bg-white/5 text-[#dfc28c] font-bold' 
                    : 'text-zinc-400 hover:bg-white/2 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Inbox size={15} />
                  <span>Inbox</span>
                </div>
                {activeFolder === 'inbox' && filteredEmails.length > 0 && (
                  <span className="bg-[#dfc28c]/10 border border-[#dfc28c]/15 text-[#dfc28c] text-[9px] font-bold px-1.5 py-0.5 rounded-md">
                    {filteredEmails.length}
                  </span>
                )}
              </button>
              
              <button
                onClick={() => {
                  setActiveFolder('sent');
                  alert('Sent folder is synced dynamically via IMAP. Outbound emails sent via this dashboard are saved to your Sent folder on your mail provider.');
                }}
                className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold tracking-wide text-zinc-400 hover:bg-white/2 hover:text-white transition-all`}
              >
                <div className="flex items-center gap-2.5">
                  <Send size={14} />
                  <span>Sent Messages</span>
                </div>
              </button>

              <button
                onClick={() => {
                  setActiveFolder('trash');
                  alert('Trash messages folder placeholder.');
                }}
                className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold tracking-wide text-zinc-400 hover:bg-white/2 hover:text-white transition-all`}
              >
                <div className="flex items-center gap-2.5">
                  <Trash2 size={14} />
                  <span>Trash</span>
                </div>
              </button>

              <a
                href="https://privateemail.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold tracking-wide text-[#dfc28c] hover:bg-white/5 hover:text-white transition-all"
              >
                <div className="flex items-center gap-2.5">
                  <ExternalLink size={14} />
                  <span>Open Webmail Portal</span>
                </div>
              </a>
            </nav>
          </div>

          <div className="p-3 bg-black/20 rounded-2xl border border-white/5 flex flex-col gap-1.5">
            <span className="text-[9px] font-black uppercase text-zinc-500 tracking-wider">Mail Server Sync</span>
            <span className="text-[10px] text-zinc-400 font-semibold">{isMocked ? 'Offline Mode' : 'Connected'}</span>
            <button 
              onClick={() => loadEmails(true)}
              className="text-[9px] font-bold uppercase tracking-wider text-[#dfc28c] hover:underline flex items-center gap-1 mt-1"
            >
              <RefreshCw size={10} className={refreshing ? 'animate-spin' : ''} />
              <span>Sync Mailbox</span>
            </button>
          </div>
        </aside>

        {/* Center Side: Inbox List */}
        <div className="w-full md:w-80 border-r border-white/5 flex flex-col shrink-0">
          
          {/* List Search & Controls */}
          <div className="p-4 border-b border-white/5 flex flex-col gap-3">
            <div className="flex justify-between items-center md:hidden">
              <button
                onClick={() => setShowCompose(true)}
                className="px-3 py-1.5 bg-[#dfc28c] text-[#020c1b] rounded-lg text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 transition-colors"
              >
                <PenSquare size={12} />
                <span>Compose</span>
              </button>
              <button 
                onClick={() => loadEmails(true)}
                className="p-1.5 hover:bg-white/5 rounded-lg text-zinc-400 hover:text-white transition-colors"
              >
                <RefreshCw size={14} className={refreshing ? 'animate-spin' : ''} />
              </button>
            </div>

            <div className="relative">
              <input
                type="text"
                placeholder="Search messages..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-black/40 border border-white/5 pl-9 pr-4 py-2 rounded-xl text-xs outline-none focus:border-[#dfc28c]"
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={14} />
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white"
                >
                  <X size={12} />
                </button>
              )}
            </div>
          </div>

          {/* List Contents */}
          <div className="flex-1 overflow-y-auto divide-y divide-white/5">
            {loading ? (
              <div className="h-48 flex flex-col items-center justify-center gap-2">
                <Loader2 className="animate-spin text-[#dfc28c]" size={24} />
                <span className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold">Synchronizing...</span>
              </div>
            ) : filteredEmails.length === 0 ? (
              <div className="p-8 text-center text-zinc-500 text-xs uppercase tracking-wider font-bold">
                No emails found
              </div>
            ) : (
              filteredEmails.map((e) => (
                <div
                  key={e.uid}
                  onClick={() => setSelectedEmail(e)}
                  className={`p-4 flex flex-col gap-1 cursor-pointer transition-colors relative ${
                    selectedEmail?.uid === e.uid 
                      ? 'bg-white/5' 
                      : 'hover:bg-white/[0.01]'
                  }`}
                >
                  {selectedEmail?.uid === e.uid && (
                    <div className="absolute top-0 left-0 bottom-0 w-1 bg-[#dfc28c]" />
                  )}
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-xs text-white truncate max-w-[170px]">{e.from.split('<')[0].trim()}</span>
                    <span className="text-[9px] text-zinc-500 font-medium whitespace-nowrap">{formatDate(e.date)}</span>
                  </div>
                  <span className={`text-[11px] truncate ${selectedEmail?.uid === e.uid ? 'text-[#dfc28c] font-semibold' : 'text-zinc-300 font-medium'}`}>
                    {e.subject}
                  </span>
                  <p className="text-[10px] text-zinc-500 line-clamp-2 mt-0.5 leading-relaxed">
                    {e.snippet}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right Side: Preview Pane */}
        <div className="flex-1 flex flex-col bg-black/10 overflow-hidden">
          {selectedEmail ? (
            <div className="flex-1 flex flex-col overflow-hidden">
              
              {/* Message Header */}
              <div className="p-6 border-b border-white/5 flex flex-col sm:flex-row justify-between sm:items-center gap-4 bg-zinc-900/40">
                <div className="flex flex-col gap-1 min-w-0">
                  <h3 className="font-heading font-bold text-sm text-white leading-snug">{selectedEmail.subject}</h3>
                  <div className="flex items-center gap-2 text-xs text-zinc-400 mt-1">
                    <div className="w-5 h-5 rounded-full bg-zinc-800 flex items-center justify-center text-[#dfc28c] border border-white/10 shrink-0">
                      <User size={10} />
                    </div>
                    <span className="font-semibold text-white truncate">{selectedEmail.from}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3 self-end sm:self-center">
                  <span className="text-[10px] text-zinc-500 font-semibold font-mono">{formatDate(selectedEmail.date)}</span>
                  <button
                    onClick={() => {
                      setReplyText(`\n\nOn ${new Date(selectedEmail.date).toLocaleString()}, ${selectedEmail.from} wrote:\n> ${selectedEmail.body.split('\n').join('\n> ')}`);
                      // Scroll reply box into view
                      document.getElementById('reply-box-anchor')?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="p-2 bg-zinc-800 hover:bg-zinc-700 text-[#dfc28c] border border-white/5 rounded-xl transition-colors cursor-pointer"
                    title="Reply"
                  >
                    <CornerUpLeft size={12} />
                  </button>
                  <button
                    onClick={() => {
                      alert('Private emails can only be deleted on your corporate mail client.');
                    }}
                    className="p-2 bg-red-500/5 hover:bg-red-500/10 text-red-400 border border-red-500/10 rounded-xl transition-colors cursor-pointer"
                    title="Delete Message"
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
              </div>

              {/* Message Body View */}
              <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-8 bg-zinc-950">
                {selectedEmail.html ? (
                  // Safe iframe render for html bodies to prevent CSS leaking
                  <div className="w-full min-h-[300px] bg-white rounded-2xl p-4 overflow-hidden border border-white/5 shadow-inner">
                    <iframe
                      title="HTML Email Content"
                      srcDoc={`
                        <html>
                          <head>
                            <style>
                              body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; font-size: 14px; line-height: 1.5; color: #333; margin: 0; padding: 10px; }
                              a { color: #d4af37; text-decoration: underline; }
                              blockquote { border-left: 3px solid #ccc; margin: 0; padding-left: 10px; color: #666; }
                            </style>
                          </head>
                          <body>
                            ${selectedEmail.html}
                          </body>
                        </html>
                      `}
                      className="w-full h-full border-0"
                    />
                  </div>
                ) : (
                  <div className="bg-zinc-900 border border-white/5 rounded-2xl p-6 shadow-sm whitespace-pre-wrap text-xs text-zinc-300 leading-relaxed font-sans">
                    {selectedEmail.body}
                  </div>
                )}

                {/* Quick Reply Form */}
                <div id="reply-box-anchor" className="bg-zinc-900 border border-white/5 rounded-2xl p-4 flex flex-col gap-3 shadow-md mt-auto">
                  <div className="flex items-center gap-2 text-[10px] font-bold uppercase text-zinc-500 tracking-wider">
                    <CornerUpLeft size={12} />
                    <span>Reply to {selectedEmail.fromAddress || selectedEmail.from}</span>
                  </div>
                  
                  <form onSubmit={handleQuickReply} className="flex flex-col gap-3">
                    <textarea
                      placeholder="Type your response here..."
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      required
                      rows={4}
                      className="w-full bg-black/40 border border-white/5 p-3 rounded-xl text-xs outline-none focus:border-[#dfc28c] resize-none"
                    />
                    <div className="flex justify-between items-center">
                      <span className="text-[9px] text-zinc-500 italic">Replying via private SMTP mailer</span>
                      <button
                        type="submit"
                        disabled={sendingReply || !replyText.trim()}
                        className="px-4 py-2 bg-[#dfc28c] hover:bg-[#d4af37] disabled:opacity-30 text-[#020c1b] rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-colors cursor-pointer"
                      >
                        {sendingReply ? <Loader2 className="animate-spin" size={12} /> : <Send size={12} />}
                        <span>Send Reply</span>
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center gap-3 text-zinc-500">
              <Mail size={36} />
              <span className="text-xs uppercase tracking-widest font-bold">No message selected</span>
            </div>
          )}
        </div>
      </div>

      {/* Composition Pop-Up Window */}
      {showCompose && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-zinc-900 border border-white/5 rounded-3xl p-6 flex flex-col gap-5 max-w-xl w-full shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-white/5">
              <div className="flex items-center gap-2">
                <PenSquare className="text-[#dfc28c]" size={18} />
                <h3 className="font-heading font-bold text-sm uppercase tracking-wider text-white">Compose Outbound Email</h3>
              </div>
              <button 
                onClick={() => setShowCompose(false)} 
                className="p-1 hover:bg-white/5 rounded text-zinc-500 hover:text-white"
              >
                <X size={16} />
              </button>
            </div>

            {sendSuccess && (
              <div className="p-3 bg-green-500/10 border border-green-500/20 text-green-400 text-xs font-semibold rounded-xl flex items-center gap-2">
                <Check size={14} />
                <span>{sendSuccess}</span>
              </div>
            )}

            {sendError && (
              <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-semibold rounded-xl flex items-center gap-2">
                <AlertTriangle size={14} />
                <span>{sendError}</span>
              </div>
            )}

            <form onSubmit={handleSendEmail} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Recipient Email (To)</label>
                <input
                  type="email"
                  required
                  placeholder="e.g. client@gmail.com"
                  value={composeTo}
                  onChange={(e) => setComposeTo(e.target.value)}
                  className="w-full bg-black/40 border border-white/5 px-4 py-2.5 rounded-xl text-xs outline-none focus:border-[#dfc28c]"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Subject</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Inquiry Follow-up - Edifice Properties"
                  value={composeSubject}
                  onChange={(e) => setComposeSubject(e.target.value)}
                  className="w-full bg-black/40 border border-white/5 px-4 py-2.5 rounded-xl text-xs outline-none focus:border-[#dfc28c]"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Message Content</label>
                <textarea
                  required
                  placeholder="Draft your email message here..."
                  value={composeMessage}
                  onChange={(e) => setComposeMessage(e.target.value)}
                  rows={8}
                  className="w-full bg-black/40 border border-white/5 p-4 rounded-xl text-xs outline-none focus:border-[#dfc28c] resize-none"
                />
              </div>

              <div className="flex gap-3 justify-end pt-3 border-t border-white/5">
                <button
                  type="button"
                  onClick={() => setShowCompose(false)}
                  className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded-xl text-xs font-bold uppercase tracking-wider"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={sendingMail}
                  className="px-4 py-2 bg-[#dfc28c] hover:bg-[#d4af37] disabled:opacity-50 text-[#020c1b] rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-1.5"
                >
                  {sendingMail ? <Loader2 className="animate-spin" size={14} /> : <Send size={14} />}
                  <span>Send Email</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
