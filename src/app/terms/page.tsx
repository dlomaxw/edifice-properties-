import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import StickyCTAs from '@/components/layout/StickyCTAs';

export const metadata = {
  title: 'Terms of Service | Edifice Properties Uganda',
  description: 'Terms of Service for Edifice Properties Uganda website usage.',
};

export default function TermsOfServicePage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <section className="relative pt-36 pb-20 bg-[#020c1b] text-white border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <span className="text-xs uppercase tracking-[0.25em] text-[#dfc28c] font-bold">Legal</span>
          <h1 className="text-4xl md:text-5xl font-heading font-bold tracking-tight mt-2">Terms of Service</h1>
          <p className="text-white/50 text-xs mt-4">Last Updated: May 30, 2026</p>
        </div>
      </section>

      <section className="py-20 bg-white flex-1">
        <div className="max-w-4xl mx-auto px-6 bg-white border border-black/5 p-8 md:p-12 rounded-3xl shadow-sm text-sm text-zinc-600 space-y-6 leading-relaxed">
          <h2 className="text-lg font-heading font-bold text-[#0a192f]">1. Agreement to Terms</h2>
          <p>
            By accessing and using this website, you agree to be bound by these Terms of Service. If you do not agree to all of these terms, you are prohibited from using the site and must discontinue use immediately.
          </p>

          <h2 className="text-lg font-heading font-bold text-[#0a192f]">2. Intellectual Property Rights</h2>
          <p>
            Unless otherwise indicated, the site is our proprietary property and all source code, databases, functionality, software, website designs, audio, video, text, photographs, and graphics on the site (collectively, the &ldquo;Content&rdquo;) are owned or controlled by us or licensed to us, and are protected by copyright and trademark laws.
          </p>

          <h2 className="text-lg font-heading font-bold text-[#0a192f]">3. Property Information & Pricing Accuracy</h2>
          <p>
            While we make every effort to display accurate details, property availability, dimensions, completion dates, and pricing shown on the website are indicative and subject to change without notice. Official purchase prices are governed solely by signed Reservation Agreements and Sale Agreements.
          </p>

          <h2 className="text-lg font-heading font-bold text-[#0a192f]">4. Prohibited Activities</h2>
          <p>
            You may not access or use the site for any purpose other than that for which we make the site available. The site may not be used in connection with any commercial endeavors except those that are specifically endorsed or approved by us.
          </p>

          <h2 className="text-lg font-heading font-bold text-[#0a192f]">5. Liability Limitation</h2>
          <p>
            In no event will we or our directors, employees, or agents be liable to you or any third party for any direct, indirect, consequential, exemplary, incidental, special, or punitive damages, including lost profit, lost revenue, loss of data, or other damages arising from your use of the site.
          </p>
        </div>
      </section>

      <Footer />
      <StickyCTAs />
    </div>
  );
}
