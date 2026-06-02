'use client';

import React, { useState, useEffect } from 'react';
import { Settings, Save, CheckCircle, AlertCircle, Loader2, Phone, Mail, MapPin, Play } from 'lucide-react';

export default function AdminSettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // Form Fields State
  const [phonePrimary, setPhonePrimary] = useState('');
  const [phoneAlt1, setPhoneAlt1] = useState('');
  const [phoneAlt2, setPhoneAlt2] = useState('');
  const [phoneAlt3, setPhoneAlt3] = useState('');
  const [phoneAlt4, setPhoneAlt4] = useState('');
  const [whatsappNumber, setWhatsappNumber] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [officeAddress, setOfficeAddress] = useState('');
  const [poBox, setPoBox] = useState('');
  const [businessHours, setBusinessHours] = useState('');
  const [youtubeHeroUrl, setYoutubeHeroUrl] = useState('');

  useEffect(() => {
    async function loadSettings() {
      try {
        const res = await fetch('/api/settings');
        if (!res.ok) throw new Error('Failed to load settings');
        const json = await res.json();
        
        if (json.success && json.data) {
          const s = json.data;
          setPhonePrimary(s.phone_primary || '');
          setPhoneAlt1(s.phone_alt1 || '');
          setPhoneAlt2(s.phone_alt2 || '');
          setPhoneAlt3(s.phone_alt3 || '');
          setPhoneAlt4(s.phone_alt4 || '');
          setWhatsappNumber(s.whatsapp_number || '');
          setContactEmail(s.contact_email || '');
          setOfficeAddress(s.office_address || '');
          setPoBox(s.po_box || '');
          setBusinessHours(s.business_hours || '');
          setYoutubeHeroUrl(s.youtube_hero_url || '');
        }
      } catch (err: any) {
        setErrorMsg(err.message || 'Error loading configurations');
      } finally {
        setLoading(false);
      }
    }
    loadSettings();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSuccessMsg('');
    setErrorMsg('');

    const payload = {
      phone_primary: phonePrimary,
      phone_alt1: phoneAlt1,
      phone_alt2: phoneAlt2,
      phone_alt3: phoneAlt3,
      phone_alt4: phoneAlt4,
      whatsapp_number: whatsappNumber,
      contact_email: contactEmail,
      office_address: officeAddress,
      po_box: poBox,
      business_hours: businessHours,
      youtube_hero_url: youtubeHeroUrl,
    };

    try {
      const res = await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error('Failed to save settings');
      const json = await res.json();
      
      if (json.success) {
        setSuccessMsg('Global settings updated successfully!');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Error updating settings');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-4xl flex flex-col gap-8">
      {/* Alert Notices */}
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
          <span className="text-xs text-zinc-500 uppercase tracking-widest font-bold">Loading configuration settings...</span>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="bg-zinc-900 border border-white/5 rounded-3xl p-8 flex flex-col gap-8 shadow-md">
          
          {/* Section: Contacts info */}
          <div className="flex flex-col gap-6">
            <div className="flex items-center gap-2 pb-3 border-b border-white/5">
              <Phone className="text-[#dfc28c]" size={18} />
              <h3 className="font-heading font-bold text-sm uppercase tracking-wider text-white">Telephone & WhatsApp Channels</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Primary Phone Desk</label>
                <input
                  type="text"
                  required
                  value={phonePrimary}
                  onChange={(e) => setPhonePrimary(e.target.value)}
                  placeholder="+256786000112"
                  className="w-full bg-black/40 border border-white/5 px-4 py-2.5 rounded-xl text-xs outline-none focus:border-[#dfc28c]"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">WhatsApp Link Number (International Format, no spaces or +)</label>
                <input
                  type="text"
                  required
                  value={whatsappNumber}
                  onChange={(e) => setWhatsappNumber(e.target.value)}
                  placeholder="256786000112"
                  className="w-full bg-black/40 border border-white/5 px-4 py-2.5 rounded-xl text-xs outline-none focus:border-[#dfc28c]"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Alternative Phone Desk 1</label>
                <input
                  type="text"
                  value={phoneAlt1}
                  onChange={(e) => setPhoneAlt1(e.target.value)}
                  placeholder="+256763700206"
                  className="w-full bg-black/40 border border-white/5 px-4 py-2.5 rounded-xl text-xs outline-none focus:border-[#dfc28c]"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Alternative Phone Desk 2</label>
                <input
                  type="text"
                  value={phoneAlt2}
                  onChange={(e) => setPhoneAlt2(e.target.value)}
                  placeholder="+256766759416"
                  className="w-full bg-black/40 border border-white/5 px-4 py-2.5 rounded-xl text-xs outline-none focus:border-[#dfc28c]"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Alternative Phone Desk 3</label>
                <input
                  type="text"
                  value={phoneAlt3}
                  onChange={(e) => setPhoneAlt3(e.target.value)}
                  placeholder="+256709269168"
                  className="w-full bg-black/40 border border-white/5 px-4 py-2.5 rounded-xl text-xs outline-none focus:border-[#dfc28c]"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Alternative Phone Desk 4</label>
                <input
                  type="text"
                  value={phoneAlt4}
                  onChange={(e) => setPhoneAlt4(e.target.value)}
                  placeholder="+256770833189"
                  className="w-full bg-black/40 border border-white/5 px-4 py-2.5 rounded-xl text-xs outline-none focus:border-[#dfc28c]"
                />
              </div>
            </div>
          </div>

          {/* Section: Email & Address */}
          <div className="flex flex-col gap-6">
            <div className="flex items-center gap-2 pb-3 border-b border-white/5">
              <Mail className="text-[#dfc28c]" size={18} />
              <h3 className="font-heading font-bold text-sm uppercase tracking-wider text-white">General Mailing & Offices Address</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Primary Contact Email</label>
                <input
                  type="email"
                  required
                  value={contactEmail}
                  onChange={(e) => setContactEmail(e.target.value)}
                  placeholder="edificepropertiesltd@gmail.com"
                  className="w-full bg-black/40 border border-white/5 px-4 py-2.5 rounded-xl text-xs outline-none focus:border-[#dfc28c]"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Business Operating Hours</label>
                <input
                  type="text"
                  required
                  value={businessHours}
                  onChange={(e) => setBusinessHours(e.target.value)}
                  placeholder="Mon - Fri: 8:00 AM - 5:00 PM, Sat: 9:00 AM - 1:00 PM"
                  className="w-full bg-black/40 border border-white/5 px-4 py-2.5 rounded-xl text-xs outline-none focus:border-[#dfc28c]"
                />
              </div>

              <div className="flex flex-col gap-1.5 md:col-span-2">
                <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Office Physical Address</label>
                <textarea
                  required
                  value={officeAddress}
                  onChange={(e) => setOfficeAddress(e.target.value)}
                  placeholder="Plot 8, Kanjokya Street, Kololo, Kampala, Uganda."
                  rows={2}
                  className="w-full bg-black/40 border border-white/5 px-4 py-2.5 rounded-xl text-xs outline-none focus:border-[#dfc28c] resize-none"
                />
              </div>

              <div className="flex flex-col gap-1.5 md:col-span-2">
                <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">P.O. Box Details</label>
                <input
                  type="text"
                  required
                  value={poBox}
                  onChange={(e) => setPoBox(e.target.value)}
                  placeholder="P.O. Box 108048 Kampala Nakawa."
                  className="w-full bg-black/40 border border-white/5 px-4 py-2.5 rounded-xl text-xs outline-none focus:border-[#dfc28c]"
                />
              </div>
            </div>
          </div>

          {/* Section: Media configs */}
          <div className="flex flex-col gap-6">
            <div className="flex items-center gap-2 pb-3 border-b border-white/5">
              <Play className="text-[#dfc28c]" size={18} />
              <h3 className="font-heading font-bold text-sm uppercase tracking-wider text-white">Homepage Background Walkthrough Video</h3>
            </div>
            
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">YouTube Video Link</label>
              <input
                type="text"
                required
                value={youtubeHeroUrl}
                onChange={(e) => setYoutubeHeroUrl(e.target.value)}
                placeholder="https://www.youtube.com/watch?v=LYgWq4vRT8c"
                className="w-full bg-black/40 border border-white/5 px-4 py-2.5 rounded-xl text-xs outline-none focus:border-[#dfc28c]"
              />
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex justify-end pt-4 border-t border-white/5">
            <button
              type="submit"
              disabled={saving}
              className="w-full md:w-auto px-6 py-3.5 bg-[#dfc28c] hover:bg-[#d4af37] disabled:opacity-50 text-[#020c1b] rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-lg"
            >
              {saving ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />}
              <span>Save Configurations</span>
            </button>
          </div>

        </form>
      )}
    </div>
  );
}
