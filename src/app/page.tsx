import { db } from '@/lib/db';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import StickyCTAs from '@/components/layout/StickyCTAs';
import HeroSlider from '@/components/home/HeroSlider';
import PropertySlider from '@/components/home/PropertySlider';
import VideoModal from '@/components/home/VideoModal';
import HomeForm from '@/components/home/HomeForm';
import ScrollReveal from '@/components/layout/ScrollReveal';
import { Shield, Sparkles, Sprout, HeartHandshake, Eye, Phone, Mail, ChevronRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  // Fetch properties, settings, and latest blogs
  const properties = await db.property.findMany({
    orderBy: { orderIndex: 'asc' },
  });

  const latestBlogs = await db.blog.findMany({
    orderBy: { dateCreated: 'desc' },
    take: 2,
  });

  const settingsDb = await db.setting.findMany();
  const settings = settingsDb.reduce((acc: any, curr) => {
    acc[curr.key] = curr.value;
    return acc;
  }, {});

  const contactList = [
    { label: 'Primary Call', value: settings.phone_primary || '+256786000112', href: `tel:${settings.phone_primary || '+256786000112'}` },
    { label: 'Secondary Call', value: settings.phone_alt1 || '+256763700206', href: `tel:${settings.phone_alt1 || '+256763700206'}` },
    { label: 'Sales Office', value: settings.phone_alt2 || '+256766759416', href: `tel:${settings.phone_alt2 || '+256766759416'}` },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Navbar />

      {/* Hero Section */}
      <HeroSlider properties={properties} />

      {/* Exclusive Offer Banner */}
      <section className="bg-[#020c1b] text-white py-6 border-y border-white/5 shadow-inner">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
          <div className="flex items-center gap-3">
            <span className="w-2.5 h-2.5 rounded-full bg-gold-500 animate-ping shrink-0" />
            <p className="text-xs font-bold tracking-widest uppercase text-white/90">
              {settings.home_exclusive_offer_banner_tag || 'Exclusive Portfolio Offer'}
            </p>
          </div>
          <p className="text-sm text-gold-500 font-semibold tracking-wide">
            {settings.home_exclusive_offer_banner_text || 'Discount of up to 3% on specific 1BHK, 2BHK & 3BHK premium suites. Limited inventory remaining.'}
          </p>
        </div>
      </section>

      {/* Featured Properties Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <ScrollReveal direction="up" delay={0.1}>
            <div className="max-w-3xl mb-16">
              <span className="text-xs uppercase tracking-[0.25em] text-gold-500 font-bold">
                {settings.home_featured_properties_tag || 'Exclusive Portfolio'}
              </span>
              <h2 className="text-4xl md:text-5xl font-heading font-bold text-[#0a192f] tracking-tight mt-2 leading-[1.15]">
                {settings.home_featured_properties_title || 'Beyond shaping skylines, Edifice is shaping futures'}
              </h2>
              <p className="text-zinc-500 text-sm md:text-base mt-4 leading-relaxed">
                {settings.home_featured_properties_desc || 'Dive into our world where architectural prowess meets natural design, curating urban oases that redefine modern living in Kampala.'}
              </p>
            </div>
          </ScrollReveal>

          <ScrollReveal direction="up" delay={0.3}>
            <PropertySlider properties={properties} />
          </ScrollReveal>
        </div>
      </section>

      {/* About Section & Pillars */}
      <section className="py-24 bg-[#0a192f] text-white border-y border-white/5 relative overflow-hidden">
        {/* Glowing background highlights */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-gold-500/5 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#020c1b]/40 rounded-full blur-[100px] pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-6 relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <ScrollReveal direction="left" delay={0.1}>
            <div>
              <span className="text-xs uppercase tracking-[0.25em] text-gold-500 font-bold">
                {settings.home_identity_tag || 'Our Identity'}
              </span>
              <h2 className="text-4xl md:text-5xl font-heading font-bold text-white tracking-tight mt-2 leading-[1.15]">
                {settings.home_identity_title || 'Redefining urban spaces for future living'}
              </h2>
              <p className="text-white/60 text-sm md:text-base leading-relaxed mt-6">
                {settings.home_identity_desc1 || 'Started with a casual conversation between three people having coffee at a cafe, talking about developments to overcome the housing deficit in Uganda, the Pearl of Africa. Founded in 2022, Edifice Properties is Uganda’s design-led real estate developer and endeavours to craft beautiful properties and communities for high-quality lifestyles.'}
              </p>
              <p className="text-white/60 text-sm md:text-base leading-relaxed mt-4">
                {settings.home_identity_desc2 || 'A truly customer-centric developer in the Ugandan real estate market, we develop beautiful residences in Kampala designed by incredible artistry and impeccable architecture.'}
              </p>
            </div>
          </ScrollReveal>

          {/* Pillars Bento-like Layout */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ScrollReveal direction="up" delay={0.1}>
              <div className="bg-white/5 border border-white/5 p-6 rounded-2xl flex flex-col gap-4 hover:border-gold-500/40 hover:bg-white/10 transition-all duration-300">
                <Sparkles className="text-gold-500" size={28} />
                <h3 className="text-lg font-heading font-bold">{settings.home_pillar1_title || 'Innovate Luxury'}</h3>
                <p className="text-xs text-white/50 leading-relaxed">
                  {settings.home_pillar1_desc || 'Develop high-quality, luxurious residential and commercial properties that leverage the latest in technology and architectural thinking, remaining financially accessible.'}
                </p>
              </div>
            </ScrollReveal>
            <ScrollReveal direction="up" delay={0.2}>
              <div className="bg-white/5 border border-white/5 p-6 rounded-2xl flex flex-col gap-4 hover:border-gold-500/40 hover:bg-white/10 transition-all duration-300">
                <Sprout className="text-gold-500" size={28} />
                <h3 className="text-lg font-heading font-bold">{settings.home_pillar2_title || 'Sustainability'}</h3>
                <p className="text-xs text-white/50 leading-relaxed">
                  {settings.home_pillar2_desc || 'Commit to environmentally responsible building practices that minimize ecological impact, incorporating green tech and renewable materials where possible.'}
                </p>
              </div>
            </ScrollReveal>
            <ScrollReveal direction="up" delay={0.3}>
              <div className="bg-white/5 border border-white/5 p-6 rounded-2xl flex flex-col gap-4 hover:border-gold-500/40 hover:bg-white/10 transition-all duration-300">
                <Eye className="text-gold-500" size={28} />
                <h3 className="text-lg font-heading font-bold">{settings.home_pillar3_title || 'Enhance Lifestyles'}</h3>
                <p className="text-xs text-white/50 leading-relaxed">
                  {settings.home_pillar3_desc || 'Focus on properties that offer enhanced lifestyles through smart-home ready systems, resort-style shared amenities, and wellness-focused communal designs.'}
                </p>
              </div>
            </ScrollReveal>
            <ScrollReveal direction="up" delay={0.4}>
              <div className="bg-white/5 border border-white/5 p-6 rounded-2xl flex flex-col gap-4 hover:border-gold-500/40 hover:bg-white/10 transition-all duration-300">
                <HeartHandshake className="text-gold-500" size={28} />
                <h3 className="text-lg font-heading font-bold">{settings.home_pillar4_title || 'Customer Focus'}</h3>
                <p className="text-xs text-white/50 leading-relaxed">
                  {settings.home_pillar4_desc || 'Maintain a steadfast focus on customer satisfaction, providing clear title guarantees, transparent purchase steps, and reliable post-handover support.'}
                </p>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Leadership Section - Visionary Co-Founders */}
      <section className="py-24 bg-white border-b border-zinc-100">
        <div className="max-w-7xl mx-auto px-6">
          <ScrollReveal direction="up" delay={0.1}>
            <div className="max-w-3xl mb-16">
              <span className="text-xs uppercase tracking-[0.25em] text-gold-500 font-bold">
                Our Leadership
              </span>
              <h2 className="text-4xl md:text-5xl font-heading font-bold text-[#0a192f] tracking-tight mt-2 leading-[1.15]">
                The Visionaries Behind Edifice Properties
              </h2>
              <p className="text-zinc-500 text-sm md:text-base mt-4 leading-relaxed">
                Guided by unmatched industry foresight and a commitment to architectural excellence, our co-founders have steered Edifice to redefine modern urban living in Kampala.
              </p>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16">
            {/* CEO Card 1 */}
            <ScrollReveal direction="right" delay={0.2} className="flex">
              <div className="group flex flex-col md:flex-row gap-6 lg:gap-8 items-center md:items-start bg-white p-6 md:p-8 rounded-3xl border border-[#dfc28c]/30 hover:border-[#dfc28c] shadow-lg hover:shadow-xl transition-all duration-300 w-full">
                <div className="relative w-48 h-56 rounded-2xl overflow-hidden shrink-0 bg-[#0a192f] shadow-md border-2 border-[#dfc28c]/30">
                  <img
                    src={settings.cofounder1_image || "/assets/images/Mr.-abbas-Message-02-1.jpg"}
                    alt={settings.cofounder1_name || "Abbas Rasheed"}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 filter contrast-[1.05]"
                  />
                </div>
                <div className="flex flex-col justify-center text-center md:text-left">
                  <span className="text-xs text-gold-500 font-bold uppercase tracking-wider">Vision Statement</span>
                  <h3 className="font-heading text-xl md:text-2xl font-bold text-[#0a192f] mt-1">{settings.cofounder1_name || "Abbas Rasheed"}</h3>
                  <span className="text-xs text-zinc-400 font-semibold mt-0.5">{settings.cofounder1_title || "C. E. O, Edifice Properties Limited"}</span>
                  <p className="text-zinc-500 text-xs md:text-sm leading-relaxed mt-4">
                    &ldquo;{settings.cofounder1_statement || "Our focus is to redefine the standard of living by integrating cutting-edge technology and modern design with innovative luxury, making luxury accessible for everyone. Our vision is to create homes that not only boast aesthetic excellence and innovative features but also enhance the living experience of our customers through sustainability and smart solutions."}&rdquo;
                  </p>
                </div>
              </div>
            </ScrollReveal>

            {/* CEO Card 2 */}
            <ScrollReveal direction="left" delay={0.3} className="flex">
              <div className="group flex flex-col md:flex-row gap-6 lg:gap-8 items-center md:items-start bg-white p-6 md:p-8 rounded-3xl border border-[#dfc28c]/30 hover:border-[#dfc28c] shadow-lg hover:shadow-xl transition-all duration-300 w-full">
                <div className="relative w-48 h-56 rounded-2xl overflow-hidden shrink-0 bg-[#0a192f] shadow-md border-2 border-[#dfc28c]/30">
                  <img
                    src={settings.cofounder2_image || "/assets/images/WhatsApp-Image-2025-10-01-at-1.01.10-PM.jpeg"}
                    alt={settings.cofounder2_name || "Mr. Mou Shaojiu"}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 filter contrast-[1.05]"
                  />
                </div>
                <div className="flex flex-col justify-center text-center md:text-left">
                  <span className="text-xs text-gold-500 font-bold uppercase tracking-wider">Message From The Director</span>
                  <h3 className="font-heading text-xl md:text-2xl font-bold text-[#0a192f] mt-1">{settings.cofounder2_name || "Mr. Mou Shaojiu"}</h3>
                  <span className="text-xs text-zinc-400 font-semibold mt-0.5">{settings.cofounder2_title || "Director, Edifice Properties Limited"}</span>
                  <p className="text-zinc-500 text-xs md:text-sm leading-relaxed mt-4">
                    &ldquo;{settings.cofounder2_statement || "At Edifice Properties Limited, we believe that construction is not just about building structures, but about creating enduring value for our clients and communities. With a strong foundation in both construction management and contractor supervision, I personally ensure that every project is executed with precision, efficiency, and integrity."}&rdquo;
                  </p>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Cinematic Media Section */}
      <section className="py-24 bg-white border-b border-zinc-100">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs uppercase tracking-[0.25em] text-gold-500 font-bold">
              Immersive Experience
            </span>
            <h2 className="text-4xl md:text-5xl font-heading font-bold text-[#0a192f] tracking-tight mt-2">
              Step Into Your Next Home
            </h2>
            <p className="text-zinc-500 text-sm md:text-base mt-4">
              View our cinematic walkthrough video and discover the luxury, layout, and finishings that define our standard of excellence.
            </p>
          </div>

          <VideoModal
            videoUrl={settings.youtube_hero_url || 'https://youtu.be/LYgWq4vRT8c?si=ZIuQnIDVuzGkP-oh'}
            thumbnail={settings.home_video_thumbnail || "/assets/images/horizon.png"}
            title={settings.home_video_title || "Horizon Residency & Edifice Property Developments"}
          />
        </div>
      </section>

      {/* Latest News & Flyers Section */}
      <section className="py-24 bg-zinc-50 border-b border-zinc-100">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-16">
            <ScrollReveal direction="up" delay={0.1}>
              <div>
                <span className="text-xs uppercase tracking-[0.25em] text-gold-500 font-bold">
                  News & Flyers
                </span>
                <h2 className="text-4xl md:text-5xl font-heading font-bold text-[#0a192f] tracking-tight mt-2 leading-[1.15]">
                  Latest Updates & Exclusive Offers
                </h2>
                <p className="text-zinc-500 text-sm mt-3 leading-relaxed max-w-xl">
                  Stay updated with construction milestones, new luxury flyers, promotional brochures, and property insights published by our marketing desk.
                </p>
              </div>
            </ScrollReveal>
            <ScrollReveal direction="up" delay={0.2} className="shrink-0">
              <Link 
                href="/blog" 
                className="px-6 py-3 bg-[#0a192f] hover:bg-[#0a192f]/90 text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-all shadow-md inline-flex items-center gap-1.5"
              >
                <span>View All Updates</span>
                <ChevronRight size={14} />
              </Link>
            </ScrollReveal>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {latestBlogs.map((blog, idx) => (
              <ScrollReveal key={blog.id} direction={idx === 0 ? "left" : "right"} delay={0.2} className="flex">
                <div className="group flex flex-col bg-white rounded-3xl border border-zinc-100 hover:border-[#dfc28c]/50 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden w-full">
                  <div className="relative h-64 w-full bg-[#0a192f] overflow-hidden">
                    <img 
                      src={blog.featuredImage || "/assets/images/horizon.png"} 
                      alt={blog.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <span className="absolute top-4 left-4 px-3 py-1 bg-white text-[#0a192f] text-[10px] font-bold uppercase tracking-wider rounded-full shadow-md">
                      {blog.category}
                    </span>
                  </div>
                  <div className="p-8 flex flex-col flex-1 justify-between gap-4">
                    <div className="flex flex-col gap-2">
                      <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider">
                        {new Date(blog.dateCreated).toLocaleDateString(undefined, {
                          year: 'numeric', month: 'long', day: 'numeric'
                        })}
                      </span>
                      <h3 className="font-heading text-xl font-bold text-[#0a192f] leading-snug group-hover:text-gold-500 transition-colors">
                        {blog.title}
                      </h3>
                      <p className="text-zinc-500 text-xs md:text-sm leading-relaxed line-clamp-3">
                        {blog.seoDescription}
                      </p>
                    </div>
                    <Link 
                      href={`/blog/${blog.slug}`}
                      className="text-xs font-bold text-[#0a192f] group-hover:text-gold-500 transition-colors flex items-center gap-1 mt-2 self-start"
                    >
                      <span>Read More</span>
                      <ChevronRight size={14} />
                    </Link>
                  </div>
                </div>
              </ScrollReveal>
            ))}

            {latestBlogs.length === 0 && (
              <>
                <ScrollReveal direction="left" delay={0.2} className="flex">
                  <div className="group flex flex-col bg-white rounded-3xl border border-zinc-100 hover:border-[#dfc28c]/50 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden w-full">
                    <div className="relative h-64 w-full bg-[#0a192f] overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-tr from-[#0a192f] to-[#172a45] flex items-center justify-center">
                        <span className="text-white/10 font-black text-6xl tracking-widest uppercase">FLYERS</span>
                      </div>
                      <span className="absolute top-4 left-4 px-3 py-1 bg-white text-[#0a192f] text-[10px] font-bold uppercase tracking-wider rounded-full shadow-md">
                        Flyer Announcement
                      </span>
                    </div>
                    <div className="p-8 flex flex-col flex-1 justify-between gap-4">
                      <div className="flex flex-col gap-2">
                        <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider">Campaign Release</span>
                        <h3 className="font-heading text-xl font-bold text-[#0a192f] leading-snug">
                          Horizon Residency Launch Flyer & Brochure
                        </h3>
                        <p className="text-zinc-500 text-xs md:text-sm leading-relaxed">
                          Discover premium 1BHK, 2BHK, and 3BHK suites on Luthuli Avenue, Bugolobi. Download our official flyer detailing payment terms and design layout specs.
                        </p>
                      </div>
                      <Link 
                        href="/blog"
                        className="text-xs font-bold text-[#0a192f] flex items-center gap-1 mt-2 self-start"
                      >
                        <span>Download Flyer</span>
                        <ChevronRight size={14} />
                      </Link>
                    </div>
                  </div>
                </ScrollReveal>

                <ScrollReveal direction="right" delay={0.3} className="flex">
                  <div className="group flex flex-col bg-white rounded-3xl border border-zinc-100 hover:border-[#dfc28c]/50 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden w-full">
                    <div className="relative h-64 w-full bg-[#0a192f] overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-tr from-[#020c1b] to-[#0a192f] flex items-center justify-center">
                        <span className="text-white/10 font-black text-6xl tracking-widest uppercase">NEWS</span>
                      </div>
                      <span className="absolute top-4 left-4 px-3 py-1 bg-white text-[#0a192f] text-[10px] font-bold uppercase tracking-wider rounded-full shadow-md">
                        News & Updates
                      </span>
                    </div>
                    <div className="p-8 flex flex-col flex-1 justify-between gap-4">
                      <div className="flex flex-col gap-2">
                        <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider">Construction Update</span>
                        <h3 className="font-heading text-xl font-bold text-[#0a192f] leading-snug">
                          Elite Palazzo Naguru Excavation & Piling Complete
                        </h3>
                        <p className="text-zinc-500 text-xs md:text-sm leading-relaxed">
                          We are proud to report that groundwork earth excavation and boundary retaining walls for Elite Palazzo have completed successfully on schedule.
                        </p>
                      </div>
                      <Link 
                        href="/blog"
                        className="text-xs font-bold text-[#0a192f] flex items-center gap-1 mt-2 self-start"
                      >
                        <span>Read News Report</span>
                        <ChevronRight size={14} />
                      </Link>
                    </div>
                  </div>
                </ScrollReveal>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-24 bg-[#0a192f] text-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="max-w-3xl mb-16">
            <span className="text-xs uppercase tracking-[0.25em] text-gold-500 font-bold">
              Testimonials
            </span>
            <h2 className="text-4xl md:text-5xl font-heading font-bold tracking-tight mt-2">
              What Our Homeowners Say
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white/5 border border-white/5 p-8 rounded-3xl flex flex-col justify-between min-h-[300px]">
              <p className="text-white/70 italic leading-relaxed text-sm">
                &ldquo;{settings.testimonial1_text || "Buying my first apartment with Edifice Properties was the best decision I ever made. The team guided me through every step, from the site visit to paperwork, making the process smooth and stress-free. Today, I’m a proud home owner and couldn’t be happier with the quality and finishing of my home."}&rdquo;
              </p>
              <div className="mt-8 border-t border-white/10 pt-4 flex flex-col">
                <span className="font-heading font-bold text-gold-500">{settings.testimonial1_name || "Sarah K."}</span>
                <span className="text-xs text-white/40">{settings.testimonial1_role || "Kampala Resident"}</span>
              </div>
            </div>

            <div className="bg-white/5 border border-white/5 p-8 rounded-3xl flex flex-col justify-between min-h-[300px]">
              <p className="text-white/70 italic leading-relaxed text-sm">
                &ldquo;{settings.testimonial2_text || "Our family needed more space, and Edifice Properties delivered beyond our expectations. The 3BHK apartment at Horizon Residency has everything we dreamed of – modern design, secure environment, and great amenities for our kids. It truly feels like home."}&rdquo;
              </p>
              <div className="mt-8 border-t border-white/10 pt-4 flex flex-col">
                <span className="font-heading font-bold text-gold-500">{settings.testimonial2_name || "Mr. Okello"}</span>
                <span className="text-xs text-white/40">{settings.testimonial2_role || "Entebbe Resident"}</span>
              </div>
            </div>

            <div className="bg-white/5 border border-white/5 p-8 rounded-3xl flex flex-col justify-between min-h-[300px]">
              <p className="text-white/70 italic leading-relaxed text-sm">
                &ldquo;{settings.testimonial3_text || "As an investor, I look for professionalism and reliability. Edifice Properties not only provided excellent property options but also gave me a strong return on my investment. Their projects are strategically located and built with great attention to detail."}&rdquo;
              </p>
              <div className="mt-8 border-t border-white/10 pt-4 flex flex-col">
                <span className="font-heading font-bold text-gold-500">{settings.testimonial3_name || "James M."}</span>
                <span className="text-xs text-white/40">{settings.testimonial3_role || "Real Estate Investor"}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Enquiry Form & Maps Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-16">
          
          {/* Info Details */}
          <div className="lg:col-span-5 flex flex-col justify-center">
            <span className="text-xs uppercase tracking-[0.25em] text-gold-500 font-bold">
              Connect With Us
            </span>
            <h2 className="text-4xl md:text-5xl font-heading font-bold text-[#0a192f] tracking-tight mt-2 leading-[1.15]">
              Let&apos;s start your homeownership journey
            </h2>
            <p className="text-zinc-500 text-sm leading-relaxed mt-6">
              We dream to build residences for people who truly appreciate design - from the first principles to the last detail. Reach out to our consultants or visit our main office in Kololo.
            </p>

            <div className="flex flex-col gap-6 mt-10">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-[#0a192f] rounded-full flex items-center justify-center text-gold-500 shadow-md">
                  <Phone size={20} />
                </div>
                <div className="flex flex-col text-sm">
                  <span className="font-bold text-[#0a192f]">Call Sales Desk</span>
                  <div className="flex flex-wrap gap-x-4 gap-y-1 text-zinc-500 font-semibold mt-0.5">
                    <a href={`tel:${settings.phone_primary || '+256786000112'}`} className="hover:text-gold-500 transition-colors">{settings.phone_primary || '+256 786 000 112'}</a>
                    <a href={`tel:${settings.phone_alt1 || '+256763700206'}`} className="hover:text-gold-500 transition-colors">{settings.phone_alt1 || '+256 763 700 206'}</a>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-[#0a192f] rounded-full flex items-center justify-center text-gold-500 shadow-md">
                  <Mail size={20} />
                </div>
                <div className="flex flex-col text-sm">
                  <span className="font-bold text-[#0a192f]">Email Inquiries</span>
                  <a
                    href={`mailto:${settings.contact_email || 'edificepropertiesltd@gmail.com'}`}
                    className="text-zinc-500 font-semibold hover:text-gold-500 transition-colors break-all mt-0.5"
                  >
                    {settings.contact_email || 'edificepropertiesltd@gmail.com'}
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="lg:col-span-7">
            <HomeForm properties={properties} />
          </div>

        </div>
      </section>

      {/* Office Maps Embed Section */}
      <section className="h-[450px] w-full relative border-t border-zinc-100">
        <iframe
          src={settings.map_iframe_url || "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3989.742880345094!2d32.59733471475396!3d0.33870809975306606!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x177dbb0e35dc8f5d%3A0x7d0fa5a40bf5b9f7!2sKanjokya%20St%2C%20Kampala!5e0!3m2!1sen!2sug!4v1700000000000!5m2!1sen!2sug"}
          className="absolute inset-0 w-full h-full border-0 grayscale filter contrast-125 brightness-95"
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </section>

      <Footer />
      <StickyCTAs />
    </div>
  );
}
