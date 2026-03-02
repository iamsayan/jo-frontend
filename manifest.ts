import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Jagadhatri Online™ - #1 Puja Portal for Chandannagar Jagadhatri Puja',
    short_name: 'Jagadhatri Online',
    description:
      'The #1 Puja Portal for Chandannagar, Mankundu & Bhadreswar Jagadhatri Puja. Explore Puja Committees, Photo Gallery, Videos, Pandal Locations, Schedule, Jubilee List, and Cultural Heritage of Goddess Jagadhatri.',
    start_url: '/',
    display: 'standalone',
    background_color: '#eab308',
    theme_color: '#eab308',
    categories: ['culture', 'religion', 'events', 'travel'],
    lang: 'en-IN',
    icons: [
      {
        src: '/favicon.ico',
        sizes: '32x32',
        type: 'image/x-icon',
      },
    ],
  };
}
