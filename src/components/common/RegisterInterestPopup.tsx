'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Phone, Mail, MessageCircle, Building2, Bed, MapPin } from 'lucide-react';
import Image from 'next/image';

export default function RegisterInterestPopup() {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Form State
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [property, setProperty] = useState('');
  const [rooms, setRooms] = useState('');
  const [location, setLocation] = useState('');

  useEffect(() => {
    // Show popup after 3 seconds, if not already dismissed in this session
    const isDismissed = sessionStorage.getItem('edifice_interest_popup_dismissed');
    if (!isDismissed) {
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleClose = () => {
    setIsOpen(false);
    sessionStorage.setItem('edifice_interest_popup_dismissed', 'true');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !phone || !email) {
      setErrorMsg('Name, Phone number, and Email are required.');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg('');

    // Split fullName into first and last name
    const nameParts = fullName.trim().split(' ');
    const firstName = nameParts[0];
    const lastName = nameParts.slice(1).join(' ') || '';

    try {
      const res = await fetch('/api/enquiries', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firstName,
          lastName,
          phone,
          email,
          preferredProperty: property || 'General Inquiry',
          preferredUnitType: rooms || 'Any',
          budgetRange: 'Any',
          buyerType: 'Home buyer',
          message: `Location preference: ${location || 'Not specified'}. Registered interest via onload popup.`,
          pageSource: 'Onload Interest Popup',
          deviceType: typeof window !== 'undefined' && window.innerWidth < 768 ? 'Mobile' : 'Desktop',
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.detail || 'Failed to submit interest.');
      }

      setSubmitSuccess(true);
      setTimeout(() => {
        handleClose();
      }, 2500);
    } catch (err: any) {
      setErrorMsg(err.message || 'An error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 overflow-y-auto">
          {/* Glassmorphism Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 bg-[#020c1b]/80 backdrop-blur-md"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ scale: 0.95, y: 20, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.95, y: 20, opacity: 0 }}
            transition={{ type: 'spring', duration: 0.5 }}
            className="relative w-full max-w-[480px] bg-white rounded-[32px] overflow-hidden shadow-2xl p-6 md:p-8 flex flex-col gap-6 text-zinc-800"
          >
            {/* Close Button */}
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 w-9 h-9 rounded-full bg-zinc-100 hover:bg-zinc-200 text-zinc-500 hover:text-zinc-800 flex items-center justify-center transition-all cursor-pointer z-10"
            >
              <X size={18} />
            </button>

            {/* Header Content */}
            <div className="flex flex-col items-center text-center gap-3">
              {/* Edifice Logo / Monogram Symbol */}
              <div className="relative w-16 h-16 bg-[#0a192f] rounded-2xl flex items-center justify-center p-3 shadow-md">
                <span className="font-heading font-black text-2xl text-[#dfc28c] tracking-tighter">EP</span>
              </div>
              <div className="flex flex-col gap-1 mt-1">
                <span className="text-[10px] uppercase font-bold tracking-widest text-zinc-400">Edifice Properties</span>
                <h3 className="font-heading text-2xl font-extrabold text-[#0a192f] tracking-tight">
                  Register Your Interest
                </h3>
              </div>
              <p className="text-xs text-zinc-500 max-w-sm leading-relaxed">
                Discover modern luxury residences in Kampala. Leave your details below and a sales representative will contact you with brochures, floor plans, and pricing.
              </p>
            </div>

            {submitSuccess ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center justify-center py-8 text-center gap-3"
              >
                <div className="w-16 h-16 rounded-full bg-green-50 text-green-500 flex items-center justify-center">
                  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h4 className="font-heading font-bold text-lg text-[#0a192f]">Submission Received!</h4>
                <p className="text-xs text-zinc-500">Thank you. We will get back to you shortly.</p>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-3.5">
                {/* Full Name */}
                <div className="relative">
                  <input
                    type="text"
                    required
                    placeholder="Full name *"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full h-11 px-4 border border-zinc-200 rounded-xl text-sm focus:outline-none focus:border-[#dfc28c] bg-zinc-50/50 focus:bg-white transition-all text-zinc-800 placeholder-zinc-400"
                  />
                </div>

                {/* Phone Number */}
                <div className="relative">
                  <input
                    type="tel"
                    required
                    placeholder="Phone number * (e.g. +256...)"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full h-11 px-4 border border-zinc-200 rounded-xl text-sm focus:outline-none focus:border-[#dfc28c] bg-zinc-50/50 focus:bg-white transition-all text-zinc-800 placeholder-zinc-400"
                  />
                </div>

                {/* Email Address */}
                <div className="relative">
                  <input
                    type="email"
                    required
                    placeholder="Email address *"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full h-11 px-4 border border-zinc-200 rounded-xl text-sm focus:outline-none focus:border-[#dfc28c] bg-zinc-50/50 focus:bg-white transition-all text-zinc-800 placeholder-zinc-400"
                  />
                </div>

                {/* Property Dropdown */}
                <div className="relative flex items-center">
                  <Building2 size={16} className="absolute left-3.5 text-zinc-400 pointer-events-none" />
                  <select
                    value={property}
                    onChange={(e) => setProperty(e.target.value)}
                    className="w-full h-11 pl-10 pr-4 border border-zinc-200 rounded-xl text-sm focus:outline-none focus:border-[#dfc28c] bg-zinc-50/50 focus:bg-white transition-all text-zinc-800 appearance-none cursor-pointer"
                  >
                    <option value="">Select Property *</option>
                    <option value="Signature Residency">Signature Residency (Kulambiro)</option>
                    <option value="Horizon Residency">Horizon Residency (Bugolobi)</option>
                    <option value="Embassy Towers">Embassy Towers (Kampala)</option>
                    <option value="Elite Palazzo Naguru">Elite Palazzo (Naguru)</option>
                    <option value="Atlantic Apartments">Atlantic Heights (Kampala)</option>
                    <option value="Urban View Apartments">Urban View Apartments (Kulambiro)</option>
                  </select>
                </div>

                {/* Grid for Rooms & Location */}
                <div className="grid grid-cols-2 gap-3">
                  {/* Rooms Selection */}
                  <div className="relative flex items-center">
                    <Bed size={16} className="absolute left-3.5 text-zinc-400 pointer-events-none" />
                    <select
                      value={rooms}
                      onChange={(e) => setRooms(e.target.value)}
                      className="w-full h-11 pl-10 pr-4 border border-zinc-200 rounded-xl text-sm focus:outline-none focus:border-[#dfc28c] bg-zinc-50/50 focus:bg-white transition-all text-zinc-800 appearance-none cursor-pointer"
                    >
                      <option value="">Bedrooms</option>
                      <option value="1 BHK">1 BHK</option>
                      <option value="2 BHK">2 BHK</option>
                      <option value="3 BHK">3 BHK</option>
                    </select>
                  </div>

                  {/* Location Selector */}
                  <div className="relative flex items-center">
                    <MapPin size={16} className="absolute left-3.5 text-zinc-400 pointer-events-none" />
                    <select
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      className="w-full h-11 pl-10 pr-4 border border-zinc-200 rounded-xl text-sm focus:outline-none focus:border-[#dfc28c] bg-zinc-50/50 focus:bg-white transition-all text-zinc-800 appearance-none cursor-pointer"
                    >
                      <option value="">Location</option>
                      <option value="Kulambiro">Kulambiro</option>
                      <option value="Bugolobi">Bugolobi</option>
                      <option value="Naguru">Naguru</option>
                      <option value="Kololo">Kololo</option>
                    </select>
                  </div>
                </div>

                {errorMsg && (
                  <span className="text-[11px] text-red-500 font-semibold">{errorMsg}</span>
                )}

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full h-11 bg-[#dfc28c] hover:bg-[#cfae74] text-[#020c1b] font-bold rounded-xl text-sm transition-all shadow-md cursor-pointer flex items-center justify-center gap-2"
                >
                  {isSubmitting ? 'Registering...' : 'Register My Interest'}
                </button>
              </form>
            )}

            <hr className="border-zinc-100" />

            {/* Quick Contact Buttons at Bottom */}
            <div className="grid grid-cols-3 gap-3">
              {/* Call Us */}
              <a
                href="tel:+256786000112"
                className="flex flex-col items-center justify-center p-3 border border-zinc-100 rounded-2xl hover:bg-zinc-50 transition-all text-zinc-600 hover:text-zinc-900 group"
              >
                <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-500 flex items-center justify-center group-hover:scale-105 transition-transform">
                  <Phone size={18} className="fill-current text-blue-500" />
                </div>
                <span className="text-[10px] font-semibold mt-1.5">Call Us</span>
              </a>

              {/* Email */}
              <a
                href="mailto:sales@edificepropertiesug.com"
                className="flex flex-col items-center justify-center p-3 border border-zinc-100 rounded-2xl hover:bg-zinc-50 transition-all text-zinc-600 hover:text-zinc-900 group"
              >
                <div className="w-10 h-10 rounded-full bg-red-50 text-red-500 flex items-center justify-center group-hover:scale-105 transition-transform">
                  <Mail size={18} />
                </div>
                <span className="text-[10px] font-semibold mt-1.5">Email</span>
              </a>

              {/* WhatsApp */}
              <a
                href="https://wa.me/256786000112?text=Hello%20Edifice%20Properties%2C%20I%20am%20interested%20in%20learning%20more%20about%20your%20developments.%20Please%20send%20me%20a%20brochure."
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center justify-center p-3 border border-zinc-100 rounded-2xl hover:bg-zinc-50 transition-all text-zinc-600 hover:text-zinc-900 group"
              >
                <div className="w-10 h-10 rounded-full bg-green-50 text-green-500 flex items-center justify-center group-hover:scale-105 transition-transform">
                  <MessageCircle size={18} className="fill-current text-green-500" />
                </div>
                <span className="text-[10px] font-semibold mt-1.5">WhatsApp</span>
              </a>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
