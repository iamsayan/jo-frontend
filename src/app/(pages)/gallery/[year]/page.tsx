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

interface PageProps {
    params: Promise<{
        year: string;
    }>;
    searchParams: Promise<{
        page: string | number;
    }>;
}

const itemsPerPage = 36;

export async function generateMetadata({ params, searchParams }: PageProps): Promise<Metadata> {
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
    const currentPage = Number(page ?? 1)
    
    return {
        title: `Photo Gallery of ${year}`,
        description: `View Jagadhatri Puja ${year} photos from Chandannagar, Mankundu, and nearby Bhadreswar—featuring award-winning pandals and themes.`,
        openGraph: {
            ...metadataSchema.openGraph,
            url: `/gallery/${year}?page=${currentPage}`,
            images: images?.data?.slice(0, 3)?.map((item: any) => {
                return {
                    url: assetImageLoader({
                        src: `${item?.year}/${item?.puja?.referenceId}/${item?.name}`,
                        quality: 70
                    }),
                    alt: item?.puja?.name
                }
            })
        },
        alternates: {
            canonical: `/gallery/${year}?page=${currentPage}`,
        },
        pagination: {
            previous: currentPage > 1 ? `/gallery/${year}?page=${currentPage - 1}` : undefined,
            next: currentPage < pageCount ? `/gallery/${year}?page=${currentPage + 1}` : undefined
        }
    }
}

export default async function Page({ params, searchParams }: PageProps) {
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
    let imagesObject = imagesData ?? []

    if (imagesObject?.data?.length < 1) {
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
                <Suspense>
                    <GalleryPaginate key={year} images={imagesObject} itemsPerPage={itemsPerPage} />
                </Suspense>
            </Section>
        </MainLayout>
    )
}