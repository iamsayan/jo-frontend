'use client';

import { useCallback, useRef } from 'react';
import SmartImage from '@/components/smart-image';
import Gallery from '@/components/gallery';
import { cn } from '@/utils/functions';

// @ts-ignore
import { Splide, SplideSlide, SplideProps } from '@splidejs/react-splide';
import { Grid } from '@splidejs/splide-extension-grid';
import { Intersection } from '@splidejs/splide-extension-intersection';
import { AutoScroll } from '@splidejs/splide-extension-auto-scroll';
import { GalleryItem } from 'lightgallery/lg-utils';
import imageUrl from '@/utils/transform';
import '@splidejs/splide/css';

interface GallerySliderProps {
    slides: GalleryItem[];
    sliderOptions: SplideProps['options'];
    sliderClass?: string;
    sliderItemClass?: string;
    [key: string]: any;
}

export default function GallerySlider({
    slides,
    sliderOptions,
    ...props
}: GallerySliderProps) {
    const lightGallery = useRef<any>(null);
    const defaultOptions: SplideProps['options'] = {
        type: 'loop',
    };

    sliderOptions = {
        ...defaultOptions,
        ...sliderOptions,
    };

    const onInit = useCallback((detail: any) => {
        if (detail) {
            lightGallery.current = detail.instance;
        }
    }, []);

    if (slides.length < 1) {
        return null;
    }

    slides = slides.map((item: any) => {
        return {
            ...item,
            src: imageUrl(item.src),
        };
    });

    return (
        <Gallery {...props} onInit={onInit} dynamicEl={slides} dynamic={true}>
            <Splide
                options={sliderOptions}
                className={cn('slider-container', props.sliderClass)}
                extensions={{ Grid, AutoScroll, Intersection }}
            >
                {slides.map((item: any, index: number) => (
                    <SplideSlide
                        key={index}
                        onClick={() => lightGallery.current.openGallery(index)}
                        className={cn(
                            'relative cursor-pointer',
                            props.sliderItemClass,
                        )}
                    >
                        <SmartImage
                            src={item.src}
                            alt={item.alt}
                            className="pointer-events-none transform object-cover text-transparent transition-all duration-700 group-hover:scale-110"
                            fill={true}
                            quality={item?.quality ?? 70}
                            lazy={false}
                            loader={false}
                            loading="lazy"
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
