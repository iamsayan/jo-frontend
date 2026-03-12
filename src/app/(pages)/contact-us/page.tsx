import type { Metadata } from 'next';

import { metadata as metadataSchema } from '@/app/layout';
import Contact from '@/components/contact';
import MainLayout from '@/components/main-layout';
import Section from '@/components/section';
import schema from '@/utils/schema';
import { GoogleMapsEmbed } from '@next/third-parties/google';

export const metadata: Metadata = {
  title: 'Contact Jagadhatri Online - Chandannagar, West Bengal',
  description:
    "Contact Jagadhatri Online™ for coverage, collaboration, or festival queries about Chandannagar Jagadhatri Puja. Based in Chandannagar, West Bengal — we're here to help 24×7 during puja season.",
  keywords: [
    'contact jagadhatri online',
    'jagadhatri puja contact',
    'chandannagar puja portal contact',
    'jagadhatri online email',
    'chandannagar west bengal contact',
  ],
  openGraph: {
    ...metadataSchema.openGraph,
    url: '/contact-us',
  },
  alternates: {
    canonical: '/contact-us',
  },
};

export default function Page() {
  const jsonLd = schema({
    path: 'contact-us',
    title: 'Contact Jagadhatri Online',
  });

  // Add ContactPage schema
  jsonLd['@graph'].push({
    '@type': 'ContactPage',
    '@id': `${process.env.NEXT_PUBLIC_SITE_URL}/contact-us/#contactpage`,
    name: 'Contact Jagadhatri Online',
    description:
      'Get in touch with Jagadhatri Online for Chandannagar Jagadhatri Puja coverage, collaboration, or festival-related queries.',
    mainEntity: {
      '@id': `${process.env.NEXT_PUBLIC_SITE_URL}/#organization`,
    },
  } as any);

  return (
    <MainLayout title="Contact Us" jsonLd={jsonLd}>
      <Section title="Need any help?" description="Contact Us">
        <div className="grid grid-cols-1 gap-6 pt-4 md:grid-cols-2">
          <div className="relative">
            <Contact />
          </div>
          <GoogleMapsEmbed
            apiKey={process.env.GOOGLE_MAP_API_KEY!}
            height={400}
            width="100%"
            mode="place"
            zoom="18"
            q="Chandannagar,Hooghly,West+Bengal,712136"
          />
        </div>
      </Section>
    </MainLayout>
  );
}
