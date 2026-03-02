import { metadata as metadataSchema } from '@/app/layout';
import GalleryPaginate from '@/components/gallery-paginate';
import MainLayout from '@/components/main-layout';
import Section from '@/components/section';
import type { Image, PageProps } from '@/types';
import { getCollection } from '@/utils/fetch';
import schema from '@/utils/schema';
import imageUrl from '@/utils/transform';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

interface Params {
  year: string;
}

interface SearchParams {
  page: string | number;
}

const itemsPerPage = 36;

export async function generateMetadata({
  params,
  searchParams,
}: PageProps<Params, SearchParams>): Promise<Metadata> {
  const { year } = await params;
  const { page } = await searchParams;

  const { data: images = [], meta: metaData } = await getCollection<Image>(
    'images',
    {
      filters: {
        category: { $in: ['puja', 'procession', 'immersion'] },
        year: year,
      },
      populate: {
        puja: {
          fields: ['name', 'referenceId'],
        },
      },
      sort: ['updatedAt:desc'],
      pagination: {
        start: (Number(page ?? 1) - 1) * itemsPerPage,
        limit: itemsPerPage,
      },
    }
  );

  const pageCount = Math.ceil(
    (metaData?.pagination?.total ?? 0) / itemsPerPage
  );
  const currentPage = Number(page ?? 0);

  return {
    title: `Jagadhatri Puja Photo Gallery ${year} - Chandannagar`,
    description: `View stunning Jagadhatri Puja ${year} photos from Chandannagar, Mankundu, and Bhadreswar — featuring award-winning pandals, themes, lighting, and procession.`,
    keywords: [
      `jagadhatri puja ${year} photos`,
      `jagadhatri puja ${year} images`,
      `chandannagar jagadhatri puja ${year} gallery`,
      `jagadhatri puja pandal photos ${year}`,
      `chandannagar puja ${year}`,
    ],
    openGraph: {
      ...metadataSchema.openGraph,
      url:
        currentPage === 0
          ? `/gallery/${year}`
          : `/gallery/${year}?page=${currentPage}`,
      images: images.slice(0, 3)?.map((item: Image) => {
        return {
          url: imageUrl(`${item.year}/${item.puja?.referenceId}/${item.name}`, {
            tquality: 60,
          }),
          alt: item.puja?.name ?? item.name,
        };
      }),
    },
    alternates: {
      canonical:
        currentPage === 0
          ? `/gallery/${year}`
          : `/gallery/${year}?page=${currentPage}`,
    },
    pagination: {
      previous:
        currentPage > 1
          ? `/gallery/${year}?page=${currentPage - 1}`
          : undefined,
      next:
        currentPage < pageCount
          ? `/gallery/${year}?page=${currentPage + 1}`
          : undefined,
    },
  };
}

export default async function Page({
  params,
  searchParams,
}: PageProps<Params, SearchParams>) {
  const { year } = await params;
  const { page } = await searchParams;

  const { data: images = [], meta: metaData } = await getCollection<Image>(
    'images',
    {
      filters: {
        category: { $in: ['puja', 'procession', 'immersion'] },
        year: year,
      },
      sort: ['updatedAt:desc'],
      populate: ['puja'],
      pagination: {
        start: (Number(page ?? 1) - 1) * itemsPerPage,
        limit: itemsPerPage,
      },
    }
  );

  if (images.length < 1) {
    notFound();
  }

  const jsonLd = schema({
    path: `gallery/${year}`,
    title: `Photo Gallery of ${year}`,
    parents: [
      {
        title: 'Photo Gallery',
        slug: 'gallery',
      },
    ],
  });

  return (
    <MainLayout title={`Photo Gallery ${year}`} jsonLd={jsonLd}>
      <Section
        title="View Jagadhatri Puja"
        description={`Photo Gallery ${year}`}
      >
        <GalleryPaginate
          key={year}
          total={metaData?.pagination?.total ?? 0}
          images={images}
          itemsPerPage={itemsPerPage}
        />
      </Section>
    </MainLayout>
  );
}
