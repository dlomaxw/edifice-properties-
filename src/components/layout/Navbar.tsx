'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ChevronDown, Phone, MessageSquare } from 'lucide-react';

interface PropertyItem {
  name: string;
  href: string;
  image: string;
}

const propertiesList: PropertyItem[] = [
  { name: 'Horizon Residency', href: '/properties/horizon-residency', image: '/assets/images/horizon.png' },
  { name: 'Embassy Towers', href: '/properties/embassy-towers', image: '/assets/images/embassy.webp' },
  { name: 'Elite Palazzo Naguru', href: '/properties/elite-palazzo-naguru', image: '/assets/images/pallazo.webp' },
  { name: 'Atlantic Apartments', href: '/properties/atlantic-apartments', image: '/assets/images/envato-labs-image-edit-64-1.png' },
  { name: 'Urban View Apartments', href: '/properties/urban-view-apartments', image: '/assets/images/urban.webp' },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const pathname = usePathname();
  const [properties, setProperties] = useState<PropertyItem[]>(propertiesList);
  const [settings, setSettings] = useState<any>({});

  // Fetch properties and settings dynamically
  useEffect(() => {
    async function fetchData() {
      try {
        const [propsRes, settingsRes] = await Promise.all([
          fetch('/api/properties'),
          fetch('/api/settings')
        ]);
        if (propsRes.ok) {
          const propsJson = await propsRes.json();
          if (propsJson.success && propsJson.data) {
            const mapped = propsJson.data.map((p: any) => ({
              name: p.name,
              href: `/properties/${p.slug}`,
              image: p.mainImage
            }));
            setProperties(mapped);
          }
        }
        if (settingsRes.ok) {
          const settingsJson = await settingsRes.json();
          if (settingsJson.success && settingsJson.data) {
            setSettings(settingsJson.data);
          }
        }
      } catch (err) {
        console.error('Error fetching navbar data:', err);
      }
    }
    fetchData();
  }, []);

  // Scroll handler
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close menus on page change
  useEffect(() => {
    setIsOpen(false);
    setDropdownOpen(false);
  }, [pathname]);

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Buying Process', href: '/buying-process' },
    { name: 'Homeownership Guide', href: '/homeownership-guide' },
    { name: 'About Us', href: '/about' },
    { name: 'Contact Us', href: '/contact' },
  ];

  return (
    <>
      <header
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
          isScrolled
            ? 'bg-[#0a192f]/95 backdrop-blur-md py-3 border-b border-white/5 shadow-lg'
            : 'bg-transparent py-5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <div className="relative w-48 h-14 md:w-56 md:h-16 transition-all duration-300">
              <img 
                src={settings.site_logo_url || "/assets/images/edifice-logo.svg"} 
                alt="Edifice Properties Logo" 
                className="w-full h-full object-contain filter brightness-110" 
              />
            </div>
          </Link>
 
          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-8">
            <Link
              href="/"
              className={`text-sm font-medium transition-colors hover:text-gold-500 ${
                pathname === '/' ? 'text-gold-500' : 'text-white/80'
              }`}
            >
              Home
            </Link>
 
            {/* Dropdown for Properties */}
            <div
              className="relative"
              onMouseEnter={() => setDropdownOpen(true)}
              onMouseLeave={() => setDropdownOpen(false)}
            >
              <button
                className={`flex items-center gap-1 text-sm font-medium transition-colors hover:text-gold-500 ${
                  pathname.startsWith('/properties') ? 'text-gold-500' : 'text-white/80'
                }`}
              >
                Properties
                <ChevronDown size={14} className={`transition-transform duration-300 ${dropdownOpen ? 'rotate-180' : ''}`} />
              </button>
 
              <AnimatePresence>
                {dropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 15 }}
                    transition={{ duration: 0.2 }}
                    className="absolute left-1/2 -translate-x-[40%] mt-3 w-[820px] bg-white border border-zinc-200 rounded-3xl p-6 shadow-2xl flex flex-col gap-4 text-zinc-800"
                  >
                    {/* Header of Mega Menu */}
                    <div className="flex justify-between items-center border-b border-zinc-100 pb-3 mb-1">
                      <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#0a192f]">
                        Signature Developments
                      </span>
                      <Link 
                        href="/properties"
                        className="text-[10px] font-bold text-[#dfc28c] hover:text-[#0a192f] uppercase tracking-wider flex items-center transition-colors"
                      >
                        All Properties &rarr;
                      </Link>
                    </div>

                    {/* Properties Grid */}
                    <div className="grid grid-cols-5 gap-4">
                      {properties.map((prop) => (
                        <Link
                          key={prop.href}
                          href={prop.href}
                          className="group border border-zinc-100 hover:border-[#dfc28c] hover:shadow-md p-3 rounded-2xl flex flex-col items-center justify-center text-center gap-2.5 transition-all duration-300 bg-white"
                        >
                          <div className="relative w-full aspect-[4/3] rounded-xl overflow-hidden bg-zinc-50 border border-zinc-100">
                            <img
                              src={prop.image}
                              alt={prop.name}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                          </div>
                          <span className="text-[10px] font-black text-[#0a192f] group-hover:text-[#dfc28c] transition-colors uppercase tracking-wider leading-tight">
                            {prop.name}
                          </span>
                        </Link>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
 
            {navLinks.slice(1).map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-sm font-medium transition-colors hover:text-gold-500 ${
                    isActive ? 'text-gold-500' : 'text-white/80'
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </nav>
 
          {/* Desktop Right CTAs */}
          <div className="hidden lg:flex items-center gap-4">
            <a
              href={`https://wa.me/${settings.whatsapp_number || '256786000112'}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm font-medium text-gold-500 hover:text-white transition-colors"
            >
              <MessageSquare size={16} />
              <span>WhatsApp</span>
            </a>
            <Link
              href="/contact?visit=book"
              className="px-5 py-2.5 text-xs font-bold uppercase tracking-wider bg-gold-500 text-[#020c1b] rounded-full hover:bg-white transition-all hover:scale-105 active:scale-95 duration-200"
            >
              Book Site Visit
            </Link>
          </div>
 
          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden text-white/90 hover:text-white transition-colors p-1"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </header>

      {/* Mobile Navigation Drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-0 z-40 bg-[#020c1b] flex flex-col lg:hidden pt-28 px-6 pb-8"
          >
            <div className="flex flex-col gap-6 overflow-y-auto flex-1">
              <Link
                href="/"
                onClick={() => setIsOpen(false)}
                className={`text-xl font-heading font-medium hover:text-gold-500 transition-colors ${
                  pathname === '/' ? 'text-gold-500' : 'text-white'
                }`}
              >
                Home
              </Link>

              {/* Properties Collapsible */}
              <div className="flex flex-col gap-3">
                <span className="text-sm font-semibold uppercase tracking-wider text-white/40">
                  Properties
                </span>
                <Link
                  href="/properties"
                  onClick={() => setIsOpen(false)}
                  className="pl-4 text-lg font-heading text-white/80 hover:text-gold-500"
                >
                  All Developments
                </Link>
                {properties.map((prop) => (
                  <Link
                    key={prop.href}
                    href={prop.href}
                    onClick={() => setIsOpen(false)}
                    className="pl-4 text-lg font-heading text-white/80 hover:text-gold-500 transition-colors"
                  >
                    {prop.name}
                  </Link>
                ))}
              </div>

              <div className="flex flex-col gap-4 border-t border-white/10 pt-6">
                <span className="text-sm font-semibold uppercase tracking-wider text-white/40">
                  Quick Links
                </span>
                {navLinks.slice(1).map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setIsOpen(false)}
                    className={`text-lg font-heading hover:text-gold-500 transition-colors ${
                      pathname === link.href ? 'text-gold-500' : 'text-white'
                    }`}
                  >
                    {link.name}
                  </Link>
                ))}
              </div>
            </div>

            {/* Mobile Drawer CTAs */}
            <div className="flex flex-col gap-3 pt-6 border-t border-white/10">
              <a
                href={`tel:${(settings.phone_primary || '+256786000112').replace(/\s+/g, '')}`}
                className="w-full py-3 flex items-center justify-center gap-2 border border-white/10 rounded-full text-white font-medium hover:bg-white/5 transition-colors"
              >
                <Phone size={18} />
                <span>Call Sales</span>
              </a>
              <Link
                href="/contact?visit=book"
                onClick={() => setIsOpen(false)}
                className="w-full py-3 flex items-center justify-center bg-gold-500 text-[#020c1b] rounded-full font-bold uppercase tracking-wider text-xs hover:bg-white transition-colors"
              >
                Book Site Visit
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
