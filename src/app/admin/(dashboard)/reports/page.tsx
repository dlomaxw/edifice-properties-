import { db } from '@/lib/db';
import { cookies } from 'next/headers';
import { verifyJWT } from '@/lib/jwt';
import { redirect } from 'next/navigation';
import { 
  TrendingUp, Users, DollarSign, Award, ArrowUpRight, BarChart3, 
  PieChart, Globe, Laptop, CheckCircle, ShieldAlert 
} from 'lucide-react';
import Link from 'next/link';

export const revalidate = 0; // Server-side rendering without cache

export default async function AdminReportsPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get('edifice_session')?.value;
  const admin = token ? verifyJWT(token) : null;

  // Restrict access to CEO, Admin, and Manager
  if (!admin || !['super_admin', 'ceo', 'manager'].includes(admin.role)) {
    redirect('/admin');
  }

  // 1. Fetch Enquiries Metrics
  const totalLeads = await db.enquiry.count();
  
  // Status breakdown
  const statusCounts = await db.enquiry.groupBy({
    by: ['status'],
    _count: { _all: true }
  });

  const getStatusCount = (status: string) => {
    return statusCounts.find(s => s.status === status)?._count._all || 0;
  };

  const leadsNew = getStatusCount('New');
  const leadsContacted = getStatusCount('Contacted');
  const leadsSiteVisit = getStatusCount('Site Visit Booked');
  const leadsNegotiation = getStatusCount('Negotiation');
  const leadsReserved = getStatusCount('Reserved');
  const leadsClosed = getStatusCount('Closed');
  const leadsLost = getStatusCount('Lost');

  const activeLeads = leadsNew + leadsContacted + leadsSiteVisit + leadsNegotiation + leadsReserved;
  const conversionRate = totalLeads > 0 ? ((leadsClosed / totalLeads) * 100).toFixed(1) : '0.0';

  // 2. Fetch Buyer Types
  const buyerTypeCounts = await db.enquiry.groupBy({
    by: ['buyerType'],
    _count: { _all: true }
  });

  // 3. Fetch Properties list & estimates
  const properties = await db.property.findMany({
    include: {
      _count: {
        select: { units: true }
      }
    },
    orderBy: { orderIndex: 'asc' }
  });

  // Calculate simulated revenue from closed deals
  // We can assume each closed deal has a value. Let's look up enquiries and aggregate their budget/revenue.
  const closedDeals = await db.enquiry.findMany({
    where: { status: 'Closed' }
  });

  // Map budget text to numbers or assume average unit values if text isn't a direct number
  let totalRevenueUSD = 0;
  let totalRevenueUGX = 0;
  
  closedDeals.forEach(deal => {
    // Parse budget range or assign default estimates
    // Standard format could be: "$90,000 - $120,000" or similar
    const budgetStr = deal.budgetRange || '';
    if (budgetStr.includes('UGX') || budgetStr.toLowerCase().includes('shs')) {
      const match = budgetStr.replace(/[^0-9]/g, '');
      const val = parseInt(match) || 200000000;
      totalRevenueUGX += val;
    } else {
      const match = budgetStr.replace(/[^0-9]/g, '');
      const val = parseInt(match) || 100000; // default 100k USD
      totalRevenueUSD += val;
    }
  });

  // Convert UGX to USD for a consolidated total (assume 1 USD = 3750 UGX)
  const consolidatedRevenue = totalRevenueUSD + (totalRevenueUGX / 3750);

  // 4. Sales Rep performance overview
  const salesReps = await db.user.findMany({
    where: { role: 'sales' },
    select: {
      id: true,
      name: true,
      email: true
    }
  });

  const repPerformance = await Promise.all(salesReps.map(async (rep) => {
    const assignedCount = await db.enquiry.count({
      where: { assignedSalesperson: rep.email }
    });
    const closedCount = await db.enquiry.count({
      where: { 
        assignedSalesperson: rep.email,
        status: 'Closed'
      }
    });
    const rate = assignedCount > 0 ? ((closedCount / assignedCount) * 100).toFixed(0) : '0';
    return {
      name: rep.name || rep.email.split('@')[0],
      email: rep.email,
      assigned: assignedCount,
      closed: closedCount,
      rate
    };
  }));

  // Add "Unassigned" leads to performance mapping
  const unassignedCount = await db.enquiry.count({
    where: { assignedSalesperson: 'Unassigned' }
  });
  const unassignedClosed = await db.enquiry.count({
    where: { 
      assignedSalesperson: 'Unassigned',
      status: 'Closed'
    }
  });
  repPerformance.push({
    name: 'Unassigned Leads',
    email: 'Unassigned',
    assigned: unassignedCount,
    closed: unassignedClosed,
    rate: unassignedCount > 0 ? ((unassignedClosed / unassignedCount) * 100).toFixed(0) : '0'
  });

  // Sort reps by closed deals descending
  repPerformance.sort((a, b) => b.closed - a.closed);

  // 5. Traffic channels and device sources (simulated using pageSource / deviceType or fallback metrics)
  const trafficData = await db.enquiry.groupBy({
    by: ['pageSource'],
    _count: { _all: true }
  });

  const deviceData = await db.enquiry.groupBy({
    by: ['deviceType'],
    _count: { _all: true }
  });

  return (
    <div className="flex flex-col gap-8">
      {/* Header and Filter Controls */}
      <div className="bg-zinc-900 border border-white/5 p-8 rounded-3xl relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-md">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#dfc28c]/5 rounded-full blur-[80px] pointer-events-none" />
        <div>
          <h2 className="text-2xl font-heading font-bold text-white flex items-center gap-2">
            <BarChart3 className="text-[#dfc28c]" size={24} />
            <span>Executive Business Analytics</span>
          </h2>
          <p className="text-xs text-zinc-400 mt-2 max-w-xl leading-relaxed">
            Consolidated reports detailing sales conversion funnels, accounting revenue forecasts, marketing channels performance, and sales representative output.
          </p>
        </div>
        <div className="bg-black/30 border border-white/5 px-4 py-2 rounded-2xl flex items-center gap-2 text-xs text-zinc-400 self-start md:self-center">
          <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          <span>Real-time Live Reports</span>
        </div>
      </div>

      {/* Analytics Summary Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-zinc-900 border border-white/5 p-6 rounded-2xl flex items-center justify-between shadow-md">
          <div className="flex flex-col gap-1">
            <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">Total Sales Revenue</span>
            <span className="text-2xl font-heading font-black mt-1 text-white">${consolidatedRevenue.toLocaleString('en-US', { maximumFractionDigits: 0 })}</span>
            <span className="text-[9px] text-zinc-400 mt-1">Consolidated (USD + UGX eq)</span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-green-500/10 border border-green-500/20 flex items-center justify-center text-green-400">
            <DollarSign size={22} />
          </div>
        </div>

        <div className="bg-zinc-900 border border-white/5 p-6 rounded-2xl flex items-center justify-between shadow-md">
          <div className="flex flex-col gap-1">
            <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">Gross Leads Acquired</span>
            <span className="text-2xl font-heading font-black mt-1 text-white">{totalLeads}</span>
            <span className="text-[9px] text-[#dfc28c] mt-1 font-bold">{activeLeads} Active Pipelines</span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-[#dfc28c]/10 border border-[#dfc28c]/20 flex items-center justify-center text-[#dfc28c]">
            <Users size={22} />
          </div>
        </div>

        <div className="bg-zinc-900 border border-white/5 p-6 rounded-2xl flex items-center justify-between shadow-md">
          <div className="flex flex-col gap-1">
            <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">Deals Won (Closed)</span>
            <span className="text-2xl font-heading font-black mt-1 text-white">{leadsClosed}</span>
            <span className="text-[9px] text-zinc-400 mt-1">Out of {totalLeads} total submissions</span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
            <CheckCircle size={22} />
          </div>
        </div>

        <div className="bg-zinc-900 border border-white/5 p-6 rounded-2xl flex items-center justify-between shadow-md">
          <div className="flex flex-col gap-1">
            <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">Conversion Ratio</span>
            <span className="text-2xl font-heading font-black mt-1 text-white">{conversionRate}%</span>
            <span className="text-[9px] text-red-400 mt-1">{leadsLost} Leads Lost ({totalLeads > 0 ? ((leadsLost / totalLeads) * 100).toFixed(0) : 0}%)</span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
            <TrendingUp size={22} />
          </div>
        </div>
      </div>

      {/* Grid: Conversion Funnel & Sales Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Conversion Funnel */}
        <div className="lg:col-span-6 bg-zinc-900 border border-white/5 rounded-3xl p-6 flex flex-col gap-6 shadow-md">
          <div className="border-b border-white/5 pb-4">
            <h3 className="font-heading font-bold text-sm uppercase tracking-wider text-white">Sales Pipeline Funnel</h3>
            <p className="text-[10px] text-zinc-500 mt-0.5">Track conversion progression counts from new acquisitions to closed contracts.</p>
          </div>

          <div className="flex flex-col gap-4">
            {[
              { label: '1. New Enquiries', count: leadsNew, color: 'bg-blue-500' },
              { label: '2. Contact Established', count: leadsContacted, color: 'bg-yellow-500' },
              { label: '3. Site Visits Scheduled', count: leadsSiteVisit, color: 'bg-purple-500' },
              { label: '4. Price Negotiation', count: leadsNegotiation, color: 'bg-orange-500' },
              { label: '5. Unit Reserved', count: leadsReserved, color: 'bg-pink-500' },
              { label: '6. Closed Deals (Won)', count: leadsClosed, color: 'bg-green-500' },
              { label: '7. Lost / Archived', count: leadsLost, color: 'bg-zinc-700' }
            ].map((funnelStep) => {
              const percent = totalLeads > 0 ? ((funnelStep.count / totalLeads) * 100) : 0;
              return (
                <div key={funnelStep.label} className="flex flex-col gap-1.5">
                  <div className="flex justify-between text-[11px] font-semibold text-zinc-300">
                    <span>{funnelStep.label}</span>
                    <span className="font-mono text-white">{funnelStep.count} <span className="text-zinc-500 text-[10px]">({percent.toFixed(0)}%)</span></span>
                  </div>
                  <div className="w-full h-2.5 bg-black/40 rounded-full overflow-hidden border border-white/5">
                    <div 
                      className={`h-full rounded-full transition-all duration-1000 ${funnelStep.color}`} 
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Sales Representatives Performance */}
        <div className="lg:col-span-6 bg-zinc-900 border border-white/5 rounded-3xl p-6 flex flex-col gap-6 shadow-md">
          <div className="border-b border-white/5 pb-4 flex items-center justify-between">
            <div>
              <h3 className="font-heading font-bold text-sm uppercase tracking-wider text-white">Sales Representative Ledger</h3>
              <p className="text-[10px] text-zinc-500 mt-0.5">Review individual closed deal outputs and lead conversion ratios.</p>
            </div>
            <Award className="text-[#dfc28c]" size={20} />
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-white/5 bg-black/20 text-zinc-500 font-bold uppercase tracking-wider text-[9px]">
                  <th className="py-3 px-4">Salesperson</th>
                  <th className="py-3 px-4 text-center">Assigned</th>
                  <th className="py-3 px-4 text-center">Closed (Won)</th>
                  <th className="py-3 px-4 text-right">Conversion</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {repPerformance.map((rep) => (
                  <tr key={rep.email} className="hover:bg-white/[0.01] transition-colors">
                    <td className="py-3.5 px-4 font-bold text-white whitespace-nowrap">
                      {rep.name}
                      <span className="block text-[9px] text-zinc-500 font-medium font-mono">{rep.email}</span>
                    </td>
                    <td className="py-3.5 px-4 text-center text-zinc-300 font-mono font-semibold">{rep.assigned}</td>
                    <td className="py-3.5 px-4 text-center text-green-400 font-mono font-semibold">{rep.closed}</td>
                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${
                        parseInt(rep.rate) >= 20 
                          ? 'bg-green-500/10 text-green-400 border border-green-500/10' 
                          : 'bg-zinc-800 text-zinc-400'
                      }`}>
                        {rep.rate}%
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>

      {/* Grid: Marketing Channels & Property Inventory */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Marketing Acquisition Channels */}
        <div className="lg:col-span-5 bg-zinc-900 border border-white/5 rounded-3xl p-6 flex flex-col gap-6 shadow-md">
          <div className="border-b border-white/5 pb-4">
            <h3 className="font-heading font-bold text-sm uppercase tracking-wider text-white">Marketing Acquisition Channels</h3>
            <p className="text-[10px] text-zinc-500 mt-0.5">Track lead source referrals and device platform analytics.</p>
          </div>

          <div className="flex flex-col gap-6">
            {/* Referrals */}
            <div className="flex flex-col gap-3">
              <span className="text-[10px] text-[#dfc28c] font-black uppercase tracking-wider flex items-center gap-1.5">
                <Globe size={12} />
                <span>Referral Sources</span>
              </span>
              <div className="flex flex-col gap-2.5">
                {trafficData.length === 0 ? (
                  <span className="text-zinc-500 text-xs italic font-medium">No channel traffic detected yet.</span>
                ) : (
                  trafficData.map((channel) => {
                    const count = channel._count._all;
                    const pct = totalLeads > 0 ? ((count / totalLeads) * 100).toFixed(0) : '0';
                    return (
                      <div key={channel.pageSource || 'Direct'} className="flex items-center justify-between text-xs">
                        <span className="text-zinc-400 font-semibold">{channel.pageSource || 'Direct / Organic'}</span>
                        <div className="flex items-center gap-3">
                          <span className="text-zinc-500 text-[10px] font-mono">{count} leads</span>
                          <span className="font-bold text-white font-mono w-8 text-right">{pct}%</span>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            {/* Devices */}
            <div className="flex flex-col gap-3 border-t border-white/5 pt-5">
              <span className="text-[10px] text-[#dfc28c] font-black uppercase tracking-wider flex items-center gap-1.5">
                <Laptop size={12} />
                <span>Device Usage Platforms</span>
              </span>
              <div className="flex flex-col gap-2.5">
                {deviceData.length === 0 ? (
                  <span className="text-zinc-500 text-xs italic font-medium">No device metadata cached.</span>
                ) : (
                  deviceData.map((device) => {
                    const count = device._count._all;
                    const pct = totalLeads > 0 ? ((count / totalLeads) * 100).toFixed(0) : '0';
                    return (
                      <div key={device.deviceType || 'Unknown'} className="flex items-center justify-between text-xs">
                        <span className="text-zinc-400 font-semibold uppercase tracking-wider text-[10px]">{device.deviceType || 'Web browser'}</span>
                        <div className="flex items-center gap-3">
                          <span className="text-zinc-500 text-[10px] font-mono">{count} leads</span>
                          <span className="font-bold text-white font-mono w-8 text-right">{pct}%</span>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Development Inventory & Capacity */}
        <div className="lg:col-span-7 bg-zinc-900 border border-white/5 rounded-3xl p-6 flex flex-col gap-6 shadow-md">
          <div className="border-b border-white/5 pb-4">
            <h3 className="font-heading font-bold text-sm uppercase tracking-wider text-white">Development Inventory Capacity</h3>
            <p className="text-[10px] text-zinc-500 mt-0.5">Monitor unit capacity, availability statuses, and pricing indices.</p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-white/5 bg-black/20 text-zinc-500 font-bold uppercase tracking-wider text-[9px]">
                  <th className="py-3 px-4">Development</th>
                  <th className="py-3 px-4 text-center">Unit Count</th>
                  <th className="py-3 px-4 text-center">Starting Price</th>
                  <th className="py-3 px-4 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {properties.map((prop) => (
                  <tr key={prop.id} className="hover:bg-white/[0.01] transition-colors">
                    <td className="py-3.5 px-4 font-bold text-white whitespace-nowrap">
                      {prop.name}
                      <span className="block text-[9px] text-zinc-500 font-medium">{prop.location}</span>
                    </td>
                    <td className="py-3.5 px-4 text-center text-zinc-300 font-mono font-semibold">
                      {prop._count.units} units
                    </td>
                    <td className="py-3.5 px-4 text-center text-zinc-300 font-mono font-semibold">
                      {prop.currency} {prop.startingPrice.toLocaleString('en-US')}
                    </td>
                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      <span className={`px-2.5 py-1 text-[9px] font-bold border rounded-full uppercase tracking-wider ${
                        prop.status === 'Sold out' 
                          ? 'bg-red-500/10 text-red-400 border border-red-500/20' 
                          : prop.status === 'Available'
                          ? 'bg-green-500/10 text-green-400 border border-green-500/20'
                          : 'bg-[#dfc28c]/10 text-[#dfc28c] border border-[#dfc28c]/15'
                      }`}>
                        {prop.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}
