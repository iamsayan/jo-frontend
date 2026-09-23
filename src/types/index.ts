import type {
  Artist,
  GlobalGetPayload,
  Image,
  Puja,
  Procession,
} from '@/strapi/types';

export interface PageProps<
  TParams = Record<string, string>,
  TSearchParams = Record<string, string | string[]>,
> {
  params: Promise<TParams>;
  searchParams: Promise<TSearchParams>;
}

export interface PujaLocation {
  address?: string;
  coordinates?: { lat?: number; lng?: number };
  geohash?: string;
}

export interface VideoField {
  url?: string;
  provider?: string;
  providerUid?: string;
  privacyHash?: string;
}

export type GlobalSite = GlobalGetPayload<{ populate: '*' }>;

export type GalleryImage = Image & {
  puja?: { name?: string; referenceId?: string } | null;
};

export interface PujaExtended extends Puja {
  year: number;
  celebrating: string;
  popular: boolean;
  adi: boolean;
  jubilee: boolean;
  preJubilee: boolean;
  psZone: string;
  address: string;
  ccjpcId: number;
  artists?: Artist[];
  procession?: Procession | null;
  images?: Image[];
  location: PujaLocation | null;
  tags: string[];
}

export * from '@/strapi/types';