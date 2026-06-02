'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, Calendar, ChevronRight } from 'lucide-react';

const heroSlides = [
  {
    image: '/assets/images/horizon.png',
    title: 'Redefining Urban Living Through Premium Residences',
    subtitle: 'THE HORIZON RESIDENCY',
    location: 'Luthuli Avenue, Bugolobi',
    price: 'Starting from $92,000',
    link: '/properties/horizon-residency',
  },
  {
    image: '/assets/images/embassy.webp',
    title: 'Sophisticated High-Rise Suites in Kampala',
    subtitle: 'EMBASSY TOWERS',
    location: 'Kampala Road, Kampala',
    price: 'Starting from $68,000',
    link: '/properties/embassy-towers',
  },
  {
    image: '/assets/images/pallazo.webp',
    title: 'Modern Elegance Meets City Connectivity',
    subtitle: 'ELITE PALAZZO',
    location: 'Naguru, Kampala',
    price: 'Starting from $120,000',
    link: '/properties/elite-palazzo-naguru',
  },
  {
    image: '/assets/images/envato-labs-image-edit-64-1.png',
    title: 'A Design-Led Sanctuary Close to Everything',
    subtitle: 'ATLANTIC HEIGHTS',
    location: 'Kampala',
    price: 'Starting from $97,000',
    link: '/properties/atlantic-apartments',
  },
];

export default function HeroSlider() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % heroSlides.length);
    }, 6500);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative h-[100dvh] w-full overflow-hidden bg-[#020c1b]">
      {/* Background Slideshow with Cinematic Ken Burns Effect */}
      <AnimatePresence mode="popLayout">
        <motion.div
          key={current}
          initial={{ opacity: 0, scale: 1.0 }}
          animate={{ opacity: 1, scale: 1.15 }}
          exit={{ opacity: 0, scale: 1.18 }}
          transition={{
            opacity: { duration: 1.2, ease: "easeOut" },
            scale: { duration: 7.0, ease: "easeOut" }
          }}
          className="absolute inset-0 w-full h-full bg-cover bg-center"
          style={{ backgroundImage: `url(${heroSlides[current].image})` }}
        >
          {/* Deep Navy Architectural Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#020c1b] via-[#0a192f]/50 to-[#020c1b]/70" />
        </motion.div>
      </AnimatePresence>

      {/* Hero Content */}
      <div className="absolute inset-0 flex flex-col justify-center px-6 md:px-12 lg:px-24">
        <div className="max-w-4xl">
          {/* Subtitle / Project Name */}
          <div className="overflow-hidden mb-4">
            <motion.span
              key={`subtitle-${current}`}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
              className="text-xs md:text-sm font-bold tracking-[0.25em] text-gold-500 uppercase block"
            >
              {heroSlides[current].subtitle} • {heroSlides[current].location}
            </motion.span>
          </div>

          {/* Headline */}
          <div className="overflow-hidden mb-6">
            <motion.h1
              key={`title-${current}`}
              initial={{ opacity: 0, y: 60 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
              className="text-4xl md:text-6xl lg:text-7xl font-heading font-bold text-white tracking-tight leading-[1.1]"
            >
              {heroSlides[current].title}
            </motion.h1>
          </div>

          {/* Pricing Highlight */}
          <div className="overflow-hidden mb-10">
            <motion.p
              key={`price-${current}`}
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 0.8, y: 0 }}
              transition={{ delay: 0.6, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
              className="text-lg md:text-xl text-white font-medium font-sans"
            >
              {heroSlides[current].price}
            </motion.p>
          </div>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-wrap gap-4"
          >
            <Link
              href={heroSlides[current].link}
              className="px-8 py-4 bg-gold-500 text-[#020c1b] rounded-full hover:bg-white transition-all font-bold uppercase tracking-wider text-xs flex items-center gap-2 hover:scale-105 duration-200 shadow-lg"
            >
              <span>Explore Property</span>
              <ChevronRight size={16} />
            </Link>
            <Link
              href="/contact?visit=book"
              className="px-8 py-4 border border-white/20 hover:border-white text-white rounded-full bg-white/5 backdrop-blur-sm transition-all font-bold uppercase tracking-wider text-xs flex items-center gap-2 hover:scale-105 duration-200"
            >
              <Calendar size={16} className="text-gold-500" />
              <span>Book Site Visit</span>
            </Link>
            <a
              href="https://wa.me/256786000112"
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-4 border border-[#25d366]/30 hover:border-[#25d366] text-white rounded-full bg-[#25d366]/10 backdrop-blur-sm transition-all font-bold uppercase tracking-wider text-xs flex items-center gap-2 hover:scale-105 duration-200"
            >
              <MessageSquare size={16} className="text-[#25d366]" />
              <span>Talk to Sales</span>
            </a>
          </motion.div>
        </div>
      </div>

      {/* Floating Counter / Highlight Overlay */}
      <div className="absolute right-6 bottom-24 lg:right-24 lg:bottom-16 hidden md:block">
        <div className="flex gap-12 bg-[#020c1b]/70 backdrop-blur-md px-8 py-6 rounded-2xl border border-white/10 shadow-2xl">
          <div className="text-center border-r border-white/10 pr-12">
            <span className="block font-heading text-3xl font-bold text-white">10+</span>
            <span className="text-xs text-white/50 uppercase tracking-widest mt-1 block">Years Experience</span>
          </div>
          <div className="text-center border-r border-white/10 pr-12">
            <span className="block font-heading text-3xl font-bold text-gold-500">50+</span>
            <span className="text-xs text-white/50 uppercase tracking-widest mt-1 block">Happy Clients</span>
          </div>
          <div className="text-center">
            <span className="block font-heading text-3xl font-bold text-white">100%</span>
            <span className="text-xs text-white/50 uppercase tracking-widest mt-1 block">Clear Titles</span>
          </div>
        </div>
      </div>

      {/* Slide Indicators */}
      <div className="absolute left-6 bottom-24 lg:left-24 lg:bottom-16 flex gap-3">
        {heroSlides.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrent(idx)}
            className={`h-1.5 transition-all duration-300 rounded-full ${
              idx === current ? 'w-8 bg-gold-500' : 'w-2 bg-white/40'
            }`}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>

      {/* Scroll Down Indicator */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
        <span className="text-[10px] uppercase tracking-[0.3em] text-white/40">Scroll Down</span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
          className="w-1 h-3 bg-gold-500 rounded-full"
        />
      </div>
    </div>
  );
}
