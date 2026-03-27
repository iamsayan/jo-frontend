import React from 'react';

import Breadcrumbs from '@/components/breadcrumbs';
import Main from '@/components/main';
import { paytoneOne } from '@/fonts';
import bg from '@/public/bg.jpg';

interface LayoutProps {
  children: React.ReactNode;
  title: string;
  jsonLd?: object;
  breadcrumbTitle?: string;
  end?: number;
  bgImg?: { src: string };
}

export default function MainLayout({
  children,
  title,
  jsonLd,
  breadcrumbTitle,
  end,
  bgImg,
}: LayoutProps) {
  const bgImage = typeof bgImg !== 'undefined' ? bgImg.src : bg.src;
  return (
    <Main jsonLd={jsonLd}>
      <div
        className="hero relative h-96"
        style={{ backgroundImage: `url(${bgImage})` }}
      >
        <div className="hero-overlay bg-black/70"></div>
        <div className="hero-content text-white-content flex-col gap-5 p-0 pt-10 text-center text-white">
          <h1
            className={`fl-text-3xl/4xl text-shadow-grey-300 text-shadow-2xs ${paytoneOne.className}`}
          >
            {title}
          </h1>
          <Breadcrumbs breadcrumbTitle={breadcrumbTitle} end={end} />
          {/* <div className="absolute top-4 left-4 w-12 h-12 border-t-2 border-l-2 border-amber-500/30"></div>
                    <div className="absolute top-4 right-4 w-12 h-12 border-t-2 border-r-2 border-amber-500/30"></div>
                    <div className="absolute bottom-4 left-4 w-12 h-12 border-b-2 border-l-2 border-amber-500/30"></div>
                    <div className="absolute bottom-4 right-4 w-12 h-12 border-b-2 border-r-2 border-amber-500/30"></div> */}
        </div>
      </div>
      {children}
    </Main>
  );
}
