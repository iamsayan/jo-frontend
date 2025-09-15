import MainLayout from "@/components/main-layout";
import Section from "@/components/section";
import schema from "@/utils/schema";
import GalleryPaginate from "@/components/gallery-paginate";
import { getCollection } from "@/utils/fetch";
import { metadata as metadataSchema } from "@/app/layout";
import { notFound } from "next/navigation";
import type { Metadata } from 'next'
import { Suspense } from 'react'
import { assetImageLoader } from "@/utils/transform";
import type { Image, PageProps } from "@/types";

interface Params {
    year: string;
};

interface SearchParams {
    page: string | number;
}

const itemsPerPage = 36;

export async function generateMetadata({ params, searchParams }: PageProps<Params, SearchParams>): Promise<Metadata> {
    const { year } = await params
    const { page } = await searchParams

    const imagesData = await getCollection('images', {
        filters: {
            category: { $in: ['puja', 'procession', 'immersion'] },
            year: year
        },
        populate: {
            puja: {
                fields: ['name', 'referenceId']
            }
        },
        sort: ['updatedAt:desc'],
        pagination: {
            start: (Number(page ?? 1) - 1) * itemsPerPage,
            limit: itemsPerPage,
        }
    })
    let images = imagesData ?? []

    const pageCount = Math.ceil(images?.meta?.pagination.total / itemsPerPage);
    const currentPage = Number(page ?? 0)
    
    return {
        title: `Photo Gallery of ${year}`,
        description: `View Jagadhatri Puja ${year} photos from Chandannagar, Mankundu, and nearby Bhadreswar—featuring award-winning pandals and themes.`,
        openGraph: {
            ...metadataSchema.openGraph,
            url: currentPage === 0 ? `/gallery/${year}` : `/gallery/${year}?page=${currentPage}`,
            images: images?.data?.slice(0, 3)?.map((item: Image) => {
                return {
                    url: assetImageLoader({
                        src: `${item.year}/${item.puja?.referenceId}/${item.name}`,
                        quality: 70
                    }),
                    alt: item.puja?.name ?? item.name
                }
            })
        },
        alternates: {
            canonical: currentPage === 0 ? `/gallery/${year}` : `/gallery/${year}?page=${currentPage}`,
        },
        pagination: {
            previous: currentPage > 1 ? `/gallery/${year}?page=${currentPage - 1}` : undefined,
            next: currentPage < pageCount ? `/gallery/${year}?page=${currentPage + 1}` : undefined
        }
    }
}

export default async function Page({ params, searchParams }: PageProps<Params, SearchParams>) {
    const { year } = await params
    const { page } = await searchParams

    const imagesData = await getCollection('images', {
        filters: {
            category: { $in: ['puja', 'procession', 'immersion'] },
            year: year
        },
        sort: ['updatedAt:desc'],
        populate: ['puja'],
        pagination: {
            start: (Number(page ?? 1) - 1) * itemsPerPage,
            limit: itemsPerPage,
        }
    })
    const imagesObject = imagesData ?? []
    const images: Image[] = imagesObject.data ?? []

    if (images.length < 1) {
        notFound()
    }

    const jsonLd = schema({
        path: `gallery/${year}`,
        title: `Photo Gallery of ${year}`,
        parents: [
            {
                title: 'Photo Gallery',
                slug: 'gallery'
            }
        ]
    })

    return (
        <MainLayout title={`Photo Gallery ${year}`} jsonLd={jsonLd}>
            <Section title="View Jagadhatri Puja" description={`Photo Gallery ${year}`}>
                <GalleryPaginate key={year} total={imagesObject.meta.pagination.total} images={images} itemsPerPage={itemsPerPage} />
            </Section>
        </MainLayout>
    )
}