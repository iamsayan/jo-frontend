import type { Metadata } from 'next';
import CinematicsPlans from '@/components/cinematics-plans';
import { getCollection } from '@/utils/fetch';
import { extendPuja } from '@/utils/functions';
import type { Puja, PageProps, PujaExtended } from '@/types';

export const metadata: Metadata = {
    title: 'JO Cinematics Registration',
    description:
        'JO Cinematics Registration is a collaboration program for Jagadhatri Puja Commitees across Chandannagar Mankundu and Bhadreswar.',
    alternates: {
        canonical: '/digital-media-partnership/register',
    },
    openGraph: null,
    twitter: null,
    robots: {
        index: false,
        follow: false,
    },
};

interface SearchParams {
    plan: string;
}

export default async function Page({
    searchParams,
}: PageProps<{}, SearchParams>) {
    const { plan } = await searchParams;

    const { data: pujasData = [] } = await getCollection<Puja>('pujas', {
        populate: ['partnerships'],
        pagination: {
            page: 1,
            pageSize: 200,
        },
        sort: ['sortOrder:asc'],
    });

    const pujas: PujaExtended[] = pujasData.map((data: Puja) =>
        extendPuja(data),
    );
    return (
        <div className="flex flex-col items-center pt-1">
            <CinematicsPlans pujaData={pujas} planId={plan} />
        </div>
    );
}
