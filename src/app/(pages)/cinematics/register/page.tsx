import type { Metadata } from 'next'
import CinematicsPlans from '@/components/cinematics-plans';
import { cms } from '@/lib/cms';
import { extendPuja } from '@/utils/functions';
import type { Puja, PageProps, PujaExtended, APIResponseCollection } from '@/types';

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

interface SearchParams {
    plan: string;
};

export default async function Page({ searchParams }: PageProps<{}, SearchParams>) {
    const { plan } = await searchParams;

    const client = cms.tag('puja').collection('pujas');
    const pujasData = await client.find({
        populate: ['partnerships'],
        pagination: {
            page: 1,
            pageSize: 200
        },
        sort: ['sortOrder:asc']
    }) as APIResponseCollection<Puja>;

    const pujas: PujaExtended[] = pujasData.data ? pujasData.data.map((data: Puja) => extendPuja(data)) : [];
    return (
        <div className="pt-1 flex items-center flex-col">
            <CinematicsPlans pujaData={pujas} planId={plan} />
        </div>
    )
}