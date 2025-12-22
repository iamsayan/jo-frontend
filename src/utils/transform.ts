export interface TransformParams {
  twidth?: number;
  tquality?: number;
  theight?: number;
  fit?: 'cover' | 'contain';
  blur?: number;
  grayscale?: boolean;
  format?: 'webp' | 'jpeg' | 'png' | 'auto';
  transform?: boolean;
}

export default function imageUrl(
  src: string,
  params?: TransformParams
): string {
  const {
    twidth,
    theight,
    tquality = 80,
    fit,
    blur,
    grayscale,
    format = 'auto',
    transform = true,
  } = params || {};

  const baseUrl = process.env.NEXT_PUBLIC_IMAGE_SERVICE_URL;
  if (!transform) return `${baseUrl}/${src}`;

  const url = new URL(`${baseUrl}/transform`);

  url.searchParams.set('src', src);
  if (twidth) url.searchParams.set('w', twidth.toString());
  if (theight) url.searchParams.set('h', theight.toString());
  if (fit) url.searchParams.set('fit', fit);
  if (blur) url.searchParams.set('blur', blur.toString());
  if (grayscale) url.searchParams.set('gray', '1');
  if (tquality) url.searchParams.set('quality', tquality.toString());
  if (format && format !== 'auto') url.searchParams.set('format', format);

  return url.toString();
}
