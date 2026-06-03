import type { Metadata } from 'next';
import { Geist, Outfit } from 'next/font/google';
import Script from 'next/script';
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
      <head>
        <Script id="google-tag-manager" strategy="afterInteractive">
          {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-MS3L3W73');`}
        </Script>
      </head>
      <body className="min-h-full flex flex-col bg-white text-charcoal-800 selection:bg-gold-500 selection:text-charcoal-800">
        {/* Google Tag Manager (noscript) */}
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-MS3L3W73"
            height="0"
            width="0"
            style={{ display: 'none', visibility: 'hidden' }}
          />
        </noscript>
        <LogoPreloader />
        {children}
      </body>
    </html>
  );
}
