'use server';


import { strapi } from '@/utils/strapi';

type SearchableCollection = {
  find: (
    params?: Record<string, unknown>,
    nextOptions?: { revalidate?: number; tags?: string[] }
  ) => Promise<unknown[]>;
};

const searchableCollections: Record<string, SearchableCollection> = {
  artists: strapi.artists as unknown as SearchableCollection,
  images: strapi.images as unknown as SearchableCollection,
  pujas: strapi.pujas as unknown as SearchableCollection,
};

export async function searchModels<T>(
  model: string,
  query: string,
  params: Record<string, unknown> = {}
) {
  try {
    const api = searchableCollections[model];

    if (!api) {
      return null;
    }

    const baseTag = model.endsWith('s') ? model.slice(0, -1) : model;
    const searchData = await api.find(
      {
        filters: {
          name: {
            $contains: query,
          },
        },
        ...params,
      },
      {
        revalidate: process.env.NODE_ENV === 'development' ? 0 : 604800,
        tags: [`collection-${baseTag}`],
      }
    );

    return searchData as T[];
  } catch (error) {
    if (error instanceof Error && error.name !== 'TimeoutError') {
      console.error('API error:', error);
    }
    return null;
  }
}