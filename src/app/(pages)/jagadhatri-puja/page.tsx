import type { Metadata } from 'next'
import Link from 'next/link';
import MainLayout from '@/components/main-layout';
import Section from '@/components/section';
import { cms } from '@/lib/cms';
import schema from "@/utils/schema";
import { metadata as metadataSchema } from "@/app/layout";
import { LuCalendar, LuHistory, LuMapPin, LuUsers } from 'react-icons/lu';
import Info from '@/components/info';
import { getDateByIndex } from '@/utils/functions';
import type { APIResponse, Global } from '@/types';

const globalClient = cms.tag('global').single('global');
   
export const metadata: Metadata = {
    title: 'Jagadhatri Puja Jubilee, Pre Jubilee List, Schedule',
    description: 'Learn about the Jagadhatri Puja traditions in Chandannagar and Mankundu, with extended coverage of Bhadreswar’s growing celebrations.',
    openGraph: {
        ...metadataSchema.openGraph,
        url: '/jagadhatri-puja',
    },
    alternates: {
        canonical: '/jagadhatri-puja',
    },
};

export default async function Page() {
    const siteData = await globalClient.find({
        populate: '*',
    }) as APIResponse<Global>;
    const data: Global = siteData.data ?? null;

    const uptoYear = getDateByIndex(data.schedules, 0).getFullYear();
    const yearsArray: number[] = [];

    for (let year = uptoYear - 12; year <= uptoYear - 1; year++) {
        yearsArray.push(year);
    }
    yearsArray.reverse();

    const jsonLd = schema({
        path: 'jagadhatri-puja',
        title: 'Jagadhatri Puja Jubilee, Pre Jubilee List, Schedule',
        type: {
            collection: true
        }
    });

    const infoCards = [
        {
            icon: <LuCalendar />,
            title: "Duration",
            description: "5 Days Festival",
            variant: "from-orange-600 to-yellow-500 rounded-xl"
        },
        {
            icon: <LuHistory />,
            title: "History",
            description: "350+ Years",
            variant: "from-blue-600 to-blue-400 rounded-xl"
        },
        {
            icon: <LuMapPin />,
            title: "Location",
            description: "Chandannagar",
            variant: "from-green-600 to-green-400 rounded-xl"
        },
        {
            icon: <LuUsers />,
            title: "Participants",
            description: "177+ Committees",
            variant: "from-purple-600 to-purple-400 rounded-xl"
        }
    ];

    return (
        <MainLayout title="Puja Schedule" jsonLd={jsonLd}>
            <Section title="Know More About" description="Puja Schedule">
                <div className="flex flex-col gap-6 mt-5">
                    <Info items={infoCards} />
                    <div className="flex flex-col gap-6 text-justify">
                        <div className="space-y-2">
                            <p className="text-gray-600 leading-relaxed">
                                Jagadhatri Puja, an esteemed festival in certain regions, extends across five joyous days,
                                commencing from Sasthi and culminating on Dashami. The main observance traditionally takes place
                                on the seventh day of the festivities. Much akin to the grandeur of Kolkata's revered Durga Puja
                                and Barasat's revered Kali Puja, Chandannagar stands out for its opulent celebrations and
                                cultural exuberance during the Jagadhatri Puja. The city comes alive with vibrant decorations,
                                illuminations, and fervent devotional activities, attracting both locals and visitors alike,
                                creating an atmosphere of religious significance and communal harmony.
                            </p>
                            <p className="text-gray-600 leading-relaxed">
                                In Chandannagar, Jagadhatri puja is celebrated as the annual festival of its own, surpassing the
                                grandeur of Durga Puja. Acclaimed for its show of lights, during the four days of the Puja the
                                entire town decks up beautifully as food stalls dot its streets and people throng to the
                                pandals. On the last day of Dashami, all the effigies are paraded throughout the town in a
                                night-long procession as the town showcases its skillful craftsmanship of lights and boasts its
                                age-old tradition. The entire town celebrates for five days as monotonous every day routine
                                comes to a halt. As birds turn to their nests when darkness kisses the ground, similarly the
                                town beckons to all who have grown up in its nooks and crannies and migrated to different parts
                                of the country or outside. During these four days as people return to their hometown to
                                celebrate with their loved ones, the entire town state lights up in the warmth and glow of
                                shared joy.
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center justify-center mt-3">
                        <Link 
                            href={`/jagadhatri-puja/${uptoYear}`}
                            className="inline-flex items-center gap-2 bg-gradient-to-r from-yellow-500 to-yellow-600 text-white font-semibold py-4 px-8 rounded-lg hover:from-yellow-600 hover:to-yellow-700 transition-all"
                        >
                            <LuCalendar className="text-xl" />
                            View Jagadhatri Puja {uptoYear} Details
                        </Link>
                    </div>

                    {/* Archive Section */}
                    <div className="flex flex-col gap-8 bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-8">
                        <div className="text-center">
                            <h2 className="text-2xl font-bold text-gray-800 mb-2">Previous Years Archive</h2>
                            <p className="text-gray-600">Explore our comprehensive collection of past celebrations</p>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-12 gap-3">
                            {yearsArray.map((year, index) => (
                                <Link 
                                    key={index} 
                                    href={`/jagadhatri-puja/${year}`}
                                    className="group relative bg-white p-4 text-center rounded-xl border border-gray-200 font-medium text-gray-700 hover:border-yellow-500 transition-all duration-200 overflow-hidden"
                                >
                                    <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/10 to-yellow-600/10 transform translate-y-full group-hover:translate-y-0 transition-transform"></div>
                                    <span className="relative z-10 group-hover:text-yellow-700">{year}</span>
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
            </Section>
        </MainLayout>
    );
}
