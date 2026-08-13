import { Metadata } from 'next';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import StickyCTAs from '@/components/layout/StickyCTAs';
import Link from 'next/link';
import Image from 'next/image';
import { Heart, Users, Utensils, Play, Sparkles, ArrowRight, ShieldCheck, Award } from 'lucide-react';

export const metadata: Metadata = {
  title: 'CSR & Community Outreach | Kitende Charity Initiative | Edifice Properties',
  description: 'At Edifice Properties Uganda, we believe building a better future means giving back. Read about our Kitende Charity Outreach, providing meals and student support.',
  alternates: {
    canonical: 'https://edificepropertiesug.com/csr',
  },
  openGraph: {
    title: 'CSR & Community Outreach | Edifice Properties Uganda',
    description: 'Together, we build more than properties. We build hope, relationships, and stronger communities.',
    url: 'https://edificepropertiesug.com/csr',
    siteName: 'Edifice Properties',
    images: [{ url: '/assets/edifice/properties/property-card-horizon-residency.webp' }],
  },
};

export default function CSRPage() {
  // Video URL slot - can be replaced with YouTube video embed link
  const videoEmbedUrl = 'https://www.youtube.com/embed/5SdItw9WkAE?autoplay=0&rel=0';

  return (
    <main className="bg-[#020c1b] min-h-screen text-white font-sans selection:bg-[#dfc28c] selection:text-[#020c1b]">
      <Navbar />

      {/* Hero Banner */}
      <section className="relative pt-36 pb-20 overflow-hidden border-b border-white/10">
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a192f] via-[#020c1b] to-[#020c1b]" />
        <div className="absolute -top-24 right-0 w-96 h-96 bg-[#dfc28c]/10 rounded-full blur-[120px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-6 relative z-10 text-center flex flex-col items-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#dfc28c]/10 border border-[#dfc28c]/30 text-[#dfc28c] text-xs font-bold uppercase tracking-widest mb-6">
            <Heart size={14} className="fill-[#dfc28c]" />
            <span>Corporate Social Responsibility (CSR)</span>
          </div>

          <h1 className="text-4xl md:text-6xl font-heading font-extrabold text-white tracking-tight leading-tight max-w-4xl">
            Together, We Build More Than Properties. <span className="text-[#dfc28c]">We Build Hope.</span>
          </h1>

          <p className="mt-6 text-base md:text-lg text-white/70 max-w-3xl leading-relaxed">
            At Edifice Properties, we believe that building a better future goes beyond developing exceptional luxury residences — it also means giving back and making a positive impact in the communities around us.
          </p>
        </div>
      </section>

      {/* Featured Event: Kitende Charity Outreach */}
      <section className="py-20 bg-white text-zinc-800">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col items-center text-center mb-16">
            <span className="text-xs uppercase tracking-widest text-[#dfc28c] font-bold">
              Featured Community Outreach
            </span>
            <h2 className="text-3xl md:text-5xl font-heading font-bold text-[#0a192f] mt-2">
              Kitende Charity Outreach
            </h2>
            <div className="w-24 h-1 bg-[#dfc28c] rounded-full mt-4" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Video Player Showcase */}
            <div className="lg:col-span-7">
              <div className="relative aspect-video rounded-3xl overflow-hidden shadow-2xl bg-zinc-950 border border-black/10 group">
                <iframe
                  src={videoEmbedUrl}
                  title="Kitende Charity Outreach - Edifice Properties Uganda"
                  className="w-full h-full border-0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
              <p className="text-xs text-zinc-400 text-center mt-3 font-medium">
                Watch: Highlights from the Edifice Properties Kitende Charity Outreach Event
              </p>
            </div>

            {/* Story Content */}
            <div className="lg:col-span-5 flex flex-col gap-6">
              <div className="bg-zinc-50 border border-zinc-200/80 p-8 rounded-3xl shadow-sm space-y-4">
                <p className="text-sm md:text-base text-zinc-700 leading-relaxed font-medium">
                  At Edifice Properties, we believe that building a better future goes beyond developing exceptional properties — it also means giving back to the communities around us.
                </p>

                <p className="text-sm md:text-base text-zinc-600 leading-relaxed">
                  As part of our <strong className="text-[#0a192f]">Kitende Charity Outreach</strong>, the entire Edifice Properties team came together to spend meaningful time with students and provide meals as a gesture of care, support and community.
                </p>

                <p className="text-sm md:text-base text-zinc-600 leading-relaxed">
                  The day was filled with smiles, interaction and a shared sense of purpose as our team connected with the students and school community. This initiative reflects our commitment to making a positive impact beyond real estate and contributing to the wellbeing of the communities we serve.
                </p>
              </div>

              {/* Quote Card */}
              <div className="bg-gradient-to-br from-[#0a192f] to-[#020c1b] text-white p-6 rounded-2xl border border-[#dfc28c]/30 shadow-lg relative overflow-hidden">
                <Sparkles className="absolute -right-4 -bottom-4 w-24 h-24 text-[#dfc28c]/10 pointer-events-none" />
                <p className="text-base md:text-lg font-heading font-bold text-[#dfc28c] leading-snug">
                  “Together, we build more than properties. We build hope, relationships and stronger communities.”
                </p>
                <span className="text-xs text-white/50 mt-2 block font-semibold">
                  — Edifice Properties Leadership & Team
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pillars of Impact */}
      <section className="py-20 bg-[#0a192f] text-white border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs uppercase font-bold text-[#dfc28c] tracking-widest">
              Core Principles
            </span>
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-white mt-2">
              Our Community Impact Pillars
            </h2>
            <p className="text-sm text-white/60 mt-4 leading-relaxed">
              Every project and outreach initiative by Edifice Properties is guided by sustainable community development principles.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Pillar 1 */}
            <div className="bg-white/5 border border-white/10 p-8 rounded-3xl flex flex-col gap-4 hover:border-[#dfc28c]/40 transition-colors">
              <div className="w-12 h-12 rounded-2xl bg-[#dfc28c]/15 text-[#dfc28c] flex items-center justify-center border border-[#dfc28c]/30">
                <Utensils size={24} />
              </div>
              <h3 className="font-heading text-xl font-bold text-white">
                Meal Provision & Student Support
              </h3>
              <p className="text-xs text-white/70 leading-relaxed">
                Nourishing young minds through direct food distribution and school meal sponsorships during community visits.
              </p>
            </div>

            {/* Pillar 2 */}
            <div className="bg-white/5 border border-white/10 p-8 rounded-3xl flex flex-col gap-4 hover:border-[#dfc28c]/40 transition-colors">
              <div className="w-12 h-12 rounded-2xl bg-[#dfc28c]/15 text-[#dfc28c] flex items-center justify-center border border-[#dfc28c]/30">
                <Users size={24} />
              </div>
              <h3 className="font-heading text-xl font-bold text-white">
                Youth & School Mentorship
              </h3>
              <p className="text-xs text-white/70 leading-relaxed">
                Engaging directly with students, sharing encouragement, and fostering career guidance across educational communities.
              </p>
            </div>

            {/* Pillar 3 */}
            <div className="bg-white/5 border border-white/10 p-8 rounded-3xl flex flex-col gap-4 hover:border-[#dfc28c]/40 transition-colors">
              <div className="w-12 h-12 rounded-2xl bg-[#dfc28c]/15 text-[#dfc28c] flex items-center justify-center border border-[#dfc28c]/30">
                <ShieldCheck size={24} />
              </div>
              <h3 className="font-heading text-xl font-bold text-white">
                Ethical & Sustainable Growth
              </h3>
              <p className="text-xs text-white/70 leading-relaxed">
                Integrating local job creation, environmental responsibility, and community infrastructure improvements in every development.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-gradient-to-br from-[#020c1b] to-[#0a192f] text-white border-t border-white/5">
        <div className="max-w-4xl mx-auto px-6 text-center flex flex-col items-center gap-6">
          <Award size={40} className="text-[#dfc28c]" />
          <h2 className="text-3xl md:text-4xl font-heading font-bold">
            Partner With Edifice On Future Community Initiatives
          </h2>
          <p className="text-sm md:text-base text-white/70 leading-relaxed max-w-2xl">
            Interested in learning more about our CSR programs or partnering on upcoming community outreach events across Kampala?
          </p>
          <div className="flex flex-wrap gap-4 justify-center mt-2">
            <Link
              href="/contact"
              className="px-8 py-4 bg-[#dfc28c] hover:bg-[#cfae74] text-[#020c1b] font-bold rounded-full text-xs uppercase tracking-wider transition-all shadow-lg flex items-center gap-2"
            >
              <span>Get In Touch With Our Team</span>
              <ArrowRight size={14} />
            </Link>
            <Link
              href="/about"
              className="px-8 py-4 bg-white/5 hover:bg-white/10 text-white font-bold rounded-full text-xs uppercase tracking-wider transition-all border border-white/10"
            >
              Learn More About Edifice
            </Link>
          </div>
        </div>
      </section>

      <Footer />
      <StickyCTAs />
    </main>
  );
}
