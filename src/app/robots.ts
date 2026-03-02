import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: 'Googlebot',
        allow: '/',
        disallow: ['/cinematics/register', '/api/'],
      },
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/cinematics/register', '/api/'],
        crawlDelay: 1,
      },
    ],
    sitemap: `${process.env.NEXT_PUBLIC_SITE_URL}/sitemap.xml`,
    host: process.env.NEXT_PUBLIC_SITE_URL,
  };
}
