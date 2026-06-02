'use client';

import { Phone, MessageCircle } from 'lucide-react';

export default function StickyCTAs() {
  const whatsappUrl = 'https://wa.me/256786000112?text=Hello%20Edifice%20Properties%2C%20I%20am%20interested%20in%20your%20developments.%20Please%20send%20me%20more%20details.';

  return (
    <>
      {/* Desktop & Mobile Floating WhatsApp Button */}
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed right-6 bottom-6 lg:bottom-8 z-40 bg-[#25d366] text-white p-4 rounded-full shadow-2xl hover:bg-[#128c7e] transition-all hover:scale-110 duration-300 flex items-center justify-center border border-white/10 group"
        aria-label="Chat on WhatsApp"
      >
        <MessageCircle size={24} className="fill-current" />
        <span className="max-w-0 overflow-hidden whitespace-nowrap group-hover:max-w-xs transition-all duration-500 ease-in-out text-sm font-medium pl-0 group-hover:pl-2">
          Chat with us
        </span>
      </a>

      {/* Mobile Only Sticky Bottom Navigation Bar for Direct CTAs */}
      <div className="fixed bottom-0 left-0 w-full z-40 bg-[#020c1b]/95 backdrop-blur-md border-t border-white/5 flex lg:hidden shadow-[0_-4px_24px_rgba(0,0,0,0.4)]">
        <a
          href="tel:+256786000112"
          className="flex-1 py-4 flex items-center justify-center gap-2 text-white font-medium border-r border-white/5 hover:bg-white/5 transition-colors"
        >
          <Phone size={18} className="text-[#dfc28c]" />
          <span className="text-sm">Call Sales</span>
        </a>
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 py-4 flex items-center justify-center gap-2 text-white font-medium hover:bg-white/5 transition-colors"
        >
          <MessageCircle size={18} className="text-[#25d366] fill-[#25d366]/20" />
          <span className="text-sm">WhatsApp</span>
        </a>
      </div>
    </>
  );
}
