'use server';

import type { Document } from '@/types/interfaces';
import { getCollection } from '@/utils/fetch';

export async function searchModels<T extends Document>(
  model: string,
  query: string,
  params: Record<string, unknown> = {}
) {
  try {
    const { data: searchData = [] } = await getCollection<T>(model, {
      filters: {
        name: {
          $contains: query,
        },
      },
      ...params,
    });
    return searchData;
  } catch (error) {
    if (error instanceof Error && error.name !== 'TimeoutError') {
      console.error('API error:', error);
    }
    return null;
  }
}
