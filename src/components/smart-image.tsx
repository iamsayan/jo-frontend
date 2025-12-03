'use client';

import { useState, useCallback, ReactNode } from 'react';
import Image, { type ImageProps } from 'next/image';
import { useOnInView, type IntersectionEffectOptions } from 'react-intersection-observer';
import { cn } from '@/utils/functions';
import placeholder from '@/public/circle-logo.png'

type SmartImageProps = Omit<ImageProps, 'loader'> & {
    lazy?: boolean;
    lazyPlaceholder?: ReactNode;
    containerClassName?: string;
    intersectionOptions?: IntersectionEffectOptions,
};

export default function SmartImage({
    lazy = true,
    lazyPlaceholder,
    containerClassName,
    intersectionOptions,
    ...rest
}: SmartImageProps) {
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<boolean>(false);
    const [isInView, setIsInView] = useState<boolean>(false);
    
    const ref = useOnInView(
        (inView, entry) => {
            setIsInView(inView);
        },
        {
            triggerOnce: true,
            rootMargin: "100px 50px",
            ...intersectionOptions
        }
    );

    const handleLoad = useCallback(() => {
        setIsLoading(false);
        setError(false);
    }, []);

    const handleError = useCallback(() => {
        setError(true);
        setIsLoading(false);
    }, []);

    const shouldRenderImage = !lazy || isInView;

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
                lazyPlaceholder || (
                    <div className="relative w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
                        <div className="w-16 h-16 mb-3 bg-white rounded-full flex items-center justify-center shadow-lg">
                            <Image
                                src={placeholder}
                                alt="Image placeholder"
                                className="w-10 h-10 opacity-40"
                                priority={false}
                            />
                        </div>
                    </div>
                )
            )}
            {shouldRenderImage && (
                <Image
                    {...rest}
                    onLoad={handleLoad}
                    onError={handleError}
                    // loader={({ src }) => src}
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