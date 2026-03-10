import { metadata as metadataSchema } from '@/app/layout';
import Breadcrumbs from '@/components/breadcrumbs';
import PujaCountdown from '@/components/puja-countdown';

import LeafletMap from '@/components/leaflet-map';
import Main from '@/components/main';
import Markdown from '@/components/markdown';
import PujaGallery from '@/components/puja-gallery';
import RemoteImage from '@/components/remote-image';
import ShareBar from '@/components/share-bar';
import type {
  Artist,
  GlobalSite,
  Image,
  PageProps,
  Puja,
  PujaExtended,
  SharedLink,
} from '@/types';
import { getCollection, getSingle } from '@/utils/fetch';
import {
  capitalizeFirst,
  cn,
  extendPuja,
  getDateByIndex,
  stripHtmlAndLimit,
} from '@/utils/functions';
import schema, { baseUrl } from '@/utils/schema';
import imageUrl from '@/utils/transform';
import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound, permanentRedirect } from 'next/navigation';
import {
  FaFacebook,
  FaGlobe,
  FaInstagram,
  FaThreads,
  FaXTwitter,
  FaYoutube,
} from 'react-icons/fa6';
import {
  LuArrowLeft,
  LuArrowRight,
  LuBook,
  LuBrush,
  LuBuilding,
  LuCalendar,
  LuCrown,
  LuGem,
  LuHistory,
  LuImages,
  LuLightbulb,
  LuMail,
  LuMapPin,
  LuPalette,
  LuPartyPopper,
  LuPencil,
  LuPhone,
  LuSparkles,
  LuTruck,
} from 'react-icons/lu';
import { format } from 'date-fns';

interface Params {
  slug: string;
  id: string;
}

export async function generateStaticParams() {
  const { data = [] } = await getCollection<Puja>('pujas', {
    pagination: { page: 1, pageSize: 200 },
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
    pagination: { page: 1, pageSize: 200 },
  });
  const currentPuja = pujas.find((item: Puja) => item.referenceId === id);

  return {
    title: `${currentPuja?.name} Sarbajanin, ${currentPuja?.zone === 'bhadreswar' ? 'Bhadreswar' : 'Chandannagar'} - Jagadhatri Puja`,
    description: stripHtmlAndLimit(currentPuja?.info ?? ''),
    keywords: [
      `${currentPuja?.name?.toLowerCase()} sarbajanin`,
      `${currentPuja?.name?.toLowerCase()} jagadhatri puja`,
      `${currentPuja?.name?.toLowerCase()} puja committee`,
      `jagadhatri puja ${currentPuja?.zone === 'bhadreswar' ? 'bhadreswar' : 'chandannagar'}`,
      'jagadhatri puja committee details',
      'chandannagar puja pandal',
    ],
    openGraph: {
      ...metadataSchema.openGraph,
      url: `/puja/${slug}/${id}`,
      images: currentPuja?.images?.slice(0, 3).map((item: Image) => ({
        url: imageUrl(`${item.year}/${currentPuja?.referenceId}/${item.name}`, {
          tquality: 60,
        }),
        alt: currentPuja?.name ?? '',
      })),
    },
    alternates: {
      canonical:
        currentPuja?.links?.find((link: SharedLink) => link.title === 'website')
          ?.url ?? `/puja/${slug}/${id}`,
    },
  };
}

export default async function Page({ params }: PageProps<Params>) {
  const { slug, id } = await params;
  const queryYear = new Date().getFullYear();

  const [{ data: pujasData = [] }, { data: siteData = null }] =
    await Promise.all([
      getCollection<Puja>('pujas', {
        populate: '*',
        pagination: { page: 1, pageSize: 200 },
        sort: ['sortOrder:asc'],
      }),
      getSingle<GlobalSite>('global', { populate: '*' }),
    ]);

  const pujas: PujaExtended[] = pujasData.map((p) => extendPuja(p, queryYear));
  const currentPuja = pujas.find(
    (item: PujaExtended) => item.referenceId === id
  );
  if (!currentPuja) notFound();
  if (slug !== currentPuja.slug)
    permanentRedirect(`/puja/${currentPuja.slug}/${currentPuja.referenceId}`);

  const pujaImages = currentPuja?.images?.map((item: Image) => ({
    src: `${item?.year}/${currentPuja.referenceId}/${item.name}`,
    thumb: `${item?.year}/${currentPuja.referenceId}/${item.name}`,
    alt: currentPuja.name,
    subHtml: `<p>By: ${capitalizeFirst(item?.uploadedBy)}</p>`,
  }));

  const heroImage = currentPuja?.images?.[0];
  const hasHeroImage = !!heroImage;
  const hasCoordinates =
    !!currentPuja.location?.coordinates?.lat &&
    !!currentPuja.location?.coordinates?.lng;
  const contactEmail = currentPuja.links?.find(
    (l: SharedLink) => l.title === 'email'
  )?.url;
  const contactPhone = currentPuja.links?.find(
    (l: SharedLink) => l.title === 'phone'
  )?.url;

  const placeholderTags = [
    'Jagadhatri Puja',
    currentPuja.zone === 'bhadreswar' ? 'Bhadreswar' : 'Chandannagar',
    currentPuja.adi ? 'Adi Puja' : 'Traditional',
    currentPuja.popular ? 'Popular' : null,
    currentPuja.celebrating || null,
    currentPuja.theme ? `Theme: ${currentPuja.theme}` : null,
    'West Bengal',
    'Hooghly',
    currentPuja.procession ? 'Procession Participant' : null,
  ].filter(Boolean) as string[];

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
      icon: <LuBrush className="text-lg text-purple-500" />,
      title: 'Idol Artist',
    },
    {
      type: 'decoration',
      icon: <LuPalette className="text-lg text-pink-500" />,
      title: 'Decoration Artist',
    },
    {
      type: 'light',
      icon: <LuLightbulb className="text-lg text-amber-500" />,
      title: 'Lighting Artist',
    },
    {
      type: 'theme',
      icon: <LuPencil className="text-lg text-indigo-500" />,
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
    {}
  );
  const info = [
    {
      icon: <LuPencil className="text-lg text-purple-500" />,
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
    { type: 'facebook', icon: FaFacebook },
    { type: 'instagram', icon: FaInstagram },
    { type: 'youtube', icon: FaYoutube },
    { type: 'x', icon: FaXTwitter },
    { type: 'threads', icon: FaThreads },
    { type: 'website', icon: FaGlobe },
  ]
    .map((item) => ({
      ...item,
      link:
        currentPuja.links?.find((link: SharedLink) => link.title === item.type)
          ?.url ?? '#',
    }))
    .filter((item) => item.link !== '#');

  const schemaData = {
    path: `puja/${currentPuja.slug}/${currentPuja.referenceId}`,
    title: `Details of ${currentPuja.name} Sarbajanin`,
    parents: [
      { title: 'Jagadhatri Puja Committee List', slug: 'puja-committee-list' },
    ],
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
      ...(hasCoordinates
        ? {
            geo: {
              '@type': 'GeoCoordinates',
              latitude: currentPuja.location!.coordinates!.lat,
              longitude: currentPuja.location!.coordinates!.lng,
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
      ? { image: pujaImages?.map((item) => imageUrl(item.src)) }
      : {}),
    startDate: `${format(getDateByIndex(siteData?.schedules, 0, '06:00:00'), "yyyy-MM-dd'T'HH:mm:ssXXX")}`,
    endDate: `${format(getDateByIndex(siteData?.schedules, 4, '23:59:59'), "yyyy-MM-dd'T'HH:mm:ssXXX")}`,
    '@id': `${baseUrl}/${schemaData.path}/#schema-${currentPuja.ccjpcId}`,
    inLanguage: 'en-IN',
    mainEntityOfPage: { '@id': `${baseUrl}/${schemaData.path}/#webpage` },
  });

  /* ───────────────────────── RENDER ───────────────────────── */
  return (
    <Main jsonLd={jsonLd}>
      {/* ══════ HERO ══════ */}
      <header className="relative flex w-full items-center justify-center overflow-hidden pt-28 pb-32 md:min-h-[88vh] md:pt-36 md:pb-40">
        {/* BG */}
        <div className="absolute inset-0 -z-10" aria-hidden="true">
          {hasHeroImage ? (
            <>
              <RemoteImage
                src={`${heroImage.year}/${currentPuja.referenceId}/${heroImage.name}`}
                alt=""
                fill
                className="object-cover"
                quality={40}
                lazy={false}
                loaderPlaceholder={false}
              />
              <div className="absolute inset-0 bg-gradient-to-b from-black/75 via-black/55 to-[#0f0a1e]/95" />
            </>
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-[#1a0e3e] via-[#12082d] to-[#2e0c2b]">
              <div className="pattern-mandala absolute inset-0" />
              <div
                className="absolute inset-0 opacity-[.07]"
                style={{
                  backgroundImage: `repeating-linear-gradient(45deg, rgba(255,223,186,0.15) 0px, rgba(255,223,186,0.15) 1px, transparent 1px, transparent 8px),
                  repeating-linear-gradient(-45deg, rgba(255,223,186,0.15) 0px, rgba(255,223,186,0.15) 1px, transparent 1px, transparent 8px)`,
                  backgroundSize: '16px 16px',
                }}
              />
            </div>
          )}
          {/* Blobs */}
          <div className="animate-blob absolute -top-40 -right-40 h-[500px] w-[500px] rounded-full bg-purple-600/15 mix-blend-screen blur-3xl" />
          <div
            className="animate-blob absolute -bottom-32 -left-32 h-[400px] w-[400px] rounded-full bg-amber-500/10 mix-blend-screen blur-3xl"
            style={{ animationDelay: '3s' }}
          />
        </div>

        {/* Content */}
        <div className="relative container mx-auto w-full px-4 sm:px-6">
          <div className="flex flex-col items-center text-center">
            <nav aria-label="Breadcrumb" className="mb-6">
              <Breadcrumbs
                breadcrumbTitle={currentPuja?.name}
                className="text-white/80 capitalize"
                end={-1}
              />
            </nav>

            <h1 className="fl-text-4xl/7xl mb-3 font-extrabold tracking-tight text-white drop-shadow-2xl">
              {currentPuja.name}
            </h1>

            {/* Badges row */}
            <div className="mb-6 flex flex-wrap items-center justify-center gap-2">
              {currentPuja.popular && (
                <span className="inline-flex items-center gap-1.5 rounded-full border border-yellow-400/30 bg-yellow-400/15 px-3 py-1 text-xs font-semibold text-yellow-300 backdrop-blur-sm">
                  <LuSparkles className="h-3.5 w-3.5" /> Popular
                </span>
              )}
              {currentPuja.adi && (
                <span className="inline-flex items-center gap-1.5 rounded-full border border-purple-400/30 bg-purple-400/15 px-3 py-1 text-xs font-semibold text-purple-300 backdrop-blur-sm">
                  <LuCrown className="h-3.5 w-3.5" /> Adi Puja
                </span>
              )}
              {currentPuja.celebrating && (
                <span className="animate-glow-pulse inline-flex items-center gap-1.5 rounded-full border border-amber-400/40 bg-amber-400/20 px-3 py-1 text-xs font-semibold text-amber-200 backdrop-blur-sm">
                  <LuGem className="h-3.5 w-3.5" /> {currentPuja.celebrating}
                </span>
              )}
            </div>

            {/* Address pill */}
            <a
              href={gMapLink}
              target="_blank"
              rel="noopener noreferrer"
              className="mb-8 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[.07] px-5 py-2 text-sm text-white/80 backdrop-blur-md transition-colors hover:bg-white/[.12] hover:text-white"
            >
              <LuMapPin className="h-3.5 w-3.5 text-amber-300" />
              <span className="line-clamp-1">{currentPuja.address}</span>
            </a>

            {/* 4 Stat Cards */}
            <div className="mb-8 grid w-full max-w-2xl grid-cols-2 gap-3 sm:grid-cols-4">
              {[
                {
                  icon: <LuHistory className="h-5 w-5" />,
                  val: currentPuja.year || '300+',
                  lbl:
                    currentPuja.adi || Number(currentPuja.year) >= 50
                      ? 'Legacy'
                      : 'Tradition',
                },
                {
                  icon: <LuCalendar className="h-5 w-5" />,
                  val: currentPuja.estd === 0 ? 'N/A' : currentPuja.estd,
                  lbl: 'Established',
                },
                {
                  icon: <LuCrown className="h-5 w-5" />,
                  val: currentPuja.adi ? 'Adi' : 'Traditional',
                  lbl: 'Category',
                },
                {
                  icon: <LuGem className="h-5 w-5" />,
                  val: String(currentPuja.ccjpcId).padStart(2, '0'),
                  lbl: 'Serial No.',
                },
              ].map((s, i) => (
                <div
                  key={i}
                  className="rounded-2xl border border-white/[.08] bg-white/[.05] px-4 py-3.5 backdrop-blur-lg transition-all duration-300 hover:border-white/15 hover:bg-white/[.09]"
                >
                  <div className="mb-1.5 flex justify-center text-amber-300/70">
                    {s.icon}
                  </div>
                  <div className="fl-text-lg/xl bg-gradient-to-b from-white to-white/70 bg-clip-text font-bold text-transparent">
                    {s.val}
                  </div>
                  <div className="text-[10px] tracking-wider text-white/40 uppercase">
                    {s.lbl}
                  </div>
                </div>
              ))}
            </div>

            {/* Social */}
            {socialLinks.length > 0 && (
              <div
                className="flex items-center gap-2.5"
                role="list"
                aria-label="Social media links"
              >
                {socialLinks.map((item, i) => (
                  <a
                    key={i}
                    href={item.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    role="listitem"
                    aria-label={`${currentPuja.name} on ${capitalizeFirst(item.type)}`}
                    className="rounded-full border border-white/10 bg-white/[.06] p-2.5 backdrop-blur-sm transition-all duration-300 hover:scale-110 hover:border-white/20 hover:bg-white/15"
                  >
                    <item.icon className="fl-text-sm/base text-white/70 hover:text-white" />
                  </a>
                ))}
              </div>
            )}
          </div>
        </div>
      </header>

      {/* ══════ STATUS RIBBON ══════ */}
      <section aria-label="Puja status" className="relative z-10 -mt-12 w-full">
        <div className="container mx-auto px-4">
          <div
            className={cn(
              'fl-gap-4/6 mx-auto grid grid-cols-1 items-stretch',
              currentPuja.procession
                ? 'max-w-5xl sm:grid-cols-2 lg:grid-cols-3'
                : 'max-w-3xl sm:grid-cols-2'
            )}
          >
            {/* Celebration */}
            <article className="group overflow-hidden rounded-2xl border border-gray-100 bg-white p-5 shadow-xl shadow-black/8 transition-all duration-300 hover:-translate-y-1">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-purple-700 text-white">
                  <LuPartyPopper className="text-xl" />
                </div>
                <div>
                  <div className="fl-text-xl/2xl font-bold text-gray-900">
                    {currentPuja.celebrating ||
                      (currentPuja.year ? currentPuja.year : '300+')}
                  </div>
                  <div className="text-xs text-gray-500">
                    {currentPuja.celebrating
                      ? `${currentPuja.year} years' celebration`
                      : 'Years of Celebration'}
                  </div>
                </div>
              </div>
            </article>
            {/* Zone */}
            <article className="group overflow-hidden rounded-2xl border border-gray-100 bg-white p-5 shadow-xl shadow-black/8 transition-all duration-300 hover:-translate-y-1">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-blue-700 text-white">
                  <LuMapPin className="text-xl" />
                </div>
                <div>
                  <div className="fl-text-xl/2xl font-bold text-gray-900">
                    {currentPuja.psZone}
                  </div>
                  <div className="text-xs text-gray-500">
                    Police Station Zone
                  </div>
                </div>
              </div>
            </article>
            {/* Procession */}
            {currentPuja.procession?.truckCount && (
              <article className="group overflow-hidden rounded-2xl border border-gray-100 bg-white p-5 shadow-xl shadow-black/8 transition-all duration-300 hover:-translate-y-1">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-700 text-white">
                    <LuTruck className="text-xl" />
                  </div>
                  <div>
                    <div className="fl-text-xl/2xl font-bold text-gray-900">
                      Participating
                    </div>
                    <div className="text-xs text-gray-500">
                      {`${currentPuja.procession.truckCount} Vehicle${currentPuja.procession.truckCount > 1 ? 's' : ''} in Procession`}
                    </div>
                  </div>
                </div>
              </article>
            )}
          </div>
        </div>
      </section>

      {/* ══════ COUNTDOWN + SHARE ══════ */}
      {siteData?.schedules &&
        siteData.schedules.length > 0 &&
        (() => {
          const firstDate = new Date(siteData.schedules[0].date);
          const now = new Date();
          const lastDate = new Date(
            siteData.schedules[siteData.schedules.length - 1].date
          );
          lastDate.setDate(lastDate.getDate() + 1);
          if (now < lastDate) {
            const targetDate =
              firstDate > now
                ? firstDate
                : new Date(
                    siteData.schedules.find((s) => new Date(s.date) > now)
                      ?.date || firstDate
                  );
            const targetEvent = siteData.schedules.find(
              (s) => new Date(s.date).getTime() === targetDate.getTime()
            );
            return (
              <section className="w-full bg-white py-8">
                <div className="container mx-auto px-4">
                  <PujaCountdown
                    targetDate={targetDate}
                    eventName={targetEvent?.event}
                  />
                  <div className="mt-5 flex justify-center">
                    <ShareBar
                      title={`${currentPuja.name} - Jagadhatri Puja`}
                      url={`https://www.jagadhatrionline.co.in/puja/${currentPuja.slug}/${currentPuja.referenceId}`}
                    />
                  </div>
                </div>
              </section>
            );
          }
          return null;
        })()}

      {/* ══════ ABOUT / PUJA INFO ══════ */}
      <section
        id="about"
        aria-labelledby="about-heading"
        className="pattern-topography w-full bg-gradient-to-b from-white via-purple-50/20 to-white py-20"
      >
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <span className="mb-3 inline-flex items-center gap-2 rounded-full bg-purple-100/70 px-4 py-1.5 text-xs font-semibold tracking-wider text-purple-700 uppercase">
              <LuBook className="text-sm" /> About This Puja
            </span>
            <h2
              id="about-heading"
              className="fl-text-3xl/5xl mb-3 bg-gradient-to-r from-gray-900 via-purple-900 to-gray-900 bg-clip-text font-extrabold text-transparent"
              style={{ lineHeight: 1.15 }}
            >
              Celebrating Culture &amp; Tradition
            </h2>
            <p className="text-sm text-gray-500">
              {currentPuja.estd === 0
                ? 'A Legacy of Tradition'
                : `Since the year ${currentPuja.estd}`}
            </p>
          </div>

          {/* Main content card */}
          <div className="relative overflow-hidden rounded-3xl border border-purple-100/50 bg-white p-6 sm:p-8 lg:p-10">
            <div
              className="absolute -top-24 -right-24 h-48 w-48 rounded-full bg-purple-100/40 blur-3xl"
              aria-hidden="true"
            />
            <div
              className="absolute -bottom-24 -left-24 h-48 w-48 rounded-full bg-amber-100/40 blur-3xl"
              aria-hidden="true"
            />

            <div className="relative">
              {/* Markdown info */}
              {currentPuja.info && (
                <div className="prose prose-purple prose-headings:text-gray-800 prose-a:text-purple-600 max-w-none text-justify leading-relaxed text-gray-600">
                  <Markdown content={currentPuja.info} className="space-y-3" />
                </div>
              )}

              {/* Jubilee callout */}
              {currentPuja.celebrating && (
                <div
                  className={cn(
                    'relative mt-8 overflow-hidden rounded-2xl border p-5 sm:p-6',
                    currentPuja.jubilee || currentPuja.preJubilee
                      ? 'border-amber-200/70 bg-gradient-to-r from-amber-50 via-yellow-50 to-amber-50'
                      : 'border-amber-100 bg-amber-50/50'
                  )}
                >
                  <div
                    className="absolute -top-10 -right-10 h-28 w-28 rounded-full bg-amber-200/50 blur-2xl"
                    aria-hidden="true"
                  />
                  <div className="relative flex flex-col items-center gap-5 sm:flex-row">
                    <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 sm:h-20 sm:w-20">
                      <span className="fl-text-xl/2xl font-bold text-white">
                        {currentPuja.year}
                      </span>
                    </div>
                    <div className="text-center sm:text-left">
                      <h3 className="fl-text-lg/xl mb-1 font-bold text-amber-900">
                        🎉 Celebrating {currentPuja.celebrating}!
                      </h3>
                      <p className="text-sm text-amber-700/80">
                        {currentPuja.celebrating === 'Silver Jubilee' &&
                          '25 years of devotion and community celebration.'}
                        {currentPuja.celebrating === 'Golden Jubilee' &&
                          '50 years of preserving cultural heritage.'}
                        {currentPuja.celebrating === 'Diamond Jubilee' &&
                          '60 years of unwavering faith and tradition.'}
                        {currentPuja.celebrating === 'Platinum Jubilee' &&
                          '75 years of spiritual journey and community bonding.'}
                        {currentPuja.celebrating === 'Centennial Jubilee' &&
                          '100 years of an incredible legacy.'}
                        {currentPuja.celebrating === 'Jubilee' &&
                          'A significant milestone in our spiritual journey.'}
                        {currentPuja.celebrating.includes('Pre') &&
                          `${currentPuja.celebrating}: Gearing up for a landmark celebration.`}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Artist / Theme Info Grid */}
              {info.length > 0 && (
                <div className="mt-8 border-t border-gray-100 pt-8">
                  <h3 className="fl-text-base/lg mb-5 font-bold tracking-wider text-gray-400 uppercase">
                    Puja Details
                  </h3>
                  <div
                    className={cn(
                      'grid gap-3',
                      info.length <= 2
                        ? 'grid-cols-1 sm:grid-cols-2'
                        : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
                    )}
                  >
                    {info.map((item, i) => (
                      <div
                        key={i}
                        className="flex items-start gap-3 rounded-xl border border-gray-100 bg-gray-50/50 p-3.5 transition-colors hover:border-purple-200 hover:bg-purple-50/50"
                      >
                        <div className="mt-0.5 flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg border border-gray-100 bg-white">
                          {item.icon}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="text-xs font-semibold tracking-wider text-gray-400 uppercase">
                            {item.title}
                          </div>
                          <div className="mt-0.5 text-sm font-medium break-words text-gray-700">
                            {item.value}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Contact Info */}
              {(contactEmail || contactPhone) && (
                <div className="mt-8 border-t border-gray-100 pt-8">
                  <h3 className="fl-text-base/lg mb-5 font-bold tracking-wider text-gray-400 uppercase">
                    Contact
                  </h3>
                  <div className="flex flex-col gap-3 sm:flex-row sm:gap-4">
                    {contactPhone && (
                      <a
                        href={`tel:${contactPhone}`}
                        className="group flex items-start gap-3 rounded-xl border border-gray-100 bg-gray-50/50 p-3.5 transition-colors hover:border-blue-200 hover:bg-blue-50/50 sm:flex-1"
                      >
                        <div className="mt-0.5 flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg border border-gray-100 bg-white">
                          <LuPhone className="text-blue-500" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="text-xs font-semibold tracking-wider text-gray-400 uppercase">
                            Phone
                          </div>
                          <div className="mt-0.5 text-sm font-medium break-words text-gray-700">
                            {contactPhone}
                          </div>
                        </div>
                      </a>
                    )}
                    {contactEmail && (
                      <a
                        href={`mailto:${contactEmail}`}
                        className="group flex items-start gap-3 rounded-xl border border-gray-100 bg-gray-50/50 p-3.5 transition-colors hover:border-violet-200 hover:bg-violet-50/50 sm:flex-1"
                      >
                        <div className="mt-0.5 flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg border border-gray-100 bg-white">
                          <LuMail className="text-violet-500" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="text-xs font-semibold tracking-wider text-gray-400 uppercase">
                            Email
                          </div>
                          <div className="mt-0.5 text-sm font-medium break-words text-gray-700">
                            {contactEmail}
                          </div>
                        </div>
                      </a>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Disclaimer */}
          <aside className="mt-5 rounded-xl border border-gray-100 bg-gray-50/70 px-4 py-3">
            <div className="flex items-start gap-2.5">
              <LuLightbulb className="mt-0.5 flex-shrink-0 text-sm text-amber-500" />
              <p className="text-xs leading-relaxed text-gray-400">
                The information provided here may be incomplete or partially
                inaccurate. If you are a representative of this puja committee
                and notice any discrepancies, we encourage you to get in touch
                with us so we can update and correct the details. This
                initiative aims to bring all puja committees together on a
                single unified platform. Puja committee reps can{' '}
                <Link
                  href="/contact-us"
                  className="font-medium text-purple-600 hover:underline"
                >
                  contact us
                </Link>{' '}
                to update details.
              </p>
            </div>
          </aside>
        </div>
      </section>

      {/* ══════ TAGS ══════ */}
      {placeholderTags.length > 0 && (
        <section
          aria-label="Tags"
          className="w-full border-y border-gray-100 bg-gray-50/30 py-8"
        >
          <div className="container mx-auto px-4">
            <div className="flex flex-wrap items-center gap-x-4 gap-y-3">
              <span className="text-[10px] font-bold tracking-widest text-gray-300 uppercase">
                Tags
              </span>
              <div className="h-4 w-px bg-gray-200" aria-hidden="true" />
              <div
                className="flex flex-wrap gap-2"
                role="list"
                aria-label="Puja tags"
              >
                {placeholderTags.map((tag, i) => {
                  const tagColors = [
                    'bg-indigo-50 text-indigo-600 ring-indigo-100',
                    'bg-violet-50 text-violet-600 ring-violet-100',
                    'bg-fuchsia-50 text-fuchsia-600 ring-fuchsia-100',
                    'bg-rose-50 text-rose-600 ring-rose-100',
                    'bg-amber-50 text-amber-600 ring-amber-100',
                    'bg-emerald-50 text-emerald-600 ring-emerald-100',
                    'bg-blue-50 text-blue-600 ring-blue-100',
                    'bg-purple-50 text-purple-600 ring-purple-100',
                  ];
                  return (
                    <span
                      key={i}
                      role="listitem"
                      className={cn(
                        'inline-flex cursor-default items-center rounded-lg px-3 py-1.5 text-xs font-semibold ring-1 transition-transform duration-200 hover:scale-105',
                        tagColors[i % tagColors.length]
                      )}
                    >
                      {tag}
                    </span>
                  );
                })}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ══════ GALLERY ══════ */}
      {currentPuja?.images && currentPuja.images.length > 0 && (
        <section
          id="gallery"
          aria-labelledby="gallery-heading"
          className="pattern-topography w-full bg-gradient-to-b from-white via-amber-50/20 to-white py-20"
        >
          <div className="container mx-auto px-4">
            <div className="mb-14 text-center">
              <span className="mb-3 inline-flex items-center gap-2 rounded-full bg-amber-100/70 px-4 py-1.5 text-xs font-semibold tracking-wider text-amber-700 uppercase">
                <LuImages className="text-sm" /> Photo Gallery
              </span>
              <h2
                id="gallery-heading"
                className="fl-text-3xl/5xl mb-3 bg-gradient-to-r from-amber-800 to-orange-800 bg-clip-text font-extrabold text-transparent"
                style={{ lineHeight: 1.15 }}
              >
                Glimpses of Celebration
              </h2>
              <p className="mx-auto max-w-lg text-sm text-gray-500">
                Moments that capture the essence of tradition and community
                spirit.
              </p>
            </div>
            <PujaGallery
              images={currentPuja.images}
              pujaName={currentPuja.name}
              referenceId={currentPuja.referenceId}
            />
          </div>
        </section>
      )}

      {/* ══════ MAP ══════ */}
      <section
        id="location"
        aria-labelledby="location-heading"
        className="pattern-sacred-geo w-full bg-gradient-to-b from-white via-emerald-50/20 to-white py-20"
      >
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <span className="mb-3 inline-flex items-center gap-2 rounded-full bg-emerald-100/70 px-4 py-1.5 text-xs font-semibold tracking-wider text-emerald-700 uppercase">
              <LuMapPin className="text-sm" /> Location
            </span>
            <h2
              id="location-heading"
              className="fl-text-3xl/4xl mb-3 bg-gradient-to-r from-emerald-800 to-teal-800 bg-clip-text font-extrabold text-transparent"
              style={{ lineHeight: 1.15 }}
            >
              Find Us
            </h2>
            <p className="text-sm text-gray-500">
              Visit us to experience the divine atmosphere
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-3">
            <div className="md:col-span-2">
              <div className="overflow-hidden rounded-2xl border border-emerald-100/50">
                {hasCoordinates ? (
                  <LeafletMap
                    lat={currentPuja.location!.coordinates!.lat}
                    lng={currentPuja.location!.coordinates!.lng}
                    name={currentPuja.name}
                    address={currentPuja.address}
                    className="h-[320px] w-full md:h-[400px]"
                  />
                ) : (
                  <div className="flex h-[320px] flex-col items-center justify-center bg-gradient-to-br from-emerald-50 to-teal-50 p-8 md:h-[400px]">
                    <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-100">
                      <LuMapPin className="text-3xl text-emerald-500" />
                    </div>
                    <h3 className="mb-1 font-semibold text-gray-700">
                      Coordinates Unavailable
                    </h3>
                    <p className="mb-5 text-xs text-gray-400">
                      Use Google Maps to find this location
                    </p>
                    <a
                      href={gMapLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-medium text-white transition-all hover:bg-emerald-700"
                    >
                      <LuMapPin className="text-xs" /> Open in Google Maps{' '}
                      <LuArrowRight className="text-xs" />
                    </a>
                  </div>
                )}
              </div>
            </div>
            <div className="md:col-span-1">
              <div className="h-full rounded-2xl border border-emerald-100/50 bg-white p-5">
                <div className="mb-5 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-700 text-white">
                    <LuBuilding className="text-lg" />
                  </div>
                  <h3 className="text-sm font-bold text-gray-800">
                    Puja Premises
                  </h3>
                </div>
                <div className="mb-4 rounded-xl bg-emerald-50 p-3.5">
                  <p className="text-sm leading-relaxed text-gray-600">
                    {currentPuja.address}
                  </p>
                </div>
                <div className="space-y-2 text-sm text-gray-500">
                  <div className="flex items-center gap-2">
                    <LuMapPin className="text-emerald-500" />{' '}
                    {currentPuja.psZone}
                  </div>
                  {hasCoordinates && (
                    <div className="flex items-center gap-2 text-xs text-gray-400">
                      <LuMapPin className="text-emerald-400" />
                      {currentPuja.location!.coordinates!.lat.toFixed(5)},{' '}
                      {currentPuja.location!.coordinates!.lng.toFixed(5)}
                    </div>
                  )}
                </div>
                <a
                  href={gMapLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 py-2.5 text-sm font-medium text-emerald-700 transition-colors hover:bg-emerald-100"
                >
                  <LuMapPin className="text-xs" /> Get Directions
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════ EVENT SCHEDULE ══════ */}
      <section
        aria-labelledby="schedule-heading"
        className="w-full bg-gradient-to-b from-white via-indigo-50/30 to-white py-20"
      >
        <div className="container mx-auto px-4">
          <div className="mb-14 text-center">
            <span className="mb-3 inline-flex items-center gap-2 rounded-full bg-indigo-100/70 px-4 py-1.5 text-xs font-semibold tracking-wider text-indigo-700 uppercase">
              <LuCalendar className="text-sm" /> Schedule
            </span>
            <h2
              id="schedule-heading"
              className="fl-text-3xl/4xl mb-3 bg-gradient-to-r from-indigo-800 to-violet-800 bg-clip-text font-extrabold text-transparent"
              style={{ lineHeight: 1.15 }}
            >
              Upcoming Events
            </h2>
            <p className="text-sm text-gray-500">
              Mark your calendar for these auspicious occasions
            </p>
          </div>
          {siteData?.schedules && siteData.schedules.length > 0 && (
            <div
              className={cn(
                'grid gap-4',
                siteData.schedules.length <= 3
                  ? 'grid-cols-1 sm:grid-cols-3'
                  : siteData.schedules.length <= 4
                    ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4'
                    : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
              )}
            >
              {(() => {
                const eventPalette = [
                  {
                    gradient: 'from-indigo-500 to-violet-600',
                    text: 'text-indigo-600',
                    hoverBorder: 'hover:border-indigo-200',
                  },
                  {
                    gradient: 'from-violet-500 to-purple-600',
                    text: 'text-violet-600',
                    hoverBorder: 'hover:border-violet-200',
                  },
                  {
                    gradient: 'from-fuchsia-500 to-pink-600',
                    text: 'text-fuchsia-600',
                    hoverBorder: 'hover:border-fuchsia-200',
                  },
                  {
                    gradient: 'from-rose-500 to-red-500',
                    text: 'text-rose-600',
                    hoverBorder: 'hover:border-rose-200',
                  },
                  {
                    gradient: 'from-amber-500 to-orange-600',
                    text: 'text-amber-600',
                    hoverBorder: 'hover:border-amber-200',
                  },
                  {
                    gradient: 'from-emerald-500 to-teal-600',
                    text: 'text-emerald-600',
                    hoverBorder: 'hover:border-emerald-200',
                  },
                ];
                return siteData.schedules.map((item, i) => {
                  const c = eventPalette[i % eventPalette.length];
                  const d = new Date(item.date);
                  return (
                    <div
                      key={i}
                      className={cn(
                        'group relative overflow-hidden rounded-2xl border border-gray-100 bg-white transition-colors duration-200',
                        c.hoverBorder
                      )}
                    >
                      <div
                        className={cn(
                          'h-1 bg-gradient-to-r transition-all duration-300 group-hover:h-1.5',
                          c.gradient
                        )}
                      />
                      <div className="p-4">
                        <div className="mb-3 flex items-center gap-3">
                          <span
                            className={cn(
                              'flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br text-base font-extrabold text-white transition-transform duration-200 group-hover:scale-105',
                              c.gradient
                            )}
                          >
                            {format(d, 'dd')}
                          </span>
                          <div>
                            <span
                              className={cn(
                                'text-xs font-bold uppercase',
                                c.text
                              )}
                            >
                              {format(d, 'MMM')}
                            </span>
                            <p className="text-[10px] font-medium text-gray-400 uppercase">
                              {format(d, 'EEE')}
                            </p>
                          </div>
                        </div>
                        <h3 className="text-sm font-bold text-gray-900">
                          {item.event}
                        </h3>
                        {item.description && (
                          <p className="mt-1.5 line-clamp-2 text-xs leading-relaxed text-gray-500">
                            {item.description}
                          </p>
                        )}
                      </div>
                    </div>
                  );
                });
              })()}
            </div>
          )}
        </div>
      </section>

      {/* ══════ NEARBY PUJAS ══════ */}
      {(() => {
        const nearbyPujas = pujas
          .filter(
            (p) =>
              p.referenceId !== currentPuja.referenceId &&
              p.zone === currentPuja.zone
          )
          .map((p) => {
            let distance = Infinity;
            if (
              currentPuja.location?.coordinates?.lat &&
              currentPuja.location?.coordinates?.lng &&
              p.location?.coordinates?.lat &&
              p.location?.coordinates?.lng
            ) {
              const R = 6371;
              const dLat =
                ((p.location.coordinates.lat -
                  currentPuja.location.coordinates.lat) *
                  Math.PI) /
                180;
              const dLon =
                ((p.location.coordinates.lng -
                  currentPuja.location.coordinates.lng) *
                  Math.PI) /
                180;
              const a =
                Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                Math.cos(
                  (currentPuja.location.coordinates.lat * Math.PI) / 180
                ) *
                  Math.cos((p.location.coordinates.lat * Math.PI) / 180) *
                  Math.sin(dLon / 2) *
                  Math.sin(dLon / 2);
              distance = R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
            }
            return { ...p, distance };
          })
          .sort((a, b) => a.distance - b.distance)
          .slice(0, 6);

        if (nearbyPujas.length === 0) return null;

        return (
          <section
            aria-labelledby="nearby-heading"
            className="w-full bg-white py-16"
          >
            <div className="container mx-auto px-4">
              <div className="mb-10 text-center">
                <span className="mb-3 inline-flex items-center gap-2 rounded-full bg-emerald-100/70 px-4 py-1.5 text-xs font-semibold tracking-wider text-emerald-700 uppercase">
                  <LuMapPin className="text-sm" /> Nearby
                </span>
                <h2
                  id="nearby-heading"
                  className="fl-text-2xl/3xl mb-2 font-bold text-gray-800"
                >
                  Explore Nearby Pujas
                </h2>
                <p className="text-sm text-gray-500">
                  Other puja committees in{' '}
                  {currentPuja.zone === 'bhadreswar'
                    ? 'Bhadreswar'
                    : 'Chandannagar'}
                </p>
              </div>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {nearbyPujas.map((p) => (
                  <Link
                    key={p.referenceId}
                    href={`/puja/${p.slug}/${p.referenceId}`}
                    className="group flex items-center gap-4 rounded-2xl border border-gray-100 bg-gray-50/50 p-4 transition-all hover:border-purple-200 hover:bg-purple-50/30"
                  >
                    <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-indigo-600 text-sm font-bold text-white">
                      {p.name?.slice(0, 2).toUpperCase()}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="truncate text-sm font-semibold text-gray-800 group-hover:text-purple-700">
                        {p.name}
                      </div>
                      <div className="flex items-center gap-2 text-xs text-gray-400">
                        <span>Est. {p.estd}</span>
                        {p.distance !== Infinity && (
                          <>
                            <span className="text-gray-200">·</span>
                            <span>
                              {p.distance < 1
                                ? `${Math.round(p.distance * 1000)}m`
                                : `${p.distance.toFixed(1)}km`}
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                    <LuArrowRight className="flex-shrink-0 text-gray-300 transition-transform group-hover:translate-x-1 group-hover:text-purple-500" />
                  </Link>
                ))}
              </div>
            </div>
          </section>
        );
      })()}

      {/* ══════ QUICK ACTIONS + PREV/NEXT ══════ */}
      <section
        aria-labelledby="actions-heading"
        className="w-full border-t border-gray-100 bg-gray-50/50 py-10"
      >
        <div className="container mx-auto px-4">
          {/* Quick Action Links */}
          <div className="mb-8 flex flex-wrap items-center justify-center gap-x-1 gap-y-2">
            <span className="mr-2 text-[10px] font-bold tracking-widest text-gray-300 uppercase">
              Explore
            </span>
            {[
              {
                href: '/puja-committee-list',
                icon: LuBuilding,
                label: 'All Pujas',
              },
              {
                href: '/gallery',
                icon: LuImages,
                label: 'Gallery',
              },
              {
                href: '/puja-history',
                icon: LuHistory,
                label: 'History',
              },
              {
                href: '/contact-us',
                icon: LuMail,
                label: 'Contact',
              },
            ].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="group inline-flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium text-gray-500 transition-colors hover:bg-white hover:text-gray-800"
              >
                <item.icon className="text-sm text-gray-400 transition-colors group-hover:text-purple-500" />
                {item.label}
              </Link>
            ))}
          </div>

          {/* Prev / Next Navigation */}
          <nav aria-label="Puja navigation">
            <div className="flex flex-col gap-3 sm:flex-row">
              <Link
                rel="prev"
                href={`/puja/${array?.[0]?.slug}/${array?.[0]?.referenceId}`}
                className="group relative flex flex-1 items-center gap-4 overflow-hidden rounded-2xl border border-gray-100 bg-white px-5 py-4 transition-all hover:border-purple-200 hover:bg-purple-50/50"
              >
                <div className="absolute top-0 left-0 h-full w-1 bg-gradient-to-b from-purple-400 to-purple-600" />
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-purple-100 transition-transform group-hover:-translate-x-1">
                  <LuArrowLeft className="text-purple-600" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-xs tracking-wider text-gray-400 uppercase">
                    Previous
                  </div>
                  <div className="truncate text-sm font-semibold text-gray-700">
                    {array?.[0]?.name}
                  </div>
                </div>
              </Link>
              <Link
                rel="next"
                href={`/puja/${array?.[1]?.slug}/${array?.[1]?.referenceId}`}
                className="group relative flex flex-1 items-center justify-end gap-4 overflow-hidden rounded-2xl border border-gray-100 bg-white px-5 py-4 text-right transition-all hover:border-purple-200 hover:bg-purple-50/50"
              >
                <div className="absolute top-0 right-0 h-full w-1 bg-gradient-to-b from-purple-400 to-purple-600" />
                <div className="min-w-0 flex-1">
                  <div className="text-xs tracking-wider text-gray-400 uppercase">
                    Next
                  </div>
                  <div className="truncate text-sm font-semibold text-gray-700">
                    {array?.[1]?.name}
                  </div>
                </div>
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-purple-100 transition-transform group-hover:translate-x-1">
                  <LuArrowRight className="text-purple-600" />
                </div>
              </Link>
            </div>
          </nav>
        </div>
      </section>
    </Main>
  );
}
