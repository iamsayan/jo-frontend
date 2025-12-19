import qs from 'qs';
import pluralize from 'pluralize';
import type {
    Document,
    DocumentResponse,
    DocumentResponseCollection,
} from '@/types/interfaces';

interface GetCollectionOptions {
    revalidate?: number;
    tags?: string[];
}

async function requestApi<TResp>(
    collection: string,
    params: Record<string, unknown>,
    options: GetCollectionOptions,
): Promise<TResp> {
    const {
        revalidate = process.env.NODE_ENV === 'development' ? 0 : 604800,
        tags = [],
    } = options;

    const query = Object.keys(params).length
        ? qs.stringify(params, { encodeValuesOnly: true })
        : '';
    const baseTag = pluralize.isPlural(collection)
        ? pluralize.singular(collection)
        : collection;
    const url = query
        ? `${process.env.API_URL}/${collection}?${query}`
        : `${process.env.API_URL}/${collection}`;

    const response = await fetch(url, {
        method: 'GET',
        headers: {
            Authorization: `Bearer ${process.env.API_KEY!}`,
        },
        next: {
            tags: [`collection-${baseTag}`, ...tags],
            revalidate,
        },
    });

    if (!response.ok) {
        const errorText = await response.text().catch(() => '');
        console.error('Strapi fetch error:', response.status, errorText);

        throw new Error(
            `Failed to fetch collection "${collection}" – ${response.status} ${response.statusText}`,
        );
    }

    return (await response.json()) as TResp;
}

export async function getCollection<T extends Document>(
    collection: string,
    params: Record<string, unknown> = {},
    options: GetCollectionOptions = {},
): Promise<DocumentResponseCollection<T>> {
    return requestApi<DocumentResponseCollection<T>>(
        collection,
        params,
        options,
    );
}

export async function getSingle<T extends Document>(
    collection: string,
    params: Record<string, unknown> = {},
    options: GetCollectionOptions = {},
): Promise<DocumentResponse<T>> {
    return requestApi<DocumentResponse<T>>(collection, params, options);
}
