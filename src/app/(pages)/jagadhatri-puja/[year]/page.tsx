import MainLayout from "@/components/main-layout";
import Section from "@/components/section";
import { getCollection } from "@/utils/fetch";
import Tabs, { TabProps } from '@/components/tabs';
import Info, { InfoItem } from '@/components/info';
import {
    jubilees,
    preJubilees,
    getYear,
    getCelebrating,
    formatDate,
    getDay,
    getDateByIndex,
    buildGoogleCalendarUrl,
} from "@/utils/functions";
import schema from "@/utils/schema";
import Link from "next/link";
import { 
    LuArrowLeft, 
    LuArrowRight, 
    LuChevronRight, 
    LuPartyPopper, 
    LuList, 
    LuCalendar, 
    LuClock, 
    LuSun, 
    LuWaves, 
    LuUsers, 
    LuBuilding2, 
    LuBuilding, 
    LuCrown, 
    LuTruck, 
    LuMedal, 
    LuAward, 
    LuPlus
} from "react-icons/lu";
import { metadata as metadataSchema } from "@/app/layout";
import type { Metadata } from 'next'
import cx from 'classix';
import { format } from "date-fns";
import type { Puja, PageProps, Global, Procession, SharedSchedule } from "@/types";

// Exporting runtime for edge function if needed
// export const runtime = 'edge';

interface Params {
    year: string;
}

export async function generateStaticParams() {
    return Array.from({ length: 100 }, (_, i) => ({
        year: (i + 2000).toString()
    }));
}

export async function generateMetadata({ params }: PageProps<Params>): Promise<Metadata> {
    const { year } = await params
    const queryYear = parseInt(year);
    const siteDataRes = await getCollection('global', { populate: '*' });
    const siteData: Global = siteDataRes.data ?? null;
    const displayDate = getDateByIndex(siteData.schedules, 0);
    const dateIsCurrent = queryYear === displayDate.getFullYear();

    return {
        title: `Jagadhatri Puja ${queryYear} Jubilee, Pre Jubilee List${dateIsCurrent ? ', Schedule' : ''}`,
        description: `Explore the Jubilee List${dateIsCurrent ? ', Schedule, Puja Updates' : ''} and Latest Information about Jagadhatri Puja ${queryYear} the great festival of Chandannagar.`,
        openGraph: {
            ...metadataSchema.openGraph,
            url: `/jagadhatri-puja/${queryYear}`,
        },
        alternates: {
            canonical: `/jagadhatri-puja/${queryYear}`,
        },
        pagination: {
            previous: queryYear > 2000 ? `/jagadhatri-puja/${queryYear - 1}` : null,
            next: `/jagadhatri-puja/${queryYear + 1}`
        },
    }
}

export default async function Page({ params }: PageProps<Params>) {
    const { year } = await params
    const queryYear = Number(year);
    
    const pujasReq = getCollection('pujas', {
        populate: '*',
        pagination: {
            page: 1,
            pageSize: 200
        },
        sort: ['order:asc']
    })
    const processionReq = getCollection('processions', {
        populate: '*',
        sort: ['order:asc']
    })
    const siteDataReq = getCollection('global', { populate: '*' });

    const [pujasRes, siteDataRes, processionRes] = await Promise.allSettled([pujasReq, siteDataReq, processionReq]).then(results => [
        results[0].status === "fulfilled" ? results[0].value : { data: [] },
        results[1].status === "fulfilled" ? results[1].value : { data: {} },
        results[2].status === "fulfilled" ? results[2].value : { data: [] }
    ]);
    const pujas: Puja[] = pujasRes.data;
    const siteData: Global = siteDataRes.data;
    const processionData: Procession[] = processionRes.data;
    const canShowProcession = processionData?.length > 0 && processionData?.every((item: Procession) => parseInt(item?.year) === queryYear);

    const displayDate = getDateByIndex(siteData.schedules, 0);
    const dateIsCurrent = queryYear === displayDate.getFullYear();
    const jubilee = pujas?.filter((data: Puja) => jubilees.includes(Number(getYear(data?.estd, queryYear))));
    const prejubilee = pujas?.filter((data: Puja) => preJubilees.includes(Number(getYear(data?.estd, queryYear))));

    const tabContent = (puja: Puja[]) => {
        const items: InfoItem[] = [
            {
                title: "Total Committees",
                description: puja?.length,
                icon: <LuUsers />,
                variant: "from-green-500 to-green-300"
            },
            {       
                title: "Chandannagar",
                description: puja?.filter((p: Puja) => p.zone === 'chandannagar')?.length,
                icon: <LuBuilding2 />,
                variant: "from-rose-500 to-rose-300"
            },
            {
                title: "Bhadreswar",
                description: puja?.filter((p: Puja) => p.zone === 'bhadreswar')?.length,
                icon: <LuBuilding />,
                variant: "from-blue-500 to-blue-300"
            },
            {
                title: "Adi Pujas",
                description: puja?.filter((p: Puja) => {
                    const y = getYear(p?.estd, queryYear);
                    if (!y || Number(y) >= 150) {
                        return true;
                    }
                    return false;
                })?.length,
                icon: <LuCrown />,
                variant: "from-purple-500 to-purple-300"
            }
        ]

        return (
            <div className="text-center p-2 pt-5 md:p-5 space-y-3 md:space-y-4 lg:space-y-3 md:space-y-4 lg:space-y-5">
                <Info items={items} />
                <div className="overflow-x-auto rounded-box border border-base-content/5 bg-base-100">
                    <table className="table text-center table-zebra">
                        <thead>
                            <tr className="bg-blue-100 text-gray-700">
                                <th>Sl. No.</th>
                                <th className="text-left">Puja Committee Name</th>
                                <th>Under P. S.</th>
                                <th>Years</th>
                                <th>{dateIsCurrent ? 'Celebrating' : 'Celebrated'}</th>
                                {dateIsCurrent && <th>Details</th>}
                            </tr>
                        </thead>
                        <tbody>
                            {puja?.map((item: Puja, index: number) => {
                                const y = getYear(item?.estd, queryYear);
                                const cel = getCelebrating(y);
                                const adi = item?.tags?.includes('adi') ?? false;
                                const popular = item?.tags?.includes('popular') ?? false;
                                const formattedCel = cel.replaceAll(' ', '-').toLowerCase();
                                const celClass = cx(
                                    'px-2.5 py-1 text-xs font-medium rounded-md whitespace-nowrap',
                                    !formattedCel.includes('pre') && formattedCel.includes('jubilee') && 'bg-rose-300/10 text-rose-700',
                                    formattedCel.includes('pre') && formattedCel.includes('jubilee') && 'bg-blue-300/10 text-blue-500',
                                );
                                return (
                                    <tr key={index} className="row">
                                        <td>{index + 1}</td>
                                        <td>
                                            <div className="flex items-center gap-2 whitespace-nowrap">
                                                <span className="text-left hover:text-green-700 transition-colors">{item?.name}</span>
                                                {(popular || adi) && (
                                                    <div className="flex gap-1">
                                                        {popular && (
                                                            <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-medium text-amber-700 bg-amber-100 rounded-md whitespace-nowrap">
                                                                <LuMedal className="text-amber-500" />
                                                                Popular
                                                            </span>
                                                        )}
                                                        {adi && (
                                                            <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-medium text-purple-700 bg-purple-100 rounded-md whitespace-nowrap">
                                                                <LuAward className="text-purple-500" />
                                                                Adi Puja
                                                            </span>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        </td>
                                        <td>{item?.zone === 'bhadreswar' ? 'Bhadreswar' : 'Chandannagar'}</td>
                                        <td>
                                            <span className="inline-flex items-center justify-center px-2.5 py-1 text-xs font-medium bg-gray-100 rounded-md whitespace-nowrap">
                                                {y}
                                            </span>
                                        </td>
                                        <td><span className={celClass}>{cel}</span></td>
                                        {dateIsCurrent && <td><Link
                                            className="btn btn-ghost btn-xs text-sky-600"
                                            href={`/puja/${item?.slug}/${item?.referenceId}${new Date().getFullYear() !== queryYear ? `?y=${queryYear}` : ''}`}>
                                            View <LuChevronRight />
                                        </Link>
                                        </td>}
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        )
    }

    const tabPujaSchedule = () => {
        const items: InfoItem[] = [
            {
                title: "Festival Duration",
                description: `${siteData?.schedules?.length} Days`,
                icon: <LuClock />,
                variant: "from-orange-500 to-orange-300",
            },
            {
                title: "Starting With",
                description: "Sasthi",
                icon: <LuSun />,
                variant: "from-blue-500 to-blue-300",
            },
            {
                title: "Main Puja Day",
                description: "Nabami",
                icon: <LuPartyPopper />,
                variant: "from-purple-500 to-purple-300",
            },
            {
                title: "Ending With",
                description: "Dashami",
                icon: <LuWaves />,
                variant: "from-rose-500 to-rose-300",
            }
        ]
        return (
            <div className="text-center p-2 pt-5 md:p-5 space-y-3 md:space-y-4 lg:space-y-5">
                <Info items={items} />
                <div className="overflow-x-auto rounded-box border border-base-content/5 bg-base-100">
                    <table className="table text-center table-zebra">
                        <thead>
                            <tr className="bg-blue-100 text-gray-700">
                                <th>Day</th>
                                <th>Date (English Calender)</th>
                                <th>Weekday</th>
                                <th>Tithi</th>
                                <th>Event</th>
                            </tr>
                        </thead>
                        <tbody>
                            {siteData?.schedules?.map((item: SharedSchedule, index: number) => {
                                return (
                                    <tr key={index} className='row'>
                                        <td>{index + 1}</td>
                                        <td className="text-blue-800 whitespace-nowrap">{formatDate(item?.date)}</td>
                                        <td className="text-gray-600">{getDay(item?.date)}</td>
                                        <td>
                                            <span className="px-2.5 py-1 text-sm rounded-md whitespace-nowrap bg-pink-300/10 text-pink-700">{item?.event}</span>
                                        </td>
                                        <td>
                                            <a className="btn btn-ghost btn-xs text-sky-600 bg-gray-100 rounded-md" target="_blank" href={buildGoogleCalendarUrl({
                                                title: `${item.event} - Jagadhatri Puja ${new Date().getFullYear()}`,
                                                location: 'Chandannagar',
                                                description: item.description
                                            }, item.date, '00:00:00', '23:59:59')} rel="noopener noreferrer">
                                                <LuPlus /> Add
                                            </a>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        )
    }

    const tabProcessionList = () => {
        const totalVehicles = processionData?.reduce((sum: number, item: Procession) => sum + (parseInt(String(item?.truckCount)) || 0), 0) || 0;
        const items: InfoItem[] = [
            {
                title: "Total Procession",
                description: processionData?.length,
                icon: <LuUsers />,
                variant: "from-green-500 to-green-300"
            },
            {
                title: "Total Vehicles",
                description: totalVehicles,
                icon: <LuTruck />,
                variant: "from-yellow-500 to-yellow-300"
            },
            {
                title: "Jubilee Celebrations",
                description: jubilee?.length,
                icon: <LuMedal />,
                variant: "from-rose-500 to-rose-300"
            },
            {
                title: "Pre Jubilee Celebrations",
                description: prejubilee?.length,
                icon: <LuAward />,
                variant: "from-blue-500 to-blue-300"
            }
        ]
        return (
            <div className="text-center p-2 pt-5 md:p-5 space-y-3 md:space-y-4 lg:space-y-5">
                <Info items={items} />
                <div className="overflow-x-auto rounded-box border border-base-content/5 bg-base-100">
                    <table className="table text-center table-zebra">
                        <thead>
                            <tr className="bg-blue-100 text-gray-700">
                                <th>Sl. No.</th>
                                <th className="text-left">Puja Committee Name</th>
                                <th>Vehicle(s)</th>
                                <th>Zone</th>
                                <th>Years</th>
                                <th>Celebrating</th>
                                <th>Under P. S.</th>
                            </tr>
                        </thead>
                        <tbody>
                            {processionData?.map((item: Procession, index: number) => {
                                const puja = item?.puja ?? null;
                                if (!puja) {
                                    return null;
                                }
                                const y = getYear(puja.estd, queryYear);
                                const cel = getCelebrating(y);
                                const adi = puja?.tags?.includes('adi') ?? false;
                                const popular = puja?.tags?.includes('popular') ?? false;
                                const formattedCel = cel.replaceAll(' ', '-').toLowerCase();
                                const celClass = cx(
                                    'px-2.5 py-1 text-xs font-medium rounded-md whitespace-nowrap',
                                    !formattedCel.includes('pre') && formattedCel.includes('jubilee') && 'bg-rose-300/10 text-rose-700',
                                    formattedCel.includes('pre') && formattedCel.includes('jubilee') && 'bg-blue-300/10 text-blue-500',
                                );
                                const rowClass = cx(
                                    'row',
                                    !formattedCel.includes('pre') && formattedCel.includes('jubilee') && 'text-rose-500 font-medium',
                                    formattedCel.includes('pre') && formattedCel.includes('jubilee') && 'text-blue-500 font-medium',
                                );
                                return (
                                    <tr key={index} className={rowClass}>
                                        <td>{index + 1}</td>
                                        <td>
                                            <div className="flex items-center gap-2 whitespace-nowrap">
                                                <span className="text-left hover:text-green-700 transition-colors">{puja?.name}</span>
                                                {(popular || adi) && (
                                                    <div className="flex gap-1">
                                                        {popular && (
                                                            <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-medium text-amber-700 bg-amber-100 rounded-md whitespace-nowrap">
                                                                <LuMedal className="text-amber-500" />
                                                                Popular
                                                            </span>
                                                        )}
                                                        {adi && (
                                                            <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-medium text-purple-700 bg-purple-100 rounded-md whitespace-nowrap">
                                                                <LuAward className="text-purple-500" />
                                                                Adi Puja
                                                            </span>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        </td>
                                        <td>{item?.truckCount == 1 ? 1 : item?.truckCount - 1 + ' + 1 = ' + item?.truckCount}</td>
                                        <td>{item?.zone}</td>
                                        <td>{y}</td>
                                        <td><span className={celClass}>{cel}</span></td>
                                        <td>{puja?.zone === 'bhadreswar' ? 'Bhadreswar' : 'Chandannagar'}</td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        )
    }

    const tabs: TabProps[] = [
        {
            title: <span key={queryYear} className="flex items-center gap-2">Jubilee List <span className="px-2.5 py-1 text-xs font-medium rounded-full bg-blue-300/10 text-blue-500">{jubilee?.length}</span></span>,
            icon: <LuList />,
            content: tabContent(jubilee),
        },
        {
            title: <span key={queryYear} className="flex items-center gap-2">Pre Jubilee List <span className="px-2.5 py-1 text-xs font-medium rounded-full bg-blue-300/10 text-blue-500">{prejubilee?.length}</span></span>,
            icon: <LuList />,
            content: tabContent(prejubilee),
        }
    ];

    const schemaData = {
        path: `jagadhatri-puja/${queryYear}`,
        title: `Jagadhatri Puja ${queryYear} Jubilee, Pre Jubilee List${dateIsCurrent ? ', Schedule' : ''}`,
        parents: [
            {
                title: 'Jagadhatri Puja Jubilee, Pre Jubilee List, Schedule',
                slug: 'jagadhatri-puja'
            }
        ]
    }
    const jsonLd = schema(schemaData);

    if (dateIsCurrent) {
        tabs.push({
            title: <span key={queryYear} className="flex items-center gap-2">Puja Schedule <span className="px-2.5 py-1 text-xs font-medium rounded-full bg-blue-300/10 text-blue-500">{queryYear}</span></span>,
            icon: <LuCalendar />,
            content: tabPujaSchedule(),
        });

        jsonLd["@graph"].push({
            "name": `${schemaData.title} - Jagadhatri Online™ | the #1 Popular Jagadhatri Puja Portal`,
            "description": `Here are the Jubilee & Pre Jubilee List, Schedule, Puja Updates and Latest Information about Jagadhatri Puja ${queryYear} the great festival of Chandannagar & Bhadreswar.`,
            "@type": "Event",
            "eventStatus": "https://schema.org/EventScheduled",
            "eventAttendanceMode": "https://schema.org/MixedEventAttendanceMode",
            "location": [
                {
                    "@type": "VirtualLocation",
                    "url": "https://www.facebook.com/JagadhatriOnlineOfficial"
                },
                {
                    "@type": "Place",
                    "name": "Chandannagar",
                    "url": "https://en.wikipedia.org/wiki/Chandannagar",
                    "address": {
                        "@type": "PostalAddress",
                        "streetAddress": "Station Road",
                        "addressLocality": "Chandannagar",
                        "addressRegion": "West Bengal",
                        "postalCode": "712136",
                        "addressCountry": "IN"
                    }
                }
            ],
            "performer": {
                "@type": "Organization",
                "name": "Jagadhatri Online",
                "sameAs": process.env.NEXT_PUBLIC_SITE_URL
            },
            "organizer": {
                "@type": "Organization",
                "name": "Jagadhatri Online",
                "url": process.env.NEXT_PUBLIC_SITE_URL
            },
            "image": `${process.env.NEXT_PUBLIC_SITE_URL}/og-image.jpg`,
            "startDate": format(getDateByIndex(siteData?.schedules, 0, "06:00:00"), "yyyy-MM-dd'T'HH:mm:ssXXX"),
            "endDate": format(getDateByIndex(siteData?.schedules, 4, "23:59:59"), "yyyy-MM-dd'T'HH:mm:ssXXX"),
            "@id": `${process.env.NEXT_PUBLIC_SITE_URL}/${schemaData.path}/#schema-${queryYear}`, // ensure unique ID
            "inLanguage": "en-IN",
            "mainEntityOfPage": {
                "@id": `${process.env.NEXT_PUBLIC_SITE_URL}/${schemaData.path}/#webpage`
            }
        });
    }

    if (canShowProcession) {
        tabs.push({
            title: <span key={queryYear} className="flex items-center gap-2">Procession List <span className="px-2.5 py-1 text-xs font-medium rounded-full bg-blue-300/10 text-blue-500">{processionData?.length}</span></span>,
            icon: <LuPartyPopper  />,
            content: tabProcessionList(),
        });
    }

    return (
        <MainLayout title={`Puja Details ${queryYear}`} jsonLd={jsonLd}>
            <Section title="Know More about" description={`Puja Details ${queryYear}`}>
                <div className="flex flex-col space-y-6 text-justify mt-2">
                    {dateIsCurrent && (
                        <div className="bg-gradient-to-br from-orange-50 to-yellow-50 rounded-xl p-6 border border-orange-100">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center">
                                    <span className="text-2xl">🎉</span>
                                </div>
                                <h3 className="text-xl font-semibold text-orange-800">Festival Introduction</h3>
                            </div>
                            <p className="text-gray-700 leading-relaxed">
                                Bengalis have a popular saying: "Bangalir baro mashe tero parbon," which translates to "Bengalis
                                celebrate 13 festivals in 12 months." This phrase reflects their boundless enthusiasm for
                                festivals and celebrations. However, the most eagerly awaited festival for the people of
                                Chandannagar, Mankundu and Bhadreswar is undoubtedly Jagadhatri Puja. Typically taking place in
                                November, Jagadhatri Puja is celebrated in Chandannagar, Mankundu and Bhadreswar with
                                unparalleled pomp and grandeur. It stands out as a festival that spans five days, starting with
                                Sashti and continuing through Saptami, Ashtami, Nabami, and culminating on Dashami with the
                                immersion Procession of Goddess Jagadhatri in water, known as "Bisarjan." Also on the day of
                                dashami, the procession of Goddess Jagadhatri is conducted in the city of Chandannagar, which is
                                the 2nd largest after Brazil's city of Rio de Janeiro.
                            </p>
                        </div>
                    )}
                    <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6 border border-purple-100">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center">
                                <span className="text-2xl">✨</span>
                            </div>
                            <h3 className="text-xl font-semibold text-purple-800">Festival Significance</h3>
                        </div>
                        <p className="text-gray-700 leading-relaxed">
                            Jagadhatri Puja, an esteemed festival spanning five vibrant days from Sashti to Dashami, holds a
                            special place in the hearts of devotees. The pinnacle of this celebration typically unfolds on
                            the seventh day. Much like the grandeur of Kolkata's revered Durga Puja and Barasat's cherished
                            Kali Puja, Chandannagar shines brightly for its elaborate and culturally rich Jagadhatri Puja
                            festivities. The city comes alive with colorful decorations, radiant illuminations, and a spirit
                            of devoutness that unites both locals and visitors, fostering an atmosphere steeped in religious
                            significance and communal harmony.
                        </p>
                    </div>
                    {dateIsCurrent && (
                        <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-6 border border-blue-100">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                                    <span className="text-2xl">📅</span>
                                </div>
                                <h3 className="text-xl font-semibold text-blue-800">Festival Schedule</h3>
                            </div>
                            <p className="text-gray-700 leading-relaxed">
                                In {queryYear}, the grand festival of Jagadhatri Puja will be celebrated with immense devotion and splendor beginning on <span className="font-semibold">{format(displayDate, "EEEE, 'the' do 'of' MMMM yyyy")}</span>, which marks the auspicious day of Jagadhatri Puja itself, and the festivities, cultural programs, and rituals will continue in full spirit and grandeur for several consecutive days until <span className="font-semibold">{format(getDateByIndex(siteData?.schedules, 4), "EEEE, 'the' do 'of' MMMM yyyy")}</span>, making this sacred occasion a five-day-long celebration filled with traditional worship, elaborate decorations, vibrant processions, and community gatherings that unite devotees and visitors alike in an atmosphere of joy, faith, and cultural harmony..
                            </p>
                        </div>
                    )}
                </div>
                <div className="mt-6">
                    <Tabs
                        key={queryYear}
                        tabs={tabs} 
                        className="border border-base-300" 
                        tabPanelClassName="bg-gray-50" 
                        tabListClassName="bg-gray-30 border-b border-base-300 pattern-dots w-full"
                        tabClassName={cx(
                            'py-4 px-6 border-b-2 border-transparent bg-gray-50',
                            Object.keys(tabs).length >= 4 && 'w-full'
                        )}
                        tabSelectedClassName="border-b-2 !border-blue-700 bg-white"
                    />
                </div>
                <div className="flex gap-3 text-sm justify-between mt-6">
                    <div className="border rounded-md border-neutral-200">
                        <Link
                            rel="prev"
                            className="bg-gray-50 hover:bg-gray-100 rounded-md px-4 py-3 block text-ellipsis overflow-hidden whitespace-nowrap"
                            href={`/jagadhatri-puja/${queryYear - 1}`}>
                            <LuArrowLeft className="inline-block mr-2 -mt-1" />
                            {queryYear - 1}
                        </Link>
                    </div>
                    <div className="border rounded-md border-neutral-200 text-right">
                        <Link
                            rel="next"
                            className="bg-gray-50 hover:bg-gray-100 rounded-md px-4 py-3 block text-ellipsis overflow-hidden whitespace-nowrap"
                            href={`/jagadhatri-puja/${queryYear + 1}`}>
                            {queryYear + 1}<LuArrowRight className="inline-block ml-2 -mt-1" />
                        </Link>
                    </div>
                </div>
            </Section>
        </MainLayout>
    );
}