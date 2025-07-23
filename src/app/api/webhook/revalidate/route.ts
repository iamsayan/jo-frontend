import { revalidateTag } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';
import pluralize from 'pluralize';

export async function POST(request: NextRequest) {
    try {
        const webhookSecret = request.headers.get('x-webhook-secret');
        if (webhookSecret !== process.env.WEBHOOK_SECRET) {
            return NextResponse.json({ message: 'Invalid webhook secret' }, { status: 401 });
        }

        const body = await request.json();
        const { model } = body;
        const modelName = pluralize(model);

        if (!modelName) {
            return NextResponse.json(
                { message: 'Missing required fields: modelName' },
                { status: 400 }
            );
        }

        const tag = `collection-${modelName}`;
        revalidateTag(tag);

        return NextResponse.json({
            revalidated: true,
            tag: tag,
            timestamp: Date.now(),
        });
    } catch (err) {
        console.error('Revalidation error:', err);
        return NextResponse.json(
            { message: 'Error revalidating', error: (err as Error).message },
            { status: 500 }
        );
    }
} 