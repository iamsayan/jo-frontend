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
    const pujasDataReq = getCollection('pujas', {
        pagination: {
            page: 1,
            pageSize: 200
        },
        sort: ['order:asc']
    });
    const partnershipDataReq = getCollection('partnerships', {
        populate: ['puja'],
        pagination: {
            page: 1,
            pageSize: 200
        },
        filters: {
            confirmed: {
                $eq: false
            },
            year: {
                $eq: new Date().getFullYear()
            }
        },
    });
    const [pujasRes, partnershipRes] = await Promise.allSettled([pujasDataReq, partnershipDataReq]).then(results => [
        results[0].status === "fulfilled" ? results[0].value : { data: [] },
        results[1].status === "fulfilled" ? results[1].value : { data: [] }
    ]);

    const pujasData = pujasRes?.data ?? [];
    const partnershipData = partnershipRes?.data ?? [];
    
    return (
        <div className="pt-1 flex items-center flex-col">
            <CinematicsPlans pujaData={pujasData} partnershipData={partnershipData} planId={plan} />
        </div>
    )
}