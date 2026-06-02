'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { MapPin, Maximize, Bed, MessageSquare, ArrowRight } from 'lucide-react';

interface Property {
  id: string;
  name: string;
  slug: string;
  location: string;
  description: string;
  startingPrice: number;
  currency: string;
  status: string;
  type: string;
  bedrooms: string;
  sizeRange: string;
  mainImage: string;
}

interface PropertySliderProps {
  properties: Property[];
}

export default function PropertySlider({ properties }: PropertySliderProps) {
  const [filter, setFilter] = useState('All');

  const locations = ['All', ...Array.from(new Set(properties.map((p) => p.location.split(',').pop()?.trim() || p.location)))];

  const filteredProperties = properties.filter((p) => {
    if (filter === 'All') return true;
    return p.location.toLowerCase().includes(filter.toLowerCase());
  });

  const formatPrice = (price: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      maximumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div className="flex flex-col gap-12">
      {/* Filters Bar */}
      <div className="flex flex-wrap items-center justify-between gap-6 border-b border-black/5 dark:border-white/5 pb-6">
        <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0">
          {locations.map((loc) => (
            <button
              key={loc}
              onClick={() => setFilter(loc || 'All')}
              className={`px-5 py-2.5 rounded-full text-xs font-semibold uppercase tracking-wider transition-all whitespace-nowrap ${
                filter === loc
                  ? 'bg-[#dfc28c] text-[#020c1b] shadow-md'
                  : 'bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 text-current'
              }`}
            >
              {loc}
            </button>
          ))}
        </div>
        <Link
          href="/properties"
          className="group flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#dfc28c] hover:text-[#d4af37] transition-colors"
        >
          <span>View All Properties</span>
          <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>

      {/* Property Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredProperties.map((prop, idx) => (
          <motion.div
            key={prop.id}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: idx * 0.1 }}
            className="flex flex-col bg-[#0a192f] rounded-3xl overflow-hidden shadow-2xl border border-white/5 group hover:border-[#dfc28c]/30 transition-all duration-300"
          >
            {/* Card Image Wrapper */}
            <div className="relative aspect-[4/3] w-full overflow-hidden bg-zinc-900 reveal-zoom">
              <Image
                src={prop.mainImage}
                alt={prop.name}
                fill
                className="object-cover"
                sizes="(max-w-768px) 100vw, (max-w-1200px) 50vw, 33vw"
              />
              
              {/* Status Badge */}
              <div className="absolute top-4 left-4 z-10">
                <span
                  className={`px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider shadow-md ${
                    prop.status.toLowerCase() === 'sold out'
                      ? 'bg-red-500 text-white'
                      : 'bg-[#dfc28c] text-[#020c1b]'
                  }`}
                >
                  {prop.status}
                </span>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 md:p-8 flex flex-col flex-1 gap-6 text-white">
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-1.5 text-xs text-white/50">
                  <MapPin size={12} className="text-[#dfc28c]" />
                  <span>{prop.location}</span>
                </div>
                <h3 className="font-heading font-bold text-xl md:text-2xl tracking-tight hover:text-[#dfc28c] transition-colors">
                  <Link href={`/properties/${prop.slug}`}>{prop.name}</Link>
                </h3>
              </div>

              <p className="text-sm text-white/60 leading-relaxed line-clamp-2">
                {prop.description}
              </p>

              {/* Specs Grid */}
              <div className="grid grid-cols-2 gap-4 border-y border-white/5 py-4 text-xs text-white/70">
                <div className="flex items-center gap-2">
                  <Bed size={14} className="text-[#dfc28c]" />
                  <span>{prop.bedrooms || 'BHK Options'}</span>
                </div>
                <div className="flex items-center gap-2 justify-end">
                  <Maximize size={14} className="text-[#dfc28c]" />
                  <span>{prop.sizeRange}</span>
                </div>
              </div>

              {/* Pricing & Call-to-actions */}
              <div className="flex items-center justify-between mt-auto">
                <div className="flex flex-col">
                  <span className="text-[10px] uppercase tracking-wider text-white/40">Starting Price</span>
                  <span className="font-heading text-lg md:text-xl font-bold text-[#dfc28c]">
                    {formatPrice(prop.startingPrice, prop.currency)}
                  </span>
                </div>

                <div className="flex gap-2">
                  <a
                    href={`https://wa.me/256786000112?text=Hello%20Edifice%20Properties%2C%20I%20am%20interested%20in%20${encodeURIComponent(prop.name)}.%20Please%20send%20me%20more%20details.`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-full bg-white/5 hover:bg-[#25d366] hover:text-white flex items-center justify-center transition-all border border-white/10"
                    title="Enquire on WhatsApp"
                  >
                    <MessageSquare size={16} />
                  </a>
                  <Link
                    href={`/properties/${prop.slug}`}
                    className="px-5 h-10 bg-white/10 hover:bg-[#dfc28c] hover:text-[#020c1b] rounded-full text-xs font-semibold flex items-center justify-center transition-all"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
