'use client';

import { useCallback, useRef } from 'react';

import Gallery from '@/components/gallery';
import RemoteImage from '@/components/remote-image';
import { cn } from '@/utils/functions';
import imageUrl from '@/utils/transform';
import { AutoScroll } from '@splidejs/splide-extension-auto-scroll';
import { Grid } from '@splidejs/splide-extension-grid';
import { Intersection } from '@splidejs/splide-extension-intersection';

import { GalleryItem } from 'lightgallery/lg-utils';
import type { LightGallery } from 'lightgallery/lightgallery';
import type { LightGalleryProps } from 'lightgallery/react';
import { Splide, SplideProps, SplideSlide } from 'react-splide-ts';
import 'react-splide-ts/css';

type GallerySliderProps = LightGalleryProps & {
  slides: GalleryItem[];
  sliderOptions: SplideProps['options'];
  sliderClass?: string;
  sliderItemClass?: string;
};

export default function GallerySlider({
  slides,
  sliderOptions,
  sliderClass,
  sliderItemClass,
  ...props
}: GallerySliderProps) {
  const lightGallery = useRef<LightGallery | null>(null);
  const defaultOptions: SplideProps['options'] = {
    type: 'loop',
  };

  sliderOptions = {
    ...defaultOptions,
    ...sliderOptions,
  };

  const onInit = useCallback((detail: { instance: LightGallery }) => {
    if (detail) {
      lightGallery.current = detail.instance;
    }
  }, []);

  if (slides.length < 1) {
    return null;
  }

  return (
    <Gallery
      {...props}
      onInit={onInit}
      dynamicEl={slides.map((item: GalleryItem) => {
        return {
          ...item,
          src: imageUrl(item.src as string),
        };
      })}
      dynamic={true}
    >
      <Splide
        options={sliderOptions}
        className={cn('slider-container', sliderClass)}
        extensions={{ Grid, AutoScroll, Intersection }}
      >
        {slides.map((item: GalleryItem, index: number) => (
          <SplideSlide
            key={index}
            onClick={() => lightGallery.current?.openGallery(index)}
            className={cn('relative cursor-pointer', sliderItemClass)}
          >
            <RemoteImage
              src={item.src as string}
              alt={item.alt as string}
              className="pointer-events-none transform object-cover text-transparent transition-all duration-700 group-hover:scale-110"
              fill={true}
              quality={item?.quality ?? 70}
              lazy={false}
              loaderPlaceholder={false}
            />
            {item?.subHtml && (
              <>
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                <div className="absolute inset-0 right-0 bottom-0 left-0 flex items-end text-center">
                  <div className="w-full translate-y-full transform text-white transition-transform duration-300 group-hover:mb-3 group-hover:translate-y-0">
                    <div
                      className="fl-text-xs/sm mx-auto mb-2 max-w-50 font-medium"
                      dangerouslySetInnerHTML={{
                        __html: item?.subHtml,
                      }}
                    />
                    {/* <div className="text-sm text-white/80">Click to expand</div> */}
                  </div>
                </div>
              </>
            )}
          </SplideSlide>
        ))}
      </Splide>
    </Gallery>
  );
}
