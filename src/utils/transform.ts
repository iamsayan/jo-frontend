interface Params {
    width?: number;
    quality?: number;
    height?: number;
    fit?: 'cover' | 'contain';
    blur?: number;
    grayscale?: boolean;
    format?: 'webp' | 'jpeg' | 'png' | 'auto';
    transform?: boolean;
}

export default function imageUrl(src: string, params?: Params): string {
    const {
        width,
        height,
        quality = 80,
        fit,
        blur,
        grayscale,
        format = 'auto',
        transform = true,
    } = params || {};

    const baseUrl = process.env.NEXT_PUBLIC_IMAGE_SERVICE_URL;
    if (!transform) return `${baseUrl}/${src}`;

    const url = new URL(`${baseUrl}/transform`);

    url.searchParams.set('src', Buffer.from(src, 'utf8').toString('base64').replace(/=/g, ''));
    if (width) url.searchParams.set('w', width.toString());
    if (height) url.searchParams.set('h', height.toString());
    if (fit) url.searchParams.set('fit', fit);
    if (blur) url.searchParams.set('blur', blur.toString());
    if (grayscale) url.searchParams.set('gray', '1');
    if (quality) url.searchParams.set('quality', quality.toString());
    if (format && format !== 'auto') url.searchParams.set('format', format);

    return url.toString();
}