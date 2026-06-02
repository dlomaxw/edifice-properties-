'use client';

import { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, X } from 'lucide-react';

interface VideoModalProps {
  videoUrl: string;
  thumbnail: string;
  title: string;
}

export default function VideoModal({ videoUrl, thumbnail, title }: VideoModalProps) {
  const [isOpen, setIsOpen] = useState(false);

  // Extract YouTube ID from link
  const getYouTubeId = (url: string) => {
    if (!url) return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? match[2] : null;
  };

  const videoId = getYouTubeId(videoUrl);
  const isYouTube = !!videoId;
  const embedUrl = isYouTube ? `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=0` : '';

  return (
    <>
      <div className="relative group cursor-pointer overflow-hidden rounded-3xl aspect-[16/9] border border-white/5 shadow-2xl" onClick={() => setIsOpen(true)}>
        {/* Thumbnail */}
        <Image
          src={thumbnail}
          alt={title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-700"
          sizes="(max-w-1024px) 100vw, 80vw"
        />
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-colors duration-300" />
        
        {/* Play Button Overlay */}
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.div
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="w-20 h-20 rounded-full bg-[#dfc28c] text-[#020c1b] flex items-center justify-center shadow-2xl transition-colors group-hover:bg-white group-hover:text-[#020c1b]"
          >
            <Play size={28} className="fill-current ml-1" />
          </motion.div>
        </div>

        {/* Video Title Indicator */}
        <div className="absolute bottom-6 left-6 right-6 text-white text-lg font-heading font-semibold text-center drop-shadow-md">
          {title}
        </div>
      </div>

      {/* Video Modal Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex items-center justify-center p-4 md:p-8"
            onClick={() => setIsOpen(false)}
          >
            {/* Close Button */}
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-6 right-6 text-white/70 hover:text-white hover:rotate-90 transition-all duration-300 p-2 z-50 cursor-pointer"
            >
              <X size={28} />
            </button>

            {/* Video Container */}
            <motion.div
              initial={{ scale: 0.9, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 15 }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="relative w-full max-w-5xl aspect-[16/9] bg-zinc-900 rounded-2xl overflow-hidden shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              {isYouTube ? (
                <iframe
                  src={embedUrl}
                  title={title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="absolute inset-0 w-full h-full border-0"
                />
              ) : (
                <video
                  src={videoUrl}
                  controls
                  autoPlay
                  className="absolute inset-0 w-full h-full object-cover"
                />
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
