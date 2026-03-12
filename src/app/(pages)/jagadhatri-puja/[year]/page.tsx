import type { Metadata } from 'next';
import Link from 'next/link';

import { metadata as metadataSchema } from '@/app/layout';
import Info, { InfoItem } from '@/components/info';
import MainLayout from '@/components/main-layout';
import Section from '@/components/section';
import Tabs, { TabProps } from '@/components/tabs';
import type {
  GlobalSite,
  PageProps,
  Procession,
  Puja,
  PujaExtended,
  SharedSchedule,
} from '@/types';
import { getCollection, getSingle } from '@/utils/fetch';
import {
  buildGoogleCalendarUrl,
  extendPuja,
  formatDate,
  getDateByIndex,
} from '@/utils/functions';
import schema, { baseUrl } from '@/utils/schema';

import cx from 'classix';
import { format } from 'date-fns';
import {
  LuArrowLeft,
  LuArrowRight,
  LuAward,
  LuBuilding,
  LuBuilding2,
  LuCalendar,
  LuChevronRight,
  LuClock,
  LuCrown,
  LuList,
  LuMedal,
  LuPartyPopper,
  LuPlus,
  LuSun,
  LuTruck,
  LuUsers,
  LuWaves,
} from 'react-icons/lu';

interface Params {
  year: string;
}

export async function generateStaticParams() {
  return Array.from({ length: 100 }, (_, i) => ({
    year: (i + 2000).toString(),
  }));
}

export async function generateMetadata({
  params,
}: PageProps<Params>): Promise<Metadata> {
  const { year } = await params;
  const queryYear = parseInt(year);
  const { data } = await getSingle<GlobalSite>('global', { populate: '*' });
  const displayDate = getDateByIndex(data?.schedules, 0) ?? new Date();
  const dateIsCurrent = queryYear === displayDate.getFullYear();

  return {
    title: `Jagadhatri Puja ${queryYear} Jubilee, Pre Jubilee List${dateIsCurrent ? ', Schedule' : ''} - Chandannagar`,
    description: `Explore the complete Jubilee List${dateIsCurrent ? ', Schedule, Puja Updates' : ''} and latest information about Jagadhatri Puja ${queryYear} — the grand festival of Chandannagar, Mankundu & Bhadreswar.`,
    keywords: [
      `jagadhatri puja ${queryYear}`,
      `chandannagar jagadhatri puja ${queryYear}`,
      `jagadhatri puja jubilee list ${queryYear}`,
      `jagadhatri puja schedule ${queryYear}`,
      `jagadhatri puja dates ${queryYear}`,
      `jagadhatri puja pre jubilee ${queryYear}`,
      'jagadhatri puja chandannagar',
      'chandannagar puja celebrations',
    ],
    openGraph: {
      ...metadataSchema.openGraph,
      url: `/jagadhatri-puja/${queryYear}`,
    },
    alternates: {
      canonical: `/jagadhatri-puja/${queryYear}`,
    },
    pagination: {
      previous: queryYear > 2000 ? `/jagadhatri-puja/${queryYear - 1}` : null,
      next: `/jagadhatri-puja/${queryYear + 1}`,
    },
  };
}

export default async function Page({ params }: PageProps<Params>) {
  const { year } = await params;
  const queryYear = Number(year);

  const [{ data: pujasData = [] }, { data: siteData = null }] =
    await Promise.all([
      getCollection<Puja>('pujas', {
        populate: '*',
        pagination: { page: 1, pageSize: 200 },
        sort: ['sortOrder:asc'],
      }),
      getSingle<GlobalSite>('global', { populate: '*' }),
    ]);

  const pujas: PujaExtended[] = pujasData.map((p: Puja) =>
    extendPuja(p, queryYear)
  );
  const displayDate = getDateByIndex(siteData?.schedules, 0);
  const dateIsCurrent = queryYear === displayDate.getFullYear();
  const jubilee: PujaExtended[] = pujas.filter(
    (data: PujaExtended) => data.jubilee === true
  );
  const prejubilee: PujaExtended[] = pujas.filter(
    (data: PujaExtended) => data.preJubilee === true
  );
  const pujaWithProcessions: PujaExtended[] = pujas
    .filter(
      (data: PujaExtended) => data.procession && data.procession.truckCount > 0
    )
    .sort(
      (a: PujaExtended, b: PujaExtended) =>
        (a?.procession?.sortOrder ?? 0) - (b.procession?.sortOrder ?? 0)
    );

  const tabContent = (puja: PujaExtended[]) => {
    const items: InfoItem[] = [
      {
        title: 'Total Committees',
        description: puja.length,
        icon: <LuUsers />,
        variant: 'from-green-500 to-green-300',
      },
      {
        title: 'Chandannagar',
        description: puja.reduce(
          (acc, p: PujaExtended) => acc + (p.zone === 'chandannagar' ? 1 : 0),
          0
        ),
        icon: <LuBuilding2 />,
        variant: 'from-rose-500 to-rose-300',
      },
      {
        title: 'Bhadreswar',
        description: puja.reduce(
          (acc, p: PujaExtended) => acc + (p.zone === 'bhadreswar' ? 1 : 0),
          0
        ),
        icon: <LuBuilding />,
        variant: 'from-blue-500 to-blue-300',
      },
      {
        title: 'Adi Pujas',
        description: puja.reduce(
          (acc, p: PujaExtended) => acc + (p.adi === true ? 1 : 0),
          0
        ),
        icon: <LuCrown />,
        variant: 'from-purple-500 to-purple-300',
      },
    ];

    return (
      <div className="fl-p-2/5 fl-space-y-3/5 pt-5 text-center">
        <Info items={items} />
        <div className="rounded-box border-base-content/5 bg-base-100 overflow-x-auto border">
          <table className="table-zebra table text-center">
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
              {puja.map((item: PujaExtended, index: number) => {
                const celClass = cx(
                  'px-2.5 py-1 text-xs font-medium rounded-md whitespace-nowrap',
                  item.jubilee && 'bg-rose-300/10 text-rose-700',
                  item.preJubilee && 'bg-blue-300/10 text-blue-500'
                );
                return (
                  <tr key={index} className="row">
                    <td>{index + 1}</td>
                    <td>
                      <div className="flex items-center gap-2 whitespace-nowrap">
                        <span className="text-left transition-colors hover:text-green-700">
                          {item.name}
                        </span>
                        {(item.popular || item.adi) && (
                          <div className="flex gap-1">
                            {item.popular && (
                              <span className="inline-flex items-center gap-1 rounded-md bg-amber-100 px-2 py-0.5 text-[10px] font-medium whitespace-nowrap text-amber-700">
                                <LuMedal className="text-amber-500" />
                                Popular
                              </span>
                            )}
                            {item.adi && (
                              <span className="inline-flex items-center gap-1 rounded-md bg-purple-100 px-2 py-0.5 text-[10px] font-medium whitespace-nowrap text-purple-700">
                                <LuAward className="text-purple-500" />
                                Adi Puja
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    </td>
                    <td>{item.psZone}</td>
                    <td>
                      <span className="inline-flex items-center justify-center rounded-md bg-gray-100 px-2.5 py-1 text-xs font-medium whitespace-nowrap">
                        {item.year}
                      </span>
                    </td>
                    <td>
                      <span className={celClass}>{item.celebrating}</span>
                    </td>
                    {dateIsCurrent && (
                      <td>
                        <Link
                          className="btn btn-ghost btn-xs text-sky-600"
                          href={`/puja/${item.slug}/${item.referenceId}${new Date().getFullYear() !== queryYear ? `?y=${queryYear}` : ''}`}
                        >
                          View <LuChevronRight />
                        </Link>
                      </td>
                    )}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  const tabPujaSchedule = () => {
    const items: InfoItem[] = [
      {
        title: 'Festival Duration',
        description: `${siteData?.schedules?.length ?? 0} Days`,
        icon: <LuClock />,
        variant: 'from-orange-500 to-orange-300',
      },
      {
        title: 'Starting With',
        description: 'Sasthi',
        icon: <LuSun />,
        variant: 'from-blue-500 to-blue-300',
      },
      {
        title: 'Main Puja Day',
        description: 'Nabami',
        icon: <LuPartyPopper />,
        variant: 'from-purple-500 to-purple-300',
      },
      {
        title: 'Ending With',
        description: 'Dashami',
        icon: <LuWaves />,
        variant: 'from-rose-500 to-rose-300',
      },
    ];
    return (
      <div className="fl-p-2/5 fl-space-y-3/5 pt-5 text-center">
        <Info items={items} />
        <div className="rounded-box border-base-content/5 bg-base-100 overflow-x-auto border">
          <table className="table-zebra table text-center">
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
              {siteData?.schedules?.map(
                (item: SharedSchedule, index: number) => {
                  return (
                    <tr key={index} className="row">
                      <td>{index + 1}</td>
                      <td className="whitespace-nowrap text-blue-800">
                        {formatDate(item.date, 'do MMMM yyyy')}
                      </td>
                      <td className="text-gray-600">
                        {formatDate(item.date, 'EEEE')}
                      </td>
                      <td>
                        <span className="rounded-md bg-pink-300/10 px-2.5 py-1 text-sm whitespace-nowrap text-pink-700">
                          {item.event}
                        </span>
                      </td>
                      <td>
                        <a
                          className="btn btn-ghost btn-xs rounded-md bg-gray-100 text-sky-600"
                          target="_blank"
                          href={buildGoogleCalendarUrl(
                            {
                              title: `${item.event} - Jagadhatri Puja ${formatDate(item.date, 'yyyy')}`,
                              location: 'Chandannagar',
                              description: item.description,
                            },
                            item.date,
                            '00:00:00',
                            '23:59:59'
                          )}
                          rel="noopener noreferrer"
                        >
                          <LuPlus /> Add
                        </a>
                      </td>
                    </tr>
                  );
                }
              )}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  const tabProcessionList = () => {
    const totalVehicles =
      pujaWithProcessions.reduce(
        (sum: number, item: PujaExtended) =>
          sum + (parseInt(String(item.procession?.truckCount)) || 0),
        0
      ) || 0;
    const items: InfoItem[] = [
      {
        title: 'Total Procession',
        description: pujaWithProcessions.length,
        icon: <LuUsers />,
        variant: 'from-green-500 to-green-300',
      },
      {
        title: 'Total Vehicles',
        description: totalVehicles,
        icon: <LuTruck />,
        variant: 'from-yellow-500 to-yellow-300',
      },
      {
        title: 'Jubilee Celebrations',
        description: jubilee.length,
        icon: <LuMedal />,
        variant: 'from-rose-500 to-rose-300',
      },
      {
        title: 'Pre Jubilee Celebrations',
        description: prejubilee.length,
        icon: <LuAward />,
        variant: 'from-blue-500 to-blue-300',
      },
    ];
    return (
      <div className="fl-p-2/5 fl-space-y-3/5 pt-5 text-center">
        <Info items={items} />
        <div className="rounded-box border-base-content/5 bg-base-100 overflow-x-auto border">
          <table className="table-zebra table text-center">
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
              {pujaWithProcessions.map((puja: PujaExtended, index: number) => {
                const procession = (puja.procession as Procession) ?? null;
                if (!procession) return null;
                const celClass = cx(
                  'px-2.5 py-1 text-xs font-medium rounded-md whitespace-nowrap',
                  puja.jubilee && 'bg-rose-300/10 text-rose-700',
                  puja.preJubilee && 'bg-blue-300/10 text-blue-500'
                );
                const rowClass = cx(
                  'row',
                  puja.jubilee && 'text-rose-500 font-medium',
                  puja.preJubilee && 'text-blue-500 font-medium'
                );
                return (
                  <tr key={index} className={rowClass}>
                    <td>{index + 1}</td>
                    <td>
                      <div className="flex items-center gap-2 whitespace-nowrap">
                        <span className="text-left transition-colors hover:text-green-700">
                          {puja.name}
                        </span>
                        {(puja.popular || puja.adi) && (
                          <div className="flex gap-1">
                            {puja.popular && (
                              <span className="inline-flex items-center gap-1 rounded-md bg-amber-100 px-2 py-0.5 text-[10px] font-medium whitespace-nowrap text-amber-700">
                                <LuMedal className="text-amber-500" />
                                Popular
                              </span>
                            )}
                            {puja.adi && (
                              <span className="inline-flex items-center gap-1 rounded-md bg-purple-100 px-2 py-0.5 text-[10px] font-medium whitespace-nowrap text-purple-700">
                                <LuAward className="text-purple-500" />
                                Adi Puja
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    </td>
                    <td>
                      {procession.truckCount == 1
                        ? 1
                        : procession?.truckCount -
                          1 +
                          ' + 1 = ' +
                          procession.truckCount}
                    </td>
                    <td>{procession.zone}</td>
                    <td>{puja.year}</td>
                    <td>
                      <span className={celClass}>
                        {puja.celebrating ? puja.celebrating : '-'}
                      </span>
                    </td>
                    <td>{puja.psZone}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  const tabs: TabProps[] = [
    {
      title: (
        <span key={queryYear} className="flex items-center gap-2">
          Jubilee List{' '}
          <span className="rounded-full bg-blue-300/10 px-2.5 py-1 text-xs font-medium text-blue-500">
            {jubilee.length}
          </span>
        </span>
      ),
      icon: <LuList />,
      content: tabContent(jubilee),
    },
    {
      title: (
        <span key={queryYear} className="flex items-center gap-2">
          Pre Jubilee List{' '}
          <span className="rounded-full bg-blue-300/10 px-2.5 py-1 text-xs font-medium text-blue-500">
            {prejubilee.length}
          </span>
        </span>
      ),
      icon: <LuList />,
      content: tabContent(prejubilee),
    },
  ];

  const schemaData = {
    path: `jagadhatri-puja/${queryYear}`,
    title: `Jagadhatri Puja ${queryYear} Jubilee, Pre Jubilee List${dateIsCurrent ? ', Schedule' : ''}`,
    parents: [
      {
        title: 'Jagadhatri Puja Jubilee, Pre Jubilee List, Schedule',
        slug: 'jagadhatri-puja',
      },
    ],
  };
  const jsonLd = schema(schemaData);

  if (dateIsCurrent) {
    tabs.push({
      title: (
        <span key={queryYear} className="flex items-center gap-2">
          Puja Schedule{' '}
          <span className="rounded-full bg-blue-300/10 px-2.5 py-1 text-xs font-medium text-blue-500">
            {queryYear}
          </span>
        </span>
      ),
      icon: <LuCalendar />,
      content: tabPujaSchedule(),
    });

    jsonLd['@graph'].push({
      name: `${schemaData.title} - Jagadhatri Online™ | the #1 Popular Jagadhatri Puja Portal`,
      description: `Jubilee & Pre Jubilee List, Schedule, Puja Updates and Latest Information about Jagadhatri Puja ${queryYear} the great festival of Chandannagar & Bhadreswar.`,
      '@type': 'Event',
      eventStatus: 'https://schema.org/EventScheduled',
      eventAttendanceMode: 'https://schema.org/MixedEventAttendanceMode',
      location: [
        {
          '@type': 'VirtualLocation',
          url: 'https://www.facebook.com/JagadhatriOnlineOfficial',
        },
        {
          '@type': 'Place',
          name: 'Chandannagar',
          url: 'https://en.wikipedia.org/wiki/Chandannagar',
          address: {
            '@type': 'PostalAddress',
            streetAddress: 'Station Road',
            addressLocality: 'Chandannagar',
            addressRegion: 'West Bengal',
            postalCode: '712136',
            addressCountry: 'IN',
          },
        },
      ],
      performer: {
        '@type': 'Organization',
        name: 'Jagadhatri Online',
        sameAs: baseUrl,
      },
      organizer: {
        '@type': 'Organization',
        name: 'Jagadhatri Online',
        url: baseUrl,
      },
      image: `${baseUrl}/og-image.jpg`,
      startDate: format(
        getDateByIndex(siteData?.schedules, 0, '06:00:00'),
        "yyyy-MM-dd'T'HH:mm:ssXXX"
      ),
      endDate: format(
        getDateByIndex(siteData?.schedules, 4, '23:59:59'),
        "yyyy-MM-dd'T'HH:mm:ssXXX"
      ),
      '@id': `${baseUrl}/${schemaData.path}/#schema-${queryYear}`, // ensure unique ID
      inLanguage: 'en-IN',
      mainEntityOfPage: {
        '@id': `${baseUrl}/${schemaData.path}/#webpage`,
      },
    });
  }

  if (siteData?.processionListPublished && pujaWithProcessions) {
    tabs.push({
      title: (
        <span key={queryYear} className="flex items-center gap-2">
          Procession List{' '}
          <span className="rounded-full bg-blue-300/10 px-2.5 py-1 text-xs font-medium text-blue-500">
            {pujaWithProcessions.length}
          </span>
        </span>
      ),
      icon: <LuPartyPopper />,
      content: tabProcessionList(),
    });
  }

  return (
    <MainLayout title={`Puja Details ${queryYear}`} jsonLd={jsonLd}>
      <Section
        title="Know More about"
        description={`Puja Details ${queryYear}`}
      >
        <div className="mt-2 flex flex-col space-y-6 text-justify">
          {dateIsCurrent && (
            <div className="rounded-xl border border-orange-100 bg-gradient-to-br from-orange-50 to-yellow-50 p-6">
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-orange-100">
                  <span className="text-2xl">🎉</span>
                </div>
                <h3 className="text-xl font-semibold text-orange-800">
                  Festival Introduction
                </h3>
              </div>
              <p className="leading-relaxed text-gray-700">
                Bengalis have a popular saying: "Bangalir baro mashe tero
                parbon," which translates to "Bengalis celebrate 13 festivals in
                12 months." This phrase reflects their boundless enthusiasm for
                festivals and celebrations. However, the most eagerly awaited
                festival for the people of Chandannagar, Mankundu and Bhadreswar
                is undoubtedly Jagadhatri Puja. Typically taking place in
                November, Jagadhatri Puja is celebrated in Chandannagar,
                Mankundu and Bhadreswar with unparalleled pomp and grandeur. It
                stands out as a festival that spans five days, starting with
                Sashti and continuing through Saptami, Ashtami, Nabami, and
                culminating on Dashami with the immersion Procession of Goddess
                Jagadhatri in water, known as "Bisarjan." Also on the day of
                dashami, the procession of Goddess Jagadhatri is conducted in
                the city of Chandannagar, which is the 2nd largest after
                Brazil's city of Rio de Janeiro.
              </p>
            </div>
          )}
          <div className="rounded-xl border border-purple-100 bg-gradient-to-br from-purple-50 to-pink-50 p-6">
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-purple-100">
                <span className="text-2xl">✨</span>
              </div>
              <h3 className="text-xl font-semibold text-purple-800">
                Festival Significance
              </h3>
            </div>
            <p className="leading-relaxed text-gray-700">
              Jagadhatri Puja, an esteemed festival spanning five vibrant days
              from Sashti to Dashami, holds a special place in the hearts of
              devotees. The pinnacle of this celebration typically unfolds on
              the seventh day. Much like the grandeur of Kolkata's revered Durga
              Puja and Barasat's cherished Kali Puja, Chandannagar shines
              brightly for its elaborate and culturally rich Jagadhatri Puja
              festivities. The city comes alive with colorful decorations,
              radiant illuminations, and a spirit of devoutness that unites both
              locals and visitors, fostering an atmosphere steeped in religious
              significance and communal harmony.
            </p>
          </div>
          {dateIsCurrent && (
            <div className="rounded-xl border border-blue-100 bg-gradient-to-br from-blue-50 to-cyan-50 p-6">
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
                  <span className="text-2xl">📅</span>
                </div>
                <h3 className="text-xl font-semibold text-blue-800">
                  Festival Schedule
                </h3>
              </div>
              <p className="leading-relaxed text-gray-700">
                In {queryYear}, the grand festival of Jagadhatri Puja will be
                celebrated with immense devotion and splendor beginning on{' '}
                <span className="font-semibold">
                  {format(displayDate, "EEEE, 'the' do 'of' MMMM yyyy")}
                </span>
                , which marks the auspicious day of Jagadhatri Puja itself, and
                the festivities, cultural programs, and rituals will continue in
                full spirit and grandeur for several consecutive days until{' '}
                <span className="font-semibold">
                  {format(
                    getDateByIndex(siteData?.schedules, 4),
                    "EEEE, 'the' do 'of' MMMM yyyy"
                  )}
                </span>
                , making this sacred occasion a five-day-long celebration filled
                with traditional worship, elaborate decorations, vibrant
                processions, and community gatherings that unite devotees and
                visitors alike in an atmosphere of joy, faith, and cultural
                harmony..
              </p>
            </div>
          )}
        </div>
        <div className="mt-6">
          <Tabs
            key={queryYear}
            tabs={tabs}
            className="border-base-300 border"
            tabPanelClassName="bg-gray-50"
            tabListClassName="bg-gray-30 border-b border-base-300 pattern-dots w-full"
            tabClassName={cx(
              'py-4 px-6 border-b-2 border-transparent bg-gray-50',
              Object.keys(tabs).length >= 4 && 'w-full'
            )}
            tabSelectedClassName="border-b-2 !border-blue-700 bg-white"
          />
        </div>
        <div className="mt-6 flex justify-between gap-3 text-sm">
          <div className="rounded-md border border-neutral-200">
            <Link
              rel="prev"
              className="block overflow-hidden rounded-md bg-gray-50 px-4 py-3 text-ellipsis whitespace-nowrap hover:bg-gray-100"
              href={`/jagadhatri-puja/${queryYear - 1}`}
            >
              <LuArrowLeft className="-mt-1 mr-2 inline-block" />
              {queryYear - 1}
            </Link>
          </div>
          <div className="rounded-md border border-neutral-200 text-right">
            <Link
              rel="next"
              className="block overflow-hidden rounded-md bg-gray-50 px-4 py-3 text-ellipsis whitespace-nowrap hover:bg-gray-100"
              href={`/jagadhatri-puja/${queryYear + 1}`}
            >
              {queryYear + 1}
              <LuArrowRight className="-mt-1 ml-2 inline-block" />
            </Link>
          </div>
        </div>
      </Section>
    </MainLayout>
  );
}
