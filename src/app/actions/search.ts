'use server'

import { admin } from "@/lib/cms";

export async function searchModels(model: string, query: string, params: Record<string, any> = {}) {
    try {
        const client = admin.collection(model);
        const searchData = await client.find({
            filters: {
                name: {
                    $contains: query,
                },
            },
            ...params,
        });
        return searchData.data ?? null;
    } catch (error) {
        if (error instanceof Error && error.name !== 'TimeoutError') {
            console.error("API error:", error);
        }
        return null;
    }
}