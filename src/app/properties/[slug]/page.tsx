import { db } from '@/lib/db';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import StickyCTAs from '@/components/layout/StickyCTAs';
import UnitMatrix from '@/components/property/UnitMatrix';
import PropertyScrollGallery from '@/components/property/PropertyScrollGallery';
import VideoModal from '@/components/home/VideoModal';
import HomeForm from '@/components/home/HomeForm';
import { MapPin, Maximize, Bed, Bath, Sparkles, MessageSquare, Calendar, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import Image from 'next/image';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const property = await db.property.findUnique({
    where: { slug },
  });

  if (!property) return { title: 'Property Not Found' };

  return {
    title: property.seoTitle,
    description: property.seoDescription,
    openGraph: {
      title: property.seoTitle,
      description: property.seoDescription,
      images: [{ url: property.mainImage }],
    },
  };
}

export const dynamic = 'force-dynamic';

export default async function PropertyDetailPage({ params }: Props) {
  const { slug } = await params;

  const property = await db.property.findUnique({
    where: { slug },
    include: { units: true, images: { orderBy: { createdAt: 'asc' } } },
  });

  if (!property) {
    notFound();
  }

  const allProperties = await db.property.findMany({
    select: { id: true, name: true },
  });

  // Load related properties (excluding current)
  const relatedProperties = await db.property.findMany({
    where: { NOT: { id: property.id } },
    take: 2,
  });

  // Gallery images are handled sequentially by the PropertyScrollGallery component

  // Parse amenities from description
  const defaultAmenities = [
    'Infinity Swimming Pool',
    'Fully Equipped Fitness Gym',
    'Secure Gated Parking',
    '24/7 Security & CCTV',
    'Standby Backup Generator',
    'Indoor Kids Play Zone',
    'Rooftop Terrace Gazebo',
    'High-Speed Passenger Lift',
  ];

  const formatPrice = (price: number, curr: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: curr,
      maximumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Navbar />

      {/* Property Hero Cover */}
      <section className="relative h-[65vh] w-full bg-zinc-900 border-b border-white/5 overflow-hidden">
        {/* Background Image with Cinematic Zoom */}
        <div
          className="absolute inset-0 bg-cover bg-center animate-page-load-zoom"
          style={{ backgroundImage: `url(${property.mainImage})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#020c1b] via-[#020c1b]/30 to-transparent z-[1]" />
        <div className="absolute bottom-12 left-0 w-full z-10">
          <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row md:items-end justify-between gap-6 text-white">
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 bg-[#dfc28c] text-[#020c1b] rounded-full text-[9px] font-bold uppercase tracking-wider">
                  {property.status}
                </span>
                <span className="text-white/60 text-xs flex items-center gap-1">
                  <MapPin size={12} className="text-[#dfc28c]" />
                  {property.location}
                </span>
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold tracking-tight">
                {property.name}
              </h1>
            </div>

            <div className="flex flex-col md:text-right">
              <span className="text-[10px] uppercase tracking-wider text-white/40">Starting Price</span>
              <span className="font-heading text-2xl md:text-3xl font-bold text-[#dfc28c]">
                {formatPrice(property.startingPrice, property.currency)}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Project Overview Details */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-16">
          {/* Main Description */}
          <div className="lg:col-span-8 flex flex-col gap-12">
            <div className="flex flex-col gap-4 text-zinc-800">
              <h2 className="font-heading font-bold text-3xl text-[#0a192f]">
                Project Overview
              </h2>
              <p className="text-sm md:text-base leading-relaxed text-zinc-600">
                {property.fullDescription}
              </p>
            </div>

            {/* Unique Project Spotlight Component */}
            <div className="border-t border-black/5 pt-10">
              {property.id === 'horizon-residency' && (
                <div className="bg-gradient-to-br from-[#0a192f] to-[#020c1b] text-white p-8 rounded-3xl border border-[#dfc28c]/20 shadow-xl relative overflow-hidden">
                  <div className="absolute right-0 bottom-0 w-64 h-64 bg-[#dfc28c]/5 rounded-full blur-[80px]" />
                  <span className="text-xs uppercase tracking-widest text-[#dfc28c] font-bold">Project Spotlight</span>
                  <h3 className="font-heading text-2xl font-bold mt-2">Bugolobi Elite Lifestyle</h3>
                  <p className="text-sm text-white/70 leading-relaxed mt-4">
                    Horizon Residency offers an unmatched urban lifestyle in Bugolobi, situated directly opposite the serene Dolphin Suites. Residents enjoy direct road connectivity along Luthuli Avenue and dual-aspect balconies that capture stunning sunset views over the Kampala skyline.
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
                    <div className="bg-white/5 p-4 rounded-xl border border-white/5">
                      <span className="text-xs text-white/50 block">Prime Location</span>
                      <span className="text-sm font-semibold text-[#dfc28c] mt-1 block">Luthuli Avenue Frontage</span>
                    </div>
                    <div className="bg-white/5 p-4 rounded-xl border border-white/5">
                      <span className="text-xs text-white/50 block">Key Access</span>
                      <span className="text-sm font-semibold text-[#dfc28c] mt-1 block">Opposite Dolphin Suites</span>
                    </div>
                  </div>
                </div>
              )}
              {property.id === 'embassy-towers' && (
                <div className="bg-gradient-to-br from-[#0a192f] to-[#020c1b] text-white p-8 rounded-3xl border border-[#dfc28c]/20 shadow-xl relative overflow-hidden">
                  <div className="absolute right-0 bottom-0 w-64 h-64 bg-[#dfc28c]/5 rounded-full blur-[80px]" />
                  <span className="text-xs uppercase tracking-widest text-[#dfc28c] font-bold">Project Spotlight</span>
                  <h3 className="font-heading text-2xl font-bold mt-2">CBD Skyrise & Yield Guarantee</h3>
                  <p className="text-sm text-white/70 leading-relaxed mt-4">
                    Perfectly positioned in the heart of Kampala's corporate district, Embassy Towers is a high-rise icon built for modern professionals. Featuring state-of-the-art double-glazing noise insulation, high-speed elevators, and luxury modular kitchens, this project represents Kampala's premier buy-to-let asset.
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
                    <div className="bg-white/5 p-4 rounded-xl border border-white/5">
                      <span className="text-xs text-white/50 block">Acoustics</span>
                      <span className="text-sm font-semibold text-[#dfc28c] mt-1 block">Double-Glazed Windows</span>
                    </div>
                    <div className="bg-white/5 p-4 rounded-xl border border-white/5">
                      <span className="text-xs text-white/50 block">Investment</span>
                      <span className="text-sm font-semibold text-[#dfc28c] mt-1 block">High Capital Appreciation</span>
                    </div>
                  </div>
                </div>
              )}
              {property.id === 'elite-palazzo-naguru' && (
                <div className="bg-gradient-to-br from-[#0a192f] to-[#020c1b] text-white p-8 rounded-3xl border border-[#dfc28c]/20 shadow-xl relative overflow-hidden">
                  <div className="absolute right-0 bottom-0 w-64 h-64 bg-[#dfc28c]/5 rounded-full blur-[80px]" />
                  <span className="text-xs uppercase tracking-widest text-[#dfc28c] font-bold">Project Spotlight</span>
                  <h3 className="font-heading text-2xl font-bold mt-2">Naguru Hilltop Prestige</h3>
                  <p className="text-sm text-white/70 leading-relaxed mt-4">
                    Standing tall at Kampala's highest elevation point, Elite Palazzo Naguru features sprawling sunset terraces and premium imported marble finishes. With instant road connectivity to Ntinda II road, it represents the absolute peak of residential prestige.
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
                    <div className="bg-white/5 p-4 rounded-xl border border-white/5">
                      <span className="text-xs text-white/50 block">Elevation</span>
                      <span className="text-sm font-semibold text-[#dfc28c] mt-1 block">Kampala Hilltop Views</span>
                    </div>
                    <div className="bg-white/5 p-4 rounded-xl border border-white/5">
                      <span className="text-xs text-white/50 block">Materials</span>
                      <span className="text-sm font-semibold text-[#dfc28c] mt-1 block">Premium Imported Finishes</span>
                    </div>
                  </div>
                </div>
              )}
              {property.id === 'atlantic-apartments' && (
                <div className="bg-gradient-to-br from-[#0a192f] to-[#020c1b] text-white p-8 rounded-3xl border border-[#dfc28c]/20 shadow-xl relative overflow-hidden">
                  <div className="absolute right-0 bottom-0 w-64 h-64 bg-[#dfc28c]/5 rounded-full blur-[80px]" />
                  <span className="text-xs uppercase tracking-widest text-[#dfc28c] font-bold">Project Spotlight</span>
                  <h3 className="font-heading text-2xl font-bold mt-2">Diaspora-First Family Haven</h3>
                  <p className="text-sm text-white/70 leading-relaxed mt-4">
                    Atlantic Heights is tailored specifically for families and diaspora buyers looking for secure long-term equity. Steps away from Kampala's leading international schools, shopping malls, and medical facilities, it offers optimal layouts designed for family comfort.
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
                    <div className="bg-white/5 p-4 rounded-xl border border-white/5">
                      <span className="text-xs text-white/50 block">Proximity</span>
                      <span className="text-sm font-semibold text-[#dfc28c] mt-1 block">Walk to Schools & Malls</span>
                    </div>
                    <div className="bg-white/5 p-4 rounded-xl border border-white/5">
                      <span className="text-xs text-white/50 block">Rental Yield</span>
                      <span className="text-sm font-semibold text-[#dfc28c] mt-1 block">Excellent Diaspora Yields</span>
                    </div>
                  </div>
                </div>
              )}
              {property.id === 'urban-view-apartments' && (
                <div className="bg-gradient-to-br from-[#0a192f] to-[#020c1b] text-white p-8 rounded-3xl border border-[#dfc28c]/20 shadow-xl relative overflow-hidden">
                  <div className="absolute right-0 bottom-0 w-64 h-64 bg-[#dfc28c]/5 rounded-full blur-[80px]" />
                  <span className="text-xs uppercase tracking-widest text-[#dfc28c] font-bold">Project Spotlight</span>
                  <h3 className="font-heading text-2xl font-bold mt-2">Kulambiro Greenery Oasis</h3>
                  <p className="text-sm text-white/70 leading-relaxed mt-4">
                    Urban View Apartments in Kulambiro provides a quiet, green retreat from Kampala's central rush. With a panoramic rooftop terrace gazebo, landscaped gardens, and a secure children's play zone, this project offers the ideal combination of serenity and value.
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
                    <div className="bg-white/5 p-4 rounded-xl border border-white/5">
                      <span className="text-xs text-white/50 block">Rooftop Oasis</span>
                      <span className="text-sm font-semibold text-[#dfc28c] mt-1 block">Panoramic Sky Gazebo</span>
                    </div>
                    <div className="bg-white/5 p-4 rounded-xl border border-white/5">
                      <span className="text-xs text-white/50 block">Vibe</span>
                      <span className="text-sm font-semibold text-[#dfc28c] mt-1 block">Peaceful Suburb Serenity</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Amenities Grid */}
            <div className="flex flex-col gap-6">
              <h3 className="font-heading font-bold text-2xl text-[#0a192f]">
                Resort-Style Amenities
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {defaultAmenities.map((amenity) => (
                  <div
                    key={amenity}
                    className="flex items-center gap-3 bg-white p-4 rounded-xl border border-black/5 shadow-sm"
                  >
                    <div className="w-8 h-8 rounded-full bg-[#0a192f]/5 flex items-center justify-center text-[#dfc28c]">
                      <Sparkles size={14} />
                    </div>
                    <span className="text-sm font-medium text-zinc-700">{amenity}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Unit Matrix Layout */}
            <UnitMatrix
              propertyName={property.name}
              units={property.units}
              currency={property.currency}
            />

            {/* Scroll-Linked Property Gallery */}
            <PropertyScrollGallery propertyId={property.id} images={property.images} />

            {/* Video Modal Section */}
            {property.youtubeUrl && (
              <div className="flex flex-col gap-6">
                <h3 className="font-heading font-bold text-2xl text-[#0a192f]">
                  Project Walkthrough Video
                </h3>
                <VideoModal
                  videoUrl={property.youtubeUrl}
                  thumbnail={property.mainImage}
                  title={`${property.name} Walkthrough`}
                />
              </div>
            )}
          </div>

          {/* Sidebar Booking Form & Location Map */}
          <div className="lg:col-span-4 flex flex-col gap-8">
            {/* Quick Contact Form */}
            <div className="sticky top-28 flex flex-col gap-8">
              <HomeForm properties={allProperties} pageSource={`Detail: ${property.name}`} />

              {/* Map Container */}
              {property.mapUrl && (
                <div className="bg-[#0a192f] border border-white/5 p-6 rounded-3xl flex flex-col gap-4 text-white">
                  <h4 className="font-heading font-bold text-lg">Development Location</h4>
                  <div className="relative aspect-[4/3] rounded-xl overflow-hidden border border-white/10">
                    <iframe
                      src={property.mapUrl}
                      className="absolute inset-0 w-full h-full border-0 grayscale filter contrast-125"
                      allowFullScreen
                      loading="lazy"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Related Properties */}
      <section className="py-20 bg-[#020c1b] text-white border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6">
          <h3 className="font-heading font-bold text-2xl mb-12 text-center lg:text-left">
            Other Signature Developments
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {relatedProperties.map((related) => (
              <div
                key={related.id}
                className="bg-white/5 border border-white/5 rounded-3xl overflow-hidden shadow-xl flex flex-col sm:flex-row hover:border-[#dfc28c]/30 transition-all duration-300 group"
              >
                <div className="relative aspect-[4/3] sm:aspect-square w-full sm:w-48 bg-zinc-900 shrink-0 overflow-hidden reveal-zoom">
                  <Image
                    src={related.mainImage}
                    alt={related.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-6 flex flex-col justify-between flex-1">
                  <div className="flex flex-col gap-1">
                    <span className="text-[10px] text-[#dfc28c] uppercase tracking-wider font-semibold">
                      {related.location}
                    </span>
                    <h4 className="font-heading font-bold text-lg group-hover:text-[#dfc28c] transition-colors">
                      <Link href={`/properties/${related.slug}`}>{related.name}</Link>
                    </h4>
                    <p className="text-xs text-white/50 leading-relaxed line-clamp-2 mt-1">
                      {related.description}
                    </p>
                  </div>
                  <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/5">
                    <span className="text-sm font-heading font-bold text-[#dfc28c]">
                      {formatPrice(related.startingPrice, related.currency)}
                    </span>
                    <Link
                      href={`/properties/${related.slug}`}
                      className="text-xs font-semibold text-white/80 hover:text-white flex items-center gap-1 group/link"
                    >
                      <span>Explore</span>
                      <ChevronRight size={12} className="group-hover/link:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
      <StickyCTAs />
    </div>
  );
}
