import { db } from '@/lib/db';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import StickyCTAs from '@/components/layout/StickyCTAs';
import PropertyGrid from '@/components/property/PropertyGrid';
import ScrollReveal from '@/components/layout/ScrollReveal';

export const metadata = {
  title: 'Our Developments | Premium Properties Kampala',
  description:
    'Browse our signature residential portfolio in Kampala. Premium apartments for sale in Bugolobi, Naguru, Muyenga, and Kulambiro. Explore starting prices, amenities, and floor plans.',
};

export const revalidate = 60;

export default async function PropertiesPage() {
  const properties = await db.property.findMany({
    orderBy: { orderIndex: 'asc' },
    include: { units: true },
  });

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      {/* Header Banner */}
      <section className="relative pt-36 pb-20 bg-[#0a192f] text-white overflow-hidden border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 relative z-10 flex flex-col justify-end min-h-[150px]">
          <ScrollReveal direction="up" delay={0.1}>
            <span className="text-xs uppercase tracking-[0.25em] text-[#dfc28c] font-bold">
              Development Portfolio
            </span>
            <h1 className="text-4xl md:text-5xl font-heading font-bold tracking-tight mt-2">
              Signature Residences
            </h1>
            <p className="text-white/50 text-sm md:text-base mt-4 max-w-2xl leading-relaxed">
              Crafting premium residential spaces that blend sophistication, architectural innovation, and lasting investment value across Kampala&apos;s prime suburbs.
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* Property Showcase Grid */}
      <section className="py-20 bg-white flex-1">
        <div className="max-w-7xl mx-auto px-6">
          <ScrollReveal direction="up" delay={0.2}>
            <PropertyGrid properties={properties} />
          </ScrollReveal>
        </div>
      </section>

      <Footer />
      <StickyCTAs />
    </div>
  );
}
