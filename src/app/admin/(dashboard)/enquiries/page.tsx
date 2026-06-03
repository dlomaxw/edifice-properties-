'use client';

import React, { useState, useEffect } from 'react';
import { 
  Users, Search, Download, Trash2, Edit2, Check, X, 
  ChevronDown, Phone, Mail, UserCheck, MessageSquare, Tag, Loader2 
} from 'lucide-react';

interface Enquiry {
  id: string;
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  preferredProperty: string;
  preferredUnitType: string;
  budgetRange: string;
  buyerType: string;
  message: string;
  status: string;
  assignedSalesperson: string;
  notes: string;
  pageSource: string;
  deviceType: string;
  dateCreated: string;
}

export default function AdminEnquiriesPage() {
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentUser, setCurrentUser] = useState<any>(null);
  
  // Search and Filter states
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [propertyFilter, setPropertyFilter] = useState('All');
  
  // Edit states
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editStatus, setEditStatus] = useState('');
  const [editRep, setEditRep] = useState('');
  const [editNotes, setEditNotes] = useState('');
  const [updating, setUpdating] = useState(false);

  // Load properties list to populate filters
  const [propertiesList, setPropertiesList] = useState<string[]>([]);

  const fetchEnquiries = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/enquiries');
      if (!res.ok) throw new Error('Failed to load enquiries');
      const json = await res.json();
      if (json.success) {
        setEnquiries(json.data);
        
        // Extract unique properties for filter dropdown
        const properties = Array.from(
          new Set(json.data.map((e: Enquiry) => e.preferredProperty))
        ) as string[];
        setPropertiesList(properties);
      }
    } catch (err: any) {
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    async function loadSession() {
      try {
        const sessionRes = await fetch('/api/auth/session');
        if (sessionRes.ok) {
          const sessionData = await sessionRes.json();
          if (sessionData.authenticated) {
            setCurrentUser(sessionData.user);
          }
        }
      } catch (err) {
        console.error('Failed to load session details:', err);
      }
    }
    loadSession();
    fetchEnquiries();
  }, []);

  const handleStartEdit = (lead: Enquiry) => {
    setEditingId(lead.id);
    setEditStatus(lead.status);
    setEditRep(lead.assignedSalesperson || 'Unassigned');
    setEditNotes(lead.notes || '');
  };

  const handleCancelEdit = () => {
    setEditingId(null);
  };

  const handleUpdate = async (id: string) => {
    setUpdating(true);
    try {
      const res = await fetch(`/api/enquiries/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: editStatus,
          assignedSalesperson: editRep,
          notes: editNotes,
        }),
      });

      if (!res.ok) throw new Error('Failed to update lead');
      const json = await res.json();
      
      if (json.success) {
        setEnquiries(
          enquiries.map((e) => (e.id === id ? json.data : e))
        );
        setEditingId(null);
      }
    } catch (err: any) {
      alert(err.message || 'Error updating lead');
    } finally {
      setUpdating(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this enquiry? This action cannot be undone.')) {
      return;
    }
    
    try {
      const res = await fetch(`/api/enquiries/${id}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('Failed to delete lead');
      
      setEnquiries(enquiries.filter((e) => e.id !== id));
    } catch (err: any) {
      alert(err.message || 'Error deleting lead');
    }
  };

  // CSV Exporter
  const handleExportCSV = () => {
    if (filteredEnquiries.length === 0) return;
    
    const headers = [
      'Date Created', 'Name', 'Phone', 'Email', 
      'Property Preferred', 'Unit Preferred', 'Budget Range', 
      'Buyer Type', 'Message', 'Status', 'Sales Rep', 'Notes', 'Page Source'
    ];
    
    const rows = filteredEnquiries.map(e => [
      new Date(e.dateCreated).toLocaleDateString(),
      `"${e.firstName} ${e.lastName}"`,
      `"${e.phone}"`,
      `"${e.email}"`,
      `"${e.preferredProperty}"`,
      `"${e.preferredUnitType}"`,
      `"${e.budgetRange}"`,
      `"${e.buyerType}"`,
      `"${e.message.replace(/"/g, '""')}"`,
      e.status,
      `"${e.assignedSalesperson || 'Unassigned'}"`,
      `"${(e.notes || '').replace(/"/g, '""')}"`,
      e.pageSource
    ]);

    const csvContent = "data:text/csv;charset=utf-8," 
      + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
      
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `edifice_leads_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'New': return 'bg-blue-500/10 text-blue-400 border border-blue-500/20';
      case 'Contacted': return 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20';
      case 'Site Visit Booked': return 'bg-purple-500/10 text-purple-400 border border-purple-500/20';
      case 'Negotiation': return 'bg-orange-500/10 text-orange-400 border border-orange-500/20';
      case 'Reserved': return 'bg-pink-500/10 text-pink-400 border border-pink-500/20';
      case 'Closed': return 'bg-green-500/10 text-green-400 border border-green-500/20';
      case 'Lost': return 'bg-zinc-800 text-zinc-500 border border-zinc-700';
      default: return 'bg-zinc-800 text-zinc-400 border border-zinc-700';
    }
  };

  // Filters logic
  const filteredEnquiries = enquiries.filter((e) => {
    const fullName = `${e.firstName} ${e.lastName}`.toLowerCase();
    const matchesSearch = 
      fullName.includes(search.toLowerCase()) ||
      e.phone.includes(search) ||
      e.email.toLowerCase().includes(search.toLowerCase()) ||
      e.message.toLowerCase().includes(search.toLowerCase());
      
    const matchesStatus = statusFilter === 'All' || e.status === statusFilter;
    const matchesProperty = propertyFilter === 'All' || e.preferredProperty === propertyFilter;

    return matchesSearch && matchesStatus && matchesProperty;
  });

  const statuses = ['New', 'Contacted', 'Site Visit Booked', 'Negotiation', 'Reserved', 'Closed', 'Lost'];
  const ALLOWED_ROLES = ['super_admin', 'ceo', 'manager', 'sales'];

  if (!loading && currentUser && !ALLOWED_ROLES.includes(currentUser.role)) {
    return (
      <div className="bg-zinc-900 border border-white/5 p-8 rounded-3xl flex flex-col items-center justify-center gap-4 text-center max-w-md mx-auto mt-12 shadow-md">
        <div className="w-12 h-12 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400">
          <Users size={24} />
        </div>
        <h2 className="text-base font-heading font-bold text-white uppercase tracking-wider">Access Restrict Guard</h2>
        <p className="text-xs text-zinc-400 leading-relaxed">
          Your active staff role of <span className="text-[#dfc28c] font-bold">{(currentUser.role || '').toUpperCase()}</span> does not possess permission to access the Leads & Enquiries Directory.
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
    <div className="flex flex-col gap-8">
      {/* Controls Header */}
      <div className="bg-zinc-900 border border-white/5 p-6 rounded-3xl flex flex-col md:flex-row gap-4 justify-between items-center shadow-md">
        
        {/* Filters */}
        <div className="flex flex-wrap items-center gap-4 w-full md:w-auto">
          {/* Search */}
          <div className="relative flex-1 md:flex-none md:w-64">
            <Search className="absolute left-4 top-3 text-zinc-500" size={16} />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search leads name/phone..."
              className="w-full bg-black/40 border border-white/5 pl-11 pr-4 py-2.5 rounded-xl text-xs focus:border-[#dfc28c] focus:ring-1 focus:ring-[#dfc28c] outline-none transition-all placeholder:text-zinc-700"
            />
          </div>

          {/* Status Filter */}
          <div className="relative">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="appearance-none bg-black/40 border border-white/5 pl-4 pr-10 py-2.5 rounded-xl text-xs focus:border-[#dfc28c] outline-none font-semibold text-zinc-300"
            >
              <option value="All">All Statuses</option>
              {statuses.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
            <ChevronDown className="absolute right-3.5 top-3.5 text-zinc-500 pointer-events-none" size={14} />
          </div>

          {/* Property Filter */}
          <div className="relative">
            <select
              value={propertyFilter}
              onChange={(e) => setPropertyFilter(e.target.value)}
              className="appearance-none bg-black/40 border border-white/5 pl-4 pr-10 py-2.5 rounded-xl text-xs focus:border-[#dfc28c] outline-none font-semibold text-zinc-300"
            >
              <option value="All">All Properties</option>
              {propertiesList.map(p => <option key={p} value={p}>{p}</option>)}
            </select>
            <ChevronDown className="absolute right-3.5 top-3.5 text-zinc-500 pointer-events-none" size={14} />
          </div>
        </div>

        {/* Action Button */}
        <button
          onClick={handleExportCSV}
          disabled={filteredEnquiries.length === 0}
          className="w-full md:w-auto px-5 py-2.5 bg-zinc-800 hover:bg-zinc-700 disabled:opacity-50 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 border border-white/5 transition-all"
        >
          <Download size={14} />
          <span>Export CSV ({filteredEnquiries.length})</span>
        </button>

      </div>

      {/* Main Leads List */}
      <div className="bg-zinc-900 border border-white/5 rounded-3xl shadow-md overflow-hidden">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 gap-3">
            <Loader2 className="animate-spin text-[#dfc28c]" size={36} />
            <span className="text-xs text-zinc-500 uppercase tracking-widest font-bold">Loading leads...</span>
          </div>
        ) : error ? (
          <div className="p-8 text-center text-red-400 text-xs font-semibold">{error}</div>
        ) : filteredEnquiries.length === 0 ? (
          <div className="p-16 text-center text-xs text-zinc-500 uppercase tracking-widest font-bold">
            No matching leads found
          </div>
        ) : (
          <div className="divide-y divide-white/5">
            {filteredEnquiries.map((lead) => {
              const isEditing = editingId === lead.id;
              return (
                <div 
                  key={lead.id} 
                  className={`p-6 transition-colors flex flex-col gap-4 ${
                    isEditing ? 'bg-white/[0.02]' : 'hover:bg-white/[0.005]'
                  }`}
                >
                  {/* Top line summary info */}
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex flex-wrap items-center gap-3">
                      <h3 className="font-heading font-bold text-base text-white">
                        {lead.firstName} {lead.lastName}
                      </h3>
                      
                      <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider ${getStatusColor(lead.status)}`}>
                        {lead.status}
                      </span>

                      <span className="text-[10px] text-zinc-500 font-bold uppercase border border-zinc-800 px-2 py-0.5 rounded-md">
                        {lead.preferredProperty}
                      </span>
                    </div>

                    <div className="text-[11px] text-zinc-500 font-medium">
                      Received: {new Date(lead.dateCreated).toLocaleDateString(undefined, { 
                        year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' 
                      })}
                    </div>
                  </div>

                  {/* Core details body */}
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-6 pt-2">
                    
                    {/* Contacts & Metadata */}
                    <div className="md:col-span-4 flex flex-col gap-3 text-xs">
                      <div className="flex items-center gap-2.5 text-zinc-400 font-semibold">
                        <Phone size={14} className="text-[#dfc28c]" />
                        <a href={`tel:${lead.phone}`} className="hover:text-[#dfc28c] transition-colors">{lead.phone}</a>
                      </div>

                      <div className="flex items-center gap-2.5 text-zinc-400 font-semibold truncate">
                        <Mail size={14} className="text-[#dfc28c]" />
                        <a href={`mailto:${lead.email}`} className="hover:text-[#dfc28c] transition-colors truncate">{lead.email}</a>
                      </div>

                      <div className="flex flex-col gap-1 mt-2 text-[10px] text-zinc-500 font-bold uppercase tracking-wider">
                        <div>Buyer Segment: <span className="text-zinc-400">{lead.buyerType}</span></div>
                        <div>Budget Level: <span className="text-zinc-400">{lead.budgetRange}</span></div>
                        <div>Unit Style: <span className="text-zinc-400">{lead.preferredUnitType}</span></div>
                        <div>Page Source: <span className="text-zinc-400">{lead.pageSource}</span></div>
                      </div>
                    </div>

                    {/* Message Box */}
                    <div className="md:col-span-4 bg-black/30 border border-white/5 p-4 rounded-2xl flex flex-col gap-1.5">
                      <span className="text-[9px] uppercase tracking-wider text-zinc-500 font-bold">Client Message:</span>
                      <p className="text-zinc-400 text-xs leading-relaxed italic">
                        &ldquo;{lead.message || 'No custom message provided.'}&rdquo;
                      </p>
                    </div>

                    {/* Salesperson Assignment & Internal Notes */}
                    <div className="md:col-span-4 flex flex-col gap-3 justify-between">
                      {isEditing ? (
                        <div className="flex flex-col gap-3">
                          {/* Status Edit */}
                          <div className="flex flex-col gap-1">
                            <span className="text-[9px] text-zinc-500 font-bold uppercase tracking-wider">Update Status:</span>
                            <div className="relative">
                              <select
                                value={editStatus}
                                onChange={(e) => setEditStatus(e.target.value)}
                                className="w-full bg-black border border-white/5 px-3 py-1.5 rounded-lg text-xs outline-none"
                              >
                                {statuses.map(s => <option key={s} value={s}>{s}</option>)}
                              </select>
                            </div>
                          </div>

                          {/* Rep Assignment */}
                          <div className="flex flex-col gap-1">
                            <span className="text-[9px] text-zinc-500 font-bold uppercase tracking-wider">Assign Representative:</span>
                            <input
                              type="text"
                              value={editRep}
                              onChange={(e) => setEditRep(e.target.value)}
                              placeholder="e.g. Sarah K. / John D."
                              className="w-full bg-black border border-white/5 px-3 py-1.5 rounded-lg text-xs outline-none focus:border-[#dfc28c]"
                            />
                          </div>

                          {/* Notes Edit */}
                          <div className="flex flex-col gap-1">
                            <span className="text-[9px] text-zinc-500 font-bold uppercase tracking-wider">Internal Activity Notes:</span>
                            <textarea
                              value={editNotes}
                              onChange={(e) => setEditNotes(e.target.value)}
                              placeholder="Enter follow up details, site visit date..."
                              rows={2}
                              className="w-full bg-black border border-white/5 px-3 py-1.5 rounded-lg text-xs outline-none focus:border-[#dfc28c] resize-none"
                            />
                          </div>
                        </div>
                      ) : (
                        <div className="bg-black/30 border border-white/5 p-4 rounded-2xl flex flex-col gap-2 h-full justify-between">
                          <div className="flex flex-col gap-1.5">
                            <div className="flex items-center gap-1.5 text-xs">
                              <UserCheck size={13} className="text-[#dfc28c]" />
                              <span className="text-[9px] uppercase tracking-wider text-zinc-500 font-bold">Representative:</span>
                              <span className="text-zinc-300 font-bold">{lead.assignedSalesperson || 'Unassigned'}</span>
                            </div>
                            
                            <div className="flex items-start gap-1.5 text-xs">
                              <MessageSquare size={13} className="text-[#dfc28c] shrink-0 mt-0.5" />
                              <div className="flex flex-col">
                                <span className="text-[9px] uppercase tracking-wider text-zinc-500 font-bold leading-none">Internal Notes:</span>
                                <p className="text-[11px] text-zinc-400 leading-relaxed mt-1 whitespace-pre-line">
                                  {lead.notes || 'No tracking history.'}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                  </div>

                  {/* Actions line */}
                  <div className="flex justify-end items-center gap-3 pt-3 border-t border-white/5 mt-2">
                    {isEditing ? (
                      <>
                        <button
                          onClick={handleCancelEdit}
                          disabled={updating}
                          className="px-3.5 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 transition-colors"
                        >
                          <X size={12} />
                          <span>Cancel</span>
                        </button>
                        <button
                          onClick={() => handleUpdate(lead.id)}
                          disabled={updating}
                          className="px-3.5 py-1.5 bg-[#dfc28c] hover:bg-[#d4af37] disabled:opacity-50 text-[#020c1b] rounded-lg text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 transition-colors animate-pulse"
                        >
                          {updating ? <Loader2 className="animate-spin" size={12} /> : <Check size={12} />}
                          <span>Save Changes</span>
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => handleDelete(lead.id)}
                          className="p-2 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-400 rounded-lg transition-colors"
                          title="Delete Enquiry"
                        >
                          <Trash2 size={13} />
                        </button>
                        <button
                          onClick={() => handleStartEdit(lead)}
                          className="px-3.5 py-1.5 bg-zinc-800 hover:bg-zinc-700 border border-white/5 text-white rounded-lg text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5 transition-colors"
                        >
                          <Edit2 size={12} className="text-[#dfc28c]" />
                          <span>Edit / Notes</span>
                        </button>
                      </>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
