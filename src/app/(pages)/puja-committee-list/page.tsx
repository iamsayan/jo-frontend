import { Metadata } from 'next';

import { metadata as metadataSchema } from '@/app/layout';
import Info, { InfoItem } from '@/components/info';
import MainLayout from '@/components/main-layout';
import PujaList from '@/components/puja-list';
import Section from '@/components/section';
import Tabs, { TabProps } from '@/components/tabs';
import type { Puja, PujaExtended } from '@/types';
import { getCollection } from '@/utils/fetch';
import { extendPuja } from '@/utils/functions';
import schema from '@/utils/schema';

import {
  LuAward,
  LuBuilding,
  LuBuilding2,
  LuCrown,
  LuLandmark,
  LuMapPin,
  LuMedal,
  LuUsers,
} from 'react-icons/lu';

export const metadata: Metadata = {
  title: 'Jagadhatri Puja Committee List - Chandannagar, Mankundu & Bhadreswar',
  description:
    'Find verified Jagadhatri Puja committees from Chandannagar, Mankundu, and Bhadreswar — with locations, established years, jubilee celebrations, and contact details for 170+ committees.',
  keywords: [
    'jagadhatri puja committee list',
    'chandannagar puja committee',
    'bhadreswar puja committee',
    'mankundu puja committee list',
    'jagadhatri puja committees chandannagar',
    'puja committee details',
    'chandannagar jagadhatri puja list',
    'puja jubilee list chandannagar',
    'adi puja chandannagar',
    'oldest puja committee chandannagar',
    'CCJPC committee list',
  ],
  openGraph: {
    ...metadataSchema.openGraph,
    url: '/puja-committee-list',
  },
  alternates: {
    canonical: '/puja-committee-list',
  },
};

const getZoneDescription = (zone: PujaExtended['zone']) => {
  switch (zone) {
    case 'chandannagar':
      return {
        title: 'Chandannagar - The Heart of Jagadhatri Puja',
        description:
          "Known as the cultural capital of Jagadhatri Puja, Chandannagar's celebrations date back to the French colonial era. The city is famous for its stunning light decorations (illumination) and artistic excellence in idol making. Each year, thousands of visitors throng the streets to witness the grand celebrations and spectacular immersion procession along the Hooghly riverfront.",
        highlights: [
          {
            icon: <LuBuilding2 className="text-yellow-500" />,
            title: 'Cultural Heritage',
            value: '270+ Years',
          },
          {
            icon: <LuLandmark className="text-rose-500" />,
            title: 'Famous For',
            value: 'Light Art & Illumination',
          },
          {
            icon: <LuBuilding className="text-blue-500" />,
            title: 'Annual Footfall',
            value: '1 Million+',
          },
        ],
      };
    case 'bhadreswar':
      return {
        title: 'Bhadreswar - Preserving Ancient Traditions',
        description:
          'Bhadreswar carries forward the legacy of traditional Jagadhatri Puja with its unique blend of old-world charm and modern celebrations. The area is particularly known for its traditional dhak, cultural programs, and community engagement that brings together people from all walks of life.',
        highlights: [
          {
            icon: <LuBuilding2 className="text-yellow-500" />,
            title: 'Heritage Status',
            value: '150+ Years',
          },
          {
            icon: <LuLandmark className="text-rose-500" />,
            title: 'Known For',
            value: 'Traditional Rituals',
          },
          {
            icon: <LuBuilding className="text-blue-500" />,
            title: 'Community Spirit',
            value: 'United in Faith',
          },
        ],
      };
    default:
      return null;
  }
};

export default async function Page() {
  const { data: pujas = [] } = await getCollection<Puja>('pujas', {
    populate: ['procession', 'images'],
    pagination: {
      page: 1,
      pageSize: 200,
    },
    sort: ['sortOrder:asc'],
  });
  const data: PujaExtended[] = pujas.map((data: Puja) => extendPuja(data));
  const cgr: PujaExtended[] = data.filter(
    (data: PujaExtended) => data.zone === 'chandannagar'
  );
  const bhr: PujaExtended[] = data.filter(
    (data: PujaExtended) => data.zone === 'bhadreswar'
  );

  const tabContent = (zone: PujaExtended[]) => {
    const zoneInfo = getZoneDescription(zone[0].zone);
    const items: InfoItem[] = [
      {
        title: 'Total Committees',
        description: zone.length,
        icon: <LuUsers />,
        variant: 'from-green-500 to-green-300',
      },
      {
        title: 'Jubilee Celebrations',
        description: zone.filter((data: PujaExtended) => data.jubilee === true)
          .length,
        icon: <LuMedal />,
        variant: 'from-rose-500 to-rose-300',
      },
      {
        title: 'Pre Jubilee Celebrations',
        description: zone.filter(
          (data: PujaExtended) => data.preJubilee === true
        ).length,
        icon: <LuAward />,
        variant: 'from-blue-500 to-blue-300',
      },
      {
        title: 'Adi Pujas',
        description: zone.filter(
          (data: Puja) => data.tags.includes('adi') ?? false
        ).length,
        icon: <LuCrown />,
        variant: 'from-purple-500 to-purple-300',
      },
    ];

    return (
      <div className="fl-p-2/5 fl-space-y-3/5 pt-5 text-center">
        {zoneInfo && (
          <div className="fl-p-6/8 relative mb-8 overflow-hidden rounded-xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500">
            <div className="relative flex flex-col gap-8">
              <div className="flex-1">
                <h2 className="fl-text-2xl/3xl mb-4 font-bold text-white">
                  {zoneInfo.title}
                </h2>
                <p className="fl-text-sm/base text-white/90">
                  {zoneInfo.description}
                </p>
              </div>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                {zoneInfo.highlights.map((highlight, index) => (
                  <div
                    key={index}
                    className="rounded-lg bg-white/10 p-4 backdrop-blur-sm"
                  >
                    <div className="flex items-center gap-3">
                      <div className="rounded-full bg-white/10 p-2">
                        {highlight.icon}
                      </div>
                      <div className="text-left">
                        <div className="text-sm text-white/75">
                          {highlight.title}
                        </div>
                        <div className="text-lg font-bold text-white">
                          {highlight.value}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
        <div className="flex flex-col items-center justify-center gap-4 md:flex-row">
          <div className="flex items-center gap-2">
            <div className="h-4 w-4 rounded-full bg-rose-500"></div>
            <span className="text-sm">Jubilee Celebrations</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-4 w-4 rounded-full bg-blue-500"></div>
            <span className="text-sm">Pre Jubilee Celebrations</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-4 w-4 rounded-full bg-purple-500"></div>
            <span className="text-sm">Adi Pujas</span>
          </div>
        </div>
        <Info items={items} />
        <PujaList data={zone} />
        {/* <div className="overflow-x-auto rounded-box border border-base-content/5 bg-base-100">
                    <table className="table text-center table-zebra">
                        <thead>
                            <tr className="bg-blue-100 text-gray-700">
                                <th>Sl. No.</th>
                                <th className="text-left">Puja Committee Name</th>
                                <th>Years</th>
                                <th>Celebrating (in {new Date().getFullYear()})</th>
                                <th>Details</th>
                            </tr>
                        </thead>
                        <tbody>
                            {zone.map((item: Puja, index: number) => {
                                const y = getYear(item.estd);
                                const cel = getCelebrating(y);
                                const adi = item.tags.includes('adi');
                                const popular = item.tags.includes('popular');
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
                                                <span className="text-left hover:text-green-700 transition-colors">{item.name}</span>
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
                                        <td>
                                            <span className="inline-flex items-center justify-center px-2.5 py-1 text-xs font-medium bg-gray-100 rounded-md whitespace-nowrap">
                                                {y}
                                            </span>
                                        </td>
                                        <td><span className={celClass}>{cel}</span></td>
                                        <td>
                                            <Link className="btn btn-ghost btn-xs text-sky-600" href={`/puja/${item.slug}/${item.referenceId}`}>
                                                View <LuChevronRight />
                                            </Link>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div> */}
      </div>
    );
  };

  const tabs: TabProps[] = [
    {
      title: (
        <span key={cgr.length} className="flex items-center gap-2">
          Chandannagar{' '}
          <span className="rounded-full bg-blue-300/10 px-2.5 py-1 text-xs font-medium text-blue-500">
            {cgr.length}
          </span>
        </span>
      ),
      icon: <LuBuilding />,
      content: tabContent(cgr),
    },
    {
      title: (
        <span key={bhr.length} className="flex items-center gap-2">
          Bhadreswar{' '}
          <span className="rounded-full bg-blue-300/10 px-2.5 py-1 text-xs font-medium text-blue-500">
            {bhr.length}
          </span>
        </span>
      ),
      icon: <LuBuilding2 />,
      content: tabContent(bhr),
    },
    {
      title: 'Others',
      icon: <LuMapPin />,
      content: (
        <div className="space-y-3 px-5 py-16 text-center">
          <h3 className="text-2xl font-bold text-gray-800">
            Enlist Your Puja Committee
          </h3>
          <p className="mx-auto max-w-2xl text-gray-600">
            Others puja committees are requested to send their puja info in
            details to us via this email id cgrjagadhatripuja@gmail.com. We will
            add your puja to our website within 24 hours.
          </p>
        </div>
      ),
    },
  ];

  const jsonLd = schema({
    path: 'puja-committee-list',
    title: 'Jagadhatri Puja Committee List',
    type: {
      collection: true,
    },
  });

  return (
    <MainLayout title="Puja Committee List" jsonLd={jsonLd}>
      <Section title="View All Jagadhatri" description="Puja Committee List">
        <div className="flex flex-col gap-6 text-justify">
          <p>
            The number of community pujas in Chandannagar, Bhadreswar and
            Champdany Municipal areas crosses 190 mark. Of these, {data?.length}{' '}
            Puja committees in different localities in Chandannagar and
            Bhadreswar are affiliated to the Chandannagar Central Jagadhatri
            Puja Committee (CCJPC). The Central committee renders all possible
            assistance to its constituents in getting permissions and clearances
            for holding Puja. The immersion procession is really memorable and
            enjoyable sight to witness which lakh of people throng in
            Chandannagar from far and near. The beautiful decorated tall images
            loaded on trucks are taken around the city in a procession.
          </p>
        </div>
        <div className="mt-6">
          <Tabs
            tabs={tabs}
            className="border-base-300 border"
            tabPanelClassName="bg-gray-50"
            tabListClassName="bg-gray-30 border-b border-base-300 pattern-dots"
            tabClassName="py-4 px-6 border-b-2 border-transparent bg-gray-50"
            tabSelectedClassName="border-b-2 !border-blue-700 bg-white"
            forceRenderTabPanel={true}
          />
        </div>
      </Section>
    </MainLayout>
  );
}
