'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { 
  LayoutDashboard, Users, Building2, BookOpen, Settings as SettingsIcon, 
  LogOut, Menu, X, ArrowUpRight, User 
} from 'lucide-react';

export default function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [adminName, setAdminName] = useState('Edifice Admin');

  // Verify session & fetch admin profile
  useEffect(() => {
    async function checkSession() {
      try {
        const res = await fetch('/api/auth/session');
        if (!res.ok) {
          router.push('/admin/login');
        } else {
          const data = await res.json();
          if (data?.user?.name) {
            setAdminName(data.user.name);
          }
        }
      } catch (err) {
        router.push('/admin/login');
      }
    }
    checkSession();
  }, [router]);

  const menuItems = [
    { name: 'Overview', href: '/admin', icon: LayoutDashboard },
    { name: 'Leads & Enquiries', href: '/admin/enquiries', icon: Users },
    { name: 'Properties & Units', href: '/admin/properties', icon: Building2 },
    { name: 'Blog News', href: '/admin/blogs', icon: BookOpen },
    { name: 'Global Settings', href: '/admin/settings', icon: SettingsIcon },
  ];

  const handleLogout = async () => {
    if (confirm('Are you sure you want to log out?')) {
      try {
        const res = await fetch('/api/auth/logout', { method: 'POST' });
        if (res.ok) {
          router.push('/admin/login');
          router.refresh();
        }
      } catch (err) {
        console.error('Logout failed', err);
      }
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white flex">
      {/* Sidebar - Desktop */}
      <aside className="w-64 bg-zinc-900 border-r border-white/5 flex-col justify-between hidden lg:flex">
        <div className="flex flex-col flex-1">
          {/* Logo */}
          <div className="h-20 flex items-center px-8 border-b border-white/5 gap-3">
            <span className="font-heading font-black text-lg tracking-wider text-[#dfc28c]">
              EDIFICE
            </span>
            <span className="text-[10px] font-bold tracking-widest text-zinc-500 uppercase border border-zinc-700 px-1.5 py-0.5 rounded">
              CMS
            </span>
          </div>

          {/* Links */}
          <nav className="flex-1 px-4 py-6 space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-3.5 rounded-xl text-xs font-semibold tracking-wide transition-all ${
                    isActive
                      ? 'bg-[#dfc28c] text-[#020c1b]'
                      : 'text-zinc-400 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <Icon size={18} />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* User profile & Logout */}
        <div className="p-4 border-t border-white/5 flex flex-col gap-3">
          <div className="flex items-center gap-3 px-4 py-2">
            <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center text-[#dfc28c] border border-white/10">
              <User size={14} />
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-xs font-bold truncate">{adminName}</span>
              <span className="text-[9px] text-zinc-500 font-bold uppercase tracking-wider">Super Admin</span>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3.5 w-full text-left rounded-xl text-xs font-bold text-red-400 hover:bg-red-500/10 transition-colors"
          >
            <LogOut size={18} />
            <span>Logout Session</span>
          </button>
        </div>
      </aside>

      {/* Mobile Sidebar overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm lg:hidden">
          <aside className="w-64 bg-zinc-900 border-r border-white/5 h-full flex flex-col justify-between">
            <div>
              <div className="h-20 flex items-center justify-between px-6 border-b border-white/5">
                <span className="font-heading font-black text-lg tracking-wider text-[#dfc28c]">
                  EDIFICE
                </span>
                <button
                  onClick={() => setSidebarOpen(false)}
                  className="text-zinc-400 hover:text-white p-1"
                >
                  <X size={20} />
                </button>
              </div>

              <nav className="px-4 py-6 space-y-1">
                {menuItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setSidebarOpen(false)}
                      className={`flex items-center gap-3 px-4 py-3.5 rounded-xl text-xs font-semibold tracking-wide transition-all ${
                        isActive
                          ? 'bg-[#dfc28c] text-[#020c1b]'
                          : 'text-zinc-400 hover:bg-white/5 hover:text-white'
                      }`}
                    >
                      <Icon size={18} />
                      <span>{item.name}</span>
                    </Link>
                  );
                })}
              </nav>
            </div>

            <div className="p-4 border-t border-white/5 flex flex-col gap-3">
              <div className="flex items-center gap-3 px-4 py-2">
                <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center text-[#dfc28c] border border-white/10">
                  <User size={14} />
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="text-xs font-bold truncate">{adminName}</span>
                  <span className="text-[9px] text-zinc-500 font-bold uppercase tracking-wider">Super Admin</span>
                </div>
              </div>

              <button
                onClick={handleLogout}
                className="flex items-center gap-3 px-4 py-3.5 w-full text-left rounded-xl text-xs font-bold text-red-400 hover:bg-red-500/10 transition-colors"
              >
                <LogOut size={18} />
                <span>Logout Session</span>
              </button>
            </div>
          </aside>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="h-20 bg-zinc-900 border-b border-white/5 flex items-center justify-between px-6 lg:px-10 z-10 shrink-0">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden text-zinc-400 hover:text-white p-1"
            >
              <Menu size={22} />
            </button>
            <h1 className="font-heading font-bold text-lg text-white">
              {menuItems.find((item) => item.href === pathname)?.name || 'Dashboard'}
            </h1>
          </div>

          <div className="flex items-center gap-4 text-xs font-semibold">
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 border border-zinc-700 hover:border-zinc-500 rounded-xl text-zinc-400 hover:text-white flex items-center gap-1.5 transition-all"
            >
              <span>View Site</span>
              <ArrowUpRight size={14} />
            </a>
          </div>
        </header>

        {/* Inner Content */}
        <main className="flex-1 overflow-y-auto p-6 lg:p-10 bg-zinc-950">
          {children}
        </main>
      </div>
    </div>
  );
}
