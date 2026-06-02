'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ShieldCheck, Eye, EyeOff, Lock, Mail, Loader2 } from 'lucide-react';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Check if session is already active
  useEffect(() => {
    async function checkSession() {
      try {
        const res = await fetch('/api/auth/session');
        if (res.ok) {
          router.push('/admin');
        }
      } catch (err) {
        console.error(err);
      }
    }
    checkSession();
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Login failed. Please check credentials.');
      }

      router.push('/admin');
      router.refresh();
    } catch (err: any) {
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white flex items-center justify-center p-6 relative overflow-hidden">
      {/* Decorative blurred backgrounds */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#dfc28c]/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-zinc-800/20 rounded-full blur-[100px] pointer-events-none" />

      <div className="w-full max-w-md bg-zinc-900 border border-white/5 p-8 rounded-3xl shadow-2xl relative z-10">
        <div className="flex flex-col items-center text-center gap-2 mb-8">
          <div className="w-12 h-12 rounded-2xl bg-[#dfc28c]/10 border border-[#dfc28c]/20 flex items-center justify-center text-[#dfc28c] mb-2">
            <ShieldCheck size={26} />
          </div>
          <h1 className="font-heading font-bold text-2xl tracking-tight">Edifice Properties</h1>
          <p className="text-xs text-zinc-500 font-bold uppercase tracking-wider">Secure Administrative Panel</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-400 text-xs font-semibold leading-relaxed">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email */}
          <div className="flex flex-col gap-2">
            <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-4 top-3.5 text-zinc-500" size={16} />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@edifice.ug"
                className="w-full bg-black/40 border border-white/5 pl-11 pr-4 py-3 rounded-xl text-xs focus:border-[#dfc28c] focus:ring-1 focus:ring-[#dfc28c] outline-none transition-all placeholder:text-zinc-700"
              />
            </div>
          </div>

          {/* Password */}
          <div className="flex flex-col gap-2">
            <div className="flex justify-between items-center">
              <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">
                Password
              </label>
            </div>
            <div className="relative">
              <Lock className="absolute left-4 top-3.5 text-zinc-500" size={16} />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-black/40 border border-white/5 pl-11 pr-12 py-3 rounded-xl text-xs focus:border-[#dfc28c] focus:ring-1 focus:ring-[#dfc28c] outline-none transition-all placeholder:text-zinc-700"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-3.5 text-zinc-500 hover:text-white transition-colors"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#dfc28c] hover:bg-[#d4af37] disabled:bg-zinc-800 disabled:text-zinc-600 text-[#020c1b] font-bold text-xs tracking-wider uppercase py-3.5 rounded-xl transition-all shadow-lg flex items-center justify-center gap-2 mt-2"
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin" size={16} />
                <span>Authenticating...</span>
              </>
            ) : (
              <span>Sign In</span>
            )}
          </button>
        </form>

        <div className="mt-8 text-center text-[10px] text-zinc-600 font-bold uppercase tracking-wider">
          © 2026 Edifice Properties Uganda
        </div>
      </div>
    </div>
  );
}
