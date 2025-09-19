'use client';

import Image, { ImageLoaderProps, ImageProps } from 'next/image';
import { useInView } from 'react-intersection-observer';
import { cn } from '@/utils/functions';
import { useState, useCallback, useMemo } from 'react';
import placeholder from '@/public/circle-logo.png'

type TransformParams = {
    src: string;
    blur?: number;
    grayscale?: boolean;
    fit?: 'cover' | 'contain';
    format?: 'jpeg' | 'png' | 'webp' | 'gif' | 'auto';
    lazy?: boolean;
    containerClassName?: string;
};

type TransformedImageProps = Omit<ImageProps, 'loader' | 'src' | 'unoptimized'> & TransformParams;

type ImageTransformParams = {
    blur?: number;
    grayscale?: boolean;
    fit?: 'cover' | 'contain';
    format?: 'jpeg' | 'png' | 'webp' | 'gif' | 'auto';
};

export default function TransformedImage({
    blur,
    grayscale,
    fit,
    format,
    lazy = true,
    containerClassName,
    ...rest
}: TransformedImageProps) {
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<boolean>(false);
    
    const { ref, inView } = useInView({
        triggerOnce: true,
        rootMargin: "100px 50px",
        fallbackInView: true
    });

    const transformParams = useMemo<ImageTransformParams>(() => ({
        blur,
        grayscale,
        fit,
        format
    }), [blur, grayscale, fit, format]);

    const loader = useCallback(({ src, width, quality }: ImageLoaderProps) => {
        try {
            const url = new URL(process.env.NEXT_PUBLIC_IMAGE_TRANSFORM_SERVICE_URL!);
            
            const params: Record<string, string> = {
                src,
                ...(width && { width: String(width) }),
                ...(quality && { quality: String(quality) }),
                ...(transformParams.blur && { blur: String(transformParams.blur) }),
                ...(transformParams.grayscale && { grayscale: '1' }),
                ...(transformParams.fit && { fit: transformParams.fit }),
                ...(transformParams.format && { format: transformParams.format })
            };

            Object.entries(params).forEach(([key, value]) => {
                url.searchParams.set(key, value);
            });

            return url.toString();
        } catch (err) {
            console.error('Error creating image URL:', err);
            return src; // Fallback to original source
        }
    }, [transformParams]);

    const handleLoad = useCallback(() => {
        setIsLoading(false);
        setError(false);
    }, []);

    const handleError = useCallback(() => {
        console.error('Image loading error');
        setError(true);
        setIsLoading(false);
    }, []);

    const shouldRenderImage = !lazy || inView;

    return (
        <div 
            ref={ref}
            className={cn(
                'w-full h-full relative bg-gray-200',
                error && 'bg-red-100',
                containerClassName
            )}
        >
            {lazy && isLoading && (
                <div className="relative w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
                    <div className="w-16 h-16 mb-3 bg-white rounded-full flex items-center justify-center shadow-lg">
                        <Image
                            src={placeholder}
                            alt="Image placeholder"
                            className="w-10 h-10 opacity-60"
                            priority={false}
                        />
                    </div>
                </div>
            )}
            {shouldRenderImage && (
                <Image
                    {...rest}
                    loader={loader}
                    onLoad={handleLoad}
                    onError={handleError}
                />
            )}
            {error && (
                <div className="absolute inset-0 flex items-center justify-center text-red-500">
                    Failed to load image
                </div>
            )}
        </div>
    );
}