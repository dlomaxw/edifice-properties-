'use client';

import { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Maximize, Bed, Bath, MessageSquare, Eye, Play, X, Download } from 'lucide-react';

interface Unit {
  id: string;
  name: string;
  price: number;
  size: string;
  bedrooms: number;
  bathrooms: number;
  status: string;
  description: string;
  floorPlanImage: string;
}

interface UnitMatrixProps {
  propertyName: string;
  units: Unit[];
  currency: string;
}

export default function UnitMatrix({ propertyName, units, currency }: UnitMatrixProps) {
  const [selectedFloorPlan, setSelectedFloorPlan] = useState<string | null>(null);
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);

  const getYouTubeId = (url: string) => {
    if (!url) return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? match[2] : null;
  };

  const getUnitVideoUrl = (name: string, bedrooms: number) => {
    const pName = propertyName.toLowerCase();
    
    if (pName.includes('embassy')) {
      if (bedrooms === 1) return 'https://youtu.be/cintZUdWXYY';
      if (bedrooms === 2) return 'https://youtu.be/xJhXa_Nsl_I';
      if (bedrooms === 3) return 'https://youtu.be/yHbu_nVRwrs';
    }

    if (pName.includes('palazzo') || pName.includes('elite')) {
      if (bedrooms === 2) return 'https://youtu.be/n3lhXEN9_Hs';
      if (bedrooms === 3) return 'https://youtu.be/M4xHnToEWbI';
      return 'https://youtu.be/gz3IQbBVr9Q';
    }

    if (pName.includes('horizon')) {
      return 'https://youtu.be/k3A4DfR2z1o';
    }

    if (pName.includes('atlantic')) {
      return 'https://youtu.be/k3A4DfR2z1o';
    }

    if (pName.includes('urban')) {
      return 'https://youtu.be/2DYu1--DbgM';
    }

    return null;
  };

  const formatPrice = (price: number, curr: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: curr,
      maximumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h3 className="font-heading text-2xl font-bold tracking-tight text-[#0a192f]">
          Available Units & Floor Plans
        </h3>
        <p className="text-zinc-500 text-sm">
          Select a layout to view detailed specifications, sizing, and architectural floor plans.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {units.map((unit) => {
          const videoUrl = getUnitVideoUrl(unit.name, unit.bedrooms);
          return (
            <div
              key={unit.id}
              className="flex flex-col lg:flex-row bg-[#0a192f] rounded-3xl p-6 md:p-8 border border-white/5 shadow-xl text-white justify-between gap-6"
            >
              {/* Left - Specs */}
              <div className="flex-1 flex flex-col gap-4">
                <div className="flex flex-wrap items-center gap-3">
                  <h4 className="font-heading font-bold text-xl md:text-2xl text-[#dfc28c]">
                    {unit.name}
                  </h4>
                  <span
                    className={`px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-wider ${
                      unit.status.toLowerCase() === 'sold out'
                        ? 'bg-red-500 text-white'
                        : 'bg-[#dfc28c] text-[#020c1b]'
                    }`}
                  >
                    {unit.status}
                  </span>
                </div>

                <p className="text-sm text-white/60 leading-relaxed max-w-2xl">
                  {unit.description}
                </p>

                {/* Specs Icons */}
                <div className="flex flex-wrap gap-6 text-xs text-white/50 border-t border-white/5 pt-4">
                  <div className="flex items-center gap-2">
                    <Bed size={14} className="text-[#dfc28c]" />
                    <span>{unit.bedrooms} Bedroom{unit.bedrooms > 1 ? 's' : ''}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Bath size={14} className="text-[#dfc28c]" />
                    <span>{unit.bathrooms} Bathroom{unit.bathrooms > 1 ? 's' : ''}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Maximize size={14} className="text-[#dfc28c]" />
                    <span>{unit.size}</span>
                  </div>
                </div>
              </div>

              {/* Right - Pricing & CTAs */}
              <div className="flex flex-col justify-between items-start lg:items-end gap-6 shrink-0 lg:border-l border-white/5 lg:pl-8">
                <div className="flex flex-col lg:text-right">
                  <span className="text-[10px] uppercase tracking-wider text-white/40">Unit Pricing</span>
                  <span className="font-heading text-2xl font-bold text-[#dfc28c]">
                    {formatPrice(unit.price, currency)}
                  </span>
                </div>

                <div className="flex flex-wrap gap-2 w-full lg:w-auto">
                  {videoUrl && (
                    <button
                      onClick={() => setSelectedVideo(videoUrl)}
                      className="flex-1 lg:flex-initial px-5 h-11 border border-[#dfc28c]/25 hover:border-[#dfc28c] rounded-full text-xs font-semibold flex items-center justify-center gap-2 bg-[#dfc28c]/10 hover:bg-[#dfc28c]/25 text-[#dfc28c] transition-all cursor-pointer"
                    >
                      <Play size={14} className="fill-current" />
                      <span>Watch Video</span>
                    </button>
                  )}
                  <button
                    onClick={() => setSelectedFloorPlan(unit.floorPlanImage)}
                    className="flex-1 lg:flex-initial px-5 h-11 border border-white/10 hover:border-[#dfc28c] rounded-full text-xs font-semibold flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 transition-all cursor-pointer"
                  >
                    <Eye size={14} className="text-[#dfc28c]" />
                    <span>Floor Plan</span>
                  </button>
                  <a
                    href={unit.floorPlanImage}
                    download={unit.floorPlanImage.split('/').pop()}
                    className="flex-1 lg:flex-initial px-5 h-11 border border-white/10 hover:border-[#dfc28c] rounded-full text-xs font-semibold flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 transition-all cursor-pointer"
                  >
                    <Download size={14} className="text-[#dfc28c]" />
                    <span>Download Plan</span>
                  </a>
                  <a
                    href={`https://wa.me/256786000112?text=Hello%20Edifice%20Properties%2C%20I%20am%20interested%20in%20${encodeURIComponent(propertyName)}%20-${encodeURIComponent(unit.name)}.%20Please%20send%20me%20pricing%20and%20payment%20details.`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 lg:flex-initial px-5 h-11 bg-[#dfc28c] text-[#020c1b] hover:bg-white rounded-full text-xs font-bold flex items-center justify-center gap-2 transition-all"
                  >
                    <MessageSquare size={14} />
                    <span>Enquire</span>
                  </a>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Floor Plan Lightbox */}
      <AnimatePresence>
        {selectedFloorPlan && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex items-center justify-center p-4"
            onClick={() => setSelectedFloorPlan(null)}
          >
            {/* Download Button */}
            <a
              href={selectedFloorPlan}
              download={selectedFloorPlan.split('/').pop()}
              className="absolute top-6 right-20 text-white hover:scale-105 transition-all duration-300 p-2 z-50 cursor-pointer flex items-center gap-2 bg-white/10 hover:bg-white/20 rounded-full px-4 h-11 border border-white/10 hover:border-[#dfc28c] text-xs font-semibold"
              onClick={(e) => e.stopPropagation()}
            >
              <Download size={14} className="text-[#dfc28c]" />
              <span>Download Original</span>
            </a>

            {/* Close Button */}
            <button
              onClick={() => setSelectedFloorPlan(null)}
              className="absolute top-6 right-6 text-white/70 hover:text-white hover:rotate-90 transition-all duration-300 p-2 z-50 cursor-pointer"
            >
              <X size={28} />
            </button>

            {/* Image Container */}
            <motion.div
              initial={{ scale: 0.9, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 15 }}
              className="relative w-full max-w-4xl aspect-[4/3] rounded-2xl overflow-hidden bg-white p-4"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative w-full h-full">
                <Image
                  src={selectedFloorPlan}
                  alt="Architectural Floor Plan Layout"
                  fill
                  className="object-contain"
                  sizes="(max-w-1024px) 100vw, 80vw"
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Video Lightbox */}
      <AnimatePresence>
        {selectedVideo && (() => {
          const videoId = getYouTubeId(selectedVideo);
          const embedUrl = videoId ? `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=0` : '';
          return (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex items-center justify-center p-4"
              onClick={() => setSelectedVideo(null)}
            >
              {/* Close Button */}
              <button
                onClick={() => setSelectedVideo(null)}
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
                {videoId ? (
                  <iframe
                    src={embedUrl}
                    title="Layout Video Tour"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="absolute inset-0 w-full h-full border-0"
                  />
                ) : (
                  <video
                    src={selectedVideo}
                    controls
                    autoPlay
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                )}
              </motion.div>
            </motion.div>
          );
        })()}
      </AnimatePresence>
    </div>
  );
}
