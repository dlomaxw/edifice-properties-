'use client';

import React, { useState, useEffect } from 'react';
import { 
  Users, Plus, Edit2, Trash2, Key, Mail, Shield, Save, X, Loader2,
  CheckCircle, AlertCircle, Eye, EyeOff
} from 'lucide-react';

interface StaffUser {
  id: string;
  email: string;
  name: string | null;
  role: string;
  emailHost: string | null;
  emailPort: number | null;
  emailUsername: string | null;
  smtpHost: string | null;
  smtpPort: number | null;
  createdAt: string;
}

export default function AdminStaffPage() {
  const [staff, setStaff] = useState<StaffUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState<'list' | 'create' | 'edit'>('list');
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [currentUser, setCurrentUser] = useState<any>(null); // Logged in user profile

  // Selected staff details for edit/create
  const [selectedId, setSelectedId] = useState('');
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('sales');

  // Mail settings
  const [emailHost, setEmailHost] = useState('');
  const [emailPort, setEmailPort] = useState('993');
  const [emailUsername, setEmailUsername] = useState('');
  const [emailPassword, setEmailPassword] = useState('');
  const [smtpHost, setSmtpHost] = useState('');
  const [smtpPort, setSmtpPort] = useState('465');
  const [showMailPass, setShowMailPass] = useState(false);

  // Fetch logged in session & staff list
  useEffect(() => {
    async function loadData() {
      try {
        const sessionRes = await fetch('/api/auth/session');
        if (sessionRes.ok) {
          const sessionData = await sessionRes.json();
          if (sessionData.authenticated) {
            setCurrentUser(sessionData.user);
          }
        }

        const staffRes = await fetch('/api/staff');
        if (staffRes.ok) {
          const staffData = await staffRes.json();
          if (staffData.success) {
            setStaff(staffData.data);
          }
        }
      } catch (err) {
        console.error('Failed to load staff details:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setSuccessMsg('');
    setErrorMsg('');

    try {
      const res = await fetch('/api/staff', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, name, role }),
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json.detail || 'Failed to create staff');

      if (json.success) {
        setSuccessMsg(`Staff member ${email} created successfully!`);
        // Refresh listing
        const listRes = await fetch('/api/staff');
        if (listRes.ok) {
          const listData = await listRes.json();
          setStaff(listData.data);
        }
        resetForm();
        setActiveTab('list');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Error occurred');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setSuccessMsg('');
    setErrorMsg('');

    try {
      const payload: any = {
        name,
        email,
        role,
        emailHost: emailHost || null,
        emailPort: parseInt(emailPort) || null,
        emailUsername: emailUsername || null,
        smtpHost: smtpHost || null,
        smtpPort: parseInt(smtpPort) || null,
      };

      if (password) payload.password = password;
      if (emailPassword) payload.emailPassword = emailPassword;

      const res = await fetch(`/api/staff/${selectedId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json.detail || 'Failed to update staff');

      if (json.success) {
        setSuccessMsg(`Details updated for ${email}`);
        // Refresh listing
        const listRes = await fetch('/api/staff');
        if (listRes.ok) {
          const listData = await listRes.json();
          setStaff(listData.data);
        }
        resetForm();
        setActiveTab('list');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Error occurred');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string, staffEmail: string) => {
    if (!confirm(`Are you sure you want to delete staff member ${staffEmail}?`)) return;

    setSuccessMsg('');
    setErrorMsg('');

    try {
      const res = await fetch(`/api/staff/${id}`, { method: 'DELETE' });
      const json = await res.json();
      if (!res.ok) throw new Error(json.detail || 'Failed to delete');

      if (json.success) {
        setSuccessMsg('Staff member removed successfully');
        setStaff(staff.filter((s) => s.id !== id));
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Error deleting');
    }
  };

  const resetForm = () => {
    setSelectedId('');
    setEmail('');
    setName('');
    setPassword('');
    setRole('sales');
    setEmailHost('');
    setEmailPort('993');
    setEmailUsername('');
    setEmailPassword('');
    setSmtpHost('');
    setSmtpPort('465');
  };

  const startEdit = (s: StaffUser) => {
    setSelectedId(s.id);
    setEmail(s.email);
    setName(s.name || '');
    setPassword('');
    setRole(s.role);
    setEmailHost(s.emailHost || '');
    setEmailPort(s.emailPort ? String(s.emailPort) : '993');
    setEmailUsername(s.emailUsername || '');
    setEmailPassword('');
    setSmtpHost(s.smtpHost || '');
    setSmtpPort(s.smtpPort ? String(s.smtpPort) : '465');
    setActiveTab('edit');
  };

  const getRoleBadgeClass = (r: string) => {
    switch (r) {
      case 'super_admin': return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
      case 'ceo': return 'bg-amber-500/10 text-[#dfc28c] border-amber-500/20';
      case 'manager': return 'bg-teal-500/10 text-teal-400 border-teal-500/20';
      case 'sales': return 'bg-green-500/10 text-green-400 border-green-500/20';
      case 'accounting': return 'bg-purple-500/10 text-purple-400 border-purple-500/20';
      case 'marketing': return 'bg-pink-500/10 text-pink-400 border-pink-500/20';
      default: return 'bg-zinc-500/10 text-zinc-400 border-zinc-500/20';
    }
  };

  const getRoleLabel = (r: string) => {
    switch (r) {
      case 'super_admin': return 'Super Admin';
      case 'ceo': return 'CEO / Executive';
      case 'manager': return 'Manager';
      case 'sales': return 'Sales Team';
      case 'accounting': return 'Accounting Desk';
      case 'marketing': return 'Marketing & SEO';
      default: return r;
    }
  };

  if (!loading && currentUser && !['super_admin', 'ceo', 'manager'].includes(currentUser.role)) {
    return (
      <div className="bg-zinc-900 border border-white/5 p-8 rounded-3xl flex flex-col items-center justify-center gap-4 text-center max-w-md mx-auto mt-12 shadow-md">
        <div className="w-12 h-12 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400">
          <Shield size={24} />
        </div>
        <h2 className="text-base font-heading font-bold text-white uppercase tracking-wider">Access Restrict Guard</h2>
        <p className="text-xs text-zinc-400 leading-relaxed">
          Your active staff role of <span className="text-[#dfc28c] font-bold">{(currentUser.role || '').toUpperCase()}</span> does not possess permission to access the Staff Directory.
        </p>
        <a 
          href="/admin" 
          className="mt-2 px-5 py-2.5 bg-white/5 hover:bg-white/10 border border-zinc-700 text-xs font-bold rounded-xl uppercase tracking-wider transition-colors"
        >
          Return to Overview
        </a>
      </div>
    );
  }

  return (
    <div className="max-w-6xl flex flex-col gap-6">
      {/* Messages */}
      {successMsg && (
        <div className="p-4 bg-green-500/10 border border-green-500/20 text-green-400 text-xs font-semibold rounded-2xl flex items-center gap-2.5">
          <CheckCircle size={16} />
          <span>{successMsg}</span>
        </div>
      )}
      {errorMsg && (
        <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-semibold rounded-2xl flex items-center gap-2.5">
          <AlertCircle size={16} />
          <span>{errorMsg}</span>
        </div>
      )}

      {loading ? (
        <div className="bg-zinc-900 border border-white/5 p-24 rounded-3xl flex flex-col items-center justify-center gap-3">
          <Loader2 className="animate-spin text-[#dfc28c]" size={36} />
          <span className="text-xs text-zinc-500 uppercase tracking-widest font-bold">Loading staff directory...</span>
        </div>
      ) : (
        <div className="flex flex-col gap-6">
          {/* Header Action Controls */}
          {activeTab === 'list' && (
            <div className="flex justify-between items-center bg-zinc-900 border border-white/5 p-6 rounded-3xl shadow-md">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gold-500/10 border border-gold-500/20 flex items-center justify-center text-[#dfc28c]">
                  <Users size={20} />
                </div>
                <div>
                  <h2 className="font-heading font-bold text-sm uppercase tracking-wider text-white">Staff Management Directory</h2>
                  <p className="text-[10px] text-zinc-500 mt-0.5">Manage credentials, permissions, and private email sync for team members.</p>
                </div>
              </div>
              <button
                onClick={() => { resetForm(); setActiveTab('create'); }}
                className="px-4 py-2 bg-[#dfc28c] hover:bg-[#d4af37] text-[#020c1b] text-xs font-bold uppercase tracking-wider rounded-xl flex items-center gap-1.5 transition-all shadow-md cursor-pointer"
              >
                <Plus size={14} />
                <span>Add Member</span>
              </button>
            </div>
          )}

          {/* TAB 1: LISTING DIRECTORY */}
          {activeTab === 'list' && (
            <div className="bg-zinc-900 border border-white/5 rounded-3xl overflow-hidden shadow-md">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-white/5 bg-black/20 text-zinc-400 uppercase tracking-wider font-bold text-[10px]">
                      <th className="px-6 py-4.5">Name</th>
                      <th className="px-6 py-4.5">Email / Username</th>
                      <th className="px-6 py-4.5">System Role</th>
                      <th className="px-6 py-4.5">Email Connection</th>
                      <th className="px-6 py-4.5">Date Created</th>
                      <th className="px-6 py-4.5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {staff.map((s) => (
                      <tr key={s.id} className="hover:bg-white/2 transition-colors">
                        <td className="px-6 py-4 font-bold text-white whitespace-nowrap">{s.name || 'Unassigned Name'}</td>
                        <td className="px-6 py-4 text-zinc-300 font-mono whitespace-nowrap">{s.email}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2.5 py-1 border text-[9px] font-bold rounded-full uppercase tracking-wider ${getRoleBadgeClass(s.role)}`}>
                            {getRoleLabel(s.role)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {s.emailHost ? (
                            <span className="text-[10px] text-green-400 flex items-center gap-1">
                              <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                              <span>Connected ({s.emailUsername})</span>
                            </span>
                          ) : (
                            <span className="text-[10px] text-zinc-500">Offline / Mocked</span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-zinc-400 whitespace-nowrap">
                          {new Date(s.createdAt).toLocaleDateString('en-US', {
                            year: 'numeric', month: 'short', day: 'numeric'
                          })}
                        </td>
                        <td className="px-6 py-4 text-right whitespace-nowrap">
                          <div className="flex justify-end gap-2.5">
                            <button
                              onClick={() => startEdit(s)}
                              className="p-2 bg-zinc-800 hover:bg-zinc-700 text-[#dfc28c] rounded-xl border border-white/5 transition-colors cursor-pointer"
                              title="Edit Credentials"
                            >
                              <Edit2 size={12} />
                            </button>
                            <button
                              disabled={currentUser?.id === s.id}
                              onClick={() => handleDelete(s.id, s.email)}
                              className="p-2 bg-red-500/5 hover:bg-red-500/10 text-red-400 border border-red-500/10 rounded-xl transition-colors disabled:opacity-30 cursor-pointer"
                              title="Remove Staff"
                            >
                              <Trash2 size={12} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {staff.length === 0 && (
                      <tr>
                        <td colSpan={6} className="text-center p-12 text-zinc-500 uppercase tracking-widest font-bold">
                          No staff members found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 2: CREATE MEMBER FORM */}
          {activeTab === 'create' && (
            <div className="bg-zinc-900 border border-white/5 rounded-3xl p-8 flex flex-col gap-6 shadow-md max-w-2xl mx-auto w-full">
              <div className="pb-3 border-b border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Plus className="text-[#dfc28c]" size={18} />
                  <h3 className="font-heading font-bold text-sm uppercase tracking-wider text-white">Create Staff Member</h3>
                </div>
                <button onClick={() => { resetForm(); setActiveTab('list'); }} className="p-1 hover:bg-white/5 rounded">
                  <X size={16} />
                </button>
              </div>

              <form onSubmit={handleCreate} className="flex flex-col gap-5">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Staff Full Name</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. John Tumusiime"
                    className="w-full bg-black/40 border border-white/5 px-4 py-2.5 rounded-xl text-xs outline-none focus:border-[#dfc28c]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Corporate Email</label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="e.g. sales@edificepropertiesug.com"
                      className="w-full bg-black/40 border border-white/5 px-4 py-2.5 rounded-xl text-xs outline-none focus:border-[#dfc28c]"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">System Role</label>
                    <select
                      value={role}
                      onChange={(e) => setRole(e.target.value)}
                      className="w-full bg-black/40 border border-white/5 px-4 py-2.5 rounded-xl text-xs outline-none focus:border-[#dfc28c]"
                    >
                      <option value="ceo">CEO / Executive (Full Reports)</option>
                      <option value="manager">Manager (Enquiries & Editing)</option>
                      <option value="sales">Salesperson (Lead Assigner)</option>
                      <option value="accounting">Accountant (Manage Units/Prices)</option>
                      <option value="marketing">Marketer / SEO (Content/Blogs)</option>
                      <option value="super_admin">Super Administrator</option>
                    </select>
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">System Login Password</label>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-black/40 border border-white/5 px-4 py-2.5 rounded-xl text-xs outline-none focus:border-[#dfc28c]"
                  />
                </div>

                <div className="flex gap-3 justify-end pt-4 border-t border-white/5 mt-2">
                  <button
                    type="button"
                    onClick={() => { resetForm(); setActiveTab('list'); }}
                    className="px-5 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-white rounded-xl text-xs font-bold uppercase tracking-wider"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="px-5 py-2.5 bg-[#dfc28c] hover:bg-[#d4af37] text-[#020c1b] disabled:opacity-50 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-1.5"
                  >
                    {submitting && <Loader2 className="animate-spin" size={14} />}
                    <span>Save Staff Member</span>
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* TAB 3: EDIT MEMBER & PRIVATE EMAIL SETTINGS */}
          {activeTab === 'edit' && (
            <div className="bg-zinc-900 border border-white/5 rounded-3xl p-8 flex flex-col gap-6 shadow-md max-w-3xl mx-auto w-full">
              <div className="pb-3 border-b border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Edit2 className="text-[#dfc28c]" size={18} />
                  <h3 className="font-heading font-bold text-sm uppercase tracking-wider text-white">Edit Staff Details & Connection</h3>
                </div>
                <button onClick={() => { resetForm(); setActiveTab('list'); }} className="p-1 hover:bg-white/5 rounded">
                  <X size={16} />
                </button>
              </div>

              <form onSubmit={handleEdit} className="flex flex-col gap-6">
                
                {/* Section A: Profile */}
                <div className="flex flex-col gap-4">
                  <span className="text-[10px] text-[#dfc28c] font-black uppercase tracking-wider">A. System Login Account</span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Staff Full Name</label>
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full bg-black/40 border border-white/5 px-4 py-2.5 rounded-xl text-xs outline-none focus:border-[#dfc28c]"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">System Role</label>
                      <select
                        value={role}
                        onChange={(e) => setRole(e.target.value)}
                        disabled={currentUser?.id === selectedId} // Cannot change your own role
                        className="w-full bg-black/40 border border-white/5 px-4 py-2.5 rounded-xl text-xs outline-none focus:border-[#dfc28c] disabled:opacity-50"
                      >
                        <option value="ceo">CEO / Executive (Full Reports)</option>
                        <option value="manager">Manager (Enquiries & Editing)</option>
                        <option value="sales">Salesperson (Lead Assigner)</option>
                        <option value="accounting">Accounting Desk</option>
                        <option value="marketing">Marketing & SEO</option>
                        <option value="super_admin">Super Administrator</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Login Email Address</label>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full bg-black/40 border border-white/5 px-4 py-2.5 rounded-xl text-xs outline-none focus:border-[#dfc28c]"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Change Login Password (Optional)</label>
                      <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Leave blank to keep current password"
                        className="w-full bg-black/40 border border-white/5 px-4 py-2.5 rounded-xl text-xs outline-none focus:border-[#dfc28c]"
                      />
                    </div>
                  </div>
                </div>

                {/* Section B: Private Email Client Connection */}
                <div className="flex flex-col gap-4 border-t border-white/5 pt-6">
                  <div className="flex items-center gap-2">
                    <Mail size={16} className="text-[#dfc28c]" />
                    <span className="text-[10px] text-[#dfc28c] font-black uppercase tracking-wider">B. Private Email Client Server Settings (IMAP/SMTP)</span>
                  </div>
                  <p className="text-[10px] text-zinc-500 -mt-2">Provide SMTP and IMAP connection parameters to retrieve and send corporate emails within the inbox.</p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">IMAP Server Host</label>
                      <input
                        type="text"
                        value={emailHost}
                        onChange={(e) => setEmailHost(e.target.value)}
                        placeholder="e.g. mail.edificepropertiesug.com or imap.gmail.com"
                        className="w-full bg-black/40 border border-white/5 px-4 py-2.5 rounded-xl text-xs outline-none focus:border-[#dfc28c]"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">IMAP Port (SSL usually 993)</label>
                      <input
                        type="number"
                        value={emailPort}
                        onChange={(e) => setEmailPort(e.target.value)}
                        placeholder="993"
                        className="w-full bg-black/40 border border-white/5 px-4 py-2.5 rounded-xl text-xs outline-none focus:border-[#dfc28c]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">SMTP Server Host</label>
                      <input
                        type="text"
                        value={smtpHost}
                        onChange={(e) => setSmtpHost(e.target.value)}
                        placeholder="e.g. mail.edificepropertiesug.com or smtp.gmail.com"
                        className="w-full bg-black/40 border border-white/5 px-4 py-2.5 rounded-xl text-xs outline-none focus:border-[#dfc28c]"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">SMTP Port (SSL usually 465)</label>
                      <input
                        type="number"
                        value={smtpPort}
                        onChange={(e) => setSmtpPort(e.target.value)}
                        placeholder="465"
                        className="w-full bg-black/40 border border-white/5 px-4 py-2.5 rounded-xl text-xs outline-none focus:border-[#dfc28c]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Email Address / Username</label>
                      <input
                        type="text"
                        value={emailUsername}
                        onChange={(e) => setEmailUsername(e.target.value)}
                        placeholder="e.g. accounts@edificepropertiesug.com"
                        className="w-full bg-black/40 border border-white/5 px-4 py-2.5 rounded-xl text-xs outline-none focus:border-[#dfc28c]"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Email Password / App Password</label>
                      <div className="relative">
                        <input
                          type={showMailPass ? 'text' : 'password'}
                          value={emailPassword}
                          onChange={(e) => setEmailPassword(e.target.value)}
                          placeholder={selectedId ? '••••••••' : 'Enter email password'}
                          className="w-full bg-black/40 border border-white/5 pl-4 pr-10 py-2.5 rounded-xl text-xs outline-none focus:border-[#dfc28c]"
                        />
                        <button
                          type="button"
                          onClick={() => setShowMailPass(!showMailPass)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white transition-colors"
                        >
                          {showMailPass ? <EyeOff size={14} /> : <Eye size={14} />}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3 justify-end pt-4 border-t border-white/5 mt-2">
                  <button
                    type="button"
                    onClick={() => { resetForm(); setActiveTab('list'); }}
                    className="px-5 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-white rounded-xl text-xs font-bold uppercase tracking-wider"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="px-5 py-2.5 bg-[#dfc28c] hover:bg-[#d4af37] text-[#020c1b] disabled:opacity-50 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 cursor-pointer"
                  >
                    {submitting && <Loader2 className="animate-spin" size={14} />}
                    <Save size={14} />
                    <span>Save Configurations</span>
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
