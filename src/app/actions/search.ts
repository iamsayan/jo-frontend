'use server'

import { getCollection } from "@/utils/fetch";

export async function searchModels(model: string, query: string, params: Record<string, any> = {}) {
    try {
        const searchData = await getCollection(model, {
            filters: {
                name: {
                    $contains: query,
                },
            },
            ...params,
        });
        return searchData?.data ?? null;
    } catch (error) {
        if (error instanceof Error && error.name !== 'TimeoutError') {
            console.error("API error:", error);
        }
        return null;
    }
}