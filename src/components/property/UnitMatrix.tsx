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
      if (bedrooms === 1) return 'https://youtu.be/HhMveJnD3wA';
      if (bedrooms === 2) return 'https://youtu.be/5SdItw9WkAE';
      if (bedrooms === 3) return 'https://youtu.be/OCJAkqtJutA';
    }

    if (pName.includes('atlantic')) {
      return 'https://youtu.be/kqrNYOfY-N8';
    }

    if (pName.includes('signature')) {
      return 'https://youtu.be/Eact7djAeQc';
    }

    if (pName.includes('urban')) {
      if (bedrooms === 3) return 'https://youtu.be/_YhgBQ4Ijns';
      return 'https://youtu.be/fH7uAJ0OZ6I';
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
        {units.map((unit) => (
          <UnitCard
            key={unit.id}
            unit={unit}
            propertyName={propertyName}
            currency={currency}
            formatPrice={formatPrice}
            getUnitVideoUrl={getUnitVideoUrl}
            getYouTubeId={getYouTubeId}
            onSelectFloorPlan={setSelectedFloorPlan}
          />
        ))}
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

interface UnitCardProps {
  unit: any;
  propertyName: string;
  currency: string;
  formatPrice: (price: number, curr: string) => string;
  getUnitVideoUrl: (name: string, bedrooms: number) => string | null;
  getYouTubeId: (url: string) => string | null;
  onSelectFloorPlan: (url: string) => void;
}

function UnitCard({
  unit,
  propertyName,
  currency,
  formatPrice,
  getUnitVideoUrl,
  getYouTubeId,
  onSelectFloorPlan,
}: UnitCardProps) {
  const videoUrl = getUnitVideoUrl(unit.name, unit.bedrooms);
  const videoId = videoUrl ? getYouTubeId(videoUrl) : null;

  // Default to video if available, otherwise floorplan
  const [activeTab, setActiveTab] = useState<'video' | 'floorplan'>(videoUrl ? 'video' : 'floorplan');
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <div className="flex flex-col lg:flex-row bg-[#0b192e] rounded-3xl p-6 md:p-8 border border-white/5 shadow-xl text-white gap-6">
      {/* 1. Left - Specs (35% width on desktop) */}
      <div className="w-full lg:w-[35%] flex flex-col justify-between gap-6">
        <div className="flex flex-col gap-3">
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
          <p className="text-xs md:text-sm text-white/60 leading-relaxed">
            {unit.description}
          </p>
        </div>

        {/* Specs Icons */}
        <div className="flex flex-wrap gap-4 text-xs text-white/50 border-t border-white/5 pt-4">
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

      {/* 2. Middle - Interactive Preview Area (40% width on desktop) */}
      <div 
        className="w-full lg:w-[40%] min-h-[220px] bg-zinc-950/40 rounded-2xl border border-white/5 overflow-hidden relative flex items-center justify-center group cursor-pointer"
        onDoubleClick={() => onSelectFloorPlan(unit.floorPlanImage)}
      >
        {activeTab === 'video' && videoId && (
          <div className="absolute inset-0 w-full h-full">
            {isPlaying ? (
              <iframe
                src={`https://www.youtube.com/embed/${videoId}?autoplay=1&mute=0`}
                title="Layout Video Tour"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="absolute inset-0 w-full h-full border-0"
              />
            ) : (
              <div 
                className="absolute inset-0 w-full h-full cursor-pointer"
                onClick={() => setIsPlaying(true)}
              >
                <Image
                  src={`https://img.youtube.com/vi/${videoId}/hqdefault.jpg`}
                  alt={`Walkthrough Video Tour for ${unit.name}`}
                  fill
                  className="object-cover brightness-[0.7] group-hover:scale-105 transition-transform duration-500"
                  unoptimized
                />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-14 h-14 rounded-full bg-[#dfc28c] hover:bg-white text-[#020c1b] flex items-center justify-center shadow-lg transition-transform group-hover:scale-110 duration-300">
                  <Play size={20} className="fill-current ml-1" />
                </div>
                <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full text-[10px] text-white font-medium flex items-center gap-1.5 border border-white/10">
                  <Play size={10} className="fill-current text-[#dfc28c]" />
                  <span>Click to Play Video Tour</span>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'floorplan' && (
          <div 
            className="absolute inset-0 w-full h-full bg-white p-4 flex items-center justify-center"
            onClick={() => onSelectFloorPlan(unit.floorPlanImage)}
          >
            <div className="relative w-full h-full">
              <Image
                src={unit.floorPlanImage}
                alt={`Floor Plan Layout Drawing for ${unit.name}`}
                fill
                className="object-contain"
                sizes="(max-w-1024px) 100vw, 40vw"
              />
            </div>
            <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full text-[10px] text-white font-medium flex items-center gap-1.5 border border-white/10 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity">
              <Maximize size={10} className="text-[#dfc28c]" />
              <span>Click to Zoom</span>
            </div>
          </div>
        )}
      </div>

      {/* 3. Right - Pricing & CTAs (25% width on desktop) */}
      <div className="w-full lg:w-[25%] flex flex-col justify-between items-start lg:items-end gap-6 lg:border-l border-white/5 lg:pl-6">
        <div className="flex flex-col lg:text-right">
          <span className="text-[10px] uppercase tracking-wider text-white/40">Unit Pricing</span>
          <span className="font-heading text-2xl font-bold text-[#dfc28c]">
            {formatPrice(unit.price, currency)}
          </span>
        </div>

        <div className="flex flex-col gap-2 w-full">
          {videoUrl && (
            <button
              onClick={() => {
                setActiveTab('video');
                setIsPlaying(true);
              }}
              className={`w-full px-5 h-11 border rounded-full text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                activeTab === 'video'
                  ? 'border-[#dfc28c] bg-[#dfc28c]/20 text-[#dfc28c]'
                  : 'border-white/10 bg-white/5 hover:bg-white/10 text-white'
              }`}
            >
              <Play size={14} className="fill-current" />
              <span>Watch Video</span>
            </button>
          )}
          <button
            onClick={() => {
              setActiveTab('floorplan');
              setIsPlaying(false);
            }}
            className={`w-full px-5 h-11 border rounded-full text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer ${
              activeTab === 'floorplan'
                ? 'border-[#dfc28c] bg-[#dfc28c]/20 text-[#dfc28c]'
                : 'border-white/10 bg-white/5 hover:bg-white/10 text-white'
            }`}
          >
            <Eye size={14} className={activeTab === 'floorplan' ? 'text-[#dfc28c]' : 'text-white/70'} />
            <span>Floor Plan</span>
          </button>
          <a
            href={unit.floorPlanImage}
            download={unit.floorPlanImage.split('/').pop()}
            className="w-full px-5 h-11 border border-white/10 hover:border-[#dfc28c] rounded-full text-xs font-semibold flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 transition-all cursor-pointer"
          >
            <Download size={14} className="text-[#dfc28c]" />
            <span>Download Plan</span>
          </a>
          <a
            href={`https://wa.me/256786000112?text=Hello%20Edifice%20Properties%2C%20I%20am%20interested%20in%20${encodeURIComponent(propertyName)}%20-${encodeURIComponent(unit.name)}.%20Please%20send%20me%20pricing%20and%20payment%20details.`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full px-5 h-11 bg-[#dfc28c] text-[#020c1b] hover:bg-white rounded-full text-xs font-bold flex items-center justify-center gap-2 transition-all"
          >
            <MessageSquare size={14} />
            <span>Enquire</span>
          </a>
        </div>
      </div>
    </div>
  );
}
