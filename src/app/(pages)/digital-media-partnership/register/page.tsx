import type { Metadata } from 'next'
import CinematicsPlans from '@/components/cinematics-plans';
import { getModel } from '@/utils/fetch';

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
    const pujaData = await getModel('pujas', {
        sort: { _o: 1 }
    });

    const data = pujaData ?? [];
    
    return (
        <div className="pt-1 flex items-center flex-col">
            <CinematicsPlans pujaData={data} planId={plan} />
        </div>
    )
}