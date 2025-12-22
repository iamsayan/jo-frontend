import type { Puja } from '@/types/interfaces';

export interface PageProps<
  TParams = Record<string, string>,
  TSearchParams = Record<string, string | string[]>,
> {
  params: Promise<TParams>;
  searchParams: Promise<TSearchParams>;
}

export interface PujaExtended extends Puja {
  year: number;
  celebrating: string;
  popular: boolean;
  adi: boolean;
  jubilee: boolean;
  preJubilee: boolean;
  psZone: string;
  address: string;
}

export * from '@/types/interfaces';
