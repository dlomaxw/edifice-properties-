'use client';

import { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, X, Compass, ChevronLeft, ChevronRight, Download, Layers, Sparkles } from 'lucide-react';

interface ImageItem {
  id?: string;
  url: string;
  category: string;
  label: string;
  description: string;
}

interface PropertyGalleriesProps {
  images: ImageItem[];
}

export default function PropertyGalleries({ images = [] }: PropertyGalleriesProps) {
  // Filter categories
  const interiorImages = images.filter((img) => img.category === 'interior');
  const floorplanImages = images.filter((img) => img.category === 'floorplan');

  // Lightbox State (for Interior Gallery)
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  // Active Floor Plan State
  const [activePlanIndex, setActivePlanIndex] = useState(0);

  // Navigation for lightbox
  const nextLightbox = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (lightboxIndex !== null && interiorImages.length > 0) {
      setLightboxIndex((lightboxIndex + 1) % interiorImages.length);
    }
  };

  const prevLightbox = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (lightboxIndex !== null && interiorImages.length > 0) {
      setLightboxIndex((lightboxIndex - 1 + interiorImages.length) % interiorImages.length);
    }
  };

  if (interiorImages.length === 0 && floorplanImages.length === 0) return null;

  return (
    <div className="flex flex-col gap-20 w-full mt-12">
      {/* 1. Luxury Interior Gallery Section */}
      {interiorImages.length > 0 && (
        <div className="flex flex-col gap-8 w-full border-t border-zinc-100 pt-16">
          <div className="flex flex-col gap-2">
            <h3 className="font-heading text-3xl font-bold tracking-tight text-[#0a192f] flex items-center gap-3">
              <Sparkles className="text-[#dfc28c]" size={28} />
              Bespoke Interior Design
            </h3>
            <p className="text-zinc-600 text-sm max-w-2xl">
              Step inside our luxury layouts. Every room features premium materials, custom palettes, and sophisticated modern detailing.
            </p>
          </div>

          {/* Gallery Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {interiorImages.map((img, idx) => (
              <motion.div
                key={idx}
                whileHover={{ y: -6 }}
                className="group relative cursor-pointer overflow-hidden rounded-3xl aspect-[4/3] border border-black/5 bg-[#0a192f] shadow-lg hover:shadow-2xl transition-all duration-300"
                onClick={() => setLightboxIndex(idx)}
              >
                {/* Image */}
                <Image
                  src={img.url}
                  alt={img.label}
                  fill
                  sizes="(max-w-768px) 100vw, (max-w-1024px) 50vw, 33vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-700 filter contrast-[1.02]"
                />
                
                {/* Dark Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent opacity-60 group-hover:opacity-85 transition-opacity duration-300" />

                {/* Info Overlay */}
                <div className="absolute inset-x-0 bottom-0 p-6 flex flex-col justify-end text-white translate-y-3 group-hover:translate-y-0 transition-transform duration-300">
                  <span className="text-[9px] font-bold text-[#dfc28c] uppercase tracking-widest mb-1.5 flex items-center gap-1">
                    <Compass size={10} />
                    Interior Showcase
                  </span>
                  <h4 className="font-heading text-lg font-bold truncate leading-snug">
                    {img.label}
                  </h4>
                  <p className="text-white/60 text-[11px] leading-relaxed mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 line-clamp-2">
                    {img.description}
                  </p>
                </div>

                {/* Hover Play/Zoom icon */}
                <div className="absolute top-6 right-6 w-10 h-10 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow-md">
                  <Eye size={18} />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* 2. Precision Floor Plans Section */}
      {floorplanImages.length > 0 && (
        <div className="flex flex-col gap-8 w-full border-t border-zinc-100 pt-16">
          <div className="flex flex-col gap-2">
            <h3 className="font-heading text-3xl font-bold tracking-tight text-[#0a192f] flex items-center gap-3">
              <Layers className="text-[#dfc28c]" size={28} />
              Floor Plans & Layout Specifications
            </h3>
            <p className="text-zinc-600 text-sm max-w-2xl">
              Study the dimensions and layout routing maps. Click the tabs below to switch floor plan models and download high-resolution blueprints.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start mt-4">
            {/* Left side: Tab selectors & Description */}
            <div className="lg:col-span-4 flex flex-col gap-6">
              <div className="flex flex-col gap-2 bg-[#020c1b]/5 p-3 rounded-3xl border border-black/5">
                {floorplanImages.map((plan, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActivePlanIndex(idx)}
                    className={`px-6 py-4 rounded-2xl text-xs font-bold uppercase tracking-wider text-left transition-all duration-200 cursor-pointer flex items-center justify-between ${
                      idx === activePlanIndex
                        ? 'bg-[#0a192f] text-[#dfc28c] shadow-lg scale-[1.02]'
                        : 'text-zinc-500 hover:text-zinc-800 hover:bg-black/5'
                    }`}
                  >
                    <span>{plan.label}</span>
                    {idx === activePlanIndex && <ChevronRight size={14} />}
                  </button>
                ))}
              </div>

              {/* Active description panel */}
              {floorplanImages[activePlanIndex] && (
                <div className="bg-zinc-50 p-6 md:p-8 rounded-3xl border border-black/5 flex flex-col gap-4">
                  <span className="text-[10px] uppercase tracking-widest text-[#dfc28c] font-bold">
                    Specifications
                  </span>
                  <h4 className="font-heading text-xl font-bold text-[#0a192f]">
                    {floorplanImages[activePlanIndex].label}
                  </h4>
                  <p className="text-zinc-600 text-xs md:text-sm leading-relaxed">
                    {floorplanImages[activePlanIndex].description}
                  </p>
                  
                  {/* Download Button */}
                  <a
                    href={floorplanImages[activePlanIndex].url}
                    download
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 px-6 py-4 bg-gold-500 hover:bg-[#0a192f] hover:text-white text-[#020c1b] rounded-full transition-all duration-200 font-bold uppercase tracking-wider text-xs flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
                  >
                    <Download size={14} />
                    <span>Download Blueprint</span>
                  </a>
                </div>
              )}
            </div>

            {/* Right side: Canvas display window */}
            <div className="lg:col-span-8 bg-white border border-[#dfc28c]/20 p-6 md:p-12 rounded-[2.5rem] shadow-xl flex items-center justify-center relative aspect-[4/3] w-full overflow-hidden group">
              {floorplanImages[activePlanIndex] && (
                <Image
                  src={floorplanImages[activePlanIndex].url}
                  alt={floorplanImages[activePlanIndex].label}
                  fill
                  priority
                  sizes="(max-w-1024px) 100vw, 60vw"
                  className="object-contain p-2 md:p-8 transition-transform duration-500 group-hover:scale-[1.02]"
                />
              )}
            </div>
          </div>
        </div>
      )}

      {/* Fullscreen Lightbox Overlay */}
      <AnimatePresence>
        {lightboxIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex items-center justify-center p-4 md:p-8"
            onClick={() => setLightboxIndex(null)}
          >
            {/* Close Button */}
            <button
              onClick={() => setLightboxIndex(null)}
              className="absolute top-6 right-6 text-white/70 hover:text-white hover:rotate-90 transition-all duration-300 p-2 z-50 cursor-pointer"
            >
              <X size={28} />
            </button>

            {/* Previous slide control */}
            {interiorImages.length > 1 && (
              <button
                onClick={prevLightbox}
                className="absolute left-6 w-14 h-14 rounded-full bg-white/5 border border-white/10 hover:bg-white/15 text-white flex items-center justify-center transition-all z-50 cursor-pointer"
              >
                <ChevronLeft size={24} />
              </button>
            )}

            {/* Video/Image Container */}
            <motion.div
              initial={{ scale: 0.92, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.92, y: 15 }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="relative w-full max-w-5xl aspect-[4/3] bg-zinc-950 rounded-2xl overflow-hidden shadow-2xl flex items-center justify-center"
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={interiorImages[lightboxIndex].url}
                alt={interiorImages[lightboxIndex].label}
                fill
                sizes="100vw"
                className="object-contain p-4 bg-zinc-950"
              />

              {/* Title / Description Bar */}
              <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black via-black/80 to-transparent p-6 text-white text-center">
                <span className="text-[9px] uppercase tracking-widest text-[#dfc28c] font-bold block mb-1">
                  Interior Design
                </span>
                <h4 className="font-heading text-lg font-bold">
                  {interiorImages[lightboxIndex].label}
                </h4>
                <p className="text-white/60 text-xs mt-2 max-w-xl mx-auto hidden md:block">
                  {interiorImages[lightboxIndex].description}
                </p>
              </div>
            </motion.div>

            {/* Next slide control */}
            {interiorImages.length > 1 && (
              <button
                onClick={nextLightbox}
                className="absolute right-6 w-14 h-14 rounded-full bg-white/5 border border-white/10 hover:bg-white/15 text-white flex items-center justify-center transition-all z-50 cursor-pointer"
              >
                <ChevronRight size={24} />
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
