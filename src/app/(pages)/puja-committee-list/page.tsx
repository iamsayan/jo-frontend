import { Metadata } from 'next';
import MainLayout from "@/components/main-layout";
import Section from "@/components/section";
import { getCollection } from "@/utils/fetch";
import Tabs, { TabProps } from '@/components/tabs';
import Info, { InfoItem } from '@/components/info';
import { jubilees, preJubilees, getYear, getCelebrating } from "@/utils/functions";
import schema from "@/utils/schema";
import Link from "next/link";
import { metadata as metadataSchema } from "@/app/layout";
import { 
    LuChevronRight, 
    LuLandmark, 
    LuUsers, 
    LuBuilding, 
    LuBuilding2, 
    LuCrown, 
    LuMedal, 
    LuAward, 
    LuMapPin 
} from "react-icons/lu";
import cx from 'classix';
import { assetImageLoader } from '@/utils/transform';

interface PujaData {
    referenceId: string;
    slug: string;
    name: string;
    zone: string;
    estd: string;
    tags: string[];
    images?: any[];
}

export const metadata: Metadata = {
    title: 'Jagadhatri Puja Committee List',
    description: 'Find verified Jagadhatri Puja committees from Chandannagar, Mankundu, and Bhadreswar with locations, years, and contact details.',
    openGraph: {
        ...metadataSchema.openGraph,
        url: '/puja-committee-list',
    },
    alternates: {
        canonical: '/puja-committee-list',
    },
}

const getZoneDescription = (zone: string) => {
    switch (zone) {
        case 'chandannagar':
            return {
                title: "Chandannagar - The Heart of Jagadhatri Puja",
                description: "Known as the cultural capital of Jagadhatri Puja, Chandannagar's celebrations date back to the French colonial era. The city is famous for its stunning light decorations (illumination) and artistic excellence in idol making. Each year, thousands of visitors throng the streets to witness the grand celebrations and spectacular immersion procession along the Hooghly riverfront.",
                highlights: [
                    { icon: <LuBuilding2 className="text-yellow-500" />, title: "Cultural Heritage", value: "270+ Years" },
                    { icon: <LuLandmark className="text-rose-500" />, title: "Famous For", value: "Light Art & Illumination" },
                    { icon: <LuBuilding className="text-blue-500" />, title: "Annual Footfall", value: "1 Million+" }
                ]
            };
        case 'bhadreswar':
            return {
                title: "Bhadreswar - Preserving Ancient Traditions",
                description: "Bhadreswar carries forward the legacy of traditional Jagadhatri Puja with its unique blend of old-world charm and modern celebrations. The area is particularly known for its traditional dhak, cultural programs, and community engagement that brings together people from all walks of life.",
                highlights: [
                    { icon: <LuBuilding2 className="text-yellow-500" />, title: "Heritage Status", value: "150+ Years" },
                    { icon: <LuLandmark className="text-rose-500" />, title: "Known For", value: "Traditional Rituals" },
                    { icon: <LuBuilding className="text-blue-500" />, title: "Community Spirit", value: "United in Faith" }
                ]
            };
        default:
            return null;
    }
};

export default async function Page() {
    const pujaData = await getCollection('pujas', {
        populate: ['procession', 'images'],
        pagination: {
            page: 1,
            pageSize: 200
        },
        sort: ['order:asc']
    });
    const data = pujaData?.data ?? [];

    const cgr: PujaData[] = data.filter((data: any) => data?.zone === 'chandannagar');
    const bhr: PujaData[] = data.filter((data: any) => data?.zone === 'bhadreswar');

    const filterData = (zone: any, cel: any) => {
        return zone.filter((data: any) => {
            return cel.includes(Number(getYear(data?.estd)));
        });
    }

    const tabContent = (zone: PujaData[]) => {
        const zoneInfo = getZoneDescription(zone[0]?.zone);
        const items: InfoItem[] = [
            {
                title: "Total Committees",
                description: zone.length,
                icon: <LuUsers />,
                variant: "from-green-500 to-green-300"
            },
            {
                title: "Jubilee Celebrations",
                description: filterData(zone, jubilees)?.length,
                icon: <LuMedal />,
                variant: "from-rose-500 to-rose-300"
            },
            {
                title: "Pre Jubilee Celebrations",
                description: filterData(zone, preJubilees)?.length,
                icon: <LuAward />,
                variant: "from-blue-500 to-blue-300"
            },
            {
                title: "Adi Pujas",
                description: zone.filter((data: any) => data?.tags?.includes('adi') ?? false)?.length,
                icon: <LuCrown />,
                variant: "from-purple-500 to-purple-300"
            }
        ]

        return (
            <div className="text-center p-2 pt-5 md:p-5 space-y-3 md:space-y-4 lg:space-y-5">
                {zoneInfo && (
                    <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 p-6 md:p-8 mb-8">
                        <div className="relative flex flex-col gap-8">
                            <div className="flex-1">
                                <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
                                    {zoneInfo.title}
                                </h2>
                                <p className="text-white/90 text-sm md:text-base">
                                    {zoneInfo.description}
                                </p>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                {zoneInfo.highlights.map((highlight, index) => (
                                    <div key={index} className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 rounded-full bg-white/10">
                                                {highlight.icon}
                                            </div>
                                            <div className="text-left">
                                                <div className="text-sm text-white/75">{highlight.title}</div>
                                                <div className="text-lg font-bold text-white">{highlight.value}</div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
                <div className="flex flex-col md:flex-row items-center justify-center gap-4">
                    <div className="flex items-center gap-2">
                        <div className="w-4 h-4 bg-rose-500 rounded-full"></div>
                        <span className="text-sm">Jubilee Celebrations</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
                        <span className="text-sm">Pre Jubilee Celebrations</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-4 h-4 bg-purple-500 rounded-full"></div>
                        <span className="text-sm">Adi Pujas</span>
                    </div>
                </div>
                <Info items={items} />
                <div className="overflow-x-auto rounded-box border border-base-content/5 bg-base-100">
                    <table className="table text-center w-full">
                        <thead>
                            <tr className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
                                <th className="py-4 px-3 text-sm font-semibold rounded-tl-xl">Sl. No.</th>
                                <th className="py-4 px-3 text-sm font-semibold text-left">Puja Committee Name</th>
                                <th className="py-4 px-3 text-sm font-semibold">Years</th>
                                <th className="py-4 px-3 text-sm font-semibold">Celebrating (in {new Date().getFullYear()})</th>
                                <th className="py-4 px-3 text-sm font-semibold rounded-tr-xl">Details</th>
                            </tr>
                        </thead>
                        <tbody>
                            {zone.map((item: PujaData, index: number) => {
                                const y = getYear(item?.estd);
                                const cel = getCelebrating(y);
                                const adi = item?.tags?.includes('adi') ?? false;
                                const popular = item?.tags?.includes('popular') ?? false;
                                const formattedCel = cel.replaceAll(' ', '-').toLowerCase();
                                const celClass = cx(
                                    'px-3 py-1.5 text-xs font-medium rounded-full whitespace-nowrap inline-block',
                                    !formattedCel.includes('pre') && formattedCel.includes('jubilee') && 'bg-rose-100 text-rose-700 border border-rose-200',
                                    formattedCel.includes('pre') && formattedCel.includes('jubilee') && 'bg-blue-100 text-blue-700 border border-blue-200',
                                    !formattedCel.includes('jubilee') && 'bg-gray-100 text-gray-700 border border-gray-200'
                                );
                                const rowClass = cx(
                                    'hover:bg-gray-50 transition-colors border-b border-gray-100 group',
                                    !formattedCel.includes('pre') && formattedCel.includes('jubilee') && 'bg-rose-50/30',
                                    formattedCel.includes('pre') && formattedCel.includes('jubilee') && 'bg-blue-50/30',
                                );
                                const image = item?.images?.[0];
                                return (
                                    <tr key={index} className={rowClass}>
                                        <td className="py-3 px-3">
                                            <span className="inline-flex items-center justify-center size-10 rounded-full bg-gray-100 text-gray-700 font-medium text-sm group-hover:bg-indigo-100 group-hover:text-indigo-700 transition-colors">
                                                {index + 1}
                                            </span>
                                        </td>
                                        <td className="py-3 px-3">
                                            <div className="flex items-center gap-2 whitespace-nowrap">
                                                {/* <div className="avatar">
                                                    <div className="mask mask-squircle size-10">
                                                        <img src={assetImageLoader({
                                                            src: `${image?.year}/${item?.referenceId}/${image?.name}`,
                                                            quality: 30,
                                                            grayscale: true
                                                        })} alt="Avatar Tailwind CSS Component" />
                                                    </div>
                                                </div> */}
                                                <span className="text-left font-medium text-gray-800 group-hover:text-indigo-700 transition-colors">{item?.name}</span>
                                                {(popular || adi) && (
                                                    <div className="flex gap-1">
                                                        {popular && (
                                                            <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-medium text-amber-700 bg-amber-100 border border-amber-200 rounded-full whitespace-nowrap">
                                                                <LuMedal className="text-amber-500" />
                                                                Popular
                                                            </span>
                                                        )}
                                                        {adi && (
                                                            <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-medium text-purple-700 bg-purple-100 border border-purple-200 rounded-full whitespace-nowrap">
                                                                <LuAward className="text-purple-500" />
                                                                Adi Puja
                                                            </span>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        </td>
                                        <td className="py-3 px-3">
                                            <span className="inline-flex items-center justify-center px-3 py-1.5 text-xs font-medium bg-indigo-100 text-indigo-700 border border-indigo-200 rounded-full whitespace-nowrap">
                                                {y}
                                            </span>
                                        </td>
                                        <td className="py-3 px-3"><span className={celClass}>{cel}</span></td>
                                        <td className="py-3 px-3">
                                            <Link className="inline-flex items-center gap-1 px-4 py-1.5 text-xs font-medium text-white bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 rounded-full transition-colors" href={`/puja/${item?.slug}/${item?.referenceId}`}>
                                                View <LuChevronRight className="text-white" />
                                            </Link>
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

    const tabs: TabProps[] = [
        {
            title: <span key={cgr?.length} className="flex items-center gap-2">Chandannagar <span className="px-2.5 py-1 text-xs font-medium rounded-full bg-blue-300/10 text-blue-500">{cgr?.length}</span></span>,
            icon: <LuBuilding />,
            content: tabContent(cgr),
        },
        {
            title: <span key={bhr?.length} className="flex items-center gap-2">Bhadreswar <span className="px-2.5 py-1 text-xs font-medium rounded-full bg-blue-300/10 text-blue-500">{bhr?.length}</span></span>,
            icon: <LuBuilding2 />,
            content: tabContent(bhr),
        },
        {
            title: 'Others',
            icon: <LuMapPin />,
            content: <div className="text-center py-16 px-5 space-y-3">
                <h3 className="text-2xl font-bold text-gray-800">Enlist Your Puja Committee</h3>
                <p className="text-gray-600 max-w-2xl mx-auto">Others puja committees are requested to send their puja info in details to us via this email id cgrjagadhatripuja@gmail.com. We will add your puja to our website within 24 hours.
                </p>
            </div>,
        }
    ];

    const jsonLd = schema({
        path: 'puja-committee-list',
        title: 'Jagadhatri Puja Committee List',
        type: {
            collection: true
        }
    });

    return (
        <MainLayout title="Puja Committee List" jsonLd={jsonLd}>
            <Section title="View All Jagadhatri" description="Puja Committee List">
                <div className="flex flex-col gap-6 text-justify">
                    <p>The number of community pujas in Chandannagar, Bhadreswar and Champdany Municipal areas crosses 190 mark. Of these, {data?.length} Puja committees in different localities in Chandannagar and Bhadreswar are affiliated to the Chandannagar Central Jagadhatri Puja Committee (CCJPC). The Central committee renders all possible assistance to its constituents in getting permissions and clearances for holding Puja. The immersion procession is really memorable and enjoyable sight to witness which lakh of people throng in Chandannagar from far and near. The beautiful decorated tall images loaded on trucks are taken around the city in a procession.</p>
                </div>
                <div className="mt-6">
                    <Tabs
                        tabs={tabs} 
                        className="border border-base-300" 
                        tabPanelClassName="bg-gray-50" 
                        tabListClassName="bg-gray-30 border-b border-base-300 pattern-dots"
                        tabClassName="py-4 px-6 border-b-2 border-transparent bg-gray-50"
                        tabSelectedClassName="border-b-2 !border-blue-700 bg-white"
                    />
                </div>
            </Section>
        </MainLayout>
    );
}