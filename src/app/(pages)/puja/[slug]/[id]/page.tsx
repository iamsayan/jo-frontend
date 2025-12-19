import { notFound, permanentRedirect } from 'next/navigation';
import {
    capitalizeFirst,
    cn,
    extendPuja,
    getDateByIndex,
    stripHtmlAndLimit,
} from '@/utils/functions';
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
    LuMail,
    LuBuilding,
    LuImages,
} from 'react-icons/lu';
import {
    FaFacebook,
    FaInstagram,
    FaYoutube,
    FaXTwitter,
    FaThreads,
    FaGlobe,
} from 'react-icons/fa6';
import { formatDate } from '@/utils/functions';
import schema, { baseUrl } from '@/utils/schema';
import Link from 'next/link';
import { metadata as metadataSchema } from '@/app/layout';
import type { Metadata } from 'next';
import Main from '@/components/main';
import Breadcrumbs from '@/components/breadcrumbs';
import GallerySlider from '@/components/gallery-slider';
import Markdown from '@/components/markdown';
import imageUrl from '@/utils/transform';
import { format } from 'date-fns';
import type {
    Artist,
    Image,
    Puja,
    GlobalSite,
    PujaExtended,
    SharedLink,
    SharedSchedule,
    PageProps,
} from '@/types';
import { getCollection, getSingle } from '@/utils/fetch';

interface Params {
    slug: string;
    id: string;
}

export async function generateStaticParams() {
    const { data = [] } = await getCollection<Puja>('pujas', {
        pagination: {
            page: 1,
            pageSize: 200,
        },
        sort: ['sortOrder:asc'],
    });

    return data.map((item: Puja) => ({
        slug: item.slug,
        id: item.referenceId,
    }));
}

export async function generateMetadata({
    params,
}: PageProps<Params>): Promise<Metadata> {
    const { slug, id } = await params;

    const { data: pujas = [] } = await getCollection<Puja>('pujas', {
        populate: ['images', 'links'],
        pagination: {
            page: 1,
            pageSize: 200,
        },
    });
    const currentPuja = pujas.find((item: Puja) => item.referenceId === id);

    return {
        title: `${currentPuja?.name} Sarbajanin, ${currentPuja?.zone === 'bhadreswar' ? 'Bhadreswar' : 'Chandannagar'}`,
        description: stripHtmlAndLimit(currentPuja?.info ?? ''),
        openGraph: {
            ...metadataSchema.openGraph,
            url: `/puja/${slug}/${id}`,
            images: currentPuja?.images?.slice(0, 3).map((item: Image) => {
                return {
                    url: imageUrl(
                        `${item.year}/${currentPuja?.referenceId}/${item.name}`,
                        { quality: 60 },
                    ),
                    alt: currentPuja?.name ?? '',
                };
            }),
        },
        alternates: {
            canonical:
                currentPuja?.links?.find(
                    (link: SharedLink) => link.title === 'website',
                )?.url ?? `/puja/${slug}/${id}`,
        },
    };
}

export default async function Page({ params }: PageProps<Params>) {
    const { slug, id } = await params;
    const queryYear = new Date().getFullYear();

    const [{ data: pujasData = [] }, { data: siteData = null }] =
        await Promise.all([
            getCollection<Puja>('pujas', {
                populate: ['partnerships'],
                pagination: { page: 1, pageSize: 200 },
                sort: ['sortOrder:asc'],
            }),
            getSingle<GlobalSite>('global', { populate: '*' }),
        ]);

    const pujas: PujaExtended[] = pujasData.map((p) =>
        extendPuja(p, queryYear),
    );
    const currentPuja = pujas.find(
        (item: PujaExtended) => item.referenceId === id,
    );

    if (!currentPuja) {
        notFound();
    }

    if (slug !== currentPuja.slug) {
        permanentRedirect(
            `/puja/${currentPuja.slug}/${currentPuja.referenceId}`,
        );
    }

    const pujaImages = currentPuja?.images?.map((item: Image) => {
        return {
            src: `${item?.year}/${currentPuja.referenceId}/${item.name}`,
            thumb: `${item?.year}/${currentPuja.referenceId}/${item.name}`,
            alt: currentPuja.name,
            subHtml: `<p>By: ${capitalizeFirst(item?.uploadedBy)}</p>`,
        };
    });

    const array: PujaExtended[] = [];
    pujas.forEach((item: PujaExtended, index: number) => {
        if (item.referenceId === id) {
            array.push(pujas?.[0 < index ? index - 1 : pujas?.length - 1]);
            array.push(pujas?.[pujas?.length - 1 > index ? index + 1 : 0]);
        }
    });

    const gMapLink =
        currentPuja.location?.coordinates?.lat &&
        currentPuja.location?.coordinates?.lng
            ? `https://www.google.com/maps/search/?api=1&query=${currentPuja.location.coordinates.lat},${currentPuja.location.coordinates.lng}(${currentPuja.name}+Jagadhatri+Puja+${currentPuja.psZone})`
            : `https://www.google.com/maps/search/?api=1&query=${currentPuja.name}+Jagadhatri+Puja+${currentPuja.zone},+Hooghly,+West+Bengal`;

    const artistTypes = [
        {
            type: 'idol',
            icon: <LuBrush className="text-xl text-purple-600" />,
            title: 'Idol Artist',
        },
        {
            type: 'decoration',
            icon: <LuPalette className="text-xl text-purple-600" />,
            title: 'Decoration Artist',
        },
        {
            type: 'light',
            icon: <LuLightbulb className="text-xl text-purple-600" />,
            title: 'Lighting Artist',
        },
        {
            type: 'theme',
            icon: <LuBrush className="text-xl text-purple-600" />,
            title: 'Theme Artist',
        },
    ];

    const artistsByType = (currentPuja?.artists || []).reduce(
        (acc: Record<string, string[]>, artist: Artist) => {
            if (artist.type && artist.name) {
                acc[artist.type] = acc[artist.type] || [];
                acc[artist.type].push(artist.name);
            }
            return acc;
        },
        {},
    );

    const info = [
        {
            icon: <LuPencil className="text-xl text-purple-600" />,
            title: 'Puja Theme',
            value: currentPuja.theme,
        },
        ...artistTypes.map(({ type, icon, title }) => ({
            icon,
            title,
            value: (artistsByType[type] || []).join(', '),
        })),
    ].filter((item) => item.value);

    const socialLinks = [
        {
            type: 'facebook',
            icon: FaFacebook,
        },
        {
            type: 'instagram',
            icon: FaInstagram,
        },
        {
            type: 'youtube',
            icon: FaYoutube,
        },
        {
            type: 'x',
            icon: FaXTwitter,
        },
        {
            type: 'threads',
            icon: FaThreads,
        },
        {
            type: 'website',
            icon: FaGlobe,
        },
    ]
        .map((item) => {
            return {
                ...item,
                link:
                    currentPuja.links?.find(
                        (link: SharedLink) => link.title === item.type,
                    )?.url ?? '#',
            };
        })
        .filter((item) => item.link !== '#');

    const schemaData = {
        path: `puja/${currentPuja.slug}/${currentPuja.referenceId}`,
        title: `Details of ${currentPuja.name} Sarbajanin`,
        parents: [
            {
                title: 'Jagadhatri Puja Committee List',
                slug: 'puja-committee-list',
            },
        ],
        // dates: {
        //     published: currentPuja.createdAt,
        //     modified: currentPuja.updatedAt,
        // }
    };
    const jsonLd = schema(schemaData);
    jsonLd['@graph'].push({
        name: `${currentPuja.jubilee || currentPuja.preJubilee ? currentPuja.celebrating : currentPuja.year ? `${currentPuja.year} Years` : 'Jagadhatri Puja'} Celebration of ${currentPuja.name} Sarbajanin`,
        description: `Jagadhatri Puja ${queryYear} celebration by ${currentPuja?.name} Sarbajanin, ${currentPuja.psZone}`,
        '@type': 'Event',
        eventStatus: 'https://schema.org/EventScheduled',
        eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
        location: {
            '@type': 'Place',
            name: currentPuja.psZone,
            url: `https://en.wikipedia.org/wiki/${currentPuja.zone === 'bhadreswar' ? 'Bhadreswar,_Hooghly' : 'Chandannagar'}`,
            address: {
                '@type': 'PostalAddress',
                name: `${currentPuja.name} Puja Premises`,
                streetAddress: currentPuja.address,
                addressLocality: currentPuja.psZone,
                addressRegion: 'West Bengal',
                addressCountry: 'IN',
            },
            ...(currentPuja.location?.coordinates?.lat &&
            currentPuja.location?.coordinates?.lng
                ? {
                      geo: {
                          '@type': 'GeoCoordinates',
                          latitude: currentPuja.location.coordinates.lat,
                          longitude: currentPuja.location.coordinates.lng,
                      },
                  }
                : {}),
            hasMap: gMapLink,
        },
        organizer: {
            '@type': 'Organization',
            name: currentPuja.name,
            url: `${baseUrl}/${schemaData.path}`,
        },
        ...(pujaImages
            ? {
                  image: pujaImages?.map((item) => imageUrl(item.src)),
              }
            : {}),
        startDate: `${format(getDateByIndex(siteData?.schedules, 0, '06:00:00'), "yyyy-MM-dd'T'HH:mm:ssXXX")}`,
        endDate: `${format(getDateByIndex(siteData?.schedules, 4, '23:59:59'), "yyyy-MM-dd'T'HH:mm:ssXXX")}`,
        '@id': `${baseUrl}/${schemaData.path}/#schema-${currentPuja.ccjpcId}`, // ensure unique ID
        inLanguage: 'en-IN',
        mainEntityOfPage: {
            '@id': `${baseUrl}/${schemaData.path}/#webpage`,
        },
    });

    return (
        <Main jsonLd={jsonLd}>
            {/* Hero Section with Dynamic Background */}
            <div className="relative flex w-full items-center justify-center overflow-hidden py-32 md:min-h-[90vh]">
                {/* Background Layer */}
                <div className="absolute inset-0">
                    {/* Base Gradient */}
                    <div className="absolute inset-0 bg-gradient-to-br from-[#2D1B69] via-[#1E1B4B] to-[#4F1C48]">
                        {/* Decorative Pattern Overlay */}
                        <div className="absolute inset-0 opacity-5">
                            <div
                                className="absolute inset-0"
                                style={{
                                    backgroundImage: `
                                    radial-gradient(circle at 0% 0%, rgba(255,215,0,0.15) 1px, transparent 8px),
                                    radial-gradient(circle at 100% 0%, rgba(255,215,0,0.15) 1px, transparent 8px),
                                    radial-gradient(circle at 100% 100%, rgba(255,215,0,0.15) 1px, transparent 8px),
                                    radial-gradient(circle at 0% 100%, rgba(255,215,0,0.15) 1px, transparent 8px)
                                `,
                                    backgroundSize: '32px 32px',
                                    backgroundPosition:
                                        '0 0, 16px 0, 16px 16px, 0 16px',
                                }}
                            />
                        </div>

                        {/* Sacred Geometry Pattern */}
                        <div className="absolute inset-0 opacity-10">
                            <div
                                className="absolute inset-0"
                                style={{
                                    backgroundImage: `
                                    repeating-linear-gradient(45deg, rgba(255,223,186,0.1) 0px, rgba(255,223,186,0.1) 1px, transparent 1px, transparent 8px),
                                    repeating-linear-gradient(-45deg, rgba(255,223,186,0.1) 0px, rgba(255,223,186,0.1) 1px, transparent 1px, transparent 8px)
                                `,
                                    backgroundSize: '16px 16px',
                                }}
                            />
                        </div>

                        {/* Additional Gradient Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-transparent via-[#FF5E5B]/5 to-transparent" />
                    </div>

                    {/* Animated Shapes with Enhanced Effects */}
                    <div className="absolute inset-0 overflow-hidden">
                        {/* Large Decorative Circle */}
                        <div className="absolute -top-1/4 -right-1/4 h-[800px] w-[800px] rounded-full bg-gradient-to-br from-[#FFD700]/10 to-transparent" />

                        {/* Animated Blobs */}
                        <div className="absolute top-0 left-0 h-[600px] w-[600px]">
                            <div className="animate-blob absolute inset-0 rounded-full bg-gradient-to-br from-[#FF9933]/20 to-transparent mix-blend-overlay blur-3xl filter" />
                        </div>
                        <div className="absolute top-1/4 right-0 h-[500px] w-[500px]">
                            <div
                                className="animate-blob absolute inset-0 rounded-full bg-gradient-to-bl from-[#FF5E5B]/15 to-transparent mix-blend-overlay blur-3xl filter"
                                style={{ animationDelay: '2s' }}
                            />
                        </div>
                        <div className="absolute bottom-0 left-1/4 h-[700px] w-[700px]">
                            <div
                                className="animate-blob absolute inset-0 rounded-full bg-gradient-to-tr from-[#FFD700]/10 to-transparent mix-blend-overlay blur-3xl filter"
                                style={{ animationDelay: '4s' }}
                            />
                        </div>

                        {/* Subtle Light Effects */}
                        <div className="absolute top-1/3 left-1/2 h-[300px] w-[300px] -translate-x-1/2 -translate-y-1/2 transform rounded-full bg-[#FFF1E6]/10 blur-3xl filter" />
                        <div className="absolute right-1/4 bottom-1/4 h-[200px] w-[200px] rounded-full bg-[#FFB6C1]/10 blur-2xl filter" />
                    </div>

                    {/* Enhanced Vignette Effect */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#2D1B69]/60 via-transparent to-[#2D1B69]/60" />

                    {/* Subtle Color Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-r from-[#FFD700]/5 via-transparent to-[#FF5E5B]/5" />
                </div>

                {/* Content Layer */}
                <div className="relative mx-auto px-8">
                    <div className="flex flex-col items-center">
                        {/* Badge */}
                        <div className="mb-10 inline-block">
                            <Breadcrumbs
                                breadcrumbTitle={currentPuja?.name}
                                className="text-white/90 capitalize"
                                end={-1}
                            />
                        </div>

                        {/* Main Title */}
                        <div className="relative">
                            <h1 className="fl-text-4xl/7xl mb-6 flex flex-col items-center gap-2 text-center font-bold tracking-tight text-white xl:flex-row">
                                <span className="text-shadow-xl text-shadow-grey-900">
                                    {currentPuja.name}
                                </span>
                                {currentPuja.popular && (
                                    <div className="relative inline-flex items-center tracking-normal">
                                        {/* <span className="absolute -inset-2">
                                            <div className="w-full h-full max-w-sm mx-auto rotate-2 blur-sm bg-gradient-to-r from-yellow-400 via-orange-500 to-red-600 opacity-30 animate-pulse" />
                                        </span> */}
                                        <span className="fl-text-xs/sm relative flex items-center gap-1 rounded-full border border-yellow-400/30 bg-gradient-to-r from-yellow-400/20 via-orange-500/20 to-red-600/20 px-3 py-1.5 font-semibold backdrop-blur-sm">
                                            <svg
                                                className="animate-spin-slow h-4 w-4 text-yellow-400"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    fill="currentColor"
                                                    d="M12 15.4l-3.76 2.27 1-4.28-3.32-2.88 4.38-.38L12 6.1l1.71 4.04 4.38.38-3.32 2.88 1 4.28z"
                                                />
                                            </svg>
                                            Popular
                                        </span>
                                    </div>
                                )}
                                <div className="absolute -top-6 -right-6 h-12 w-12 rounded-full bg-purple-400/20 blur-xl" />
                                <div className="absolute -bottom-6 -left-6 h-12 w-12 rounded-full bg-pink-400/20 blur-xl" />
                            </h1>
                        </div>

                        {/* Location */}
                        <div className="relative mb-12">
                            <div className="flex items-center justify-center gap-3 rounded-xl border border-white/10 bg-white/5 px-6 py-3 backdrop-blur-sm">
                                <span className="size-4">
                                    <LuMapPin className="text-purple-400" />
                                </span>
                                <a
                                    href={gMapLink}
                                    target="_blank"
                                    className="fl-text-xs/sm text-white/90"
                                >
                                    {currentPuja.address}
                                </a>
                            </div>
                            {/* Decorative dots */}
                            <div
                                className="absolute -top-4 -left-4 h-8 w-8"
                                style={{
                                    backgroundImage:
                                        'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.3) 1.5px, transparent 0)',
                                    backgroundSize: '8px 8px',
                                }}
                            />
                            <div
                                className="absolute -right-4 -bottom-4 h-8 w-8"
                                style={{
                                    backgroundImage:
                                        'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.3) 1.5px, transparent 0)',
                                    backgroundSize: '8px 8px',
                                }}
                            />
                        </div>

                        {/* Stats Row */}
                        <div className="fl-gap-4/8 mb-12 grid grid-cols-2 lg:grid-cols-4">
                            {[
                                {
                                    text: currentPuja.year
                                        ? currentPuja.year
                                        : '300+',
                                    description:
                                        'Years of ' +
                                        (currentPuja.adi ||
                                        Number(currentPuja.year) >= 50
                                            ? 'Legacy'
                                            : 'Tradition'),
                                    after: (
                                        <span className="h-1.5 w-1.5 animate-ping rounded-full bg-amber-400" />
                                    ),
                                },
                                {
                                    text:
                                        currentPuja.estd === 0
                                            ? 'Not Known'
                                            : currentPuja.estd,
                                    description: 'Established Year',
                                },
                                {
                                    text: currentPuja.adi
                                        ? 'Adi Puja'
                                        : 'Traditional',
                                    description: 'Puja Category',
                                },
                                {
                                    text: String(currentPuja.ccjpcId).padStart(
                                        2,
                                        '0',
                                    ),
                                    description: 'Serial Number',
                                },
                            ].map((item, index) => (
                                <div
                                    key={index}
                                    className="relative overflow-hidden rounded-xl border border-white/10 bg-white/5 px-6 py-4 backdrop-blur-sm xl:min-w-[200px]"
                                >
                                    {/* <div className="absolute -right-8 -top-8 w-16 h-16 bg-purple-500/20 rounded-full blur-xl animate-pulse" /> */}
                                    <div className="relative text-center">
                                        <div className="fl-text-xl/2xl mb-1 flex items-center justify-center gap-2 font-bold text-white">
                                            <span className="bg-gradient-to-r from-amber-200 to-amber-500 bg-clip-text whitespace-nowrap text-transparent">
                                                {item.text}
                                            </span>
                                            {item?.after}
                                        </div>
                                        <div className="fl-text-xs/sm whitespace-nowrap text-white/70">
                                            {item.description}
                                        </div>
                                    </div>
                                    <div
                                        className="absolute -bottom-2 -left-2 h-8 w-8"
                                        style={{
                                            backgroundImage:
                                                'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.2) 1px, transparent 0)',
                                            backgroundSize: '6px 6px',
                                        }}
                                    />
                                </div>
                            ))}
                        </div>

                        {socialLinks.length > 0 && (
                            <div className="mt-4 flex items-center justify-center gap-4">
                                {socialLinks.map((item, index) => (
                                    <a
                                        key={index}
                                        href={item.link}
                                        target="_blank"
                                        rel="noopener"
                                        className={cn(
                                            'rounded-full border border-white/20 bg-white/10 p-2 backdrop-blur-sm transition-all duration-300 hover:bg-white/20',
                                            item.link === '#' &&
                                                'pointer-events-none',
                                        )}
                                        aria-label={`Visit our ${capitalizeFirst(item.type)}`}
                                        title={capitalizeFirst(item.type)}
                                    >
                                        <item.icon className="fl-text-sm/xl text-white/80 transition-colors hover:text-white" />
                                    </a>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div className="w-full bg-gradient-to-br from-purple-50/50 via-white to-purple-50/50">
                <div className="pattern-dots px-4">
                    <div className="relative container mx-auto -mt-10 mb-16 px-2 lg:px-0">
                        <div
                            className={cn(
                                `fl-gap-4/8 mx-auto grid grid-cols-1 items-center justify-center`,
                                currentPuja.procession &&
                                    'max-w-screen-xl lg:grid-cols-3',
                                !currentPuja.procession &&
                                    'max-w-screen-lg lg:grid-cols-2',
                            )}
                        >
                            <div className="rounded-2xl bg-white p-5 shadow-xl shadow-purple-100/50 transition-all duration-300 hover:shadow-2xl hover:shadow-purple-100/50">
                                <div className="flex items-center gap-4">
                                    <div className="rounded-xl bg-purple-100 p-3">
                                        <LuHistory className="text-2xl text-purple-600" />
                                    </div>
                                    <div>
                                        <div className="fl-text-xl/2xl mb-1 font-bold text-gray-800">
                                            {currentPuja.celebrating
                                                ? currentPuja.celebrating
                                                : currentPuja.year
                                                  ? currentPuja.year
                                                  : '300+'}
                                        </div>
                                        <div className="fl-text-xs/sm text-gray-600">
                                            {currentPuja.celebrating
                                                ? `Be the part of ${currentPuja.year} years' celebration`
                                                : 'Years of Celebration'}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="rounded-2xl bg-white p-5 shadow-xl shadow-purple-100/50 transition-all duration-300 hover:shadow-2xl hover:shadow-purple-100/50">
                                <div className="flex items-center gap-4">
                                    <div className="rounded-xl bg-purple-100 p-3">
                                        <LuMapPin className="text-2xl text-purple-600" />
                                    </div>
                                    <div>
                                        <div className="fl-text-xl/2xl mb-1 font-bold text-gray-800">
                                            {currentPuja?.zone === 'bhadreswar'
                                                ? 'Bhadreswar'
                                                : 'Chandannagar'}
                                        </div>
                                        <div className="fl-text-xs/sm text-gray-600">
                                            Police Station Zone
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {currentPuja.procession?.truckCount && (
                                <div className="rounded-2xl bg-white p-5 shadow-xl shadow-purple-100/50 transition-all duration-300 hover:shadow-2xl hover:shadow-purple-100/50">
                                    <div className="flex items-center gap-4">
                                        <div className="rounded-xl bg-purple-100 p-3">
                                            <LuPalette className="text-2xl text-purple-600" />
                                        </div>
                                        <div>
                                            <div className="fl-text-xl/2xl mb-1 font-bold text-gray-800">
                                                Participating
                                            </div>
                                            <div className="fl-text-xs/sm text-gray-600">
                                                {`With ${currentPuja.procession?.truckCount} Vehicle${currentPuja.procession?.truckCount > 1 ? 's' : ''} in Procession`}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                    <div id="about" className="relative overflow-hidden py-16">
                        <div className="container mx-auto px-2 lg:px-0">
                            <div className="mb-8 text-center">
                                <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-purple-100/50 px-4 py-2 font-medium text-purple-700">
                                    <LuBook className="text-sm" />
                                    <span className="text-sm">
                                        About Our Puja
                                    </span>
                                </div>
                                <h2
                                    className="fl-text-3xl/5xl mb-6 bg-gradient-to-r from-purple-900 via-purple-700 to-purple-800 bg-clip-text font-bold text-transparent"
                                    style={{ lineHeight: 'normal' }}
                                >
                                    Celebrating Culture & Tradition
                                </h2>
                                <p className="fl-text-base/lg text-gray-600">
                                    {currentPuja.estd === 0
                                        ? 'A Legacy of Tradition'
                                        : `Since the year ${currentPuja.estd}`}
                                </p>
                            </div>
                            <div className="fl-p-6/8 relative overflow-hidden rounded-3xl border border-purple-100 bg-white shadow-xl shadow-purple-100/50">
                                <div className="absolute top-0 right-0 -mt-16 -mr-16 h-32 w-32 rounded-full bg-purple-100/50 blur-3xl" />
                                <div className="absolute bottom-0 left-0 -mb-16 -ml-16 h-32 w-32 rounded-full bg-purple-100/50 blur-3xl" />
                                <div className="relative">
                                    <div className="prose prose-lg prose-purple max-w-none space-y-2 text-justify">
                                        {currentPuja.info && (
                                            <Markdown
                                                content={currentPuja.info}
                                                className="space-y-2"
                                            />
                                        )}
                                        {currentPuja.celebrating && (
                                            <div className="relative my-8 overflow-hidden rounded-2xl border border-amber-100 bg-gradient-to-r from-purple-50 to-amber-50 p-6">
                                                <div className="absolute top-0 right-0 -mt-20 -mr-20 h-40 w-40 rounded-full bg-yellow-100/70 opacity-70 blur-3xl" />
                                                <div className="absolute bottom-0 left-0 -mb-20 -ml-20 h-40 w-40 rounded-full bg-purple-100/70 opacity-70 blur-3xl" />

                                                <div className="relative flex flex-col items-center gap-6 md:flex-row">
                                                    <div className="fl-size-24/28 flex flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-amber-400 to-amber-600 shadow-lg shadow-amber-200/50">
                                                        <div className="fl-text-2xl/3xl font-bold text-white">
                                                            {currentPuja.year}
                                                        </div>
                                                    </div>
                                                    <div className="text-center md:text-left">
                                                        <h3 className="fl-text-2xl/3xl mb-2 bg-gradient-to-r from-purple-700 via-amber-600 to-amber-700 bg-clip-text font-bold text-transparent">
                                                            Celebrating{' '}
                                                            {
                                                                currentPuja.celebrating
                                                            }{' '}
                                                            Year!
                                                        </h3>
                                                        <p className="text-gray-700">
                                                            {currentPuja.celebrating ===
                                                                'Silver Jubilee' &&
                                                                'Silver Jubilee: A quarter century of devotion and community celebration.'}
                                                            {currentPuja.celebrating ===
                                                                'Golden Jubilee' &&
                                                                'Golden Jubilee: Half a century of preserving our cultural heritage.'}
                                                            {currentPuja.celebrating ===
                                                                'Diamond Jubilee' &&
                                                                'Diamond Jubilee: Sixty years of unwavering faith and tradition.'}
                                                            {currentPuja.celebrating ===
                                                                'Platinum Jubilee' &&
                                                                'Platinum Jubilee: A seventy-five years of spiritual journey and community bonding.'}
                                                            {currentPuja.celebrating ===
                                                                'Centennial Jubilee' &&
                                                                'Centennial Jubilee: A hundred years of spiritual journey and community bonding.'}
                                                            {currentPuja.celebrating ===
                                                                'Jubilee' &&
                                                                'Jubilee: Celebrating a significant milestone in our spiritual journey, tradition and community bonding.'}
                                                            {currentPuja.celebrating.includes(
                                                                'Pre',
                                                            ) &&
                                                                `${currentPuja.celebrating}: Celebrating a significant milestone in our spiritual journey and community bonding.`}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                    {info.length > 0 && (
                                        <div
                                            className={cn(
                                                `mx-auto grid grid-cols-1 md:grid-cols-2 lg:max-w-screen-xl lg:grid-cols-${info.length} fl-gap-4/6 mt-8 justify-center border-t border-purple-100 pt-8`,
                                            )}
                                        >
                                            {info.map((item, index: number) => (
                                                <div
                                                    key={index}
                                                    className="flex items-start gap-4"
                                                >
                                                    <div className="rounded-xl bg-purple-100 p-3">
                                                        {item.icon}
                                                    </div>
                                                    <div className="whitespace-nowrap">
                                                        <div className="mb-1 font-semibold text-gray-800">
                                                            {item.title}
                                                        </div>
                                                        <div className="text-sm text-gray-600">
                                                            {item.value}
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className="mt-8">
                                <div className="rounded-xl border border-purple-100 bg-purple-50 px-6 py-4">
                                    <div className="flex items-start gap-3">
                                        <div className="rounded-lg bg-purple-100 p-2">
                                            <LuLightbulb className="text-lg text-purple-600" />
                                        </div>
                                        <div>
                                            <h4 className="mb-2 font-medium text-gray-900">
                                                Disclaimer
                                            </h4>
                                            <p className="fl-text-xs/sm leading-relaxed text-gray-600">
                                                The information provided here
                                                may be incomplete or partially
                                                inaccurate. If you are a
                                                representative of this puja
                                                committee and notice any
                                                discrepancies, we encourage you
                                                to get in touch with us so we
                                                can update and correct the
                                                details. This initiative aims to
                                                bring all puja committees
                                                together on a single unified
                                                platform.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {pujaImages && (
                    <div
                        id="gallery"
                        className="bg-gradient-to-br from-white via-amber-50/30 to-orange-50/30 py-20"
                    >
                        <div className="mb-16 text-center">
                            <div className="mb-4 inline-flex items-center gap-2 rounded-lg bg-amber-100 px-4 py-2 font-medium text-amber-700">
                                <LuImages className="text-lg" />
                                <span>Our Gallery</span>
                            </div>
                            <h2
                                className="fl-text-3xl/5xl mb-4 bg-gradient-to-r from-amber-700 to-orange-800 bg-clip-text px-3 font-bold text-transparent"
                                style={{ lineHeight: 'normal' }}
                            >
                                Glimpses of Celebration
                            </h2>
                            <p className="mx-auto max-w-2xl text-gray-600">
                                Explore moments from our recent celebrations
                                that capture the essence of our tradition and
                                community spirit.
                            </p>
                        </div>
                        <GallerySlider
                            speed={500}
                            thumbnail={true}
                            slideShowAutoplay={true}
                            fullScreen={true}
                            slides={pujaImages}
                            sliderOptions={{
                                lazyLoad: 'sequential',
                                perPage:
                                    pujaImages.length >= 4
                                        ? 4
                                        : pujaImages.length,
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
                                        perPage:
                                            pujaImages.length >= 2
                                                ? 2
                                                : pujaImages.length,
                                        height: 300,
                                    },
                                    1024: {
                                        perPage:
                                            pujaImages.length >= 3
                                                ? 3
                                                : pujaImages.length,
                                        height: 350,
                                    },
                                },
                            }}
                            sliderItemClass="aspect-[4/5] overflow-hidden rounded-2xl group"
                        />
                    </div>
                )}

                <div className="bg-gradient-to-br from-white via-blue-50/50 to-indigo-100/30 py-20">
                    <div className="mx-auto max-w-7xl px-4">
                        <div className="mb-16 text-center">
                            <div className="mb-4 inline-flex items-center gap-2 rounded-lg bg-blue-100 px-4 py-2 font-medium text-blue-700">
                                <LuCalendar className="text-lg" />
                                <span>Event Schedule</span>
                            </div>
                            <h2
                                className="fl-text-3xl/4xl mb-4 bg-gradient-to-r from-blue-700 to-indigo-700 bg-clip-text font-bold text-transparent"
                                style={{ lineHeight: 'normal' }}
                            >
                                Upcoming Events
                            </h2>
                            <p className="mx-auto max-w-2xl text-gray-600">
                                Mark your calendar for these auspicious
                                occasions
                            </p>
                        </div>
                        <div className="grid gap-4 md:grid-cols-2">
                            {siteData?.schedules?.map(
                                (item: SharedSchedule, index: number) => (
                                    <div
                                        key={index}
                                        className="flex items-center gap-4 overflow-hidden rounded-2xl border border-gray-200 bg-white/90 p-4 backdrop-blur-sm transition-all duration-300 hover:border-blue-200 hover:bg-blue-50/50"
                                    >
                                        <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-blue-100">
                                            <LuCalendar className="text-lg text-blue-600" />
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <div className="flex items-center gap-2">
                                                <h3 className="truncate text-base font-semibold text-blue-700">
                                                    {item.event}
                                                </h3>
                                                <span className="text-xs text-gray-500">
                                                    {formatDate(
                                                        item.date,
                                                        'dd MMMM yyyy',
                                                    )}
                                                </span>
                                            </div>
                                            {item.description && (
                                                <p className="mt-1 line-clamp-2 text-xs text-gray-600">
                                                    {item.description}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                ),
                            )}
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
                                <h2 className="fl-text-3xl/4xl font-bold mb-4 bg-gradient-to-r from-green-700 to-emerald-700 bg-clip-text text-transparent" style={{lineHeight: 'normal'}}>
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
                            <h2 className="fl-text-3xl/4xl font-bold mb-4 bg-gradient-to-r from-blue-700 to-indigo-700 bg-clip-text text-transparent" style={{lineHeight: 'normal'}}>
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
                <div className="bg-gradient-to-br from-white via-gray-50/50 to-slate-50/50 py-16">
                    <div className="mx-auto max-w-4xl px-4">
                        <div className="mb-12 text-center">
                            <h3 className="fl-text-2xl/3xl mb-4 font-bold text-gray-800">
                                Quick Actions
                            </h3>
                            <p className="text-gray-600">
                                Everything you need to know about this puja
                            </p>
                        </div>

                        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                            <Link
                                href={`/puja-committee-list`}
                                className="group rounded-xl border border-gray-200 bg-white/80 p-4 text-center backdrop-blur-sm transition-all duration-300 hover:border-purple-200 hover:bg-purple-50/50"
                            >
                                <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-lg bg-purple-100 transition-colors group-hover:bg-purple-200">
                                    <LuBuilding className="text-xl text-purple-600" />
                                </div>
                                <div className="text-sm font-medium text-gray-700 group-hover:text-purple-700">
                                    All Pujas
                                </div>
                            </Link>

                            <Link
                                href={`/gallery`}
                                className="group rounded-xl border border-gray-200 bg-white/80 p-4 text-center backdrop-blur-sm transition-all duration-300 hover:border-blue-200 hover:bg-blue-50/50"
                            >
                                <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100 transition-colors group-hover:bg-blue-200">
                                    <LuPalette className="text-xl text-blue-600" />
                                </div>
                                <div className="text-sm font-medium text-gray-700 group-hover:text-blue-700">
                                    Gallery
                                </div>
                            </Link>

                            <Link
                                href={`/puja-history`}
                                className="group rounded-xl border border-gray-200 bg-white/80 p-4 text-center backdrop-blur-sm transition-all duration-300 hover:border-green-200 hover:bg-green-50/50"
                            >
                                <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-lg bg-green-100 transition-colors group-hover:bg-green-200">
                                    <LuHistory className="text-xl text-green-600" />
                                </div>
                                <div className="text-sm font-medium text-gray-700 group-hover:text-green-700">
                                    History
                                </div>
                            </Link>

                            <Link
                                href={`/contact-us`}
                                className="group rounded-xl border border-gray-200 bg-white/80 p-4 text-center backdrop-blur-sm transition-all duration-300 hover:border-orange-200 hover:bg-orange-50/50"
                            >
                                <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-lg bg-orange-100 transition-colors group-hover:bg-orange-200">
                                    <LuMail className="text-xl text-orange-600" />
                                </div>
                                <div className="text-sm font-medium text-gray-700 group-hover:text-orange-700">
                                    Contact
                                </div>
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Enhanced Navigation */}
                <div className="py-12">
                    <div className="mx-auto max-w-7xl px-4">
                        <div className="flex flex-col justify-between gap-6 sm:flex-row">
                            <Link
                                rel="prev"
                                href={`/puja/${array?.[0]?.slug}/${array?.[0]?.referenceId}`}
                                className="group relative flex flex-1 items-center gap-4 overflow-hidden rounded-xl border border-purple-100 bg-gradient-to-r from-white to-purple-50 px-6 py-5 transition-all hover:border-purple-200"
                            >
                                <div className="absolute top-0 left-0 h-full w-1 bg-purple-400"></div>
                                <div className="rounded-lg bg-purple-100 p-2.5 transition-transform group-hover:-translate-x-1">
                                    <LuArrowLeft className="text-purple-600" />
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center gap-1 text-sm text-gray-600">
                                        <span className="inline-block h-2 w-2 animate-pulse rounded-full bg-purple-300"></span>
                                        Previous Puja
                                    </div>
                                    <div className="truncate font-medium">
                                        {array?.[0]?.name}
                                    </div>
                                    {array?.[0]?.tags?.includes('popular') && (
                                        <span className="mt-1 inline-block rounded-full bg-amber-100 px-2 py-0.5 text-xs text-amber-700">
                                            Popular
                                        </span>
                                    )}
                                </div>
                            </Link>
                            <Link
                                rel="next"
                                href={`/puja/${array?.[1]?.slug}/${array?.[1]?.referenceId}`}
                                className="group relative flex flex-1 items-center justify-end gap-4 overflow-hidden rounded-xl border border-purple-100 bg-gradient-to-l from-white to-purple-50 px-6 py-5 text-right transition-all hover:border-purple-200"
                            >
                                <div className="absolute top-0 right-0 h-full w-1 bg-purple-400"></div>
                                <div className="flex-1">
                                    <div className="flex items-center justify-end gap-1 text-sm text-gray-600">
                                        Next Puja
                                        <span className="inline-block h-2 w-2 animate-pulse rounded-full bg-purple-300"></span>
                                    </div>
                                    <div className="truncate font-medium">
                                        {array?.[1]?.name}
                                    </div>
                                    {array?.[1]?.tags?.includes('popular') && (
                                        <span className="mt-1 inline-block rounded-full bg-amber-100 px-2 py-0.5 text-xs text-amber-700">
                                            Popular
                                        </span>
                                    )}
                                </div>
                                <div className="rounded-lg bg-purple-100 p-2.5 transition-transform group-hover:translate-x-1">
                                    <LuArrowRight className="text-purple-600" />
                                </div>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </Main>
    );
}
