import { notFound, permanentRedirect } from 'next/navigation';
import { getCollection } from "@/utils/fetch";
import { cn, getDateByIndex, stripHtmlAndLimit } from "@/utils/functions";
import {
    LuArrowLeft,
    LuArrowRight,
    LuCalendar,
    LuMapPin,
    LuHistory,
    LuPalette,
    LuPencil,
    LuBrush,
    LuBook,
    LuLightbulb,
    LuPhone,
    LuMail,
    LuUser,
    LuBuilding,
    LuCrown,
    LuMedal,
    LuImages,
} from "react-icons/lu";
import {
    FaFacebook,
    FaInstagram,
    FaYoutube,
    FaXTwitter,
} from "react-icons/fa6";
import {
    getYear,
    getCelebrating,
    formatDate,
} from "@/utils/functions";
import schema from "@/utils/schema";
import Link from "next/link";
import { metadata as metadataSchema } from "@/app/layout";
import type { Metadata } from 'next'
import Main from '@/components/main';
import Breadcrumbs from '@/components/breadcrumbs';
import GallerySlider from '@/components/gallery-slider';
import Markdown from '@/components/markdown';
import { assetImageLoader } from '@/utils/transform';

interface PujaData {
    referenceId: string;
    name: string;
    slug: string;
    zone: string;
    estd: string;
    location?: {
        address?: string;
        coordinates?: {
            lat?: number;
            lng?: number;
        };
        geohash?: string;
    };
    theme?: string;
    artists?: {
        type: string;
        name: string;
        contact?: string;
        email?: string;
        businessName?: string;
    };
    info?: string;
    tags?: string[];
}

interface PageProps {
    params: Promise<{
        slug: string;
        id: string;
    }>;
}

export async function generateStaticParams() {
    const pujaData = await getCollection('pujas', {
        pagination: {
            page: 1,
            pageSize: 200
        },
        sort: ['order:asc']
    });
    const data = pujaData?.data ?? []

    return data.map((item: any) => ({
        slug: item?.slug,
        id: item?.referenceId,
    }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { slug, id } = await params

    const pujaData = await getCollection('pujas', {
        populate: ['images'],
        filters: {
            referenceId: {
                $eq: id
            }
        }
    });
    const data = pujaData?.data ?? []
    const currentPuja = data?.[0] ?? null;

    return {
        title: `${currentPuja?.name} Sarbajanin, ${currentPuja?.zone === 'bhadreswar' ? 'Bhadreswar' : 'Chandannagar'}`,
        description: stripHtmlAndLimit(currentPuja?.info),
        openGraph: {
            ...metadataSchema.openGraph,
            url: `/puja/${slug}/${id}`,
            images: currentPuja?.images?.slice(0, 3).map((item: any) => {
                return {
                    url: assetImageLoader({
                        src: `${item?.year}/${currentPuja?.referenceId}/${item?.name}`,
                        quality: 70
                    }),
                    alt: currentPuja?.name
                }
            })
        },
        alternates: {
            canonical: `/puja/${slug}/${id}`
        },
    }
}

export default async function Page({ params }: PageProps) {
    const { slug, id } = await params
    const queryYear = new Date().getFullYear()

    const pujasReq = getCollection('pujas', {
        populate: '*',
        pagination: {
            page: 1,
            pageSize: 200
        },
        sort: ['order:asc']
    })
    const siteDataReq = getCollection('global', { populate: '*' });

    const [pujasRes, siteDataRes] = await Promise.allSettled([pujasReq, siteDataReq]).then(results => [
        results[0].status === "fulfilled" ? results[0].value : { data: [] },
        results[1].status === "fulfilled" ? results[1].value : { data: {} },
    ]);
    const pujas = pujasRes.data;
    const siteData = siteDataRes.data;

    const currentPuja = pujas.find((item: any) => item?.referenceId === id) ?? null;

    if (!currentPuja) {
        notFound();
    }

    if (slug !== currentPuja?.slug) {
        permanentRedirect(`/puja/${currentPuja?.slug}/${currentPuja?.referenceId}`);
    }

    const pujaImages = currentPuja?.images?.map((item: any) => {
        return {
            src: `${item?.year}/${currentPuja?.referenceId}/${item?.name}`,
            thumb: `${item?.year}/${currentPuja?.referenceId}/${item?.name}`,
            alt: currentPuja?.name,
            subHtml: `<p>By: ${item?.uploadedBy.trim().split(' ').map((word: string) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ')}</p>`,
        }
    });

    let array: PujaData[] = [];
    pujas?.forEach((item: PujaData, index: number) => {
        if (item?.referenceId === id) {
            array.push(pujas?.[0 < index ? index - 1 : pujas?.length - 1])
            array.push(pujas?.[pujas?.length - 1 > index ? index + 1 : 0])
        }
    });

    const y = getYear(currentPuja?.estd);
    const cel = getCelebrating(y);
    const adi = currentPuja?.tags?.includes('adi') ?? false;
    const popular = currentPuja?.tags?.includes('popular') ?? false;
    const zone = currentPuja?.zone === 'bhadreswar' ? 'Bhadreswar' : 'Chandannagar';
    const gMapLink = currentPuja?.location?.coordinates?.lat && currentPuja?.location?.coordinates?.lng ? `https://www.google.com/maps/search/?api=1&query=${currentPuja?.location?.coordinates?.lat},${currentPuja?.location?.coordinates?.lng}(${currentPuja?.name}+Jagadhatri+Puja+${zone})` : `https://www.google.com/maps/search/?api=1&query=${currentPuja?.name}+Jagadhatri+Puja+${zone},+Hooghly,+West+Bengal`
    const truckCount = currentPuja?.procession?.truckCount ?? null;
    const showProcession = currentPuja?.procession && parseInt(currentPuja?.procession?.year) === queryYear;
    
    const artistTypes = [
        { type: 'idol', icon: <LuBrush className="text-xl text-purple-600" />, title: 'Idol Artist' },
        { type: 'decoration', icon: <LuPalette className="text-xl text-purple-600" />, title: 'Decoration Artist' },
        { type: 'light', icon: <LuLightbulb className="text-xl text-purple-600" />, title: 'Lighting Artist' },
        { type: 'theme', icon: <LuBrush className="text-xl text-purple-600" />, title: 'Theme Artist' },
    ];

    const artistsByType = (currentPuja?.artists || []).reduce((acc: Record<string, string[]>, artist: any) => {
        if (artist?.type && artist?.name) {
            acc[artist.type] = acc[artist.type] || [];
            acc[artist.type].push(artist.name);
        }
        return acc;
    }, {});

    const info = [
        {
            icon: <LuPencil className="text-xl text-purple-600" />,
            title: 'Puja Theme',
            value: currentPuja?.theme
        },
        ...artistTypes.map(({ type, icon, title }) => ({
            icon,
            title,
            value: (artistsByType[type] || []).join(', ')
        }))
    ].filter(item => item.value);

    const socialLinks = [
        {
            type: "facebook",
            icon: <FaFacebook className="text-xl text-white/80 hover:text-white transition-colors" />
        },
        {
            type: "instagram", 
            link: "#",
            icon: <FaInstagram className="text-xl text-white/80 hover:text-white transition-colors" />
        },
        {
            type: "youtube",
            icon: <FaYoutube className="text-xl text-white/80 hover:text-white transition-colors" />
        },
        {
            type: "x",
            icon: <FaXTwitter className="text-xl text-white/80 hover:text-white transition-colors" />
        }
    ].map((item: any) => {
        return {
            ...item,
            link: currentPuja?.links?.find((link: any) => link.title === item.type)?.url ?? '#'
        }
    });

    const schemaData = {
        path: `puja/${currentPuja?.slug}/${currentPuja?.referenceId}`,
        title: `Details of ${currentPuja?.name} Sarbajanin`,
        parents: [
            {
                title: 'Jagadhatri Puja Committee List',
                slug: 'puja-committee-list'
            }
        ],
        dates: {
            published: currentPuja?.createdAt,
            modified: currentPuja?.updatedAt,
        }
    }
    const jsonLd = schema(schemaData);
    jsonLd["@graph"].push({
        "name": `${cel != '--' ? cel : y === 'Not Known' ? 'Jagadhatri Puja' : `${y} Years`} Celebration of ${currentPuja?.name} Sarbajanin`,
        "description": `Jagadhatri Puja ${queryYear} celebration by ${currentPuja?.name} Sarbajanin, ${zone}`,
        "@type": "Event",
        "eventStatus": "https://schema.org/EventScheduled",
        "eventAttendanceMode": "https://schema.org/OfflineEventAttendanceMode",
        "location": [
            {
                "@type": "Place",
                "name": zone,
                "url": `https://en.wikipedia.org/wiki/${currentPuja?.zone === 'bhadreswar' ? 'Bhadreswar,_Hooghly' : 'Chandannagar'}`,
                "address": {
                    "@type": "PostalAddress",
                    "name": `${currentPuja?.name} Puja Premises`,
                    "streetAddress": `${currentPuja?.location?.address || `${zone}, Hooghly, West Bengal`}`,
                    "addressLocality": zone,
                    "addressRegion": "West Bengal",
                    "addressCountry": "IN"
                },
                ...(currentPuja?.location?.coordinates?.lat && currentPuja?.location?.coordinates?.lng ? {
                    "geo": {
                        "@type": "GeoCoordinates",
                        "latitude": currentPuja?.location?.coordinates?.lat,
                        "longitude": currentPuja?.location?.coordinates?.lng
                    },
                } : {}),
                "hasMap": gMapLink
            }
        ],
        "organizer": {
            "@type": "Organization",
            "name": currentPuja?.name || 'Jagadhatri Puja',
            "url": `${process.env.NEXT_PUBLIC_SITE_URL}/${schemaData.path}`
        },
        "image": pujaImages.map((item: any) => item.src),
        "startDate": `${getDateByIndex(siteData?.schedules, 0)}T00:00:00+05:30`,
        "endDate": `${getDateByIndex(siteData?.schedules, 4)}T21:59:59+05:30`,
        "subEvent": siteData?.schedules?.map((item: any) => {
            const date = new Date(item?.date);
            date.setDate(date.getDate() + 1);
            return {
                "@type": "Event",
                "name": item?.event,
                "description": `Jagadhatri Puja ${queryYear} ${item?.event} celebration by ${currentPuja?.name} Sarbajanin, ${zone}`,
                "eventStatus": "https://schema.org/EventScheduled",
                "eventAttendanceMode": "https://schema.org/OfflineEventAttendanceMode",
                "startDate": item?.event === 'Procession' ? `${item?.date}T18:00:00+05:30` : `${item?.date}T00:00:00+05:30`,
                "endDate": item?.event === 'Procession' ? `${date.toISOString().split('T')[0]}T08:00:00+05:30` : `${item?.date}T21:59:59+05:30`,
                "location": {
                    "@type": "Place",
                    "name": "Haridradanga Puja Premises",
                    "address": {
                        "@type": "PostalAddress",
                        "streetAddress": `${currentPuja?.location?.address || `${zone}, Hooghly, West Bengal`}`,
                        "addressLocality": zone,
                        "addressRegion": "West Bengal",
                        "addressCountry": "IN"
                    },
                },
                "organizer": {
                    "@type": "Organization",
                    "name": currentPuja?.name || 'Jagadhatri Puja',
                    "url": `${process.env.NEXT_PUBLIC_SITE_URL}/${schemaData.path}`
                },
            }
        }),
        "@id": `${process.env.NEXT_PUBLIC_SITE_URL}/${schemaData.path}#schema-${currentPuja?.order+1}`, // ensure unique ID
        "inLanguage": "en-IN",
        "mainEntityOfPage": {
            "@id": `${process.env.NEXT_PUBLIC_SITE_URL}/${schemaData.path}#webpage`
        }
    });

    return (
        <Main jsonLd={jsonLd}>
            {/* Hero Section with Dynamic Background */}
            <div className="relative md:min-h-[90vh] px-16 md:px-32 py-32 w-full flex items-center justify-center overflow-hidden">
                {/* Background Layer */}
                <div className="absolute inset-0">
                    {/* Base Gradient */}
                    <div className="absolute inset-0 bg-gradient-to-br from-[#2D1B69] via-[#1E1B4B] to-[#4F1C48]">
                        {/* Decorative Pattern Overlay */}
                        <div className="absolute inset-0 opacity-5">
                            <div className="absolute inset-0" style={{
                                backgroundImage: `
                                    radial-gradient(circle at 0% 0%, rgba(255,215,0,0.15) 1px, transparent 8px),
                                    radial-gradient(circle at 100% 0%, rgba(255,215,0,0.15) 1px, transparent 8px),
                                    radial-gradient(circle at 100% 100%, rgba(255,215,0,0.15) 1px, transparent 8px),
                                    radial-gradient(circle at 0% 100%, rgba(255,215,0,0.15) 1px, transparent 8px)
                                `,
                                backgroundSize: '32px 32px',
                                backgroundPosition: '0 0, 16px 0, 16px 16px, 0 16px'
                            }} />
                        </div>
                        
                        {/* Sacred Geometry Pattern */}
                        <div className="absolute inset-0 opacity-10">
                            <div className="absolute inset-0" style={{
                                backgroundImage: `
                                    repeating-linear-gradient(45deg, rgba(255,223,186,0.1) 0px, rgba(255,223,186,0.1) 1px, transparent 1px, transparent 8px),
                                    repeating-linear-gradient(-45deg, rgba(255,223,186,0.1) 0px, rgba(255,223,186,0.1) 1px, transparent 1px, transparent 8px)
                                `,
                                backgroundSize: '16px 16px'
                            }} />
                        </div>

                        {/* Additional Gradient Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-transparent via-[#FF5E5B]/5 to-transparent" />
                    </div>

                    {/* Animated Shapes with Enhanced Effects */}
                    <div className="absolute inset-0 overflow-hidden">
                        {/* Large Decorative Circle */}
                        <div className="absolute -top-1/4 -right-1/4 w-[800px] h-[800px] rounded-full bg-gradient-to-br from-[#FFD700]/10 to-transparent" />
                        
                        {/* Animated Blobs */}
                        <div className="absolute top-0 left-0 w-[600px] h-[600px]">
                            <div className="absolute inset-0 bg-gradient-to-br from-[#FF9933]/20 to-transparent rounded-full mix-blend-overlay filter blur-3xl animate-blob" />
                        </div>
                        <div className="absolute top-1/4 right-0 w-[500px] h-[500px]">
                            <div className="absolute inset-0 bg-gradient-to-bl from-[#FF5E5B]/15 to-transparent rounded-full mix-blend-overlay filter blur-3xl animate-blob" style={{ animationDelay: '2s' }} />
                        </div>
                        <div className="absolute bottom-0 left-1/4 w-[700px] h-[700px]">
                            <div className="absolute inset-0 bg-gradient-to-tr from-[#FFD700]/10 to-transparent rounded-full mix-blend-overlay filter blur-3xl animate-blob" style={{ animationDelay: '4s' }} />
                        </div>

                        {/* Subtle Light Effects */}
                        <div className="absolute top-1/3 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-[#FFF1E6]/10 rounded-full filter blur-3xl" />
                        <div className="absolute bottom-1/4 right-1/4 w-[200px] h-[200px] bg-[#FFB6C1]/10 rounded-full filter blur-2xl" />
                    </div>

                    {/* Enhanced Vignette Effect */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#2D1B69]/60 via-transparent to-[#2D1B69]/60" />
                    
                    {/* Subtle Color Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-r from-[#FFD700]/5 via-transparent to-[#FF5E5B]/5" />
                </div>

                {/* Content Layer */}
                <div className="relative mx-auto px-4">
                    <div className="flex flex-col items-center">
                        {/* Badge */}
                        <div className="inline-block mb-10">
                            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20">
                                <Breadcrumbs breadcrumbTitle={currentPuja?.name} className="text-white/90 capitalize p-0" end={-1} />
                            </div>
                        </div>

                        {/* Main Title */}
                        <div className="relative">
                            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 tracking-tight text-center">
                                <span className="text-shadow-xl text-shadow-grey-900 flex flex-col xl:flex-row items-center gap-2">
                                    {currentPuja?.name}
                                    {popular && (
                                        <div className="relative inline-flex items-center tracking-normal">
                                            {/* <span className="absolute -inset-2">
                                                <div className="w-full h-full max-w-sm mx-auto rotate-2 blur-sm bg-gradient-to-r from-yellow-400 via-orange-500 to-red-600 opacity-30 animate-pulse" />
                                            </span> */}
                                            <span className="relative flex items-center gap-1 text-sm font-semibold px-3 py-1.5 bg-gradient-to-r from-yellow-400/20 via-orange-500/20 to-red-600/20 rounded-full border border-yellow-400/30 backdrop-blur-sm">
                                                <svg className="w-4 h-4 text-yellow-400 animate-spin-slow" viewBox="0 0 24 24">
                                                    <path fill="currentColor" d="M12 15.4l-3.76 2.27 1-4.28-3.32-2.88 4.38-.38L12 6.1l1.71 4.04 4.38.38-3.32 2.88 1 4.28z"/>
                                                </svg>
                                                Popular
                                            </span>
                                        </div>
                                    )}
                                </span>
                                <div className="absolute -top-6 -right-6 w-12 h-12 bg-purple-400/20 rounded-full blur-xl" />
                                <div className="absolute -bottom-6 -left-6 w-12 h-12 bg-pink-400/20 rounded-full blur-xl" />
                            </h1>
                        </div>

                        {/* Location */}
                        <div className="relative mb-12">
                            <div className="flex items-center justify-center gap-3 px-6 py-3 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10">
                                <LuMapPin className="text-purple-400" />
                                <a href={gMapLink} target="_blank" className="text-sm md:text-base text-white/90">
                                    {currentPuja?.location?.address || `${zone}, Hooghly, West Bengal`}
                                </a>
                            </div>
                            {/* Decorative dots */}
                            <div className="absolute -left-4 -top-4 w-8 h-8" style={{
                                backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.3) 1.5px, transparent 0)',
                                backgroundSize: '8px 8px'
                            }} />
                            <div className="absolute -right-4 -bottom-4 w-8 h-8" style={{
                                backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.3) 1.5px, transparent 0)',
                                backgroundSize: '8px 8px'
                            }} />
                        </div>

                        {/* Stats Row */}
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8 mb-12">
                            {[
                                {
                                    text: y === 'Not Known' ? '300+' : y,
                                    description: 'Years of ' + (adi || Number(y) >= 50 ? 'Legacy' : 'Tradition'),
                                    after: <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping" />
                                },
                                {
                                    text: currentPuja?.estd === '0' ? 'Not Known' : currentPuja?.estd,
                                    description: 'Established Year'
                                },
                                {
                                    text: adi ? 'Adi Puja' : 'Traditional',
                                    description: 'Puja Category'
                                },
                                {
                                    text: String(currentPuja?.order + 1).padStart(2, '0'),
                                    description: 'Serial Number'
                                }
                            ].map((item, index) => (
                                <div key={index} className="px-6 py-4 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 xl:min-w-[200px] relative overflow-hidden">
                                    {/* <div className="absolute -right-8 -top-8 w-16 h-16 bg-purple-500/20 rounded-full blur-xl animate-pulse" /> */}
                                    <div className="relative text-center">
                                        <div className="text-xl md:text-2xl font-bold text-white mb-1 flex items-center justify-center gap-2">
                                            <span className="bg-clip-text text-transparent bg-gradient-to-r from-amber-200 to-amber-500">{item.text}</span>
                                            {item?.after}
                                        </div>
                                        <div className="text-xs md:text-sm text-white/70">{item.description}</div>
                                    </div>
                                    <div className="absolute -left-2 -bottom-2 w-8 h-8" style={{
                                        backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.2) 1px, transparent 0)',
                                        backgroundSize: '6px 6px'
                                    }} />
                                </div>
                            ))}
                            {/* <div className="px-6 py-4 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10">
                                <div className="text-xl md:text-2xl font-bold text-white mb-1">{adi ? 'Adi Puja' : 'Traditional'}</div>
                                <div className="text-xs md:text-sm text-white/70">Puja Category</div>
                            </div> */}
                        </div>

                        <div className="flex items-center justify-center gap-4 mt-4">
                            {socialLinks.map((item, index) => (
                                <a 
                                    key={index}
                                    href={item.link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={cn("p-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 transition-all duration-300", item.link === '#' && 'pointer-events-none')}
                                    aria-label={`Visit our ${item.type} page`}
                                >
                                    {item.icon}
                                </a>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            <div className="w-full bg-gradient-to-br from-purple-50/50 via-white to-purple-50/50">
                <div className="px-4 pattern-dots">
                    <div className="container px-2 lg:px-0 mx-auto relative -mt-10 mb-16">
                        <div className={cn(`grid grid-cols-1 gap-4 md:gap-8 justify-center items-center mx-auto`, showProcession && 'lg:grid-cols-3 max-w-screen-xl', !showProcession && 'lg:grid-cols-2 max-w-screen-lg')}>
                            <div className="bg-white rounded-2xl p-5 shadow-xl shadow-purple-100/50 hover:shadow-2xl hover:shadow-purple-100/50 transition-all duration-300">
                                <div className="flex items-center gap-4">
                                    <div className="p-3 rounded-xl bg-purple-100">
                                        <LuHistory className="text-2xl text-purple-600" />
                                    </div>
                                    <div>
                                        <div className="text-xl md:text-2xl font-bold text-gray-800 mb-1">{cel != '--' ? cel : y === 'Not Known' ? '300+' : y}</div>
                                        <div className="text-xs md:text-sm text-gray-600">{cel != '--' ? `Be the part of ${y === 'Not Known' ? '300+' : y} years' celebration` : 'Years of Celebration'}</div>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-white rounded-2xl p-5 shadow-xl shadow-purple-100/50 hover:shadow-2xl hover:shadow-purple-100/50 transition-all duration-300">
                                <div className="flex items-center gap-4">
                                    <div className="p-3 rounded-xl bg-purple-100">
                                        <LuMapPin className="text-2xl text-purple-600" />
                                    </div>
                                    <div>
                                        <div className="text-xl md:text-2xl font-bold text-gray-800 mb-1">{currentPuja?.zone === 'bhadreswar' ? 'Bhadreswar' : 'Chandannagar'}</div>
                                        <div className="text-xs md:text-sm text-gray-600">Police Station Zone</div>
                                    </div>
                                </div>
                            </div>
                            {showProcession && (
                                <div className="bg-white rounded-2xl p-5 shadow-xl shadow-purple-100/50 hover:shadow-2xl hover:shadow-purple-100/50 transition-all duration-300">
                                    <div className="flex items-center gap-4">
                                        <div className="p-3 rounded-xl bg-purple-100">
                                            <LuPalette className="text-2xl text-purple-600" />
                                        </div>
                                        <div>
                                            <div className="text-xl md:text-2xl font-bold text-gray-800 mb-1">Participating</div>
                                            <div className="text-xs md:text-sm text-gray-600">
                                                {`With ${truckCount} Vehicle${truckCount > 1 ? 's' : ''} in Procession`}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                    <div id="about" className="relative overflow-hidden py-16">
                        <div className="container px-2 lg:px-0 mx-auto">
                            <div className="text-center mb-8">
                                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-100/50 text-purple-700 font-medium mb-4">
                                    <LuBook className="text-sm" />
                                    <span className="text-sm">About Our Puja</span>
                                </div>
                                <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-purple-900 via-purple-700 to-purple-800" style={{lineHeight: 'normal'}}>
                                    Celebrating Culture & Tradition
                                </h2>
                                <p className="text-gray-600 text-base md:text-lg">
                                    {currentPuja?.estd === '0' ? 'A Legacy of Tradition' : `Since the year ${currentPuja?.estd}`}
                                </p>
                            </div>
                            <div className="bg-white rounded-3xl p-8 border border-purple-100 shadow-xl shadow-purple-100/50 relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-purple-100/50 rounded-full blur-3xl -mr-16 -mt-16" />
                                <div className="absolute bottom-0 left-0 w-32 h-32 bg-purple-100/50 rounded-full blur-3xl -ml-16 -mb-16" />
                                <div className="relative">
                                    <div className="prose prose-lg prose-purple max-w-none space-y-2 text-justify">
                                        {currentPuja?.info && <Markdown content={currentPuja?.info} className="space-y-2" />}
                                        {cel != '--' && (
                                            <div className="my-8 p-6 rounded-2xl bg-gradient-to-r from-purple-50 to-amber-50 border border-amber-100 relative overflow-hidden">
                                                <div className="absolute top-0 right-0 w-40 h-40 bg-yellow-100/70 rounded-full blur-3xl -mr-20 -mt-20 opacity-70" />
                                                <div className="absolute bottom-0 left-0 w-40 h-40 bg-purple-100/70 rounded-full blur-3xl -ml-20 -mb-20 opacity-70" />
                                                
                                                <div className="relative flex flex-col md:flex-row items-center gap-6">
                                                    <div className="flex-shrink-0 w-24 h-24 md:w-28 md:h-28 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center shadow-lg shadow-amber-200/50">
                                                        <div className="text-white font-bold text-2xl md:text-3xl">
                                                            {y}
                                                        </div>
                                                    </div>
                                                    <div className="text-center md:text-left">
                                                        <h3 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-purple-700 via-amber-600 to-amber-700 bg-clip-text text-transparent mb-2">
                                                            Celebrating {cel} Year!
                                                        </h3>
                                                        <p className="text-gray-700">
                                                            {cel == 'Silver Jubilee' && "Silver Jubilee: A quarter century of devotion and community celebration."}
                                                            {cel == 'Golden Jubilee' && "Golden Jubilee: Half a century of preserving our cultural heritage."}
                                                            {cel == 'Diamond Jubilee' && "Diamond Jubilee: Sixty years of unwavering faith and tradition."}
                                                            {cel == 'Platinum Jubilee' && "Platinum Jubilee: A seventy-five years of spiritual journey and community bonding."}
                                                            {cel == 'Centennial Jubilee' && "Centennial Jubilee: A hundred years of spiritual journey and community bonding."}
                                                            {cel == 'Jubilee' && "Jubilee: Celebrating a significant milestone in our spiritual journey, tradition and community bonding."}
                                                            {cel.includes('Pre') && `${cel}: Celebrating a significant milestone in our spiritual journey and community bonding.`}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                    {info.length > 0 && <div className="flex flex-wrap md:flex-nowrap justify-center gap-4 md:gap-6 mt-8 border-t border-purple-100 pt-8 overflow-x-auto">
                                        {
                                            info.map((item: any, index: number) => (
                                                <div key={index} className="flex items-start gap-4 basis-64">
                                                    <div className="p-3 rounded-xl bg-purple-100">
                                                        {item.icon}
                                                    </div>
                                                    <div className="whitespace-nowrap">
                                                        <div className="font-semibold text-gray-800 mb-1">{item.title}</div>
                                                        <div className="text-sm text-gray-600">{item.value}</div>
                                                    </div>
                                                </div>
                                            ))
                                        }
                                    </div>}
                                </div>
                            </div>
                            <div className="mt-8">
                                <div className="px-6 py-4 rounded-xl bg-purple-50 border border-purple-100">
                                    <div className="flex items-start gap-3">
                                        <div className="p-2 rounded-lg bg-purple-100">
                                            <LuLightbulb className="text-purple-600 text-lg" />
                                        </div>
                                        <div>
                                            <h4 className="text-gray-900 font-medium mb-2">Disclaimer</h4>
                                            <p className="text-xs md:text-sm text-gray-600 leading-relaxed">
                                                The information provided here may be incomplete or partially inaccurate. If you are a representative of this puja committee and notice any discrepancies, we encourage you to get in touch with us so we can update and correct the details. This initiative aims to bring all puja committees together on a single unified platform.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
          
                {currentPuja?.images?.length > 0 && (
                    <div id="gallery" className="py-20 bg-gradient-to-br from-white via-amber-50/30 to-orange-50/30">
                        <div className="text-center mb-16">
                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-amber-100 text-amber-700 font-medium mb-4">
                                <LuImages className="text-lg" />
                                <span>Our Gallery</span>
                            </div>
                            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 px-3 bg-gradient-to-r from-amber-700 to-orange-800 bg-clip-text text-transparent" style={{lineHeight: 'normal'}}>Glimpses of Celebration</h2>
                            <p className="text-gray-600 max-w-2xl mx-auto">Explore moments from our recent celebrations that capture the essence of our tradition and community spirit.</p>
                        </div>
                        <GallerySlider 
                            speed={500} 
                            thumbnail={true} 
                            slideShowAutoplay={true} 
                            fullScreen={true} 
                            slides={pujaImages}
                            sliderOptions={{
                                lazyLoad: 'sequential',
                                perPage: pujaImages.length >= 4 ? 4 : pujaImages.length,
                                gap: '0.5rem',
                                perMove: 1,
                                drag: 'free',
                                focus: 'center',
                                autoScroll: {
                                    speed: 1,
                                },
                                height: 600,
                                pagination: false,
                                breakpoints: {
                                    640: {
                                        perPage: pujaImages.length >= 2 ? 2 : pujaImages.length,
                                        height: 300,
                                    },
                                    1024: {
                                        perPage: pujaImages.length >= 3 ? 3 : pujaImages.length,
                                        height: 350,
                                    },
                                },
                            }}
                            sliderItemClass="aspect-[4/5] overflow-hidden rounded-2xl group"
                        />
                    </div>
                )}

                <div className="py-20 bg-gradient-to-br from-white via-blue-50/50 to-indigo-100/30">
                    <div className="max-w-7xl mx-auto px-4">
                        <div className="text-center mb-16">
                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-100 text-blue-700 font-medium mb-4">
                                <LuCalendar className="text-lg" />
                                <span>Event Schedule</span>
                            </div>
                            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-700 to-indigo-700 bg-clip-text text-transparent" style={{lineHeight: 'normal'}}>
                                Upcoming Events
                            </h2>
                            <p className="text-gray-600 max-w-2xl mx-auto">Mark your calendar for these auspicious occasions</p>
                        </div>
                        <div className="grid md:grid-cols-2 gap-4">
                            {siteData?.schedules?.map((item: any, index: number) => (
                                <div
                                    key={index}
                                    className="flex items-center gap-4 bg-white/90 backdrop-blur-sm p-4 rounded-2xl backdrop-blur-sm border border-gray-200 hover:border-blue-200 hover:bg-blue-50/50 transition-all duration-300 overflow-hidden"
                                >
                                    <div className="flex-shrink-0 flex items-center justify-center w-10 h-10 rounded-lg bg-blue-100">
                                        <LuCalendar className="text-lg text-blue-600" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2">
                                            <h3 className="text-base font-semibold text-blue-700 truncate">{item?.event}</h3>
                                            <span className="text-xs text-gray-500">{formatDate(item?.date)}</span>
                                        </div>
                                        {item?.description && (
                                            <p className="text-xs text-gray-600 mt-1 line-clamp-2">{item.description}</p>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Location Section */}
                {/* {currentPuja?.location?.address && (
                    <div className="py-24 bg-gradient-to-br from-white via-green-50/30 to-emerald-50/30">
                        <div className="max-w-7xl mx-auto px-4">
                            <div className="text-center mb-16">
                                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-green-100 text-green-700 font-medium mb-4">
                                    <LuMapPin className="text-lg" />
                                    <span>Location</span>
                                </div>
                                <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 bg-gradient-to-r from-green-700 to-emerald-700 bg-clip-text text-transparent" style={{lineHeight: 'normal'}}>
                                    Find Us
                                </h2>
                                <p className="text-gray-600 max-w-2xl mx-auto">Visit us to experience the divine atmosphere and spiritual energy</p>
                            </div>
                            <div className="grid md:grid-cols-3 gap-8 items-center">
                                <div className="md:col-span-2">
                                    <div className="bg-white/90 backdrop-blur-sm p-6 rounded-2xl shadow-lg shadow-green-100/50 hover:shadow-xl hover:shadow-green-200/60 transition-all duration-300 border border-green-100/30">
                                        <div className="aspect-video rounded-xl overflow-hidden bg-gradient-to-br from-green-100 to-emerald-100 flex items-center justify-center">
                                            <div className="text-center p-8">
                                                <LuMapPin className="text-6xl text-green-600 mx-auto mb-4" />
                                                <h3 className="text-xl font-semibold text-gray-800 mb-2">Interactive Map</h3>
                                                <p className="text-gray-600 mb-4">Click below to view the exact location</p>
                                                <a 
                                                    href={gMapLink}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl hover:from-green-700 hover:to-emerald-700 transition-all duration-300 shadow-lg hover:shadow-xl"
                                                >
                                                    <LuMapPin className="text-sm" />
                                                    Open in Google Maps
                                                    <LuArrowRight className="text-sm" />
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="md:col-span-1">
                                    <div className="bg-white/90 backdrop-blur-sm p-6 rounded-2xl shadow-lg shadow-green-100/50 hover:shadow-xl hover:shadow-green-200/60 transition-all duration-300 border border-green-100/30">
                                        <div className="flex items-center gap-4 mb-6">
                                            <div className="p-3 rounded-xl bg-green-100">
                                                <LuMapPin className="text-xl text-green-600" />
                                            </div>
                                            <div>
                                                <h3 className="text-lg font-semibold text-gray-800">Address</h3>
                                                <p className="text-sm text-gray-600">Puja premises location</p>
                                            </div>
                                        </div>
                                        <div className="space-y-4">
                                            <div className="p-4 rounded-xl bg-green-50 border border-green-100">
                                                <p className="text-gray-700 leading-relaxed">{currentPuja.location.address}</p>
                                            </div>
                                            <div className="space-y-3">
                                                <div className="flex items-center gap-3 text-sm text-gray-600">
                                                    <LuBuilding className="text-green-600" />
                                                    <span>Zone: {zone}</span>
                                                </div>
                                                {currentPuja?.location?.coordinates?.lat && currentPuja?.location?.coordinates?.lng && (
                                                    <div className="flex items-center gap-3 text-sm text-gray-600">
                                                        <LuMapPin className="text-green-600" />
                                                        <span>Coordinates: {currentPuja.location.coordinates.lat.toFixed(6)}, {currentPuja.location.coordinates.lng.toFixed(6)}</span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )} */}

                {/* Related Pujas Section */}
                {/* <div className="py-20 bg-gradient-to-br from-white via-blue-50/30 to-indigo-50/30">
                    <div className="max-w-7xl mx-auto px-4">
                        <div className="text-center mb-16">
                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-100 text-blue-700 font-medium mb-4">
                                <LuBuilding className="text-lg" />
                                <span>Explore More</span>
                            </div>
                            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-700 to-indigo-700 bg-clip-text text-transparent" style={{lineHeight: 'normal'}}>
                                Related Pujas
                            </h2>
                            <p className="text-gray-600 max-w-2xl mx-auto">Discover other puja committees in the same area</p>
                        </div>
                        
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {pujas
                                .filter((puja: any) => puja?.zone === currentPuja?.zone && puja?.referenceId !== currentPuja?.referenceId)
                                .slice(0, 6)
                                .map((puja: any, index: number) => {
                                    const pujaYear = getYear(puja?.estd);
                                    const pujaCel = getCelebrating(pujaYear);
                                    const pujaAdi = puja?.tags?.includes('adi') ?? false;
                                    const pujaPopular = puja?.tags?.includes('popular') ?? false;
                                    
                                    return (
                                        <Link
                                            key={puja.referenceId}
                                            href={`/puja/${puja.slug}/${puja.referenceId}`}
                                            className="group bg-white/90 backdrop-blur-sm p-6 rounded-2xl shadow-lg shadow-blue-100/50 hover:shadow-xl hover:shadow-blue-200/60 transition-all duration-300 border border-blue-100/30 hover:border-blue-200/50"
                                        >
                                            <div className="flex items-start justify-between mb-4">
                                                <div className="flex-1 overflow-hidden">
                                                    <h3 className="text-lg font-semibold text-gray-800 group-hover:text-blue-600 transition-colors line-clamp-2">
                                                        {puja.name}
                                                    </h3>
                                                    <p className="text-sm text-gray-600 mt-1 truncate">
                                                        {puja.location?.address ? 
                                                            puja.location.address : 
                                                            `${puja.zone === 'bhadreswar' ? 'Bhadreswar' : 'Chandannagar'}`
                                                        }
                                                    </p>
                                                </div>
                                                <div className="flex flex-col items-end gap-2">
                                                    {pujaPopular && (
                                                        <span className="inline-flex items-center gap-1 text-xs px-2 py-1 bg-amber-100 text-amber-700 rounded-full">
                                                            <svg className="w-3 h-3" viewBox="0 0 24 24">
                                                                <path fill="currentColor" d="M12 15.4l-3.76 2.27 1-4.28-3.32-2.88 4.38-.38L12 6.1l1.71 4.04 4.38.38-3.32 2.88 1 4.28z"/>
                                                            </svg>
                                                            Popular
                                                        </span>
                                                    )}
                                                    {pujaAdi && (
                                                        <span className="inline-flex items-center gap-1 text-xs px-2 py-1 bg-purple-100 text-purple-700 rounded-full">
                                                            <LuCrown className="w-3 h-3" />
                                                            Adi
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                            
                                            <div className="space-y-3">
                                                <div className="flex items-center gap-3 text-sm">
                                                    <LuHistory className="text-blue-600" />
                                                    <span className="text-gray-700">
                                                        {pujaYear === 'Not Known' ? '300+ Years' : `${pujaYear} Years`}
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-3 text-sm">
                                                    <LuCalendar className="text-blue-600" />
                                                    <span className="text-gray-700">
                                                        Est. {puja.estd === '0' ? 'Not Known' : puja.estd}
                                                    </span>
                                                </div>
                                                {pujaCel !== '--' && (
                                                    <div className="inline-flex items-center gap-1 text-xs px-2 py-1 bg-gradient-to-r from-amber-100 to-orange-100 text-amber-700 rounded-full">
                                                        <LuMedal className="w-3 h-3" />
                                                        {pujaCel}
                                                    </div>
                                                )}
                                            </div>
                                            
                                            <div className="mt-4 pt-4 border-t border-blue-100">
                                                <div className="flex items-center justify-between text-sm">
                                                    <span className="text-gray-600">View Details</span>
                                                    <LuArrowRight className="text-blue-600 group-hover:translate-x-1 transition-transform" />
                                                </div>
                                            </div>
                                        </Link>
                                    );
                                })}
                        </div>
                        
                        {pujas.filter((puja: any) => puja?.zone === currentPuja?.zone && puja?.referenceId !== currentPuja?.referenceId).length === 0 && (
                            <div className="text-center py-12">
                                <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
                                    <LuBuilding className="text-2xl text-blue-600" />
                                </div>
                                <h3 className="text-xl font-semibold text-gray-800 mb-2">No Related Pujas</h3>
                                <p className="text-gray-600">This appears to be the only puja in this zone.</p>
                            </div>
                        )}
                    </div>
                </div> */}

                {/* Quick Actions Section */}
                <div className="py-16 bg-gradient-to-br from-white via-gray-50/50 to-slate-50/50">
                    <div className="max-w-4xl mx-auto px-4">
                        <div className="text-center mb-12">
                            <h3 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">Quick Actions</h3>
                            <p className="text-gray-600">Everything you need to know about this puja</p>
                        </div>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <Link
                                href={`/puja-committee-list`}
                                className="group p-4 rounded-xl bg-white/80 backdrop-blur-sm border border-gray-200 hover:border-purple-200 hover:bg-purple-50/50 transition-all duration-300 text-center"
                            >
                                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-3 group-hover:bg-purple-200 transition-colors">
                                    <LuBuilding className="text-xl text-purple-600" />
                                </div>
                                <div className="text-sm font-medium text-gray-700 group-hover:text-purple-700">All Pujas</div>
                            </Link>
                            
                            <Link
                                href={`/gallery`}
                                className="group p-4 rounded-xl bg-white/80 backdrop-blur-sm border border-gray-200 hover:border-blue-200 hover:bg-blue-50/50 transition-all duration-300 text-center"
                            >
                                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3 group-hover:bg-blue-200 transition-colors">
                                    <LuPalette className="text-xl text-blue-600" />
                                </div>
                                <div className="text-sm font-medium text-gray-700 group-hover:text-blue-700">Gallery</div>
                            </Link>
                            
                            <Link
                                href={`/puja-history`}
                                className="group p-4 rounded-xl bg-white/80 backdrop-blur-sm border border-gray-200 hover:border-green-200 hover:bg-green-50/50 transition-all duration-300 text-center"
                            >
                                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-3 group-hover:bg-green-200 transition-colors">
                                    <LuHistory className="text-xl text-green-600" />
                                </div>
                                <div className="text-sm font-medium text-gray-700 group-hover:text-green-700">History</div>
                            </Link>
                            
                            <Link
                                href={`/contact-us`}
                                className="group p-4 rounded-xl bg-white/80 backdrop-blur-sm border border-gray-200 hover:border-orange-200 hover:bg-orange-50/50 transition-all duration-300 text-center"
                            >
                                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mx-auto mb-3 group-hover:bg-orange-200 transition-colors">
                                    <LuMail className="text-xl text-orange-600" />
                                </div>
                                <div className="text-sm font-medium text-gray-700 group-hover:text-orange-700">Contact</div>
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Enhanced Navigation */}
                <div className="py-12">
                    <div className="max-w-7xl mx-auto px-4">
                        <div className="flex flex-col sm:flex-row justify-between gap-6">
                            <Link
                                rel="prev"
                                href={`/puja/${array?.[0]?.slug}/${array?.[0]?.referenceId}`}
                                className="flex items-center gap-4 px-6 py-5 bg-gradient-to-r from-white to-purple-50 border border-purple-100 rounded-xl hover:border-purple-200 transition-all group relative overflow-hidden flex-1"
                            >
                                <div className="absolute top-0 left-0 w-1 h-full bg-purple-400"></div>
                                <div className="p-2.5 rounded-lg bg-purple-100 group-hover:-translate-x-1 transition-transform">
                                    <LuArrowLeft className="text-purple-600" />
                                </div>
                                <div className="flex-1">
                                    <div className="text-sm text-gray-600 flex items-center gap-1">
                                        <span className="inline-block w-2 h-2 rounded-full bg-purple-300 animate-pulse"></span>
                                        Previous Puja
                                    </div>
                                    <div className="font-medium truncate">{array?.[0]?.name}</div>
                                    {array?.[0]?.tags?.includes('popular') && (
                                        <span className="inline-block text-xs px-2 py-0.5 bg-amber-100 text-amber-700 rounded-full mt-1">Popular</span>
                                    )}
                                </div>
                            </Link>
                            <Link
                                rel="next"
                                href={`/puja/${array?.[1]?.slug}/${array?.[1]?.referenceId}`}
                                className="flex items-center justify-end gap-4 px-6 py-5 bg-gradient-to-l from-white to-purple-50 border border-purple-100 rounded-xl hover:border-purple-200 transition-all group text-right relative overflow-hidden flex-1"
                            >
                                <div className="absolute top-0 right-0 w-1 h-full bg-purple-400"></div>
                                <div className="flex-1">
                                    <div className="text-sm text-gray-600 flex items-center justify-end gap-1">
                                        Next Puja
                                        <span className="inline-block w-2 h-2 rounded-full bg-purple-300 animate-pulse"></span>
                                    </div>
                                    <div className="font-medium truncate">{array?.[1]?.name}</div>
                                    {array?.[1]?.tags?.includes('popular') && (
                                        <span className="inline-block text-xs px-2 py-0.5 bg-amber-100 text-amber-700 rounded-full mt-1">Popular</span>
                                    )}
                                </div>
                                <div className="p-2.5 rounded-lg bg-purple-100 group-hover:translate-x-1 transition-transform">
                                    <LuArrowRight className="text-purple-600" />
                                </div>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </Main>
    )
}