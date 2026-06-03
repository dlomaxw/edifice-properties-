'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from 'framer-motion';
import { Eye, X, ChevronLeft, ChevronRight, Compass, ArrowDownCircle, Layers } from 'lucide-react';

interface ImageItem {
  id?: string;
  url: string;
  category: string;
  label: string;
  description: string;
}

interface PropertyScrollGalleryProps {
  propertyId: string;
  images?: ImageItem[];
}

export default function PropertyScrollGallery({ propertyId, images }: PropertyScrollGalleryProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  // Grouped data matching local assets explicitly
  const getCategorizedImages = (id: string): ImageItem[] => {
    switch (id) {
      case 'horizon-residency':
        return [
          {
            url: '/assets/images/horizon.png',
            category: 'exterior',
            label: 'Architectural Entrance Facade',
            description: 'Stunning modern exterior featuring floor-to-ceiling glass paneling and premium structural finishing.',
          },
          {
            url: '/assets/images/1.webp',
            category: 'exterior',
            label: 'Cinematic Facade Rendering',
            description: 'Photorealistic exterior rendering displaying the modern verticality and premium paint styling of Horizon Residency.',
          },
          {
            url: '/assets/images/2-1.webp',
            category: 'exterior',
            label: 'Corner & Balcony Perspectives',
            description: 'Detailed exterior perspective highlighting double-aspect balconies and architectural sunshading.',
          },
          {
            url: '/assets/images/5.webp',
            category: 'exterior',
            label: 'Exterior Access & Driveway',
            description: 'Double-entry driveway with beautifully landscaped drop-off zones directly along Luthuli Avenue.',
          },
          {
            url: '/assets/images/6.webp',
            category: 'interior',
            label: 'Bespoke Interior Living Space',
            description: 'Sophisticated living lounge area featuring custom walnut wall panels, gold accents, and recessed LED ambient lighting.',
          },
          {
            url: '/assets/images/3-1.webp',
            category: 'interior',
            label: 'Signature Master Bedroom Showcase',
            description: 'Luxury bedroom visualization detailing premium floor tiling, integrated wardrobes, and warm ambient light channels.',
          },
          {
            url: '/assets/images/4-1.webp',
            category: 'interior',
            label: 'Panoramic Lounge View Concept',
            description: 'Spacious open-plan lounge concept looking out over the city with distinct dining partitions.',
          },
          {
            url: '/assets/images/EDIFICE-PROFILE._page-0071.jpg',
            category: 'floorplan',
            label: 'Development Block Diagram Layout',
            description: 'Detailed site map and blocks routing overview demonstrating secure neighborhood boundary lines.',
          },
          {
            url: '/assets/images/EDIFICE-PROFILE._page-0072.jpg',
            category: 'floorplan',
            label: 'Apartment Type 1 Layout Specifications',
            description: 'Engineering plans highlighting door width clearances, window placements, and structural partitions.',
          },
          {
            url: '/assets/images/EDIFICE-PROFILE._page-0073.jpg',
            category: 'floorplan',
            label: 'Apartment Type 2 Layout Specifications',
            description: 'Detailed bathroom plumbing guides and kitchen cabinetry partition outlines.',
          },
          {
            url: '/assets/images/DTB-Flyers-Horizon-Residency-1638x2048.png',
            category: 'floorplan',
            label: 'Horizon Residency Brochure Flyer',
            description: 'Complete project documentation flyer detailing dimensions, structural specifications, and corporate features.',
          },
        ];
      case 'embassy-towers':
        return [
          {
            url: '/assets/images/embassy.webp',
            category: 'exterior',
            label: 'Corporate District Elevation',
            description: 'Grand towering steel-and-glass design set in the heart of Kampala\'s prestigious business district.',
          },
          {
            url: '/assets/images/WhatsApp-Image-2024-09-12-at-1.16.19-PM-2.jpeg',
            category: 'exterior',
            label: 'Structural Foundation Progress',
            description: 'High-durability reinforced concrete pillar framework under construction on the Embassy Towers site.',
          },
          {
            url: '/assets/images/WhatsApp-Image-2024-09-12-at-1.16.20-PM.jpeg',
            category: 'exterior',
            label: 'Floor Level Construction Update',
            description: 'Laying out high-strength post-tensioned slabs and primary conduits during main framing.',
          },
          {
            url: '/assets/images/WhatsApp-Image-2024-09-12-at-1.16.22-PM.jpeg',
            category: 'exterior',
            label: 'Exterior Facade Glass Installation',
            description: 'Double-glazed soundproof glass panels being assembled across the building facade layers.',
          },
          {
            url: '/assets/images/WhatsApp-Image-2024-09-12-at-1.16.24-PM.jpeg',
            category: 'exterior',
            label: 'Acoustic Glazing Assembly',
            description: 'Engineered structural panels details providing optimal noise dampening for interior office layouts.',
          },
          {
            url: '/assets/images/8-1.png',
            category: 'interior',
            label: 'Modular Luxury Kitchen Layout',
            description: 'Bespoke cabinet plans featuring gold framing, integrated cooktop ventilation, and quartz counters.',
          },
          {
            url: '/assets/images/9.png',
            category: 'interior',
            label: 'Premium Bathroom Finishes',
            description: 'Elegantly tiled walk-in rain showers with gold fixtures and suspended vanity layouts.',
          },
          {
            url: '/assets/images/10.png',
            category: 'interior',
            label: 'Executive Living Room Salon',
            description: 'Warm lounge renderings showcasing custom wall sconces, integrated media walls, and ceiling coves.',
          },
          {
            url: '/assets/images/2-1-1024x722.png',
            category: 'floorplan',
            label: '1BHK & 2BHK Layout Outline',
            description: 'Open living-dining space optimization plans showing structural columns and partition layouts.',
          },
          {
            url: '/assets/images/3-1-1024x722.png',
            category: 'floorplan',
            label: '3BHK Executive Layout Outline',
            description: 'High-density three-bedroom floor plans with en-suite master facilities and dual aspect balconies.',
          },
          {
            url: '/assets/images/DTB-Flyers-Embassy-Towers-1638x2048.png',
            category: 'floorplan',
            label: 'Embassy Towers Brochure Flyer',
            description: 'Promotional brochure highlighting payment installments, project location metrics, and site layouts.',
          },
        ];
      case 'elite-palazzo-naguru':
        return [
          {
            url: '/assets/images/pallazo.webp',
            category: 'exterior',
            label: 'Naguru Hilltop Architectural Facade',
            description: 'Majestic design standing at Kampala\'s highest point, offering panoramic outlooks over the cityscape.',
          },
          {
            url: '/assets/images/envato-labs-image-edit-2.webp',
            category: 'exterior',
            label: 'Perimeter Driveway & Dropoff',
            description: 'Gated parking approach, secure guard facilities, and beautifully paved modern vehicular rampways.',
          },
          {
            url: '/assets/images/WhatsApp-Image-2025-01-09-at-12.57.20_31ca38cf.jpg',
            category: 'exterior',
            label: 'Construction Site Earthworks',
            description: 'Deep excavation and soil retention wall construction on the Naguru hilltop site.',
          },
          {
            url: '/assets/images/WhatsApp-Image-2025-01-09-at-12.57.20_cb4802eb.jpg',
            category: 'exterior',
            label: 'Structural Floor Construction',
            description: 'Laying concrete columns and tensioning deck reinforcements for upper apartment levels.',
          },
          {
            url: '/assets/images/WhatsApp-Image-2025-01-09-at-12.57.20_f3822509.jpg',
            category: 'exterior',
            label: 'Foundation Core Piling Update',
            description: 'Piling machine active on site, drilling deep concrete piers to ensure load-bearing hilltop stability.',
          },
          {
            url: '/assets/images/2.png',
            category: 'interior',
            label: 'Marble Reception Lobby',
            description: 'Imported Greek marble floors and custom gold-accented light installations welcoming residents.',
          },
          {
            url: '/assets/images/3.png',
            category: 'interior',
            label: 'Hilltop Sunset Balcony View',
            description: 'Spacious interior salon with double glass doors leading directly to sprawling hilltop viewing terraces.',
          },
          {
            url: '/assets/images/Flux_Schnell_a_lush_3d_render_of_Photorealistic_luxury_standar_2.jpg',
            category: 'interior',
            label: 'Master Penthouse Suite Rendering',
            description: 'Luxury master bedroom space detailing plush headboard panels, gold accents, and floor-to-ceiling windows.',
          },
          {
            url: '/assets/images/4.png',
            category: 'floorplan',
            label: 'Precision Penthouse Layout',
            description: 'Elite layout prioritizing cross-ventilation, panoramic terraces, and distinct domestic quarters.',
          },
          {
            url: '/assets/images/EDIFICE-PROFILE._page-0029.jpg',
            category: 'floorplan',
            label: 'Elite Palazzo Layout Dimensions',
            description: 'Dimension specs sheets showing bedroom sizes, terrace areas, and total square footage breakdowns.',
          },
          {
            url: '/assets/images/DTB-FlyersElite-Palazzo-1638x2048.png',
            category: 'floorplan',
            label: 'Naguru Palazzo Brochure Flyer',
            description: 'Executive project overview brochure displaying premium finishes and amenity highlights.',
          },
        ];
      case 'atlantic-apartments':
        return [
          {
            url: '/assets/images/envato-labs-image-edit-64-1.png',
            category: 'exterior',
            label: 'Atlantic Heights Main Facade',
            description: 'Clean architectural lines and modern high-end stucco finish with custom structural accents.',
          },
          {
            url: '/assets/images/2-4-496x279.png',
            category: 'exterior',
            label: 'Lush Landscaping & Approach',
            description: 'Secure gated security perimeter and landscaped front walkways tailored for family arrivals.',
          },
          {
            url: '/assets/images/3-4-496x279.png',
            category: 'interior',
            label: 'Sophisticated Living Area',
            description: 'Premium hardwood paneling and contemporary luxury lighting fixture layouts.',
          },
          {
            url: '/assets/images/4-3-496x279.png',
            category: 'interior',
            label: 'Luxury Master Suite Room',
            description: 'Plush master bedroom renders showing expansive closets and elegant, relaxing vanity units.',
          },
          {
            url: '/assets/images/5-2-496x279.png',
            category: 'floorplan',
            label: '1BHK Family Starter Plan',
            description: 'Optimal layout highlighting separate laundry cabinets and an integrated breakfast bar.',
          },
          {
            url: '/assets/images/6-1-496x279.png',
            category: 'floorplan',
            label: '2BHK Premium Family Plan',
            description: 'Balanced space offering two self-contained bedrooms and high daylight penetration.',
          },
          {
            url: '/assets/images/7-1-496x279.png',
            category: 'floorplan',
            label: '3BHK Spacious Residence Plan',
            description: 'Sprawling three-bedroom layout optimized specifically for diaspora buyers seeking secure investment equity.',
          },
        ];
      case 'urban-view-apartments':
        return [
          {
            url: '/assets/images/urban.webp',
            category: 'exterior',
            label: 'Urban View Main Approach',
            description: 'Peaceful residential architecture nestled within the green, serene valleys of Kulambiro.',
          },
          {
            url: '/assets/images/DJI-0001-1024x576.png',
            category: 'exterior',
            label: 'Panoramic Aerial Drone View',
            description: 'Sweeping drone photography of the building\'s rooftop gazebo oasis and landscaped perimeter.',
          },
          {
            url: '/assets/images/DJI-0002-1024x576.png',
            category: 'interior',
            label: 'Light-Filled Living Room',
            description: 'Warm, cozy family lounge showing high ceilings and broad double-glazed slider windows.',
          },
          {
            url: '/assets/images/DJI-0003.png',
            category: 'floorplan',
            label: 'Type A Optimized Floor Plan',
            description: 'Functional layout maximizing kitchen cabinetry and private bedroom alcoves.',
          },
          {
            url: '/assets/images/DJI-0004.png',
            category: 'floorplan',
            label: 'Type B Multi-Balcony Floor Plan',
            description: 'Large family layout featuring dual aspects and expansive outdoor balcony seating area plans.',
          },
          {
            url: '/assets/images/EDIFICE-PROFILE._page-0048.jpg',
            category: 'floorplan',
            label: 'Block Walkway Site Diagram',
            description: 'Site layout plan displaying building access roadways, common gardens, and children play fields.',
          },
          {
            url: '/assets/images/EDIFICE-PROFILE._page-0049.jpg',
            category: 'floorplan',
            label: '1BHK Dimensions & Sizing Sheets',
            description: 'Technical drawing demonstrating room boundaries, structural doors, and plumbing pipes layout.',
          },
          {
            url: '/assets/images/EDIFICE-PROFILE._page-0050.jpg',
            category: 'floorplan',
            label: '2BHK Dimensions & Sizing Sheets',
            description: 'Comprehensive 2-bedroom dimensions outlining balcony spaces and kitchen counter widths.',
          },
          {
            url: '/assets/images/EDIFICE-PROFILE._page-0052.jpg',
            category: 'floorplan',
            label: '3BHK Executive Penthouses Layout',
            description: 'Upper floor planning detailing maids rooms, separate laundry utilities, and penthouse layouts.',
          },
        ];
      default:
        return [];
    }
  };

  const dbItems = images && images.length > 0
    ? images.map((img) => ({
        url: img.url,
        category: img.category as 'exterior' | 'interior' | 'floorplan',
        label: img.label,
        description: img.description
      }))
    : [];

  const items = dbItems.length > 0 ? dbItems : getCategorizedImages(propertyId);

  // Scroll Tracking hooks
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  useMotionValueEvent(scrollYProgress, 'change', (latest) => {
    const totalItems = items.length;
    if (totalItems === 0) return;

    // Map scroll progress (0 to 1) to active index
    const index = Math.min(Math.floor(latest * totalItems), totalItems - 1);
    if (index !== activeIndex) {
      setDirection(index > activeIndex ? 1 : -1);
      setActiveIndex(index);
    }
  });

  if (items.length === 0) return null;

  const currentItem = items[activeIndex];

  // Helper to trigger specific slide index
  const selectSlide = (index: number) => {
    setDirection(index > activeIndex ? 1 : -1);
    setActiveIndex(index);
  };

  // Nav helpers for lightbox
  const nextLightbox = () => {
    setActiveIndex((prev) => (prev + 1) % items.length);
  };
  const prevLightbox = () => {
    setActiveIndex((prev) => (prev - 1 + items.length) % items.length);
  };

  // Category display details
  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'exterior': return 'Phase 01: Architectural Exterior';
      case 'interior': return 'Phase 02: Bespoke Interior Design';
      case 'floorplan': return 'Phase 03: Precision Floor Plan';
      default: return '';
    }
  };

  // Slide Animation configurations (Vertical slide-up/slide-down)
  const slideVariants = {
    enter: (dir: number) => ({
      y: dir > 0 ? '100%' : '-100%',
      opacity: 0,
    }),
    center: {
      y: 0,
      opacity: 1,
      transition: {
        y: { type: 'spring' as const, stiffness: 300, damping: 30 },
        opacity: { duration: 0.2 },
      },
    },
    exit: (dir: number) => ({
      y: dir < 0 ? '100%' : '-100%',
      opacity: 0,
      transition: {
        y: { type: 'spring' as const, stiffness: 300, damping: 30 },
        opacity: { duration: 0.2 },
      },
    }),
  };

  return (
    <div className="flex flex-col gap-8 w-full">
      <div className="flex flex-col gap-2">
        <h3 className="font-heading text-3xl font-bold tracking-tight text-[#0a192f] flex items-center gap-3">
          <Layers className="text-[#dfc28c]" size={28} />
          Interactive Project Walkthrough
        </h3>
        <p className="text-zinc-600 text-sm max-w-2xl">
          Scroll down this section to watch the property unfold page-by-page, sliding from the architectural exterior and luxurious interior details to the final precision floor plans.
        </p>
      </div>

      {/* Desktop Scroll-Linked Gallery */}
      <div className="hidden lg:block">
        {/* Parent tall container to create scroll height */}
        <div ref={containerRef} className="relative h-[300vh] w-full bg-[#020c1b] rounded-3xl overflow-visible border border-[#dfc28c]/10 shadow-2xl">
          
          {/* Sticky Inner viewport */}
          <div className="sticky top-24 h-[75vh] w-full flex items-stretch p-8 gap-12 overflow-hidden rounded-3xl bg-[#0a192f]">
            
            {/* Left Side: Dynamic Text Panel */}
            <div className="w-[40%] flex flex-col justify-between text-white z-10 select-none">
              
              {/* Top Section details */}
              <div className="flex flex-col gap-6">
                <span className="px-3 py-1 bg-[#dfc28c]/10 border border-[#dfc28c]/30 text-[#dfc28c] rounded-full text-[10px] font-bold uppercase tracking-wider w-fit">
                  {getCategoryLabel(currentItem.category)}
                </span>
                
                <h4 className="font-heading text-3xl font-bold tracking-tight text-white leading-tight min-h-[72px]">
                  {currentItem.label}
                </h4>
                
                <p className="text-white/60 text-sm leading-relaxed min-h-[96px]">
                  {currentItem.description}
                </p>
              </div>

              {/* Middle Section: Progress steps indicator */}
              <div className="flex flex-col gap-3 py-6 border-t border-white/5">
                <span className="text-[10px] text-white/40 uppercase tracking-widest font-semibold block">Showcase Timeline</span>
                <div className="flex flex-col gap-2">
                  {items.map((item, idx) => (
                    <button
                      key={idx}
                      onClick={() => selectSlide(idx)}
                      className={`flex items-center gap-3 group text-left cursor-pointer transition-all duration-300`}
                    >
                      <div className="relative flex items-center justify-center">
                        <div className={`w-2 h-2 rounded-full transition-all duration-300 ${
                          idx === activeIndex
                            ? 'bg-[#dfc28c] scale-125'
                            : 'bg-white/20 group-hover:bg-white/40'
                        }`} />
                        {idx === activeIndex && (
                          <motion.div
                            layoutId="activeDotOutline"
                            className="absolute -inset-1 rounded-full border border-[#dfc28c]/40"
                            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                          />
                        )}
                      </div>
                      <span className={`text-xs transition-colors duration-300 truncate max-w-[200px] ${
                        idx === activeIndex
                          ? 'text-[#dfc28c] font-semibold'
                          : 'text-white/40 group-hover:text-white/70'
                      }`}>
                        {item.label}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Bottom Section: Scroll hint */}
              <div className="flex items-center gap-2 text-white/30 text-xs animate-pulse">
                <ArrowDownCircle size={16} className="text-[#dfc28c]" />
                <span>Keep scrolling to slide next</span>
              </div>
            </div>

            {/* Right Side: Image View Window */}
            <div className="flex-1 relative rounded-2xl overflow-hidden bg-black/60 border border-white/5 group shadow-inner">
              <AnimatePresence initial={false} custom={direction}>
                <motion.div
                  key={activeIndex}
                  custom={direction}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  onClick={() => setIsLightboxOpen(true)}
                  className="absolute inset-0 w-full h-full cursor-zoom-in"
                >
                  <Image
                    src={currentItem.url}
                    alt={currentItem.label}
                    fill
                    priority
                    className={`transition-all duration-700 ${
                      currentItem.category === 'floorplan'
                        ? 'object-contain p-8 bg-white'
                        : 'object-cover group-hover:scale-105'
                    }`}
                    sizes="60vw"
                  />
                  {/* Visual Category Label overlaid in image */}
                  <div className="absolute top-4 right-4 px-3 py-1.5 bg-black/60 backdrop-blur-md border border-white/10 rounded-lg text-white/90 text-xs font-semibold uppercase tracking-wider shadow-lg flex items-center gap-1.5">
                    <Compass size={12} className="text-[#dfc28c]" />
                    {currentItem.category}
                  </div>
                  {/* Hover icon */}
                  <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <div className="w-12 h-12 rounded-full bg-white text-[#0a192f] flex items-center justify-center shadow-2xl">
                      <Eye size={20} />
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
            
          </div>
        </div>
      </div>

      {/* Mobile Touch-Friendly Alternative Slider (<1024px) */}
      <div className="block lg:hidden w-full bg-[#0a192f] rounded-3xl border border-[#dfc28c]/10 shadow-xl overflow-hidden">
        
        {/* Mobile Header Tabs */}
        <div className="flex border-b border-white/5 bg-[#020c1b]">
          {(['exterior', 'interior', 'floorplan'] as const).map((cat) => {
            const isActiveCategory = currentItem.category === cat;
            const firstOfCategoryIndex = items.findIndex(item => item.category === cat);
            return (
              <button
                key={cat}
                onClick={() => {
                  if (firstOfCategoryIndex !== -1) {
                    selectSlide(firstOfCategoryIndex);
                  }
                }}
                className={`flex-1 py-4 text-[10px] font-bold uppercase tracking-wider text-center border-b-2 transition-all duration-300 cursor-pointer ${
                  isActiveCategory
                    ? 'border-[#dfc28c] text-[#dfc28c] bg-[#0a192f]/50'
                    : 'border-transparent text-white/40 hover:text-white/60'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* Mobile Showcase Display Area */}
        <div className="p-6 flex flex-col gap-4">
          {/* Active Title */}
          <div className="flex flex-col gap-1">
            <span className="text-[9px] uppercase tracking-widest text-[#dfc28c] font-bold">
              {getCategoryLabel(currentItem.category)}
            </span>
            <h4 className="font-heading text-lg font-bold text-white truncate">
              {currentItem.label}
            </h4>
          </div>

          {/* Active Image Box */}
          <div
            onClick={() => setIsLightboxOpen(true)}
            className="relative aspect-[4/3] w-full bg-black/60 rounded-xl overflow-hidden border border-white/5"
          >
            <Image
              src={currentItem.url}
              alt={currentItem.label}
              fill
              className={`transition-all duration-300 ${
                currentItem.category === 'floorplan'
                  ? 'object-contain p-4 bg-white'
                  : 'object-cover'
              }`}
              sizes="90vw"
            />
            {/* Open Zoom Badge */}
            <div className="absolute bottom-3 right-3 px-2 py-1 bg-black/60 rounded text-[9px] text-white/80 flex items-center gap-1 font-semibold border border-white/5">
              <Eye size={10} className="text-[#dfc28c]" />
              Tap to zoom
            </div>
          </div>

          {/* Description text */}
          <p className="text-white/60 text-xs leading-relaxed min-h-[48px]">
            {currentItem.description}
          </p>

          {/* Navigation Controls */}
          <div className="flex items-center justify-between pt-4 border-t border-white/5 mt-2">
            <button
              onClick={() => {
                const prevIndex = (activeIndex - 1 + items.length) % items.length;
                selectSlide(prevIndex);
              }}
              className="w-10 h-10 rounded-full border border-white/10 text-white flex items-center justify-center hover:bg-white/5 transition-colors cursor-pointer"
            >
              <ChevronLeft size={18} />
            </button>
            
            {/* Dots Counter */}
            <div className="flex gap-1.5">
              {items.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => selectSlide(idx)}
                  className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                    idx === activeIndex ? 'bg-[#dfc28c] w-3' : 'bg-white/20'
                  }`}
                />
              ))}
            </div>

            <button
              onClick={() => {
                const nextIndex = (activeIndex + 1) % items.length;
                selectSlide(nextIndex);
              }}
              className="w-10 h-10 rounded-full border border-white/10 text-white flex items-center justify-center hover:bg-white/5 transition-colors cursor-pointer"
            >
              <ChevronRight size={18} />
            </button>
          </div>

        </div>
      </div>

      {/* Shared Lightbox Overlay */}
      <AnimatePresence>
        {isLightboxOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/98 backdrop-blur-xl flex items-center justify-center p-4 md:p-8"
            onClick={() => setIsLightboxOpen(false)}
          >
            {/* Download Button */}
            <a
              href={items[activeIndex].url}
              download={items[activeIndex].url.split('/').pop()}
              className="absolute top-6 right-20 text-white hover:scale-105 transition-all duration-300 p-2 z-50 cursor-pointer flex items-center gap-2 bg-white/10 hover:bg-white/20 rounded-full px-4 h-11 border border-white/10 hover:border-[#dfc28c] text-xs font-semibold"
              onClick={(e) => e.stopPropagation()}
            >
              <ArrowDownCircle size={14} className="text-[#dfc28c]" />
              <span>Download</span>
            </a>

            {/* Close */}
            <button
              onClick={() => setIsLightboxOpen(false)}
              className="absolute top-6 right-6 text-white/70 hover:text-white hover:rotate-90 transition-all duration-300 p-2 z-50 cursor-pointer"
            >
              <X size={28} />
            </button>

            {/* Left Nav */}
            <button
              onClick={(e) => { e.stopPropagation(); prevLightbox(); }}
              className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors z-50 cursor-pointer"
            >
              <ChevronLeft size={24} />
            </button>
            
            {/* Right Nav */}
            <button
              onClick={(e) => { e.stopPropagation(); nextLightbox(); }}
              className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors z-50 cursor-pointer"
            >
              <ChevronRight size={24} />
            </button>

            {/* Image & Captions */}
            <motion.div
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
              className="relative w-full max-w-5xl aspect-[4/3] rounded-2xl overflow-hidden flex flex-col justify-end p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={items[activeIndex].url}
                alt={items[activeIndex].label}
                fill
                className="object-contain"
                sizes="100vw"
                priority
              />

              {/* Bottom text info overlay inside Lightbox */}
              <div className="absolute bottom-4 left-4 right-4 bg-black/75 backdrop-blur-md border border-white/5 p-4 rounded-xl text-white select-none pointer-events-none md:flex justify-between items-center gap-4">
                <div className="flex flex-col gap-1 max-w-2xl">
                  <span className="text-[10px] text-[#dfc28c] uppercase tracking-wider font-bold">
                    {getCategoryLabel(items[activeIndex].category)}
                  </span>
                  <h5 className="font-heading text-sm font-bold truncate">
                    {items[activeIndex].label}
                  </h5>
                </div>
                <div className="text-white/40 text-xs font-semibold shrink-0 mt-2 md:mt-0">
                  {activeIndex + 1} / {items.length}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
