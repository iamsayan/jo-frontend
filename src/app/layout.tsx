import Providers from '@/app/providers';
import { rubik } from '@/fonts';
import type { GlobalSite } from '@/types';
import { getSingle } from '@/utils/fetch';
import { GoogleTagManager } from '@next/third-parties/google';
import type { Metadata, Viewport } from 'next';
import { headers } from 'next/headers';
import Script from 'next/script';

import '@/app/globals.scss';
import '@bprogress/core/css';

export const revalidate = 604800; // 1 week

export const viewport: Viewport = {
  themeColor: '#eab308',
};

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL!),
  alternates: {
    canonical: '/',
  },
  title: {
    template:
      '%s - Jagadhatri Online™ | 10 Years of Being the #1 Puja Portal for Chandannagar Jagadhatri Puja',
    default:
      'Jagadhatri Online™ | the #1 Puja Portal for Chandannagar Jagadhatri Puja',
  },
  description: `Celebrating 10 years of devotion, Jagadhatri Online™ is Chandannagar’s leading portal for Jagadhatri Puja – dedicated to the goddess Jagaddhatri, a serene form of Durga worshipped through Tantra and tradition in West Bengal.`,
  keywords: ['jagadhatri puja', 'jagadhatri', 'chandannagar'],
  authors: [{ name: 'Sayan Datta', url: 'https://sayandatta.co.in' }],
  creator: 'Sayan Datta',
  publisher: 'Jagadhatri Online',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    siteName: 'Jagadhatri Online',
    locale: 'en_IN',
    type: 'website',
    url: '/',
  },
  verification: {
    google: 'DlFEkrjmoyJEMTrNA5wonqW45Se03O5RkI_9D8Md7Us',
    other: {
      me: ['info@jagadhatrionline.co.in'],
    },
  },
  facebook: {
    appId: process.env.AUTH_FACEBOOK_ID!,
  },
  other: {
    'p:domain_verify': '17e6e3cc4fa6744677baf74c22411d8d',
    'facebook-domain-verification': 'g7w4rsbdbiffzthsoh176leffkonxf',
    'google-adsense-account': process.env.NEXT_PUBLIC_ADSENSE_PUBLISHER_ID!,
  },
};

interface RootLayoutProps {
  children: React.ReactNode;
}

export default async function RootLayout({ children }: RootLayoutProps) {
  const { data: siteData } = await getSingle<GlobalSite>('global', {
    populate: '*',
  });
  const nonce = (await headers()).get('x-nonce') ?? '';

  return (
    <html
      lang="en"
      data-theme="light"
      suppressHydrationWarning={process.env.NODE_ENV === 'production'}
    >
      {process.env.NODE_ENV === 'production' && (
        <>
          <GoogleTagManager
            gtmId={process.env.NEXT_PUBLIC_GA4_ID!}
            nonce={nonce}
            dataLayer={{
              cookie_prefix: 'JoGtag',
              cookie_domain: process.env.NEXT_PUBLIC_SITE_URL!,
              cookie_flags: 'samesite=none;secure',
              allow_google_signals: true,
            }}
          />
          <Script
            async
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${process.env.NEXT_PUBLIC_ADSENSE_PUBLISHER_ID}`}
            crossOrigin="anonymous"
            nonce={nonce}
            strategy="afterInteractive"
          />
          <Script id="statcounter">
            {`
                            var sc_project=11108007;
                            var sc_invisible=1;
                            var sc_security="13b4e93a";
                        `}
          </Script>
          <Script
            src="https://www.statcounter.com/counter/counter.js"
            nonce={nonce}
            async={true}
          />
        </>
      )}
      <body
        className={`${rubik.className} ${rubik.variable} fl-text-sm/base overflow-x-hidden antialiased`}
      >
        <Providers siteData={siteData}>{children}</Providers>
      </body>
    </html>
  );
}
