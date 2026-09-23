'use client';

import { useCallback, useRef } from 'react';

import { useParams, useSearchParams } from 'next/navigation';

import Gallery from '@/components/gallery';
import RemoteImage from '@/components/remote-image';
import type { GalleryImage } from '@/types';
import { cn } from '@/utils/functions';
import imageUrl from '@/utils/transform';
import { useRouter } from '@bprogress/next/app';

import type { LightGallery } from 'lightgallery/lightgallery';
import { renderToString } from 'react-dom/server';
import { LuChevronLeft, LuChevronRight } from 'react-icons/lu';
import type { ReactPaginateProps } from 'react-paginate';
import ReactPaginate from 'react-paginate';

interface GalleryPaginateProps {
  className?: string;
  images: GalleryImage[];
  itemsPerPage: number;
  total: number;
}

function GalleryPaginate({
  className,
  images,
  itemsPerPage,
  total,
}: GalleryPaginateProps) {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const lightGallery = useRef<LightGallery | null>(null);

  const classes = cn('gallery-paginate mt-4', className);
  const pageCount = Math.ceil(total / itemsPerPage);
  const currentPage = Number(searchParams.get('page') ?? 1);
  const currentYear = params.year ?? new Date().getFullYear();

  const handlePageClick: ReactPaginateProps['onPageChange'] = (event) => {
    router.push(`/gallery/${currentYear}?page=${event.selected + 1}`);
  };

  const onInit = useCallback((detail: { instance: LightGallery }) => {
    if (detail) {
      lightGallery.current = detail.instance;
    }
  }, []);

  const subHtml = (item: GalleryImage) => {
    return (
      <div className="flex flex-col items-center justify-center gap-1.5">
        <div className="text-xl font-bold">{item?.puja?.name}</div>
      </div>
    );
  };

  const dynamicEl = images.map((item, index: number) => {
    const imagePath = imageUrl(
      `${item.year}/${item.puja?.referenceId}/${item.name}`
    );
    return {
      key: item.documentId ?? index,
      src: imagePath,
      thumb: imagePath,
      alt: item.puja?.name ?? item.name,
      subHtml: renderToString(subHtml(item)),
    };
  });

  return (
    <div className={classes}>
      <Gallery
        elementClassNames="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-6 fl-gap-2/4 mt-2"
        speed={500}
        thumbnail={true}
        slideShowAutoplay={true}
        onInit={onInit}
        fullScreen={true}
        dynamicEl={dynamicEl}
        dynamic={true}
      >
        {images.map((item, index: number) => (
          <div
            key={item.documentId ?? index}
            className="group relative aspect-[4/5] cursor-pointer overflow-hidden rounded-2xl"
            onClick={() => lightGallery.current?.openGallery(index)}
          >
            <RemoteImage
              key={item.documentId ?? index}
              src={`${item.year}/${item.puja?.referenceId}/${item.name}`}
              fill={true}
              className="pointer-events-none transform object-cover text-transparent transition-all duration-700 group-hover:scale-110"
              alt={item.puja?.name ?? item.name}
            />
            {/* <span className="absolute bottom-0 left-0 right-0 text-center bg-yellow-500 p-1.5 text-xs">{item?.puja_entry_id?.puja_name}</span> */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
            <div className="absolute inset-0 right-0 bottom-0 left-0 flex items-end text-center">
              <div className="w-full translate-y-full transform text-white transition-transform duration-300 group-hover:mb-3 group-hover:translate-y-0">
                <div className="fl-text-xs/sm mx-auto mb-2 max-w-50 font-medium">
                  {item.puja?.name ?? item.name}
                </div>
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
          forcePage={currentPage - 1}
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
          hrefBuilder={(page, pageCount) =>
            page >= 1 && page <= pageCount
              ? `/gallery/${currentYear}?page=${page}`
              : '#'
          }
          hrefAllControls
        />
      )}
    </div>
  );
}

export default GalleryPaginate;
