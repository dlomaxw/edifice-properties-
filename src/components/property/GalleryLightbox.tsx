'use client';

import { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight, Eye } from 'lucide-react';

interface GalleryLightboxProps {
  images: string[];
}

export default function GalleryLightbox({ images }: GalleryLightboxProps) {
  const [index, setIndex] = useState<number | null>(null);

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (index !== null) {
      setIndex((prev) => (prev! + 1) % images.length);
    }
  };

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (index !== null) {
      setIndex((prev) => (prev! - 1 + images.length) % images.length);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h3 className="font-heading text-2xl font-bold tracking-tight text-[#0a192f]">
          Interior & Exterior Gallery
        </h3>
        <p className="text-zinc-500 text-sm">
          Click on any photo to open the interactive lightbox and explore finishing details.
        </p>
      </div>

      {/* Grid Layout */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {images.map((img, idx) => (
          <div
            key={img}
            onClick={() => setIndex(idx)}
            className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-zinc-900 border border-black/5 dark:border-white/5 cursor-pointer reveal-zoom group shadow-md"
          >
            <Image
              src={img}
              alt={`Property gallery slide ${idx + 1}`}
              fill
              className="object-cover"
              sizes="(max-w-768px) 50vw, (max-w-1024px) 33vw, 25vw"
            />
            {/* Hover overlay */}
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
              <div className="w-10 h-10 rounded-full bg-white text-[#0a192f] flex items-center justify-center shadow-lg">
                <Eye size={16} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Full-screen Lightbox */}
      <AnimatePresence>
        {index !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex items-center justify-center p-4 md:p-8"
            onClick={() => setIndex(null)}
          >
            {/* Close Button */}
            <button
              onClick={() => setIndex(null)}
              className="absolute top-6 right-6 text-white/70 hover:text-white hover:rotate-90 transition-all duration-300 p-2 z-50 cursor-pointer"
            >
              <X size={28} />
            </button>

            {/* Navigation Arrows */}
            <button
              onClick={handlePrev}
              className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors z-50 cursor-pointer"
            >
              <ChevronLeft size={24} />
            </button>
            <button
              onClick={handleNext}
              className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors z-50 cursor-pointer"
            >
              <ChevronRight size={24} />
            </button>

            {/* Image Wrapper */}
            <motion.div
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
              className="relative w-full max-w-5xl aspect-[4/3] rounded-2xl overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={images[index]}
                alt={`Property gallery slide ${index + 1}`}
                fill
                className="object-contain"
                sizes="100vw"
                priority
              />
              {/* Image counter indicator */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white/70 text-xs bg-black/60 px-4 py-1.5 rounded-full font-semibold">
                {index + 1} / {images.length}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
