"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import SmartImage from "@/components/smart-image";
import Gallery from "@/components/gallery";
import { cn } from "@/utils/functions";

// @ts-ignore
import { Splide, SplideSlide, SplideProps } from "@splidejs/react-splide";
import { Grid } from "@splidejs/splide-extension-grid";
import { Intersection } from "@splidejs/splide-extension-intersection";
import { AutoScroll } from "@splidejs/splide-extension-auto-scroll";
import { GalleryItem } from "lightgallery/lg-utils";
import imageUrl from "@/utils/transform";
import "@splidejs/splide/css";

interface GallerySliderProps {
  slides: GalleryItem[];
  sliderOptions: SplideProps["options"];
  sliderClass?: string;
  sliderItemClass?: string;
  [key: string]: any;
}

export default function GallerySlider({ slides, sliderOptions, ...props }: GallerySliderProps) {
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const lightGallery = useRef<any>(null);
  const defaultOptions: SplideProps["options"] = {
    type: "loop",
  };

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  sliderOptions = {
    ...defaultOptions,
    ...sliderOptions,
  };

  const onInit = useCallback((detail: any) => {
    if (detail) {
      lightGallery.current = detail.instance;
    }
  }, []);

  if (!isLoaded || slides.length < 1) {
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
      <Splide options={sliderOptions} className={cn("slider-container", props.sliderClass)} extensions={{ Grid, AutoScroll, Intersection }}>
        {slides.map((item: any, index: number) => (
          <SplideSlide
            key={index}
            onClick={() => lightGallery.current.openGallery(index)}
            className={cn("relative cursor-pointer", props.sliderItemClass)}
          >
            <SmartImage
              src={item.src}
              alt={item.alt}
              className="object-cover pointer-events-none text-transparent transform transition-all duration-700 group-hover:scale-110"
              fill={true}
              quality={item?.quality ?? 70}
              lazy={false}
              loader={false}
              loading="lazy"
            />
            {item?.subHtml && (
              <>
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute inset-0 flex items-end left-0 right-0 text-center bottom-0">
                  <div className="text-white transform translate-y-full group-hover:translate-y-0 transition-transform duration-300 w-full group-hover:mb-3">
                    <div className="font-medium mb-2 max-w-50 mx-auto fl-text-xs/sm" dangerouslySetInnerHTML={{ __html: item?.subHtml }} />
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
