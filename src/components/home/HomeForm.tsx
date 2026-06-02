'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, CheckCircle2, AlertCircle } from 'lucide-react';

interface HomeFormProps {
  properties: { id: string; name: string }[];
  pageSource?: string;
}

export default function HomeForm({ properties, pageSource = 'Homepage' }: HomeFormProps) {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    preferredProperty: '',
    preferredUnitType: 'Any',
    budgetRange: 'Any',
    buyerType: 'Home buyer',
    message: '',
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const budgetOptions = [
    'Any',
    'Under $100,000',
    '$100,000 - $150,000',
    '$150,000 - $200,000',
    'Above $200,000',
    'Under 200M UGX',
    '200M - 350M UGX',
    'Above 350M UGX',
  ];

  const buyerTypes = [
    { label: 'Home Buyer', value: 'Home buyer' },
    { label: 'Real Estate Investor', value: 'Investor' },
    { label: 'Diaspora Buyer', value: 'Diaspora buyer' },
    { label: 'Corporate Purchaser', value: 'Corporate buyer' },
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (!formData.firstName || !formData.email || !formData.phone) {
      setError('Please fill in all required fields (First name, email, and phone number).');
      setLoading(false);
      return;
    }

    try {
      const res = await fetch('/api/enquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          pageSource,
          deviceType: typeof window !== 'undefined' ? (window.innerWidth < 768 ? 'Mobile' : 'Desktop') : 'unknown',
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.detail || 'Failed to submit the form.');
      }

      setSuccess(true);
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        preferredProperty: '',
        preferredUnitType: 'Any',
        budgetRange: 'Any',
        buyerType: 'Home buyer',
        message: '',
      });
    } catch (err: any) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#020c1b] border border-white/5 p-8 md:p-12 rounded-3xl shadow-2xl text-white">
      {success ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center justify-center text-center py-12 gap-4"
        >
          <CheckCircle2 size={64} className="text-[#dfc28c] animate-pulse" />
          <h3 className="font-heading text-2xl font-bold tracking-tight">Enquiry Received</h3>
          <p className="text-white/60 text-sm max-w-md">
            Thank you for reaching out to Edifice Properties. A dedicated property consultant will review your preferences and contact you within 24 hours.
          </p>
          <button
            onClick={() => setSuccess(false)}
            className="mt-6 px-6 py-2.5 bg-white/10 hover:bg-[#dfc28c] hover:text-[#020c1b] text-xs uppercase tracking-widest font-semibold rounded-full transition-all"
          >
            Submit Another Enquiry
          </button>
        </motion.div>
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <h3 className="font-heading text-2xl font-bold tracking-tight">Request Full Brochure & Details</h3>
            <p className="text-white/50 text-xs">Fill in your information below to speak with a sales advisor.</p>
          </div>

          {error && (
            <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/20 p-4 rounded-xl text-red-400 text-sm">
              <AlertCircle size={18} className="shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Form Fields Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="firstName" className="text-xs font-semibold text-white/50">First Name *</label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                required
                value={formData.firstName}
                onChange={handleChange}
                placeholder="e.g. Sarah"
                className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#dfc28c] transition-colors"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label htmlFor="lastName" className="text-xs font-semibold text-white/50">Last Name</label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                placeholder="e.g. Kigozi"
                className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#dfc28c] transition-colors"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="email" className="text-xs font-semibold text-white/50">Email Address *</label>
              <input
                type="email"
                id="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                placeholder="e.g. sarah@example.com"
                className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#dfc28c] transition-colors"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label htmlFor="phone" className="text-xs font-semibold text-white/50">Phone Number *</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                required
                value={formData.phone}
                onChange={handleChange}
                placeholder="e.g. +256 786 000112"
                className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#dfc28c] transition-colors"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="preferredProperty" className="text-xs font-semibold text-white/50">Select Development</label>
              <select
                id="preferredProperty"
                name="preferredProperty"
                value={formData.preferredProperty}
                onChange={handleChange}
                className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#dfc28c] transition-colors appearance-none"
              >
                <option value="" className="bg-[#020c1b]">General Enquiry</option>
                {properties.map((p) => (
                  <option key={p.id} value={p.name} className="bg-[#020c1b]">
                    {p.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex flex-col gap-1.5">
              <label htmlFor="buyerType" className="text-xs font-semibold text-white/50">Buyer Classification</label>
              <select
                id="buyerType"
                name="buyerType"
                value={formData.buyerType}
                onChange={handleChange}
                className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#dfc28c] transition-colors appearance-none"
              >
                {buyerTypes.map((type) => (
                  <option key={type.value} value={type.value} className="bg-[#020c1b]">
                    {type.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="budgetRange" className="text-xs font-semibold text-white/50">Estimated Budget Range</label>
              <select
                id="budgetRange"
                name="budgetRange"
                value={formData.budgetRange}
                onChange={handleChange}
                className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#dfc28c] transition-colors appearance-none"
              >
                {budgetOptions.map((opt) => (
                  <option key={opt} value={opt} className="bg-[#020c1b]">
                    {opt}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex flex-col gap-1.5">
              <label htmlFor="preferredUnitType" className="text-xs font-semibold text-white/50">Apartment Size Requirement</label>
              <select
                id="preferredUnitType"
                name="preferredUnitType"
                value={formData.preferredUnitType}
                onChange={handleChange}
                className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#dfc28c] transition-colors appearance-none"
              >
                <option value="Any" className="bg-[#020c1b]">Any Size</option>
                <option value="1BHK" className="bg-[#020c1b]">1 Bed (1BHK)</option>
                <option value="2BHK" className="bg-[#020c1b]">2 Bed (2BHK)</option>
                <option value="3BHK" className="bg-[#020c1b]">3 Bed (3BHK)</option>
                <option value="Penthouse" className="bg-[#020c1b]">Penthouse</option>
              </select>
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="message" className="text-xs font-semibold text-white/50">Additional Requests / Messages</label>
            <textarea
              id="message"
              name="message"
              rows={4}
              value={formData.message}
              onChange={handleChange}
              placeholder="e.g. I would like to schedule a viewing next Tuesday afternoon..."
              className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#dfc28c] transition-colors resize-none"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full h-12 rounded-xl bg-[#dfc28c] text-[#020c1b] hover:bg-white hover:text-[#020c1b] transition-all font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            <span>{loading ? 'Submitting...' : 'Send Message'}</span>
            {!loading && <Send size={14} />}
          </button>
        </form>
      )}
    </div>
  );
}
