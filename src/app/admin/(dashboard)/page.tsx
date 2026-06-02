import { db } from '@/lib/db';
import { Building2, Users, FileText, CheckCircle2, ChevronRight, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export const revalidate = 0; // Disable caching for admin dashboard

export default async function AdminDashboardPage() {
  // Query counts and lists
  const propertyCount = await db.property.count();
  const unitCount = await db.unit.count();
  const leadCount = await db.enquiry.count();
  
  const openLeadsCount = await db.enquiry.count({
    where: {
      status: {
        in: ['New', 'Contacted', 'Site Visit Booked', 'Negotiation', 'Reserved'],
      },
    },
  });

  const recentLeads = await db.enquiry.findMany({
    orderBy: { dateCreated: 'desc' },
    take: 5,
  });

  const propertiesList = await db.property.findMany({
    include: {
      _count: {
        select: { units: true },
      },
    },
    orderBy: { orderIndex: 'asc' },
  });

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(date));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'New':
        return 'bg-blue-500/10 text-blue-400 border border-blue-500/20';
      case 'Contacted':
        return 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20';
      case 'Site Visit Booked':
        return 'bg-purple-500/10 text-purple-400 border border-purple-500/20';
      case 'Negotiation':
        return 'bg-orange-500/10 text-orange-400 border border-orange-500/20';
      case 'Reserved':
        return 'bg-pink-500/10 text-pink-400 border border-pink-500/20';
      case 'Closed':
        return 'bg-green-500/10 text-green-400 border border-green-500/20';
      case 'Lost':
        return 'bg-zinc-800 text-zinc-500 border border-zinc-700';
      default:
        return 'bg-zinc-800 text-zinc-400 border border-zinc-700';
    }
  };

  const stats = [
    { name: 'Total Developments', value: propertyCount, icon: Building2, color: 'text-[#dfc28c]' },
    { name: 'Total Units Available', value: unitCount, icon: CheckCircle2, color: 'text-green-400' },
    { name: 'Total Enquiries Received', value: leadCount, icon: Users, color: 'text-blue-400' },
    { name: 'Open Active Enquiries', value: openLeadsCount, icon: FileText, color: 'text-yellow-400' },
  ];

  return (
    <div className="flex flex-col gap-8">
      {/* Welcome Banner */}
      <div className="bg-zinc-900 border border-white/5 p-8 rounded-3xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#dfc28c]/5 rounded-full blur-[80px] pointer-events-none" />
        <h2 className="text-2xl font-heading font-bold text-white">Welcome back, Administrator</h2>
        <p className="text-xs text-zinc-400 mt-2 max-w-xl leading-relaxed">
          Manage properties, keep track of incoming client leads, customize your global phone numbers, and draft search-engine optimized articles from this control panel.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.name} className="bg-zinc-900 border border-white/5 p-6 rounded-2xl flex items-center justify-between shadow-md">
              <div className="flex flex-col gap-1">
                <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">{stat.name}</span>
                <span className="text-3xl font-heading font-bold mt-1 text-white">{stat.value}</span>
              </div>
              <div className={`w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center ${stat.color}`}>
                <Icon size={22} />
              </div>
            </div>
          );
        })}
      </div>

      {/* Grid: Recent Leads & Suburbs */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Recent Leads Table */}
        <div className="lg:col-span-8 bg-zinc-900 border border-white/5 rounded-3xl flex flex-col shadow-md">
          <div className="p-6 border-b border-white/5 flex items-center justify-between">
            <h3 className="font-heading font-bold text-base text-white">Recent Enquiries</h3>
            <Link 
              href="/admin/enquiries" 
              className="text-xs font-bold text-[#dfc28c] hover:underline flex items-center gap-1"
            >
              <span>View All</span>
              <ChevronRight size={14} />
            </Link>
          </div>
          
          <div className="overflow-x-auto">
            {recentLeads.length === 0 ? (
              <div className="text-center py-16 text-xs text-zinc-500 uppercase tracking-wider">
                No inquiries found
              </div>
            ) : (
              <table className="w-full border-collapse text-left text-xs">
                <thead>
                  <tr className="border-b border-white/5 text-zinc-500 uppercase font-bold tracking-wider">
                    <th className="p-4 pl-6">Client</th>
                    <th className="p-4">Contact</th>
                    <th className="p-4">Property</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 pr-6">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {recentLeads.map((lead) => (
                    <tr key={lead.id} className="hover:bg-white/[0.01] transition-colors">
                      <td className="p-4 pl-6 font-bold text-white">
                        {lead.firstName} {lead.lastName}
                      </td>
                      <td className="p-4 flex flex-col gap-0.5 text-zinc-400">
                        <span>{lead.phone}</span>
                        <span className="text-[10px] text-zinc-600 truncate max-w-[150px]">{lead.email}</span>
                      </td>
                      <td className="p-4 text-zinc-300 font-semibold">{lead.preferredProperty}</td>
                      <td className="p-4">
                        <span className={`px-2.5 py-1 rounded-full text-[9px] font-bold uppercase tracking-wider ${getStatusColor(lead.status)}`}>
                          {lead.status}
                        </span>
                      </td>
                      <td className="p-4 pr-6 text-zinc-500 font-medium">{formatDate(lead.dateCreated)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* Development suburbs */}
        <div className="lg:col-span-4 bg-zinc-900 border border-white/5 rounded-3xl flex flex-col shadow-md">
          <div className="p-6 border-b border-white/5">
            <h3 className="font-heading font-bold text-base text-white">Developments Summary</h3>
          </div>
          
          <div className="p-6 flex flex-col gap-4">
            {propertiesList.map((prop) => (
              <div 
                key={prop.id} 
                className="flex items-center justify-between p-4 bg-black/30 rounded-2xl border border-white/5 hover:border-[#dfc28c]/30 transition-colors"
              >
                <div className="flex flex-col gap-0.5 min-w-0">
                  <span className="font-bold text-xs text-white truncate">{prop.name}</span>
                  <span className="text-[10px] text-zinc-500 font-semibold truncate">{prop.location}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-0.5 rounded text-[8px] font-bold uppercase tracking-wider ${
                    prop.status === 'Sold out' 
                      ? 'bg-red-500/10 text-red-400 border border-red-500/10' 
                      : 'bg-[#dfc28c]/10 text-[#dfc28c] border border-[#dfc28c]/15'
                  }`}>
                    {prop.status}
                  </span>
                  <span className="text-xs text-zinc-400 font-semibold shrink-0">
                    {prop._count.units} units
                  </span>
                </div>
              </div>
            ))}

            <Link 
              href="/admin/properties"
              className="mt-2 w-full py-3.5 bg-white/5 hover:bg-white/10 rounded-2xl text-center text-xs font-bold text-[#dfc28c] flex items-center justify-center gap-1.5 transition-colors"
            >
              <span>Manage Properties & Units</span>
              <ArrowRight size={14} />
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
