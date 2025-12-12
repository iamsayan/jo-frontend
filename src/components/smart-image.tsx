'use client';

import { useState, useCallback, ReactNode } from 'react';
import Image, { type ImageProps } from 'next/image';
import { useInView, type IntersectionOptions } from 'react-intersection-observer';
import { cn } from '@/utils/functions';
import placeholder from '@/public/circle-logo.png'

type SmartImageProps = Omit<ImageProps, 'loader'> & {
    lazy?: boolean;
    loader?: boolean;
    loaderPlaceholder?: ReactNode;
    containerClassName?: string;
    intersectionOptions?: IntersectionOptions,
};

export default function SmartImage({
    lazy = true,
    loader = true,
    loaderPlaceholder,
    containerClassName,
    intersectionOptions,
    ...rest
}: SmartImageProps) {
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<boolean>(false);
    
    const { ref, inView, entry } = useInView({
        triggerOnce: true,
        rootMargin: "100px 50px",
        fallbackInView: true,
        ...intersectionOptions,
        skip: !lazy,
    });

    const handleLoad = useCallback(() => {
        setIsLoading(false);
        setError(false);
    }, []);

    const handleError = useCallback(() => {
        setError(true);
        setIsLoading(false);
    }, []);

    return (
        <div 
            ref={ref}
            className={cn(
                'w-full h-full relative bg-gray-200',
                error && 'bg-red-100',
                containerClassName
            )}
        >
            {loader && isLoading && (
                loaderPlaceholder || (
                    <div className="relative w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
                        <div className="w-16 h-16 mb-3 bg-white rounded-full flex items-center justify-center shadow-lg">
                            <Image
                                src={placeholder}
                                alt="Image placeholder"
                                className="size-10 opacity-40"
                                priority={false}
                            />
                        </div>
                    </div>
                )
            )}
            {(!lazy || inView) && (
                <Image
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    {...rest}
                    onLoad={handleLoad}
                    onError={handleError}
                    //loader={({ src }) => src}
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