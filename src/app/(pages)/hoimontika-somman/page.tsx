import { metadata as metadataSchema } from '@/app/layout';
import MainLayout from '@/components/main-layout';
import Section from '@/components/section';
import Tabs, { TabProps } from '@/components/tabs';
import type { Award, AwardsCategory, AwardsPosition, Puja } from '@/types';
import { getCollection } from '@/utils/fetch';
import schema from '@/utils/schema';
import type { Metadata } from 'next';
import Link from 'next/link';
import { createElement } from 'react';
import {
  LuAward,
  LuHistory,
  LuLightbulb,
  LuMedal,
  LuRibbon,
  LuStar,
  LuTrophy,
  LuUsers,
} from 'react-icons/lu';

export const metadata: Metadata = {
  title: 'Amie Srestho Hoimantika Somman - Jagadhatri Puja Awards Chandannagar',
  description:
    'The Amie Srestho Hoimantika Somman is a prestigious award celebrating creativity and craftsmanship during Jagadhatri Puja in Chandannagar since 2016 — honoring the best pandals, idols, decoration, and themes.',
  keywords: [
    'hoimantika somman',
    'amie srestho award',
    'jagadhatri puja awards',
    'chandannagar puja awards',
    'best jagadhatri puja pandal award',
    'jagadhatri puja competition',
    'chandannagar puja decoration award',
    'jagadhatri puja idol award',
    'best puja chandannagar',
  ],
  openGraph: {
    ...metadataSchema.openGraph,
    url: '/hoimontika-somman',
  },
  alternates: {
    canonical: '/hoimontika-somman',
  },
};

const getPositionStyle = (position: string) => {
  switch (position) {
    case 'First':
      return { icon: LuTrophy, color: 'text-yellow-500' };
    case 'Second':
      return { icon: LuMedal, color: 'text-emerald-500' };
    case 'Third':
      return { icon: LuAward, color: 'text-amber-700' };
    case 'Ononnyo':
      return { icon: LuStar, color: 'text-blue-600' };
    default:
      return { icon: LuRibbon, color: 'text-indigo-500' };
  }
};

export default async function Page() {
  const { data: awards = [] } = await getCollection<Award>('awards', {
    sort: ['year:desc'],
    populate: [
      'categories',
      'categories.positions',
      'categories.positions.pujas',
      'categories.positions.artist',
    ],
  });

  const tabs: TabProps[] = [];

  const tabContent = (award: Award) => {
    return (
      <div className="p-4">
        {award.description && (
          <p className="mb-4 text-center text-gray-500">{award.description}</p>
        )}
        {award.categories && award.categories.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {award.categories.map((category: AwardsCategory, idx: number) => (
              <div
                key={idx}
                className="group flex gap-5 rounded-xl border border-neutral-200 bg-gradient-to-br from-white to-neutral-50 transition-all delay-300 duration-300 ease-in-out hover:scale-105 hover:shadow-lg"
              >
                <div className="fl-w-8/12 flex items-center justify-center border-r border-neutral-200 px-2 py-6">
                  <h3 className="writing-mode-vertical -rotate-180 transform font-bold text-gray-800 md:text-lg">
                    {category.category}
                  </h3>
                </div>

                <div className="flex flex-col gap-3 py-4 pr-4">
                  {category.positions &&
                    category.positions.map(
                      (position: AwardsPosition, posIdx: number) => (
                        <div key={posIdx}>
                          <div
                            className={`flex items-center gap-2 ${getPositionStyle(position.position || '').color} mb-1 font-semibold`}
                          >
                            {createElement(
                              getPositionStyle(position.position || '').icon,
                              {
                                className: 'text-lg',
                              }
                            )}
                            {position.position || ''}
                          </div>
                          {position.pujas?.map(
                            (puja: Puja, pujaIdx: number) => (
                              <div key={pujaIdx} className="pl-6 text-gray-700">
                                &bull;{' '}
                                <Link
                                  href={`/puja/${puja.slug}/${puja.referenceId}`}
                                >
                                  {puja.name}
                                </Link>
                              </div>
                            )
                          )}
                          {position.artist && (
                            <div className="pl-6 text-gray-700">
                              &bull; {position.artist.name}
                            </div>
                          )}
                        </div>
                      )
                    )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500">
            No competition was organized this year.
          </p>
        )}
      </div>
    );
  };

  awards.forEach((award: Award) => {
    const totalAwards =
      award.categories?.reduce((total: number, category: AwardsCategory) => {
        return (
          total +
          (category.positions?.reduce(
            (posTotal: number, position: AwardsPosition) => {
              return (
                posTotal +
                (position.pujas?.length || 0) +
                (position.artist ? 1 : 0)
              );
            },
            0
          ) || 0)
        );
      }, 0) || 0;

    tabs.push({
      title: (
        <span key={award.year} className="flex items-center gap-2">
          {award.year}
          <span className="rounded-full bg-blue-300/10 px-2.5 py-1 text-xs font-medium text-blue-500">
            {totalAwards}
          </span>
        </span>
      ),
      icon: <LuTrophy />,
      content: tabContent(award),
    });
  });

  const jsonLd = schema({
    path: 'hoimontika-somman',
    title: 'Amie Srestho Hoimantika Somman',
  });

  return (
    <MainLayout title="Hoimantika Somman" jsonLd={jsonLd}>
      <Section
        title="Know More About Amie Srestho"
        description="Hoimantika Somman"
      >
        <div className="flex flex-col gap-6 text-justify">
          <p>
            The Amie Srestho Hoimantika Somman is a prestigious award that has
            been celebrating creativity and craftsmanship during Jagadhatri Puja
            in Chandannagar since 2016. It is one of the most significant awards
            given to the best pandals across the city, recognizing excellence in
            various aspects such as decoration, theme, and artistry.
          </p>
          <p>
            The awards have contributed to a shift in how Jagadhatri Puja is
            celebrated in Chandannagar, Mankundu and Bhadreswar, emphasizing
            artistic and cultural innovation in the creation of pandals and
            idols. The initiative has not only become an integral part of
            Chandannagar's Jagadhatri Puja traditions but also reflects the
            evolving cultural landscape of the festival. Each year, the awards
            are judged by a panel of eminent personalities from various fields
            such as art, literature, and cinema. Winners receive a unique
            statuette, which has evolved in design over the years, symbolizing
            the honor and prestige of the award.
          </p>
          <p>
            In this year, the Hoimantika Somman continues to uphold its legacy,
            with pandals across Chandannagar striving to win in categories like
            Best Puja, Creative Excellence, and Best Artisan, among others
          </p>
          <div className="fl-gap-4/6 grid md:grid-cols-3">
            <div className="fl-p-4/6 flex transform items-start rounded-xl border border-gray-200 bg-white/90 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1">
              <LuTrophy className="mt-1 shrink-0 text-3xl text-yellow-500" />
              <div className="ml-4">
                <h3 className="fl-text-lg/xl fl-mb-1/2 font-bold">
                  Prestigious Award
                </h3>
                <p className="text-gray-600">
                  Celebrating creativity and craftsmanship since 2016.
                </p>
              </div>
            </div>
            <div className="fl-p-4/6 flex transform items-start rounded-xl border border-gray-200 bg-white/90 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1">
              <LuUsers className="mt-1 shrink-0 text-3xl text-yellow-500" />
              <div className="ml-4">
                <h3 className="fl-text-lg/xl fl-mb-1/2 font-bold">
                  Expert Panel
                </h3>
                <p className="text-gray-600">
                  Judged by eminent personalities from various fields.
                </p>
              </div>
            </div>
            <div className="fl-p-4/6 flex transform items-start rounded-xl border border-gray-200 bg-white/90 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1">
              <LuLightbulb className="mt-1 shrink-0 text-3xl text-yellow-500" />
              <div className="ml-4">
                <h3 className="fl-text-lg/xl fl-mb-1/2 font-bold">
                  Innovation
                </h3>
                <p className="text-gray-600">
                  Promoting artistic and cultural excellence.
                </p>
              </div>
            </div>
          </div>
          <div className="fl-gap-4/6 flex flex-col">
            <h2 className="flex items-center justify-center gap-2 text-center text-2xl font-bold">
              <LuHistory className="text-yellow-500" />
              Archives
            </h2>
            <Tabs
              tabs={tabs}
              className="border-base-300 border"
              tabPanelClassName="bg-gray-50"
              tabListClassName="bg-gray-30 border-b border-base-300 pattern-dots"
              tabClassName="py-4 px-6 border-b-2 border-transparent bg-gray-50 w-full"
              tabSelectedClassName="border-b-2 !border-blue-700 bg-white"
            />
          </div>
        </div>
      </Section>
    </MainLayout>
  );
}
