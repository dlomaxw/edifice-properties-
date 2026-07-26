import { db } from '@/lib/db';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import StickyCTAs from '@/components/layout/StickyCTAs';
import ScrollReveal from '@/components/layout/ScrollReveal';
import HomeForm from '@/components/home/HomeForm';
import { 
  Globe, ShieldCheck, Video, CreditCard, Award, 
  HelpCircle, ArrowRight, CheckCircle2, Phone, Mail, Building2 
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export const metadata = {
  title: 'Buy Property in Uganda From Abroad | Diaspora Investment Guide',
  description: 'Dedicated property investment guide for Ugandans living abroad in UK, USA, Canada, UAE, and South Africa. Buy apartments safely in Kampala with verified title deeds, virtual tours, and remote payment plans.',
  alternates: {
    canonical: 'https://edificepropertiesug.com/diaspora',
  },
  openGraph: {
    title: 'Buy Property in Uganda From Abroad | Diaspora Investment Guide',
    description: 'Invest safely in Kampala apartments from overseas. Verified condominium titles, virtual tours, and flexible diaspora payment plans.',
    url: 'https://edificepropertiesug.com/diaspora',
    siteName: 'Edifice Properties',
    type: 'website',
  },
};

export const dynamic = 'force-dynamic';

export default async function DiasporaPage() {
  const properties = await db.property.findMany({
    where: { status: { not: 'Sold out' } },
    orderBy: { orderIndex: 'asc' },
    take: 3,
  });

  const faqs = [
    {
      q: 'How can I safely buy an apartment in Kampala while living abroad?',
      a: 'Edifice Properties provides a complete remote purchase service. You receive verified digital title deeds, legal sales agreements prepared by accredited Ugandan advocates, live HD video walkthroughs, and secure international bank wire transfer channels.',
    },
    {
      q: 'Can I inspect the property without traveling to Uganda?',
      a: 'Yes! We conduct interactive 1-on-1 virtual site visits via WhatsApp, Zoom, or Google Meet. Our team walks you through the construction site, floor plans, and surrounding neighborhood metrics in real time.',
    },
    {
      q: 'What payment plans are available for diaspora buyers?',
      a: 'We offer flexible 12-to-36-month interest-free installment plans with a low initial deposit. You can transfer funds directly via wire transfer, WorldRemit, or corporate escrow bank accounts in USD or UGX.',
    },
    {
      q: 'Will Edifice manage my property and find tenants if I buy to let?',
      a: 'Yes. For diaspora investors seeking passive income, Edifice offers full property management options—including tenant vetting, rent collection, routine maintenance, and monthly dividend disbursements to your account.',
    },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-white text-zinc-800">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-36 pb-24 bg-[#020c1b] text-white overflow-hidden border-b border-white/5">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#0a192f] via-[#020c1b] to-black opacity-80" />
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <ScrollReveal direction="up" delay={0.1}>
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-bold uppercase tracking-widest text-[#dfc28c] mb-6">
                <Globe size={14} />
                <span>Uganda Diaspora Property Investment</span>
              </div>
              <h1 className="text-4xl md:text-6xl font-heading font-extrabold tracking-tight leading-[1.1] text-white">
                Invest in Kampala Real Estate From Abroad with 100% Peace of Mind
              </h1>
              <p className="text-white/70 text-base md:text-xl mt-6 leading-relaxed">
                Build lasting wealth in Uganda from anywhere in the UK, USA, Canada, UAE, or Europe. Own verified condominium apartments in Bugolobi, Naguru, and Kulambiro with flexible payment plans.
              </p>

              <div className="flex flex-wrap gap-4 mt-8">
                <a
                  href="#diaspora-form"
                  className="px-8 py-4 bg-[#dfc28c] hover:bg-white text-[#020c1b] font-bold rounded-full text-xs uppercase tracking-wider transition-all duration-300 shadow-xl hover:scale-105"
                >
                  Book Remote Consultation
                </a>
                <a
                  href="https://wa.me/256786000112?text=Hello%20Edifice%20Properties%2C%20I%20am%20living%20abroad%20and%20interested%20in%20diaspora%20property%20investment."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-8 py-4 bg-white/10 hover:bg-white/20 text-white font-bold rounded-full text-xs uppercase tracking-wider transition-all duration-300 border border-white/10"
                >
                  WhatsApp Diaspora Desk
                </a>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Key Pillars for Overseas Investors */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <ScrollReveal direction="up" delay={0.1}>
            <div className="text-center max-w-2xl mx-auto mb-16">
              <span className="text-xs uppercase tracking-[0.25em] text-[#dfc28c] font-bold block mb-2">
                Why Diaspora Buyers Choose Edifice
              </span>
              <h2 className="text-3xl md:text-4xl font-heading font-bold text-[#0a192f]">
                Designed Specifically for Remote & Overseas Homeowners
              </h2>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <ScrollReveal direction="up" delay={0.1}>
              <div className="p-8 rounded-3xl bg-[#0a192f] text-white border border-white/5 flex flex-col gap-4 shadow-xl">
                <div className="w-12 h-12 rounded-2xl bg-[#dfc28c]/10 text-[#dfc28c] flex items-center justify-center">
                  <ShieldCheck size={24} />
                </div>
                <h3 className="font-heading font-bold text-xl">Verified Legal Titles</h3>
                <p className="text-xs text-white/60 leading-relaxed">
                  Clear condominium title deeds verified by accredited Ugandan advocates before you commit a single shilling.
                </p>
              </div>
            </ScrollReveal>

            <ScrollReveal direction="up" delay={0.2}>
              <div className="p-8 rounded-3xl bg-[#0a192f] text-white border border-white/5 flex flex-col gap-4 shadow-xl">
                <div className="w-12 h-12 rounded-2xl bg-[#dfc28c]/10 text-[#dfc28c] flex items-center justify-center">
                  <Video size={24} />
                </div>
                <h3 className="font-heading font-bold text-xl">Live Virtual Site Tours</h3>
                <p className="text-xs text-white/60 leading-relaxed">
                  Join interactive 1-on-1 video walkthroughs to inspect construction milestones, view mock rooms, and check neighborhood views.
                </p>
              </div>
            </ScrollReveal>

            <ScrollReveal direction="up" delay={0.3}>
              <div className="p-8 rounded-3xl bg-[#0a192f] text-white border border-white/5 flex flex-col gap-4 shadow-xl">
                <div className="w-12 h-12 rounded-2xl bg-[#dfc28c]/10 text-[#dfc28c] flex items-center justify-center">
                  <CreditCard size={24} />
                </div>
                <h3 className="font-heading font-bold text-xl">Flexible Payment Plans</h3>
                <p className="text-xs text-white/60 leading-relaxed">
                  Spread payments comfortably over 12 to 36 months in USD or UGX via secure escrow bank accounts without high interest rates.
                </p>
              </div>
            </ScrollReveal>

            <ScrollReveal direction="up" delay={0.4}>
              <div className="p-8 rounded-3xl bg-[#0a192f] text-white border border-white/5 flex flex-col gap-4 shadow-xl">
                <div className="w-12 h-12 rounded-2xl bg-[#dfc28c]/10 text-[#dfc28c] flex items-center justify-center">
                  <Award size={24} />
                </div>
                <h3 className="font-heading font-bold text-xl">Turnkey Rental Returns</h3>
                <p className="text-xs text-white/60 leading-relaxed">
                  Earn solid passive income with fully managed corporate tenant placement and monthly dividend transfers directly overseas.
                </p>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* 4-Step Remote Buying Workflow */}
      <section className="py-24 bg-zinc-50 border-y border-zinc-200">
        <div className="max-w-7xl mx-auto px-6">
          <ScrollReveal direction="up" delay={0.1}>
            <div className="max-w-2xl mb-16">
              <span className="text-xs uppercase tracking-[0.25em] text-[#dfc28c] font-bold block mb-2">
                Simple & Transparent
              </span>
              <h2 className="text-3xl md:text-4xl font-heading font-bold text-[#0a192f]">
                4 Steps to Own Your Kampala Apartment From Abroad
              </h2>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                step: '01',
                title: 'Virtual Consultation',
                desc: 'Schedule a call with our Diaspora Desk to review property floor plans, pricing sheets, and localized rental yield data.',
              },
              {
                step: '02',
                title: 'Digital Reservation',
                desc: 'Select your preferred unit and receive your legal reservation agreement digitally for lawyer verification.',
              },
              {
                step: '03',
                title: 'Flexible Installments',
                desc: 'Transfer your initial deposit and monthly payments through secure bank wires while tracking progress via live updates.',
              },
              {
                step: '04',
                title: 'Handover or Management',
                desc: 'Collect your title deed keys upon completion or enroll in our corporate rental management program immediately.',
              },
            ].map((s, idx) => (
              <ScrollReveal key={s.step} direction="up" delay={idx * 0.1}>
                <div className="p-8 rounded-3xl bg-white border border-zinc-200 shadow-sm flex flex-col gap-4">
                  <span className="font-heading font-black text-3xl text-[#dfc28c]">{s.step}</span>
                  <h3 className="font-heading font-bold text-lg text-[#0a192f]">{s.title}</h3>
                  <p className="text-xs text-zinc-500 leading-relaxed">{s.desc}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Diaspora Investment Opportunities */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-16">
            <div>
              <span className="text-xs uppercase tracking-[0.25em] text-[#dfc28c] font-bold block mb-2">
                Prime Investment Portfolio
              </span>
              <h2 className="text-3xl md:text-4xl font-heading font-bold text-[#0a192f]">
                Featured Developments Ideal for Diaspora Buyers
              </h2>
            </div>
            <Link
              href="/properties"
              className="text-xs font-bold uppercase tracking-widest text-[#dfc28c] hover:text-[#0a192f] transition-colors flex items-center gap-2"
            >
              <span>View All Properties</span>
              <ArrowRight size={14} />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {properties.map((prop) => (
              <div key={prop.id} className="bg-[#0a192f] rounded-3xl overflow-hidden shadow-xl border border-white/5 text-white flex flex-col">
                <div className="relative aspect-[4/3] w-full">
                  <Image src={prop.mainImage} alt={prop.name} fill className="object-cover" />
                  <span className="absolute top-4 left-4 px-3 py-1 bg-[#dfc28c] text-[#020c1b] text-[10px] font-bold uppercase tracking-wider rounded-full">
                    {prop.status}
                  </span>
                </div>
                <div className="p-6 flex flex-col justify-between flex-1 gap-4">
                  <div>
                    <span className="text-[10px] text-[#dfc28c] uppercase tracking-widest">{prop.location}</span>
                    <h3 className="font-heading text-xl font-bold mt-1">{prop.name}</h3>
                    <p className="text-xs text-white/60 mt-2 line-clamp-2">{prop.description}</p>
                  </div>
                  <div className="flex items-center justify-between border-t border-white/10 pt-4">
                    <span className="text-xs font-bold text-[#dfc28c]">Starting from ${prop.startingPrice.toLocaleString()}</span>
                    <Link
                      href={`/properties/${prop.slug}`}
                      className="px-4 py-2 bg-white/10 hover:bg-[#dfc28c] hover:text-[#020c1b] rounded-full text-xs font-bold transition-all"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Inquiry Form Section */}
      <section id="diaspora-form" className="py-24 bg-[#020c1b] text-white border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6 flex flex-col gap-6">
            <span className="text-xs uppercase tracking-[0.25em] text-[#dfc28c] font-bold">
              Dedicated Overseas Support
            </span>
            <h2 className="text-3xl md:text-5xl font-heading font-extrabold leading-tight">
              Connect With Our International Property Desk
            </h2>
            <p className="text-sm text-white/70 leading-relaxed">
              Our specialized Diaspora Sales Desk understands international time zones, foreign wire requirements, and virtual inspection needs. Request a tailored brochure and payment schedule today.
            </p>
            <div className="flex flex-col gap-3 mt-2 text-xs text-white/80">
              <div className="flex items-center gap-3">
                <CheckCircle2 size={16} className="text-[#dfc28c]" />
                <span>Virtual 1-on-1 consultation via Zoom or WhatsApp</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle2 size={16} className="text-[#dfc28c]" />
                <span>Custom installment plans structured in USD, GBP, EUR, or UGX</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle2 size={16} className="text-[#dfc28c]" />
                <span>Verified lawyers for land title search & transfer</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6 bg-white p-8 rounded-3xl shadow-2xl text-zinc-800">
            <h3 className="font-heading font-bold text-xl text-[#0a192f] mb-2">Request Diaspora Investor Pack</h3>
            <p className="text-xs text-zinc-500 mb-6">Leave your contact details and an international advisor will reach out within 24 hours.</p>
            <HomeForm properties={properties.map((p) => ({ id: p.id, name: p.name }))} pageSource="Diaspora Page" />
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section className="py-24 bg-white">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-16">
            <span className="text-xs uppercase tracking-[0.25em] text-[#dfc28c] font-bold block mb-2">
              Got Questions?
            </span>
            <h2 className="text-3xl font-heading font-bold text-[#0a192f]">
              Frequently Asked Questions for Diaspora Investors
            </h2>
          </div>

          <div className="flex flex-col gap-6">
            {faqs.map((faq, idx) => (
              <div key={idx} className="p-6 rounded-2xl bg-zinc-50 border border-zinc-200 flex flex-col gap-2">
                <h3 className="font-heading font-bold text-base text-[#0a192f] flex items-center gap-2">
                  <HelpCircle size={18} className="text-[#dfc28c] shrink-0" />
                  <span>{faq.q}</span>
                </h3>
                <p className="text-xs text-zinc-600 leading-relaxed pl-6">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Structured Schema for FAQ */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            'mainEntity': faqs.map((f) => ({
              '@type': 'Question',
              'name': f.q,
              'acceptedAnswer': {
                '@type': 'Answer',
                'text': f.a,
              },
            })),
          }),
        }}
      />

      <Footer />
      <StickyCTAs />
    </div>
  );
}
