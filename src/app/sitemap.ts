import type { Puja } from '@/types';
import { getCollection } from '@/utils/fetch';
import type { MetadataRoute } from 'next';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const { data = [] } = await getCollection<Puja>('pujas', {
    pagination: {
      page: 1,
      pageSize: 200,
    },
    sort: ['sortOrder:asc'],
  });

  const sitemaps: MetadataRoute.Sitemap = [
    {
      url: process.env.NEXT_PUBLIC_SITE_URL!,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${process.env.NEXT_PUBLIC_SITE_URL}/puja-history`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${process.env.NEXT_PUBLIC_SITE_URL}/gallery`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.8,
    },
    {
      url: `${process.env.NEXT_PUBLIC_SITE_URL}/puja-committee-list`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    {
      url: `${process.env.NEXT_PUBLIC_SITE_URL}/terms`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.2,
    },
    {
      url: `${process.env.NEXT_PUBLIC_SITE_URL}/privacy-policy`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.2,
    },
    {
      url: `${process.env.NEXT_PUBLIC_SITE_URL}/about-us`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${process.env.NEXT_PUBLIC_SITE_URL}/contact-us`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${process.env.NEXT_PUBLIC_SITE_URL}/achievements`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.6,
    },
    {
      url: `${process.env.NEXT_PUBLIC_SITE_URL}/cinematics`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.2,
    },
    {
      url: `${process.env.NEXT_PUBLIC_SITE_URL}/hoimontika-somman`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.7,
    },
    {
      url: `${process.env.NEXT_PUBLIC_SITE_URL}/digital-media-partnership`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.4,
    },
    {
      url: `${process.env.NEXT_PUBLIC_SITE_URL}/jagadhatri-puja`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.9,
    },
  ];

  const currentYear = new Date().getFullYear();
  const galleryYears = Array.from(
    { length: currentYear - 2015 },
    (_, i) => i + 2016
  ).reverse();
  galleryYears.forEach((year: number, index: number) => {
    sitemaps.push({
      url: `${process.env.NEXT_PUBLIC_SITE_URL}/gallery/${year}`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: index === 0 ? 0.9 : 0.8,
    });
  });

  const pujaYears = Array.from(
    { length: currentYear - 1998 },
    (_, i) => i + 2000
  );
  pujaYears.forEach((year: number) => {
    sitemaps.push({
      url: `${process.env.NEXT_PUBLIC_SITE_URL}/jagadhatri-puja/${year}`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: year === currentYear ? 0.9 : 0.8,
    });
  });

  data.forEach((element: Puja) => {
    sitemaps.push({
      url: `${process.env.NEXT_PUBLIC_SITE_URL}/puja/${element.slug}/${element.referenceId}`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    });
  });

  return sitemaps;
}
