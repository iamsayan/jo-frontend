'use client';

import placeholderImage from '@/public/circle-logo.png';
import { cn } from '@/utils/functions';
import imageUrl, { TransformParams } from '@/utils/transform';
import Image, { type ImageProps } from 'next/image';
import { useCallback, useMemo, useRef, useState, type ReactNode } from 'react';
import {
  useInView,
  type IntersectionOptions,
} from 'react-intersection-observer';

type RemoteImageProps = Omit<ImageProps, 'loader' | 'src'> & {
  src: string;
  lazy?: boolean;
  loaderPlaceholder?: boolean | ReactNode;
  containerClassName?: string;
  intersectionOptions?: IntersectionOptions;
} & TransformParams;

export default function RemoteImage({
  src,
  alt,
  lazy = true,
  loaderPlaceholder = true,
  tquality,
  twidth,
  theight,
  containerClassName,
  intersectionOptions,
  ...rest
}: RemoteImageProps) {
  const [imageState, setImageState] = useState<{
    isLoading: boolean;
    error: boolean;
    useTransform: boolean;
  }>({
    isLoading: true,
    error: false,
    useTransform: true,
  });

  const hasAttemptedFallback = useRef(false);

  const url = useMemo(
    () =>
      imageUrl(src, {
        twidth,
        theight,
        tquality,
        transform: imageState.useTransform,
      }),
    [src, twidth, theight, tquality, imageState.useTransform]
  );

  const { ref, inView } = useInView({
    triggerOnce: true,
    rootMargin: '100px 50px',
    fallbackInView: true,
    skip: !lazy,
    ...intersectionOptions,
  });

  const handleLoad = useCallback(() => {
    setImageState((prev) => ({
      ...prev,
      isLoading: false,
      error: false,
    }));
    hasAttemptedFallback.current = false;
  }, []);

  const handleError = useCallback(() => {
    if (imageState.useTransform && !hasAttemptedFallback.current) {
      hasAttemptedFallback.current = true;
      setImageState((prev) => ({
        ...prev,
        useTransform: false,
        isLoading: true,
      }));
    } else {
      setImageState({
        isLoading: false,
        error: true,
        useTransform: false,
      });
    }
  }, [imageState.useTransform]);

  const shouldRenderImage = !lazy || inView;
  const shouldShowPlaceholder =
    imageState.isLoading && loaderPlaceholder !== false;

  const containerClasses = useMemo(
    () =>
      cn(
        'relative h-full w-full bg-gray-200',
        imageState.error && 'bg-red-100',
        containerClassName
      ),
    [imageState.error, containerClassName]
  );

  return (
    <div ref={ref} className={containerClasses}>
      {shouldShowPlaceholder &&
        (typeof loaderPlaceholder === 'boolean' ? (
          <div className="relative flex h-full w-full flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
            <div className="mb-3 flex size-16 items-center justify-center rounded-full bg-white shadow-lg">
              <Image
                src={placeholderImage}
                alt="Image placeholder"
                className="size-10 opacity-40"
                priority={false}
              />
            </div>
          </div>
        ) : (
          loaderPlaceholder
        ))}

      {shouldRenderImage && (
        <Image
          src={url}
          alt={alt}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 75vw, 50vw"
          onLoad={handleLoad}
          onError={handleError}
          unoptimized
          {...rest}
        />
      )}

      {imageState.error && (
        <div className="absolute inset-0 flex items-center justify-center text-red-500">
          Failed to load image
        </div>
      )}
    </div>
  );
}
