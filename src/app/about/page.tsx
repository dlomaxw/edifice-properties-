import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import StickyCTAs from '@/components/layout/StickyCTAs';
import ScrollReveal from '@/components/layout/ScrollReveal';
import { Sparkles, Sprout, Eye, HeartHandshake, Award, Coffee, Building2, ShieldCheck } from 'lucide-react';
import Image from 'next/image';

export const metadata = {
  title: 'About Us | Edifice Properties Uganda',
  description: 'Learn about Edifice Properties, Uganda’s design-led real estate developer. Founded in 2022 with a mission to craft premium residential spaces in Kampala.',
};

export default function AboutPage() {
  const pillars = [
    { title: 'Change Mindsets', description: 'Reimagining what urban residential living in Kampala can look and feel like.', icon: Sparkles },
    { title: 'Establish Credibility', description: 'Delivering uncompromised building standards, transparent titles, and on-time completion.', icon: ShieldCheck },
    { title: 'Evoke Emotions', description: 'Crafting spaces that resonate deeply, bringing joy, comfort, and pride to our homeowners.', icon: Eye },
    { title: 'Differentiation', description: 'Leading with distinct, artful architecture rather than replicating standard designs.', icon: Award },
  ];

  const missionItems = [
    {
      title: 'Innovate Luxury',
      description: 'Develop high-quality, luxurious residential and commercial properties that leverage the latest in technology and architectural thinking, while remaining financially accessible to a broad market segment.',
      icon: Sparkles,
    },
    {
      title: 'Sustainability',
      description: 'Commit to environmentally responsible building practices that minimize ecological impact and promote long-term sustainability, incorporating green technologies and renewable materials wherever possible.',
      icon: Sprout,
    },
    {
      title: 'Enhance Lifestyles',
      description: 'Focus on properties that offer enhanced lifestyles through smart home features, community amenities, and wellness-focused designs.',
      icon: Eye,
    },
    {
      title: 'Customer Focus',
      description: 'Maintain a steadfast focus on customer satisfaction and user experience, ensuring that all developments cater to the intricate needs and preferences of our clients.',
      icon: HeartHandshake,
    },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      {/* Hero Header */}
      <section className="relative pt-36 pb-20 bg-[#0a192f] text-white overflow-hidden border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 relative z-10 flex flex-col justify-end min-h-[180px]">
          <span className="text-xs uppercase tracking-[0.25em] text-[#dfc28c] font-bold">
            Our Story
          </span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold tracking-tight mt-2">
            Crafting Artful Suburbs
          </h1>
          <p className="text-white/50 text-sm md:text-base mt-4 max-w-2xl leading-relaxed">
            Uganda&apos;s design-led real estate developer creating high-quality properties and communities for sophisticated lifestyles.
          </p>
        </div>
      </section>      {/* Main Story Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <ScrollReveal direction="left" delay={0.1}>
            <div className="flex flex-col gap-6">
              <span className="text-xs uppercase tracking-[0.25em] text-[#dfc28c] font-bold">
                Who We Are
              </span>
              <h2 className="text-3xl md:text-4xl font-heading font-bold text-[#0a192f] tracking-tight">
                About Edifice Properties
              </h2>
              <div className="text-zinc-500 space-y-4 text-sm md:text-base leading-relaxed">
                <p>
                  Started with a casual conversation between three people having coffee at a cafe, talking about the development to overcome the housing deficit in Uganda aka The Pearl of Africa. Founded in 2022, Edifice Properties is Uganda’s design-led real estate developer and endeavours to craft beautiful properties and communities for high-quality lifestyles.
                </p>
                <p>
                  A truly customer-centric developer in the Ugandan real estate market, we develop beautiful residences in Kampala designed by incredible artistry and impeccable architecture.
                </p>
                <p>
                  Our customers&apos; refined tastes inspire us to create compelling luxury properties that consistently transcend fashions and trends. We dream to build residences for people who truly appreciate design – from the first principles to the last detail.
                </p>
              </div>
              
              <div className="flex items-center gap-4 mt-4 p-4 bg-white rounded-2xl border border-black/5 shadow-sm">
                <div className="w-12 h-12 rounded-full bg-[#dfc28c]/10 flex items-center justify-center text-[#dfc28c] shrink-0">
                  <Coffee size={20} />
                </div>
                <p className="text-xs font-medium text-zinc-500 italic">
                  &ldquo;Started with a casual conversation between three people having coffee at a cafe...&rdquo;
                </p>
              </div>
            </div>
          </ScrollReveal>

          <ScrollReveal direction="right" delay={0.2}>
            <div className="relative aspect-[4/3] bg-zinc-950 rounded-3xl overflow-hidden shadow-2xl border border-black/5 hover:scale-[1.02] transition-transform duration-500">
              <Image
                src="/assets/images/horizon.png"
                alt="Edifice properties design rendering"
                fill
                className="object-cover"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
              <div className="absolute bottom-8 left-8 right-8 text-white">
                <span className="text-[10px] uppercase tracking-wider text-[#dfc28c] font-bold">design philosophy</span>
                <p className="text-lg font-heading font-bold mt-1">Impeccable Architecture & Artistry</p>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Four Pillars Section */}
      <section className="py-24 bg-[#0a192f] text-white border-y border-white/5">
        <div className="max-w-7xl mx-auto px-6">
          <ScrollReveal direction="up" delay={0.1}>
            <div className="max-w-3xl mb-16 text-center lg:text-left">
              <span className="text-xs uppercase tracking-[0.25em] text-[#dfc28c] font-bold">
                Our Pillars
              </span>
              <h2 className="text-3xl md:text-4xl font-heading font-bold text-white tracking-tight mt-2">
                Every property is built on four key pillars
              </h2>
              <p className="text-white/50 text-sm mt-4 leading-relaxed">
                We guide our project planning, engineering, and service delivery through a strict value system designed to deliver lasting property appreciation.
              </p>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {pillars.map((pillar, idx) => {
              const Icon = pillar.icon;
              return (
                <ScrollReveal key={pillar.title} direction="up" delay={0.1 * idx} className="flex">
                  <div className="bg-white/5 border border-white/5 p-8 rounded-3xl flex flex-col gap-4 hover:border-gold-500/40 hover:bg-white/10 transition-all duration-300 w-full">
                    <div className="w-12 h-12 rounded-full bg-[#dfc28c]/10 flex items-center justify-center text-[#dfc28c]">
                      <Icon size={22} />
                    </div>
                    <h3 className="text-lg font-heading font-bold text-white mt-2">{pillar.title}</h3>
                    <p className="text-xs text-white/50 leading-relaxed">{pillar.description}</p>
                  </div>
                </ScrollReveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <ScrollReveal direction="up" delay={0.1}>
            <div className="max-w-3xl mb-16">
              <span className="text-xs uppercase tracking-[0.25em] text-[#dfc28c] font-bold">
                Our Vision
              </span>
              <h2 className="text-3xl md:text-4xl font-heading font-bold text-[#0a192f] tracking-tight mt-2">
                Our Corporate Mission
              </h2>
              <p className="text-zinc-500 text-sm mt-4 leading-relaxed">
                To build a reliable bridge between luxury living and financial feasibility, creating long-term value for investors and beautiful homes for owners.
              </p>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {missionItems.map((item, idx) => {
              const Icon = item.icon;
              return (
                <ScrollReveal key={item.title} direction="up" delay={0.1 * idx}>
                  <div className="bg-white border border-black/5 p-8 rounded-3xl flex items-start gap-6 shadow-sm hover:shadow-md transition-all duration-300 h-full">
                    <div className="w-12 h-12 rounded-full bg-[#0a192f]/5 flex items-center justify-center text-[#dfc28c] shrink-0">
                      <Icon size={20} />
                    </div>
                    <div className="flex flex-col gap-2">
                      <h3 className="text-lg font-heading font-bold text-[#0a192f]">{item.title}</h3>
                      <p className="text-xs text-zinc-500 leading-relaxed">{item.description}</p>
                    </div>
                  </div>
                </ScrollReveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* Global Skylines Section */}
      <section className="py-24 bg-[#0a192f] text-white border-t border-white/5 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
          <div className="lg:col-span-7 flex flex-col gap-6">
            <span className="text-xs uppercase tracking-[0.25em] text-[#dfc28c] font-bold">
              Global Standards
            </span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-heading font-bold text-white tracking-tight leading-[1.15]">
              Redefining Global Skylines
            </h2>
            <div className="text-white/60 space-y-4 text-sm md:text-base leading-relaxed">
              <p>
                At Edifice, we pride ourselves on redefining cityscapes across the globe. We’re not just about constructing iconic buildings; our vision transcends traditional boundaries.
              </p>
              <p>
                We aim to reshape the essence of urban living by creating self-contained micro-cities that flawlessly blend residential, commercial, and recreational spaces, delivering a comprehensive urban experience tailored for the modern individual.
              </p>
            </div>
          </div>
          
          <div className="lg:col-span-5 bg-white/5 border border-white/5 p-8 rounded-3xl flex flex-col justify-center text-center items-center gap-6 min-h-[300px]">
            <Building2 className="text-[#dfc28c]" size={48} />
            <h3 className="text-xl font-heading font-bold">Get Your Dream House</h3>
            <p className="text-xs text-white/50 max-w-sm">
              Get in touch with us and our experts and developers would love to contribute their expertise and insights and help you today.
            </p>
            <a 
              href="/contact" 
              className="px-6 py-3 bg-[#dfc28c] hover:bg-[#d4af37] text-[#020c1b] font-semibold text-xs tracking-wider uppercase rounded-xl transition-all duration-300 shadow-lg"
            >
              Contact Our Experts
            </a>
          </div>
        </div>
      </section>

      <Footer />
      <StickyCTAs />
    </div>
  );
}
