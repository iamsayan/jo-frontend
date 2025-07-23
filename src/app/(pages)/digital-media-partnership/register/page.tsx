import type { Metadata } from 'next'
import CinematicsPlans from '@/components/cinematics-plans';
import { getCollection } from '@/utils/fetch';

export const metadata: Metadata = {
    title: 'JO Cinematics Registration',
    description: 'JO Cinematics Registration is a collaboration program for Jagadhatri Puja Commitees across Chandannagar Mankundu and Bhadreswar.',
    alternates: {
        canonical: '/digital-media-partnership/register',
    },
    openGraph: null,
    twitter: null,
    robots: {
        index: false,
        follow: false,
    },
}

export default async function Page({ searchParams }: { searchParams: Promise<{
    plan: string;
}> }) {
    const { plan } = await searchParams;
    const pujaData = await getCollection('pujas', {
        pagination: {
            page: 1,
            pageSize: 200
        },
        sort: ['order:asc']
    });

    const data = pujaData?.data ?? [];
    
    return (
        <div className="pt-1 flex items-center flex-col">
            <CinematicsPlans pujaData={data} planId={plan} />
        </div>
    )
}