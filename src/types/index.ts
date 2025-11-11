import type { Puja } from '@/types/interfaces';
import type { API } from '@strapi/client';

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

export type APIResponse<T extends API.Document = API.Document> = API.DocumentResponse<T>;
export type APIResponseCollection<T extends API.Document = API.Document> = API.DocumentResponseCollection<T>;