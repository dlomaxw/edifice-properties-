'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Bed, Maximize, MessageSquare, Search, SlidersHorizontal, Scale, X, Check } from 'lucide-react';

interface Unit {
  id: string;
  name: string;
  price: number;
  size: string;
  bedrooms: number;
  bathrooms: number;
}

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
  units: Unit[];
}

interface PropertyGridProps {
  properties: Property[];
}

export default function PropertyGrid({ properties }: PropertyGridProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('All');
  const [selectedBhk, setSelectedBhk] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [sortBy, setSortBy] = useState('newest'); // 'newest', 'price-asc', 'price-desc'
  const [showFilters, setShowFilters] = useState(false);
  const [compareList, setCompareList] = useState<Property[]>([]);
  const [showCompareModal, setShowCompareModal] = useState(false);

  // Extract filters lists
  const locations = ['All', ...Array.from(new Set(properties.map((p) => p.location.split(',').pop()?.trim() || p.location)))];
  const statuses = ['All', 'Available', 'Sold out'];
  const bhkOptions = ['All', '1BHK', '2BHK', '3BHK'];

  // Toggle compare list
  const toggleCompare = (property: Property) => {
    if (compareList.some((p) => p.id === property.id)) {
      setCompareList((prev) => prev.filter((p) => p.id !== property.id));
    } else {
      if (compareList.length >= 3) {
        alert('You can compare a maximum of 3 properties at once.');
        return;
      }
      setCompareList((prev) => [...prev, property]);
    }
  };

  // Filtered properties
  const filteredProperties = properties
    .filter((p) => {
      const matchesSearch =
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.description.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesLocation = selectedLocation === 'All' || p.location.toLowerCase().includes(selectedLocation.toLowerCase());
      const matchesStatus = selectedStatus === 'All' || p.status.toLowerCase() === selectedStatus.toLowerCase();
      const matchesBhk = selectedBhk === 'All' || p.bedrooms.toLowerCase().includes(selectedBhk.toLowerCase());

      return matchesSearch && matchesLocation && matchesStatus && matchesBhk;
    })
    .sort((a, b) => {
      if (sortBy === 'price-asc') return a.startingPrice - b.startingPrice;
      if (sortBy === 'price-desc') return b.startingPrice - a.startingPrice;
      return 0; // Default ordering
    });

  const formatPrice = (price: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      maximumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div className="flex flex-col gap-8 relative">
      {/* Search and Filters Toggle */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-center bg-[#0a192f] border border-white/5 p-6 rounded-2xl">
        <div className="relative w-full md:max-w-md">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by property, location, description..."
            className="w-full pl-12 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-sm text-white focus:outline-none focus:border-[#dfc28c] transition-colors"
          />
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" />
        </div>

        <div className="flex w-full md:w-auto gap-3 justify-end">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white text-sm font-semibold transition-colors w-full md:w-auto cursor-pointer"
          >
            <SlidersHorizontal size={16} />
            <span>Filters</span>
          </button>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-5 py-3 rounded-xl bg-[#0a192f] border border-white/10 text-white text-sm font-semibold focus:outline-none transition-colors cursor-pointer"
          >
            <option value="newest">Sort: Default</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
          </select>
        </div>
      </div>

      {/* Advanced Filters Expandable Panel */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden bg-[#020c1b] border border-white/5 p-6 rounded-2xl"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-white">
              <div className="flex flex-col gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-white/40">Location</span>
                <div className="flex flex-wrap gap-2">
                  {locations.map((loc) => (
                    <button
                      key={loc}
                      onClick={() => setSelectedLocation(loc || 'All')}
                      className={`px-4 py-2 rounded-full text-xs font-semibold transition-colors ${
                        selectedLocation === loc
                          ? 'bg-[#dfc28c] text-[#020c1b]'
                          : 'bg-white/5 hover:bg-white/10 border border-white/5'
                      }`}
                    >
                      {loc}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-white/40">Status</span>
                <div className="flex flex-wrap gap-2">
                  {statuses.map((stat) => (
                    <button
                      key={stat}
                      onClick={() => setSelectedStatus(stat)}
                      className={`px-4 py-2 rounded-full text-xs font-semibold transition-colors ${
                        selectedStatus === stat
                          ? 'bg-[#dfc28c] text-[#020c1b]'
                          : 'bg-white/5 hover:bg-white/10 border border-white/5'
                      }`}
                    >
                      {stat}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-white/40">Unit Types</span>
                <div className="flex flex-wrap gap-2">
                  {bhkOptions.map((bhk) => (
                    <button
                      key={bhk}
                      onClick={() => setSelectedBhk(bhk)}
                      className={`px-4 py-2 rounded-full text-xs font-semibold transition-colors ${
                        selectedBhk === bhk
                          ? 'bg-[#dfc28c] text-[#020c1b]'
                          : 'bg-white/5 hover:bg-white/10 border border-white/5'
                      }`}
                    >
                      {bhk}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Compare Floating Button */}
      {compareList.length > 0 && (
        <div className="fixed left-6 bottom-24 lg:left-8 lg:bottom-8 z-40 bg-[#dfc28c] text-[#020c1b] px-6 py-3.5 rounded-full shadow-2xl flex items-center gap-3 border border-white/20 animate-bounce">
          <Scale size={18} />
          <span className="text-xs font-bold uppercase tracking-wider">
            Compare ({compareList.length})
          </span>
          <button
            onClick={() => setShowCompareModal(true)}
            className="text-xs font-black hover:underline uppercase pl-2 border-l border-[#020c1b]/20"
          >
            Open Panel
          </button>
        </div>
      )}

      {/* Property Cards Grid */}
      {filteredProperties.length === 0 ? (
        <div className="text-center py-20 bg-black/5 rounded-3xl border border-dashed border-black/10 dark:border-white/10">
          <p className="text-zinc-500">No properties matched your search parameters.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProperties.map((prop) => (
            <div
              key={prop.id}
              className="flex flex-col bg-[#0a192f] rounded-3xl overflow-hidden shadow-2xl border border-white/5 group hover:border-[#dfc28c]/30 transition-all duration-300"
            >
              {/* Card Image */}
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

                {/* Compare Checkbox Icon Button */}
                <button
                  onClick={() => toggleCompare(prop)}
                  className={`absolute top-4 right-4 z-10 w-9 h-9 rounded-full flex items-center justify-center border transition-all ${
                    compareList.some((p) => p.id === prop.id)
                      ? 'bg-[#dfc28c] border-[#dfc28c] text-[#020c1b]'
                      : 'bg-black/60 border-white/20 text-white hover:bg-black/80'
                  }`}
                  title="Compare property"
                >
                  <Scale size={14} />
                </button>
              </div>

              {/* Card Info */}
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
                      Details
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Comparison Modal Overlay */}
      <AnimatePresence>
        {showCompareModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 md:p-8"
            onClick={() => setShowCompareModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
              className="bg-[#0a192f] border border-white/10 rounded-3xl w-full max-w-4xl p-6 md:p-8 text-white relative flex flex-col gap-6 shadow-2xl max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Header */}
              <div className="flex justify-between items-center border-b border-white/5 pb-4">
                <div className="flex items-center gap-2 text-[#dfc28c]">
                  <Scale size={20} />
                  <h3 className="font-heading text-xl font-bold">Property Comparison</h3>
                </div>
                <button
                  onClick={() => setShowCompareModal(false)}
                  className="text-white/60 hover:text-white transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Comparison Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-sm">
                  <thead>
                    <tr className="border-b border-white/5">
                      <th className="py-4 font-semibold text-white/40 w-1/4">Details</th>
                      {compareList.map((p) => (
                        <th key={p.id} className="py-4 px-4 font-heading font-bold text-white text-base">
                          {p.name}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-white/5">
                      <td className="py-4 text-white/50 font-medium">Image</td>
                      {compareList.map((p) => (
                        <td key={p.id} className="py-4 px-4">
                          <div className="relative aspect-[4/3] w-32 rounded-lg overflow-hidden bg-zinc-900 border border-white/10">
                            <Image src={p.mainImage} alt={p.name} fill className="object-cover" />
                          </div>
                        </td>
                      ))}
                    </tr>
                    <tr className="border-b border-white/5">
                      <td className="py-4 text-white/50 font-medium">Location</td>
                      {compareList.map((p) => (
                        <td key={p.id} className="py-4 px-4 text-white/90">
                          {p.location}
                        </td>
                      ))}
                    </tr>
                    <tr className="border-b border-white/5">
                      <td className="py-4 text-white/50 font-medium">Starting Price</td>
                      {compareList.map((p) => (
                        <td key={p.id} className="py-4 px-4 font-heading font-bold text-[#dfc28c]">
                          {formatPrice(p.startingPrice, p.currency)}
                        </td>
                      ))}
                    </tr>
                    <tr className="border-b border-white/5">
                      <td className="py-4 text-white/50 font-medium">Layout Options</td>
                      {compareList.map((p) => (
                        <td key={p.id} className="py-4 px-4 text-white/80">
                          {p.bedrooms}
                        </td>
                      ))}
                    </tr>
                    <tr className="border-b border-white/5">
                      <td className="py-4 text-white/50 font-medium">Size Range</td>
                      {compareList.map((p) => (
                        <td key={p.id} className="py-4 px-4 text-white/80">
                          {p.sizeRange}
                        </td>
                      ))}
                    </tr>
                    <tr className="border-b border-white/5">
                      <td className="py-4 text-white/50 font-medium">Status</td>
                      {compareList.map((p) => (
                        <td key={p.id} className="py-4 px-4">
                          <span
                            className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                              p.status.toLowerCase() === 'sold out' ? 'bg-red-500 text-white' : 'bg-[#dfc28c] text-[#020c1b]'
                            }`}
                          >
                            {p.status}
                          </span>
                        </td>
                      ))}
                    </tr>
                    <tr>
                      <td className="py-4 text-white/50 font-medium">Action</td>
                      {compareList.map((p) => (
                        <td key={p.id} className="py-4 px-4">
                          <div className="flex gap-2">
                            <Link
                              href={`/properties/${p.slug}`}
                              onClick={() => setShowCompareModal(false)}
                              className="px-4 py-2 bg-white/10 hover:bg-[#dfc28c] hover:text-[#020c1b] text-xs font-semibold rounded-full transition-all"
                            >
                              Explore
                            </Link>
                            <button
                              onClick={() => toggleCompare(p)}
                              className="text-xs text-red-400 hover:text-red-300 font-semibold uppercase px-2"
                            >
                              Remove
                            </button>
                          </div>
                        </td>
                      ))}
                    </tr>
                  </tbody>
                </table>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
