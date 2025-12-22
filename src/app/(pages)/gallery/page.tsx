import { metadata as metadataSchema } from '@/app/layout';
import Gallery from '@/components/gallery';
import MainLayout from '@/components/main-layout';
import RemoteImage from '@/components/remote-image';
import Section from '@/components/section';
import type { Image } from '@/types';
import { getCollection } from '@/utils/fetch';
import { capitalizeFirst } from '@/utils/functions';
import schema from '@/utils/schema';
import imageUrl from '@/utils/transform';
import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Photo Gallery',
  description: `Browse Jagadhatri Puja photos from Chandannagar, Mankundu, and Bhadreswar—capturing pandals, lighting, idols, and themes from 2016 to ${new Date().getFullYear()}.`,
  openGraph: {
    ...metadataSchema.openGraph,
    url: '/gallery',
  },
  alternates: {
    canonical: '/gallery',
  },
};

export default async function Page() {
  const { data: allImages = [] } = await getCollection<Image>('images', {
    populate: {
      puja: {
        fields: ['name', 'referenceId'],
      },
    },
    pagination: {
      page: 1,
      pageSize: 1000,
    },
    filters: {
      category: {
        $in: ['puja', 'procession', 'immersion'],
      },
    },
    sort: ['updatedAt:desc'],
  });
  const availableYears = [
    ...new Set(allImages.map((img: Image) => img.year)),
  ].sort((a: number, b: number) => b - a);

  const jsonLd = schema({
    path: 'gallery',
    title: 'Photo Gallery',
    type: {
      collection: true,
    },
  });

  return (
    <MainLayout title="Photo Gallery" jsonLd={jsonLd}>
      <Section title="View Jagadhatri Puja" description="Photo Gallery">
        <div className="mb-16 text-center">
          <Gallery
            elementClassNames="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 fl-gap-2/4"
            speed={500}
            slideShowAutoplay={true}
            fullScreen={true}
          >
            {allImages.slice(0, 12).map((image: Image, index: number) => (
              <a
                href={imageUrl(
                  `${image.year}/${image.puja?.referenceId}/${image.name}`
                )}
                data-disable-progress={true}
                key={index}
                className="group relative aspect-[3/4] cursor-pointer overflow-hidden rounded-lg"
                data-sub-html={`<h4>${image.puja?.name}</h4><p>By: ${capitalizeFirst(image.uploadedBy)}</p>`}
              >
                <RemoteImage
                  src={imageUrl(
                    `${image.year}/${image.puja?.referenceId}/${image.name}`
                  )}
                  fill={true}
                  className="pointer-events-none object-cover text-transparent transition-transform duration-500 group-hover:scale-110"
                  quality={70}
                  alt={image.puja?.name ?? image.name}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                <div className="absolute inset-0 right-0 bottom-0 left-0 flex items-end text-center">
                  <div className="w-full translate-y-full transform text-white transition-transform duration-300 group-hover:mb-3 group-hover:translate-y-0">
                    <div className="fl-text-xs/sm mx-auto mb-2 max-w-50 font-medium">
                      {image.puja?.name ?? image.name}
                    </div>
                    {/* <div className="text-sm text-white/80">Click to expand</div> */}
                  </div>
                </div>
              </a>
            ))}
          </Gallery>
        </div>
        <div>
          <h2 className="mb-6 text-2xl font-bold">Browse by Year</h2>
          <div className="fl-gap-2/4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {availableYears.map((year: number) => {
              const yearImages = allImages.filter(
                (img: Image) => img.year === year
              );
              if (yearImages.length === 0) return null;
              const randomImage =
                yearImages[Math.floor(year % yearImages.length)];

              return (
                <Link
                  key={year}
                  href={`/gallery/${year}`}
                  className="group relative aspect-[3/4] cursor-pointer overflow-hidden rounded-lg md:aspect-square"
                >
                  <RemoteImage
                    src={imageUrl(
                      `${randomImage.year}/${randomImage.puja?.referenceId}/${randomImage.name}`
                    )}
                    fill={true}
                    className="pointer-events-none object-cover text-transparent transition-transform duration-500 group-hover:scale-110"
                    alt={`Gallery ${year}`}
                    loading="lazy"
                    lazy={false}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center text-white">
                      <div className="mb-2 text-3xl font-bold">{year}</div>
                      <div className="text-sm opacity-80">
                        {yearImages.length} Photos
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </Section>
    </MainLayout>
  );
}
