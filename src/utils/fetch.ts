import qs from 'qs';

interface ApiResponse {
    [key: string]: any;
}

export async function getCollection(collection: string, params: Record<string, any> = {}): Promise<ApiResponse> {
    const query = qs.stringify(params, {
        encodeValuesOnly: true,
    });
    const response = await fetch(`${process.env.API_URL}/${collection}?${query}`, {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${process.env.API_KEY!}`,
        },
        next: {
            tags: [`collection-${collection}`],
            revalidate: process.env.NODE_ENV === 'development' ? 0 : 604800,
        },
    });

    if (response.ok) {
        return response.json();
    } else {
        return Promise.reject(response);
    }
}