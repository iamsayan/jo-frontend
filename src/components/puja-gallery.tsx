'use client';

import { useCallback, useMemo, useRef, useState } from 'react';

import Gallery from '@/components/gallery';
import RemoteImage from '@/components/remote-image';
import type { Image as PujaImage } from '@/types';
import { cn } from '@/utils/functions';
import imageUrl from '@/utils/transform';

import { GalleryItem } from 'lightgallery/lg-utils';
import type { LightGallery } from 'lightgallery/lightgallery';
import { LuExpand } from 'react-icons/lu';

interface PujaGalleryProps {
  images: PujaImage[];
  pujaName: string;
  referenceId: string;
}

export default function PujaGallery({
  images,
  pujaName,
  referenceId,
}: PujaGalleryProps) {
  const lightGallery = useRef<LightGallery | null>(null);

  const yearGroups = useMemo(() => {
    const groups: Record<string, PujaImage[]> = {};
    images.forEach((img) => {
      if (!groups[img.year]) groups[img.year] = [];
      groups[img.year].push(img);
    });
    return groups;
  }, [images]);

  const years = useMemo(
    () =>
      Object.keys(yearGroups)
        .sort((a, b) => Number(b) - Number(a)),
    [yearGroups]
  );

  const [activeYear, setActiveYear] = useState<string | 'all'>('all');

  const filteredImages = useMemo(() => {
    if (activeYear === 'all') return images;
    return yearGroups[activeYear] || [];
  }, [activeYear, images, yearGroups]);

  const galleryItems: GalleryItem[] = useMemo(
    () =>
      filteredImages.map((img) => ({
        src: imageUrl(`${img.year}/${referenceId}/${img.name}`),
        thumb: imageUrl(`${img.year}/${referenceId}/${img.name}`, {
          twidth: 400,
          tquality: 60,
        }),
        alt: pujaName,
        subHtml: img.category
          ? `<p class="text-xs opacity-70">${img.category}</p>`
          : '',
      })),
    [filteredImages, referenceId, pujaName]
  );

  const onInit = useCallback((detail: { instance: LightGallery }) => {
    if (detail) {
      lightGallery.current = detail.instance;
    }
  }, []);

  if (images.length < 1) return null;

  const count = filteredImages.length;
  // Determine how many images to show in the bento grid (max 5)
  const visibleCount = Math.min(count, 5);
  const visibleImages = filteredImages.slice(0, visibleCount);
  const remainingCount = count - visibleCount;

  return (
    <div>
      {/* Year Filter */}
      {years.length > 1 && (
        <div className="mb-8 flex flex-wrap items-center justify-center gap-2">
          <button
            onClick={() => setActiveYear('all')}
            className={cn(
              'cursor-pointer rounded-full px-4 py-1.5 text-xs font-semibold transition-all duration-200',
              activeYear === 'all'
                ? 'bg-gray-900 text-white'
                : 'border border-gray-200 bg-white text-gray-500 hover:border-gray-300 hover:text-gray-700'
            )}
          >
            All ({images.length})
          </button>
          {years.map((year) => (
            <button
              key={year}
              onClick={() => setActiveYear(year)}
              className={cn(
                'cursor-pointer rounded-full px-4 py-1.5 text-xs font-semibold transition-all duration-200',
                activeYear === year
                  ? 'bg-gray-900 text-white'
                  : 'border border-gray-200 bg-white text-gray-500 hover:border-gray-300 hover:text-gray-700'
              )}
            >
              {year} ({yearGroups[year].length})
            </button>
          ))}
        </div>
      )}

      {/* Gallery */}
      <Gallery
        onInit={onInit}
        dynamicEl={galleryItems}
        dynamic={true}
        speed={500}
        thumbnail={true}
        fullScreen={true}
      >
        <div
          className={cn(
            'grid gap-2 md:gap-2.5',
            count === 1 && 'grid-cols-1',
            count === 2 && 'grid-cols-2',
            count === 3 && 'grid-cols-2 md:grid-cols-3',
            count === 4 && 'grid-cols-2',
            count >= 5 && 'grid-cols-2 md:grid-cols-4'
          )}
          style={count >= 5 ? { gridTemplateRows: 'auto auto' } : undefined}
        >
          {visibleImages.map((img, index) => {
            // Determine special sizing based on position and total count
            const isLargeFirst =
              (count === 3 && index === 0) || (count >= 5 && index === 0);

            const spanClass = cn(
              isLargeFirst &&
                count === 3 &&
                'col-span-2 md:col-span-1 md:row-span-2',
              isLargeFirst && count >= 5 && 'col-span-2 row-span-2'
            );

            const aspectClass = cn(
              count === 1 && 'aspect-video max-w-2xl mx-auto',
              count === 2 && 'aspect-[3/4]',
              count === 3 &&
                index === 0 &&
                'aspect-[3/4] md:aspect-auto md:h-full',
              count === 3 && index !== 0 && 'aspect-[4/3]',
              count === 4 && 'aspect-[4/3]',
              count >= 5 &&
                index === 0 &&
                'aspect-square md:aspect-auto md:h-full',
              count >= 5 && index !== 0 && 'aspect-[4/3]'
            );

            const isLastVisible = index === visibleCount - 1;

            return (
              <div
                key={`${img.year}-${img.name}-${index}`}
                className={cn('relative', spanClass)}
              >
                <div
                  className={cn(
                    'group relative h-full cursor-pointer overflow-hidden rounded-xl bg-gray-100',
                    aspectClass
                  )}
                  onClick={() => lightGallery.current?.openGallery(index)}
                >
                  <RemoteImage
                    src={`${img.year}/${referenceId}/${img.name}`}
                    alt={`${pujaName} - ${img.category || 'Gallery'} ${img.year}`}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                    fill={true}
                    quality={75}
                    lazy={index > 0}
                    loaderPlaceholder={true}
                  />
                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                  <div className="absolute top-2.5 right-2.5 flex h-8 w-8 items-center justify-center rounded-full bg-white/20 opacity-0 backdrop-blur-sm transition-all duration-300 group-hover:opacity-100">
                    <LuExpand className="text-xs text-white" />
                  </div>
                  {/* Bottom meta */}
                  <div className="absolute right-0 bottom-0 left-0 flex items-end justify-between p-3 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                    {img.category && (
                      <span className="rounded-full bg-white/20 px-2.5 py-0.5 text-[10px] font-medium text-white capitalize backdrop-blur-sm">
                        {img.category}
                      </span>
                    )}
                    <span className="ml-auto rounded-full bg-white/20 px-2.5 py-0.5 text-[10px] font-medium text-white backdrop-blur-sm">
                      {img.year}
                    </span>
                  </div>
                </div>

                {/* "+N more" overlay on last visible image */}
                {isLastVisible && remainingCount > 0 && (
                  <div
                    className="absolute inset-0 flex cursor-pointer flex-col items-center justify-center rounded-xl bg-black/45 backdrop-blur-[1px] transition-colors hover:bg-black/55"
                    onClick={() => lightGallery.current?.openGallery(index)}
                  >
                    <span className="text-2xl font-bold text-white md:text-3xl">
                      +{remainingCount}
                    </span>
                    <span className="mt-1 text-xs text-white/70">View all</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </Gallery>
    </div>
  );
}
