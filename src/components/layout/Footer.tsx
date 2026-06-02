'use client';

import Link from 'next/link';
import { Phone, Mail, MapPin, Send, MessageSquare } from 'lucide-react';

const propertyLinks = [
  { name: 'Horizon Residency', href: '/properties/horizon-residency' },
  { name: 'Embassy Towers', href: '/properties/embassy-towers' },
  { name: 'Elite Palazzo Naguru', href: '/properties/elite-palazzo-naguru' },
  { name: 'Atlantic Apartments', href: '/properties/atlantic-apartments' },
  { name: 'Urban View Apartments', href: '/properties/urban-view-apartments' },
];

const quickLinks = [
  { name: 'Home', href: '/' },
  { name: 'Buying Process', href: '/buying-process' },
  { name: 'Homeownership Guide', href: '/homeownership-guide' },
  { name: 'About Us', href: '/about' },
  { name: 'Contact Us', href: '/contact' },
];

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#020c1b] text-white/75 pt-20 pb-8 border-t border-white/5">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
        
        {/* About & Branding */}
        <div className="flex flex-col gap-6">
          <Link href="/" className="flex items-center gap-2">
            <span className="font-heading font-bold text-2xl tracking-wider text-white">
              EDIFICE<span className="text-[#dfc28c]">.</span>
            </span>
          </Link>
          <p className="text-sm leading-relaxed text-white/50">
            This luxury high-rise community developer provides residents with sophisticated and trendy apartment features, extravagant and resort-style amenities at a cost-effective price. Take in gorgeous views from within your home.
          </p>
          <div className="flex items-center gap-4">
            <a
              href="https://wa.me/256786000112"
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 hover:text-[#dfc28c] flex items-center justify-center transition-colors border border-white/10"
              title="Chat on WhatsApp"
            >
              <MessageSquare size={16} />
            </a>
          </div>
        </div>

        {/* Property Portfolio */}
        <div className="flex flex-col gap-6">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-[#dfc28c]">
            Our Developments
          </h3>
          <ul className="flex flex-col gap-3">
            {propertyLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-sm hover:text-white transition-colors"
                >
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Quick Navigation */}
        <div className="flex flex-col gap-6">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-[#dfc28c]">
            Information
          </h3>
          <ul className="flex flex-col gap-3">
            {quickLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-sm hover:text-white transition-colors"
                >
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact Information */}
        <div className="flex flex-col gap-6">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-[#dfc28c]">
            Head Office
          </h3>
          <ul className="flex flex-col gap-4 text-sm text-white/60">
            <li className="flex gap-3">
              <MapPin size={18} className="text-[#dfc28c] shrink-0 mt-0.5" />
              <span>
                <strong>Edifice Properties Limited</strong><br />
                Plot 8, Kanjokya Street, Kololo, Kampala, Uganda.<br />
                P.O. Box 108048 Kampala Nakawa.
              </span>
            </li>
            <li className="flex gap-3">
              <Phone size={18} className="text-[#dfc28c] shrink-0 mt-0.5" />
              <div className="flex flex-col">
                <a href="tel:+256786000112" className="hover:text-white transition-colors">+256 786 000112</a>
                <a href="tel:+256763700206" className="hover:text-white transition-colors">+256 763 700206</a>
              </div>
            </li>
            <li className="flex gap-3">
              <Mail size={18} className="text-[#dfc28c] shrink-0 mt-0.5" />
              <a
                href="mailto:edificepropertiesltd@gmail.com"
                className="hover:text-white transition-colors break-all"
              >
                edificepropertiesltd@gmail.com
              </a>
            </li>
          </ul>
        </div>

      </div>

      {/* Copyright Bar */}
      <div className="max-w-7xl mx-auto px-6 border-t border-white/5 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-white/30">
        <p>
          &copy; {currentYear} Edifice Properties Ltd. All rights reserved.
        </p>
        <div className="flex gap-6">
          <Link href="/privacy" className="hover:text-white transition-colors">
            Privacy Policy
          </Link>
          <Link href="/terms" className="hover:text-white transition-colors">
            Terms & Conditions
          </Link>
        </div>
      </div>
    </footer>
  );
}
