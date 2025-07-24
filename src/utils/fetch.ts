import qs from 'qs';
import pluralize from 'pluralize';

interface ApiResponse {
    [key: string]: any;
}

export async function getCollection(collection: string, params: Record<string, any> = {}): Promise<ApiResponse> {
    if (!process.env.API_URL || !process.env.API_KEY) {
        console.error('Missing API_URL or API_KEY environment variable');
        return { success: false, error: 'Server configuration error' };
    }

    const query = qs.stringify(params, {
        encodeValuesOnly: true,
    });
    const tag = pluralize.isPlural(collection) ? pluralize.singular(collection) : collection;
    const response = await fetch(`${process.env.API_URL}/${collection}?${query}`, {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${process.env.API_KEY!}`,
        },
        next: {
            tags: [`collection-${tag}`],
            revalidate: process.env.NODE_ENV === 'development' ? 0 : 604800,
        },
    });

    if (response.ok) {
        return response.json();
    } else {
        return Promise.reject(response);
    }
}