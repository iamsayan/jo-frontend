type AssetImageLoaderParams = {
    src: string;
    width?: number;
    quality?: number;
    height?: number;
    fit?: 'cover' | 'contain';
    blur?: number;
    grayscale?: boolean;
    format?: 'webp' | 'jpeg' | 'png' | 'auto';
};

export function assetImageLoader({
    src,
    width,
    height,
    quality = 80,
    fit,
    blur,
    grayscale,
    format = 'auto',
}: AssetImageLoaderParams): string {
    const url = new URL(process.env.NEXT_PUBLIC_IMAGE_TRANSFORM_SERVICE_URL!);

    url.searchParams.set('src', src);
    if (width) url.searchParams.set('w', width.toString());
    if (height) url.searchParams.set('h', height.toString());
    if (fit) url.searchParams.set('fit', fit);
    if (blur) url.searchParams.set('blur', blur.toString());
    if (grayscale) url.searchParams.set('gray', '1');
    if (quality) url.searchParams.set('quality', quality.toString());
    if (format && format !== 'auto') url.searchParams.set('format', format);

    return url.toString();
}
