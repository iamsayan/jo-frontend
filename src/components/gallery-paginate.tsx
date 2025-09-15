'use client';

import React, { useCallback, useRef } from 'react';
import { useSearchParams, useParams } from 'next/navigation';
import { useRouter } from '@bprogress/next/app';
import TransformedImage from '@/components/transformed-image';
import { capitalizeFirst, cn } from '@/utils/functions';
import Gallery from "@/components/gallery";
import ReactPaginate from 'react-paginate';
import { LuCamera, LuChevronLeft, LuChevronRight } from 'react-icons/lu';
import { assetImageLoader } from '@/utils/transform';
import { renderToString } from "react-dom/server";
import type { Image } from "@/types";

interface GalleryPaginateProps {
    className?: string;
    images: Image[];
    itemsPerPage: number;
    total: number;
}

function GalleryPaginate({ className, images, itemsPerPage, total }: GalleryPaginateProps) {
    const router = useRouter();
    const params = useParams();
    const searchParams = useSearchParams();
    const lightGallery = useRef<any>(null);

    const classes = cn('gallery-filter mt-4', className);
    const pageCount = Math.ceil(total / itemsPerPage);
    const currentPage = Number(searchParams.get('page') ?? 1);
    const currentYear = params.year ?? new Date().getFullYear();

    const handlePageClick = (event: any) => {
        router.push(`/gallery/${currentYear}?page=${event.selected + 1}`)
    };

    const onInit = useCallback((detail: any) => {
        if (detail) {
            lightGallery.current = detail.instance;
        }
    }, []);

    const subHtml = (item: any) => {
        return (
            <div className="flex flex-col items-center justify-center gap-1.5">
                <div className="font-bold text-xl">{item?.puja?.name}</div>
                <div className="flex items-center justify-center gap-1.5">
                    <LuCamera className="inline-block size-3.5" /> 
                    <div className="text-xs">Captured by: <span className="font-bold">{capitalizeFirst(item?.uploadedBy)}</span></div>
                </div>
            </div>
        )
    }

    const dynamicEl = images.map((item: Image, index: number) => {
        const imagePath = assetImageLoader({
            src: `${item.year}/${item.puja?.referenceId}/${item.name}`,
        });
        return {
            key: item.documentId ?? index,
            src: imagePath,
            thumb: imagePath,
            alt: item.puja?.name ?? item.name,
            subHtml: renderToString(subHtml(item)),
        }
    });

    return (
        <div className={classes}>
            <Gallery elementClassNames="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-6 gap-2 md:gap-3 lg:gap-4 mt-2" speed={500} thumbnail={true} slideShowAutoplay={true} onInit={onInit} fullScreen={true} dynamicEl={dynamicEl} dynamic={true}>
                {images.map((item: Image, index: number) => (
                    <div key={item.documentId ?? index} className="relative aspect-[4/5] overflow-hidden rounded-2xl group cursor-pointer" onClick={() => lightGallery.current.openGallery(index)}>
                        <TransformedImage
                            key={item.documentId ?? index}
                            src={`${item.year}/${item.puja?.referenceId}/${item.name}`}
                            width={500}
                            height={300}
                            className="object-cover w-full h-full pointer-events-none text-transparent transform transition-all duration-700 group-hover:scale-110"
                            priority={true}
                            quality={70}
                            alt={item.puja?.name ?? item.name}
                        />
                        {/* <span className="absolute bottom-0 left-0 right-0 text-center bg-yellow-500 p-1.5 text-xs">{item?.puja_entry_id?.puja_name}</span> */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        <div className="absolute inset-0 flex items-end left-0 right-0 text-center bottom-0">
                            <div className="text-white transform translate-y-full group-hover:translate-y-0 transition-transform duration-300 w-full group-hover:mb-3">
                                <div className="font-medium mb-2 max-w-50 mx-auto text-xs md:text-sm">{item.puja?.name ?? item.name}</div>
                                {/* <div className="text-sm text-white/80">Click to expand</div> */}
                            </div>
                        </div>
                    </div>
                ))}
            </Gallery>
            {pageCount > 1 && (
                <ReactPaginate
                    previousLabel={<LuChevronLeft />}
                    nextLabel={<LuChevronRight />}
                    breakLabel="..."
                    pageCount={pageCount}
                    marginPagesDisplayed={2}
                    pageRangeDisplayed={2}
                    onPageChange={handlePageClick}
                    forcePage={currentPage-1}
                    containerClassName="join flex justify-center mt-5"
                    pageClassName="join-item"
                    pageLinkClassName="rounded-none btn"
                    nextClassName="join-item"
                    nextLinkClassName="rounded-none btn"
                    previousClassName="join-item"
                    previousLinkClassName="rounded-none btn"
                    breakClassName="join-item"
                    breakLinkClassName="rounded-none btn btn-disabled"
                    activeLinkClassName="btn-active"
                    hrefBuilder={(page, pageCount, selected) =>
                        page >= 1 && page <= pageCount ? `/gallery/${currentYear}?page=${page}` : '#'
                    }
                    hrefAllControls
                />
            )}
        </div>
    );
}

export default GalleryPaginate;