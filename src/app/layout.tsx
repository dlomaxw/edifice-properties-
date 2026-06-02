import type { Metadata } from 'next';
import { Geist, Outfit } from 'next/font/google';
import LogoPreloader from '@/components/layout/LogoPreloader';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const outfit = Outfit({
  variable: '--font-outfit',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: {
    default: 'Edifice Properties Uganda | Luxury Apartments for Sale in Kampala',
    template: '%s | Edifice Properties Uganda',
  },
  description:
    'Explore premium apartments and residential developments by Edifice Properties Uganda. Discover Horizon Residency Bugolobi, Embassy Towers Kampala, and Elite Palazzo Naguru.',
  metadataBase: new URL('https://edificepropertiesug.com'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'Edifice Properties Uganda | Luxury Apartments for Sale in Kampala',
    description:
      'Discover premium residential developments by Edifice Properties in Bugolobi, Naguru, Kololo, and Kulambiro, Kampala. Modern layouts, premium finishes, and flexible payment plans.',
    url: 'https://edificepropertiesug.com',
    siteName: 'Edifice Properties',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Edifice Properties Uganda | Luxury Apartments for Sale in Kampala',
    description:
      'Explore premium apartments and residential developments by Edifice Properties Uganda. Discover Horizon Residency Bugolobi, Embassy Towers, and Elite Palazzo Naguru.',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${outfit.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-white text-charcoal-800 selection:bg-gold-500 selection:text-charcoal-800">
        <LogoPreloader />
        {children}
      </body>
    </html>
  );
}
