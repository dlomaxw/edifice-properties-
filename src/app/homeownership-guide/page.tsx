import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import StickyCTAs from '@/components/layout/StickyCTAs';
import { 
  HelpCircle, ChevronDown, CheckCircle2, Wrench, ShieldAlert, 
  Lightbulb, Droplets, Wind, Home, UserCheck 
} from 'lucide-react';

export const metadata = {
  title: 'Homeownership Guide | Edifice Properties Uganda',
  description: 'Essential information, maintenance tips, and answers to common queries for Edifice Properties homeowners in Kampala.',
};

export default function HomeownershipGuidePage() {
  const faqs = [
    {
      q: 'What is covered under the warranty?',
      a: 'Our comprehensive warranty covers structural defects, major building systems (plumbing, electrical, HVAC), and workmanship issues for a period of 12 months from handover. This includes foundation, walls, roof, windows, doors, and all installed fixtures. Cosmetic issues and normal wear and tear are not covered.',
    },
    {
      q: 'How do I report maintenance issues?',
      a: 'Contact our property management team via phone, email, or through our online portal. For emergencies (water leaks, electrical failures, security issues), call our 24/7 hotline. For non-urgent matters, submit a maintenance request through your homeowner portal, and we\'ll respond within 48 hours.',
    },
    {
      q: 'What are the monthly service charges?',
      a: 'Service charges cover common area maintenance, security, landscaping, waste management, and shared utilities. Charges vary by property size and development but typically range from 2-4% of the property value annually, billed monthly. Detailed breakdowns are provided in your homeowner agreement.',
    },
    {
      q: 'Can I make modifications to my property?',
      a: 'Minor interior modifications (painting, fixtures, flooring) are generally permitted. Major structural changes, exterior modifications, or changes affecting common areas require written approval from property management. Submit modification requests with detailed plans for review.',
    },
    {
      q: 'What insurance do I need?',
      a: 'We recommend comprehensive home insurance covering building structure, contents, liability, and natural disasters. The development maintains master insurance for common areas and building exteriors. Individual unit owners should insure their interiors, belongings, and personal liability.',
    },
    {
      q: 'How do I transfer or sell my property?',
      a: 'Contact our sales team to initiate the transfer process. You\'ll need to clear all outstanding service charges, obtain a clearance certificate, and complete legal documentation. We can assist with finding buyers and connecting you with legal professionals for the transfer process.',
    },
    {
      q: 'What about property management and security?',
      a: 'All Edifice Properties developments have professional property management and 24/7 security. This includes CCTV surveillance, access control, security personnel, and regular patrols. Property management handles maintenance coordination, vendor management, and community administration.',
    },
    {
      q: 'Are there community rules and regulations?',
      a: 'Yes, each development has community guidelines covering noise levels, parking, pet policies, waste disposal, and use of common facilities. These rules ensure a harmonious living environment for all residents.',
    },
  ];

  const maintenanceCategories = [
    {
      title: 'Plumbing',
      icon: Droplets,
      tips: [
        'Check for leaks regularly under sinks and around toilets',
        'Clean drain traps monthly to prevent clogs',
        'Don\'t flush non-biodegradable items',
        'Test water pressure and report any significant changes',
      ],
    },
    {
      title: 'Electrical',
      icon: Lightbulb,
      tips: [
        'Test circuit breakers and GFCI outlets quarterly',
        'Replace light bulbs with energy-efficient LED alternatives',
        'Never overload electrical outlets or extension cords',
        'Schedule professional inspection every 3-5 years',
        'Keep electrical panels accessible and clearly labeled',
      ],
    },
    {
      title: 'HVAC & Ventilation',
      icon: Wind,
      tips: [
        'Clean or replace AC filters every 1-3 months',
        'Schedule professional AC servicing twice yearly',
        'Keep vents and air returns unobstructed',
        'Check for proper ventilation in bathrooms and kitchen',
        'Monitor humidity levels to prevent mold growth',
      ],
    },
    {
      title: 'Interior Maintenance',
      icon: Home,
      tips: [
        'Touch up paint and repair minor wall damage promptly',
        'Clean windows and check seals for air leaks',
        'Inspect and maintain door locks and hinges',
        'Deep clean carpets and upholstery annually',
        'Check for signs of pest activity and address immediately',
      ],
    },
  ];

  const careServices = [
    {
      title: '24/7 Emergency Support',
      description: 'Round-the-clock assistance for urgent maintenance issues including plumbing emergencies, electrical failures, and security concerns.',
      icon: ShieldAlert,
    },
    {
      title: 'Scheduled Maintenance',
      description: 'Regular preventive maintenance services for common areas, building systems, and shared facilities to ensure optimal performance.',
      icon: Wrench,
    },
    {
      title: 'Approved Contractors',
      description: 'Access our network of vetted contractors and service providers for repairs, renovations, and specialized maintenance work.',
      icon: UserCheck,
    },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      {/* Hero Header */}
      <section className="relative pt-36 pb-20 bg-[#0a192f] text-white border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 relative z-10 flex flex-col justify-end min-h-[180px]">
          <span className="text-xs uppercase tracking-[0.25em] text-[#dfc28c] font-bold">
            Homeowner Support
          </span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold tracking-tight mt-2">
            Homeownership Guide
          </h1>
          <p className="text-white/50 text-sm md:text-base mt-4 max-w-2xl leading-relaxed">
            Essential information, maintenance tips, and answers to common queries for Edifice Properties homeowners. We&apos;re here to support you long after you receive your keys.
          </p>
        </div>
      </section>

      {/* Common Queries (FAQ) */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="max-w-3xl mb-16">
            <span className="text-xs uppercase tracking-[0.25em] text-[#dfc28c] font-bold">
              FAQ
            </span>
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-[#0a192f] tracking-tight mt-2">
              Common Queries
            </h2>
            <p className="text-zinc-500 text-sm mt-4">
              Find instant answers to general questions regarding warranties, maintenance, modifications, and community guidelines.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {faqs.map((faq) => (
              <div 
                key={faq.q} 
                className="bg-white border border-black/5 p-8 rounded-3xl shadow-sm flex flex-col gap-3"
              >
                <div className="flex gap-3 items-start">
                  <div className="w-8 h-8 rounded-full bg-[#dfc28c]/10 flex items-center justify-center text-[#dfc28c] shrink-0 mt-0.5">
                    <HelpCircle size={16} />
                  </div>
                  <h3 className="font-heading font-bold text-base text-[#0a192f] leading-snug">
                    {faq.q}
                  </h3>
                </div>
                <p className="text-xs text-zinc-500 leading-relaxed pl-11">
                  {faq.a}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Maintenance Tips */}
      <section className="py-24 bg-[#0a192f] text-white border-y border-white/5">
        <div className="max-w-7xl mx-auto px-6">
          <div className="max-w-3xl mb-16">
            <span className="text-xs uppercase tracking-[0.25em] text-[#dfc28c] font-bold">
              Property Care
            </span>
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-white tracking-tight mt-2">
              Essential Maintenance Tips
            </h2>
            <p className="text-white/50 text-sm mt-4">
              Keep your property in excellent condition and preserve its long-term investment value with these essential practices.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {maintenanceCategories.map((cat) => {
              const Icon = cat.icon;
              return (
                <div 
                  key={cat.title} 
                  className="bg-white/5 border border-white/5 p-8 rounded-3xl flex flex-col gap-6"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#dfc28c]/10 flex items-center justify-center text-[#dfc28c]">
                      <Icon size={18} />
                    </div>
                    <h3 className="font-heading font-bold text-base text-white">{cat.title}</h3>
                  </div>
                  
                  <ul className="space-y-3 flex-1">
                    {cat.tips.map((tip) => (
                      <li key={tip} className="text-xs text-white/60 flex items-start gap-2">
                        <span className="text-[#dfc28c] mt-1 text-[10px] shrink-0">✓</span>
                        <span className="leading-relaxed">{tip}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Property Care Services */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="max-w-3xl mb-16 text-center lg:text-left">
            <span className="text-xs uppercase tracking-[0.25em] text-[#dfc28c] font-bold">
              Developer Support
            </span>
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-[#0a192f] tracking-tight mt-2">
              Property Care Services
            </h2>
            <p className="text-zinc-500 text-sm mt-4">
              We stand by our clients long after key handover. Access round-the-clock emergency support and vetted contractors.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {careServices.map((service) => {
              const Icon = service.icon;
              return (
                <div 
                  key={service.title} 
                  className="bg-white border border-black/5 p-8 rounded-3xl shadow-sm flex flex-col gap-4 text-center items-center"
                >
                  <div className="w-14 h-14 rounded-full bg-[#0a192f]/5 flex items-center justify-center text-[#dfc28c]">
                    <Icon size={24} />
                  </div>
                  <h3 className="font-heading font-bold text-lg text-[#0a192f] mt-2">{service.title}</h3>
                  <p className="text-xs text-zinc-500 leading-relaxed max-w-xs">{service.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <Footer />
      <StickyCTAs />
    </div>
  );
}
