import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import StickyCTAs from '@/components/layout/StickyCTAs';
import { 
  Users, CheckSquare, Search, FileText, Landmark, FileCheck, Key, 
  Wallet, Award, ShieldCheck, HelpCircle, ArrowRight 
} from 'lucide-react';
import Link from 'next/link';

export const metadata = {
  title: 'The Buying Process | Edifice Properties Uganda',
  description: 'Your step-by-step guide to purchasing a premium residence with Edifice Properties. Explore our 7-step buying process, flexible financing options, and legal details.',
};

export default function BuyingProcessPage() {
  const steps = [
    {
      number: '01',
      title: 'Initial Consultation',
      description: 'Meet with our property consultants to discuss your requirements, budget, and preferred locations. We\'ll help you understand available options and payment plans.',
      icon: Users,
    },
    {
      number: '02',
      title: 'Property Selection',
      description: 'Tour our developments and select your ideal unit. Our team will provide detailed specifications, floor plans, and pricing information for your chosen property.',
      icon: Search,
    },
    {
      number: '03',
      title: 'Exclusive Site Visit',
      description: 'Join us for a free guided site visit to explore our premium projects including Embassy Towers, Horizon Residency, Atlantic Heights, and Urban View Apartments.',
      icon: CheckSquare,
    },
    {
      number: '04',
      title: 'Reservation',
      description: 'Secure your property with a reservation fee. We\'ll provide you with a reservation agreement and begin the documentation process.',
      icon: FileText,
    },
    {
      number: '05',
      title: 'Financial Arrangement',
      description: 'Finalize your payment plan or mortgage arrangement. Our financial advisors can connect you with trusted banking partners for competitive financing options.',
      icon: Landmark,
    },
    {
      number: '06',
      title: 'Legal Documentation',
      description: 'Complete all legal requirements including sale agreements, title verification, and registration. Our legal team ensures all documentation is properly executed.',
      icon: FileCheck,
    },
    {
      number: '07',
      title: 'Handover',
      description: 'Receive your keys and complete the handover process. We\'ll conduct a final walkthrough and provide you with all necessary documentation and warranties.',
      icon: Key,
    },
  ];

  const financingOptions = [
    {
      title: 'Flexible Payment Plans',
      description: 'Choose from various payment schedules tailored to your financial situation. Options include installment plans over 12, 24, or 36 months with competitive terms.',
      points: [
        'Initial deposit: 20-30%',
        'Flexible installment periods',
        'No hidden charges',
        'Early payment discounts available',
      ],
      icon: Wallet,
    },
    {
      title: 'Mortgage Financing',
      description: 'Partner with leading banks and financial institutions offering competitive mortgage rates. We assist with the entire application process.',
      points: [
        'Up to 90% financing available',
        'Competitive interest rates',
        'Loan tenure up to 25 years',
        'Pre-approval assistance',
      ],
      icon: Landmark,
    },
    {
      title: 'Corporate Packages',
      description: 'Special arrangements for corporate clients and bulk purchases. Customized payment structures for organizations and investment groups.',
      points: [
        'Volume discounts',
        'Customized payment terms',
        'Dedicated account management',
        'Investment advisory services',
      ],
      icon: Award,
    },
  ];

  const legalRequirements = [
    'Valid national ID or passport',
    'Proof of income (employment letter or business registration)',
    'Bank statements (last 3-6 months)',
    'Tax identification number (TIN)',
    'Passport-size photographs',
    'Marriage certificate (if applicable)',
  ];

  const legalProcesses = [
    'Sale agreement preparation and signing',
    'Title search and verification',
    'Stamp duty payment',
    'Property registration with land registry',
    'Transfer of ownership documentation',
    'Issuance of certificate of title',
  ];

  const guarantees = [
    'Clear and marketable title guarantee',
    'Structural warranty coverage',
    'Defects liability period',
    'Legal indemnity insurance',
    'Compliance with building regulations',
    'Environmental clearance certificates',
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      {/* Hero Header */}
      <section className="relative pt-36 pb-20 bg-[#0a192f] text-white border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 relative z-10 flex flex-col justify-end min-h-[180px]">
          <span className="text-xs uppercase tracking-[0.25em] text-[#dfc28c] font-bold">
            Ownership Path
          </span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold tracking-tight mt-2">
            The Buying Process
          </h1>
          <p className="text-white/50 text-sm md:text-base mt-4 max-w-2xl leading-relaxed">
            Your journey to home ownership with Edifice Properties is designed to be seamless, transparent, and rewarding. We guide you through every step with expertise and care.
          </p>
        </div>
      </section>

      {/* Timeline steps */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="max-w-3xl mb-16 text-center lg:text-left">
            <span className="text-xs uppercase tracking-[0.25em] text-[#dfc28c] font-bold">
              Step-By-Step
            </span>
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-[#0a192f] tracking-tight mt-2">
              7 Simple Steps to Secure Your Home
            </h2>
            <p className="text-zinc-500 text-sm mt-4">
              From the initial cup of coffee and consultation to holding your keys, here is how we make ownership straightforward.
            </p>
          </div>

          <div className="relative border-l border-zinc-200 pl-6 md:pl-12 ml-4 md:ml-8 space-y-16">
            {steps.map((step) => {
              const Icon = step.icon;
              return (
                <div key={step.number} className="relative group">
                  {/* Timeline dot */}
                  <span className="absolute -left-[39px] md:-left-[63px] top-0 flex items-center justify-center w-8 h-8 rounded-full bg-[#0a192f] text-[#dfc28c] text-xs font-bold border-2 border-[#dfc28c]/30 shadow-md">
                    {step.number}
                  </span>
                  
                  <div className="bg-white border border-black/5 p-8 rounded-3xl shadow-sm hover:shadow-md transition-shadow flex flex-col md:flex-row gap-6 items-start">
                    <div className="w-12 h-12 rounded-2xl bg-[#dfc28c]/10 flex items-center justify-center text-[#dfc28c] shrink-0">
                      <Icon size={20} />
                    </div>
                    <div className="flex flex-col gap-2">
                      <h3 className="text-xl font-heading font-bold text-[#0a192f]">{step.title}</h3>
                      <p className="text-sm text-zinc-500 leading-relaxed max-w-4xl">{step.description}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Financing Options Section */}
      <section className="py-24 bg-[#0a192f] text-white border-y border-white/5">
        <div className="max-w-7xl mx-auto px-6">
          <div className="max-w-3xl mb-16">
            <span className="text-xs uppercase tracking-[0.25em] text-[#dfc28c] font-bold">
              Funding Options
            </span>
            <h2 className="text-3xl md:text-4xl font-heading font-bold tracking-tight mt-2">
              Financing Options
            </h2>
            <p className="text-white/50 text-sm mt-4">
              Multiple pathways to make your dream home a reality, structured to match your investment strategy.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {financingOptions.map((opt) => {
              const Icon = opt.icon;
              return (
                <div key={opt.title} className="bg-white/5 border border-white/5 p-8 rounded-3xl flex flex-col justify-between">
                  <div className="flex flex-col gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-[#dfc28c]/10 flex items-center justify-center text-[#dfc28c]">
                      <Icon size={20} />
                    </div>
                    <h3 className="text-xl font-heading font-bold mt-2">{opt.title}</h3>
                    <p className="text-xs text-white/50 leading-relaxed">{opt.description}</p>
                    
                    <ul className="space-y-3 mt-6">
                      {opt.points.map((pt) => (
                        <li key={pt} className="text-xs flex items-center gap-2 text-white/75">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#dfc28c]" />
                          <span>{pt}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Legal Requirements grid */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="max-w-3xl mb-16">
            <span className="text-xs uppercase tracking-[0.25em] text-[#dfc28c] font-bold">
              Compliance & Safety
            </span>
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-[#0a192f] tracking-tight mt-2">
              Legal Requirements & Verification
            </h2>
            <p className="text-zinc-500 text-sm mt-4">
              Everything you need to know about documentation and compliance during the registration and handover stages.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Required Documentation */}
            <div className="bg-white border border-black/5 p-8 rounded-3xl shadow-sm">
              <h3 className="font-heading font-bold text-lg text-[#0a192f] mb-6 pb-2 border-b border-black/5">
                Required Documentation
              </h3>
              <ul className="space-y-4">
                {legalRequirements.map((req) => (
                  <li key={req} className="text-xs text-zinc-600 flex items-start gap-2.5">
                    <span className="text-[#dfc28c] font-bold text-sm shrink-0">✓</span>
                    <span>{req}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Legal Process */}
            <div className="bg-white border border-black/5 p-8 rounded-3xl shadow-sm">
              <h3 className="font-heading font-bold text-lg text-[#0a192f] mb-6 pb-2 border-b border-black/5">
                Legal Process
              </h3>
              <ul className="space-y-4">
                {legalProcesses.map((proc) => (
                  <li key={proc} className="text-xs text-zinc-600 flex items-start gap-2.5">
                    <span className="text-[#dfc28c] font-bold text-sm shrink-0">✓</span>
                    <span>{proc}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Protections & Guarantees */}
            <div className="bg-white border border-black/5 p-8 rounded-3xl shadow-sm">
              <h3 className="font-heading font-bold text-lg text-[#0a192f] mb-6 pb-2 border-b border-black/5">
                Protection & Guarantees
              </h3>
              <ul className="space-y-4">
                {guarantees.map((g) => (
                  <li key={g} className="text-xs text-zinc-600 flex items-start gap-2.5">
                    <span className="text-[#dfc28c] font-bold text-sm shrink-0">✓</span>
                    <span>{g}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Legal Support Box */}
          <div className="bg-[#020c1b] border border-white/5 text-white p-8 md:p-12 rounded-3xl mt-12 flex flex-col md:flex-row gap-8 justify-between items-center">
            <div className="flex flex-col gap-3 max-w-3xl">
              <div className="flex items-center gap-2 text-[#dfc28c]">
                <ShieldCheck size={20} />
                <span className="text-xs uppercase tracking-wider font-bold">Guaranteed Safety</span>
              </div>
              <h3 className="text-xl md:text-2xl font-heading font-bold text-white">Dedicated Legal Support</h3>
              <p className="text-xs text-white/50 leading-relaxed">
                Our in-house legal team and trusted partners guide you through every legal requirement. We ensure all documentation is properly prepared, verified, and registered according to local regulations. Your investment is protected at every stage of the process.
              </p>
            </div>
            
            <a 
              href="/contact" 
              className="px-6 py-3 bg-[#dfc28c] hover:bg-[#d4af37] text-[#020c1b] font-semibold text-xs tracking-wider uppercase rounded-xl transition-all duration-300 shadow-lg whitespace-nowrap"
            >
              Get Legal Consultation
            </a>
          </div>
        </div>
      </section>

      <Footer />
      <StickyCTAs />
    </div>
  );
}
