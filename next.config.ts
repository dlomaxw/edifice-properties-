import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
      {
        protocol: 'http',
        hostname: '**',
      },
    ],
  },
  async redirects() {
    return [
      {
        source: '/about-us',
        destination: '/about',
        permanent: true,
      },
      {
        source: '/about-us/',
        destination: '/about',
        permanent: true,
      },
      {
        source: '/elite-palazzonaguru-2',
        destination: '/properties/horizon-residency',
        permanent: true,
      },
      {
        source: '/elite-palazzonaguru-2/',
        destination: '/properties/horizon-residency',
        permanent: true,
      },
      {
        source: '/diaspora-investment',
        destination: '/diaspora',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
