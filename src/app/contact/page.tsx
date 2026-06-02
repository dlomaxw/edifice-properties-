import { db } from '@/lib/db';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import StickyCTAs from '@/components/layout/StickyCTAs';
import HomeForm from '@/components/home/HomeForm';
import { Phone, Mail, MapPin, Clock, ShieldCheck } from 'lucide-react';

export const metadata = {
  title: 'Contact Us | Edifice Properties Uganda',
  description: 'Reach out to Edifice Properties Uganda. Visit our office at Plot 8 Kanjokya Street in Kololo, Kampala, or contact our sales consultants directly.',
};

export default async function ContactPage() {
  const properties = await db.property.findMany({
    select: { id: true, name: true },
    orderBy: { orderIndex: 'asc' },
  });

  const phones = [
    { label: 'Primary Desk', value: '+256 786 000 112', href: 'tel:+256786000112' },
    { label: 'Sales Consultant', value: '+256 763 700 206', href: 'tel:+256763700206' },
    { label: 'Offices desk', value: '+256 766 759 416', href: 'tel:+256766759416' },
    { label: 'Lead Specialist', value: '+256 770 833 189', href: 'tel:+256770833189' },
    { label: 'Support Desk', value: '+256 709 269 168', href: 'tel:+256709269168' },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      {/* Hero Header */}
      <section className="relative pt-36 pb-20 bg-[#0a192f] text-white border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 relative z-10 flex flex-col justify-end min-h-[180px]">
          <span className="text-xs uppercase tracking-[0.25em] text-[#dfc28c] font-bold">
            Get In Touch
          </span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold tracking-tight mt-2">
            Contact Our Team
          </h1>
          <p className="text-white/50 text-sm md:text-base mt-4 max-w-2xl leading-relaxed">
            Have questions about our signature properties or want to book an exclusive site visit? Our real estate specialists are ready to guide you.
          </p>
        </div>
      </section>

      {/* Form & Info Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-16">
          {/* Info Side */}
          <div className="lg:col-span-5 flex flex-col gap-10">
            <div className="flex flex-col gap-3">
              <span className="text-xs uppercase tracking-[0.25em] text-[#dfc28c] font-bold">
                Let&apos;s Connect
              </span>
              <h2 className="text-3xl font-heading font-bold text-[#0a192f]">
                Office & Contact Details
              </h2>
              <p className="text-zinc-500 text-xs leading-relaxed mt-2">
                We dream to build residences for people who truly appreciate design - from the first principles to the last detail. Visit us at our main corporate office.
              </p>
            </div>

            {/* Address */}
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-[#0a192f] text-[#dfc28c] flex items-center justify-center shrink-0">
                <MapPin size={18} />
              </div>
              <div className="flex flex-col text-xs">
                <span className="font-semibold text-[#0a192f] text-sm">Main Office</span>
                <p className="text-zinc-500 leading-relaxed mt-1 font-semibold">
                  Edifice Properties Limited
                </p>
                <p className="text-zinc-500 leading-relaxed font-medium">
                  Plot 8, Kanjokya Street, (Beside The Aleph Restaurant and Africana Tours & Travels Office), Kololo, Kampala, Uganda.
                </p>
                <p className="text-zinc-400 mt-1">
                  P.O. Box 108048 Kampala Nakawa.
                </p>
              </div>
            </div>

            {/* Phone */}
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-[#0a192f] text-[#dfc28c] flex items-center justify-center shrink-0">
                <Phone size={18} />
              </div>
              <div className="flex flex-col text-xs gap-1.5">
                <span className="font-semibold text-[#0a192f] text-sm">Call Sales Desk</span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1 text-zinc-500 font-medium">
                  {phones.map((phone) => (
                    <div key={phone.value} className="flex justify-between sm:justify-start gap-3 py-1 sm:py-0">
                      <span className="text-[10px] text-zinc-400 self-center uppercase tracking-wider">{phone.label}:</span>
                      <a href={phone.href} className="hover:text-[#dfc28c] transition-colors">{phone.value}</a>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Email */}
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-[#0a192f] text-[#dfc28c] flex items-center justify-center shrink-0">
                <Mail size={18} />
              </div>
              <div className="flex flex-col text-xs">
                <span className="font-semibold text-[#0a192f] text-sm">Email Inquiry</span>
                <a href="mailto:edificepropertiesltd@gmail.com" className="text-zinc-500 hover:text-[#dfc28c] font-medium transition-colors mt-1 break-all">
                  edificepropertiesltd@gmail.com
                </a>
              </div>
            </div>

            {/* Office Hours */}
            <div className="flex items-start gap-4 border-t border-black/5 pt-8">
              <div className="w-10 h-10 rounded-full bg-[#0a192f]/5 text-[#dfc28c] flex items-center justify-center shrink-0">
                <Clock size={18} />
              </div>
              <div className="flex flex-col text-xs text-zinc-500">
                <span className="font-semibold text-[#0a192f] text-sm">Office Hours</span>
                <span className="mt-1">Monday – Friday: 8:00 AM – 5:00 PM</span>
                <span>Saturday: 9:00 AM – 1:00 PM</span>
                <span>Sunday & Public Holidays: Closed (Site visits by appointment only)</span>
              </div>
            </div>
          </div>

          {/* Form Side */}
          <div className="lg:col-span-7">
            <HomeForm properties={properties} pageSource="Contact Page" />
          </div>
        </div>
      </section>

      {/* Full Width Google Maps Embed */}
      <section className="h-[500px] w-full relative border-t border-black/5">
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3989.742880345094!2d32.59733471475396!3d0.33870809975306606!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x177dbb0e35dc8f5d%3A0x7d0fa5a40bf5b9f7!2sKanjokya%20St%2C%20Kampala!5e0!3m2!1sen!2sug!4v1700000000000!5m2!1sen!2sug"
          className="absolute inset-0 w-full h-full border-0 grayscale filter contrast-125"
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
