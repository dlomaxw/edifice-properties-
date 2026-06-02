import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import StickyCTAs from '@/components/layout/StickyCTAs';

export const metadata = {
  title: 'Privacy Policy | Edifice Properties Uganda',
  description: 'Privacy Policy for Edifice Properties Uganda. Learn how we handle and protect your personal information.',
};

export default function PrivacyPolicyPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <section className="relative pt-36 pb-20 bg-[#020c1b] text-white border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <span className="text-xs uppercase tracking-[0.25em] text-[#dfc28c] font-bold">Legal</span>
          <h1 className="text-4xl md:text-5xl font-heading font-bold tracking-tight mt-2">Privacy Policy</h1>
          <p className="text-white/50 text-xs mt-4">Last Updated: May 30, 2026</p>
        </div>
      </section>

      <section className="py-20 bg-white flex-1">
        <div className="max-w-4xl mx-auto px-6 bg-white border border-black/5 p-8 md:p-12 rounded-3xl shadow-sm text-sm text-zinc-600 space-y-6 leading-relaxed">
          <h2 className="text-lg font-heading font-bold text-[#0a192f]">1. Information We Collect</h2>
          <p>
            We collect personal information that you voluntarily provide to us when expressing an interest in obtaining information about us or our products, such as your name, phone number, email address, and preferred property configuration.
          </p>

          <h2 className="text-lg font-heading font-bold text-[#0a192f]">2. How We Use Your Information</h2>
          <p>
            We use personal information collected via our website for various business purposes described below:
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li>To facilitate account creation and the logon process.</li>
            <li>To send you marketing and promotional communications regarding available real estate assets.</li>
            <li>To respond to your inquiries and offer booking solutions for site visits.</li>
            <li>To process your reservations and coordinate documentation with legal representatives.</li>
          </ul>

          <h2 className="text-lg font-heading font-bold text-[#0a192f]">3. Sharing of Information</h2>
          <p>
            We do not share, sell, rent, or trade any of your information with third parties for their promotional purposes. Your data is strictly shared with assigned sales agents, in-house lawyers, or banking partners involved in your transaction.
          </p>

          <h2 className="text-lg font-heading font-bold text-[#0a192f]">4. Data Security</h2>
          <p>
            We implement appropriate technical and organizational security measures designed to protect the security of any personal information we process. However, please also remember that we cannot guarantee that the internet itself is 100% secure.
          </p>

          <h2 className="text-lg font-heading font-bold text-[#0a192f]">5. Your Rights</h2>
          <p>
            You have the right to request access to and rectification of your personal data. If you wish to delete your contact history or opt out of sales calls, please contact us at <a href="mailto:edificepropertiesltd@gmail.com" className="text-[#dfc28c] underline">edificepropertiesltd@gmail.com</a>.
          </p>
        </div>
      </section>

      <Footer />
      <StickyCTAs />
    </div>
  );
}
