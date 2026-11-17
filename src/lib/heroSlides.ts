// Shared hero slider data: types, defaults and the logic that picks which
// slides the homepage shows. Used by the homepage (server) and the admin
// Hero editor (client), so it must stay free of server-only imports.

export interface HeroSlide {
  image: string; // background image (also the poster for uploaded videos)
  video: string; // YouTube link or direct video file URL (mp4/webm); optional
  title: string;
  subtitle: string;
  location: string;
  price: string;
  link: string;
}

export interface HeroStat {
  value: string;
  label: string;
}

export const HERO_SLIDES_KEY = 'home_hero_slides';
export const HERO_STATS_KEY = 'home_hero_stats';

export const DEFAULT_HERO_SLIDES: HeroSlide[] = [
  {
    image: '/assets/edifice/properties/property-card-horizon-residency.webp',
    video: 'https://youtu.be/5SdItw9WkAE',
    title: 'Redefining Urban Living Through Premium Residences',
    subtitle: 'THE HORIZON RESIDENCY',
    location: 'Luthuli Avenue, Bugolobi',
    price: 'Starting from $92,000',
    link: '/properties/horizon-residency',
  },
  {
    image: '/assets/edifice/embassy-towers/embassy-towers-hero.webp',
    video: 'https://youtu.be/cintZUdWXYY',
    title: 'Sophisticated High-Rise Suites in Kampala',
    subtitle: 'EMBASSY TOWERS',
    location: 'Kampala Road, Kampala',
    price: 'Starting from $68,000',
    link: '/properties/embassy-towers',
  },
  {
    image: '/assets/edifice/elite-palazzo/elite-palazzo-hero.webp',
    video: 'https://youtu.be/n3lhXEN9_Hs',
    title: 'Modern Elegance Meets City Connectivity',
    subtitle: 'ELITE PALAZZO',
    location: 'Naguru, Kampala',
    price: 'Starting from $120,000',
    link: '/properties/elite-palazzo-naguru',
  },
  {
    image: '/assets/edifice/atlantic-apartments/atlantic-apartments-exterior-01.png',
    video: 'https://youtu.be/k3A4DfR2z1o',
    title: 'A Design-Led Sanctuary Close to Everything',
    subtitle: 'ATLANTIC HEIGHTS',
    location: 'Kampala',
    price: 'Starting from $97,000',
    link: '/properties/atlantic-apartments',
  },
  {
    image: '/assets/edifice/signature%20residency/B.png',
    video: 'https://youtu.be/Eact7djAeQc',
    title: 'Experience modern living at Signature Residency, Kulambiro – comfort, convenience & great investment.',
    subtitle: 'SIGNATURE RESIDENCY',
    location: 'Kulambiro, Kampala',
    price: 'Starting from UGX 180,000,000',
    link: '/properties/signature-residency',
  },
];

export const DEFAULT_HERO_STATS: HeroStat[] = [
  { value: '10+', label: 'Years Experience' },
  { value: '50+', label: 'Happy Clients' },
  { value: '100%', label: 'Clear Titles' },
];

export const EMPTY_HERO_SLIDE: HeroSlide = {
  image: '',
  video: '',
  title: '',
  subtitle: '',
  location: '',
  price: '',
  link: '',
};

function parseJsonArray<T>(raw: string | undefined): T[] | null {
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

// Minimal shape of a Property row needed to build a slide.
interface PropertyLike {
  featured?: boolean;
  mainImage?: string | null;
  youtubeUrl?: string | null;
  description?: string | null;
  name?: string | null;
  location?: string | null;
  currency?: string | null;
  startingPrice?: number | null;
  slug?: string | null;
}

// Slides built from properties marked "featured" (the previous behaviour).
export function slidesFromProperties(properties: PropertyLike[]): HeroSlide[] {
  return properties
    .filter((p) => p.featured)
    .map((p) => ({
      image: p.mainImage || '',
      video: p.youtubeUrl || '',
      title: p.description || '',
      subtitle: (p.name || '').toUpperCase(),
      location: p.location || '',
      price: `Starting from ${p.currency === 'USD' ? '$' : ''}${Number(p.startingPrice || 0).toLocaleString()}${p.currency !== 'USD' ? ' ' + p.currency : ''}`,
      link: `/properties/${p.slug}`,
    }));
}

// Order of precedence: slides saved in admin → featured properties → built-in defaults.
export function resolveHeroSlides(settings: Record<string, string>, properties: PropertyLike[]): HeroSlide[] {
  const saved = parseJsonArray<HeroSlide>(settings[HERO_SLIDES_KEY]);
  if (saved && saved.length > 0) {
    return saved.map((s) => ({ ...EMPTY_HERO_SLIDE, ...s }));
  }
  const featured = slidesFromProperties(properties);
  return featured.length > 0 ? featured : DEFAULT_HERO_SLIDES;
}

export function resolveHeroStats(settings: Record<string, string>): HeroStat[] {
  const saved = parseJsonArray<HeroStat>(settings[HERO_STATS_KEY]);
  return saved && saved.length > 0 ? saved : DEFAULT_HERO_STATS;
}

export function getYouTubeId(url: string): string | null {
  if (!url) return null;
  const match = url.match(/^.*(youtu.be\/|v\/|u\/\w\/|embed\/|shorts\/|watch\?v=|&v=)([^#&?]*).*/);
  return match && match[2].length === 11 ? match[2] : null;
}
