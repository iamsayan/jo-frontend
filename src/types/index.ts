import type { Puja } from '@/types/interfaces';

export interface PageProps<TParams = {}, TSearchParams = {}> {
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

export * from "@/types/interfaces";
