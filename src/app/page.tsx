import CountdownTimer from '@/components/countdown-timer';
import GallerySlider from '@/components/gallery-slider';
import HeroSlider from '@/components/hero-slider';
import Main from '@/components/main';
import Section from '@/components/section';
import Videos from '@/components/videos';
import { paytoneOne } from '@/fonts';
import type { GlobalSite, SharedSchedule } from '@/types';
import { getSingle } from '@/utils/fetch';
import {
  buildGoogleCalendarUrl,
  cn,
  formatDate,
  getDateByIndex,
  timeOrigin,
} from '@/utils/functions';
import Image from 'next/image';
import Link from 'next/link';
import { FaFacebook, FaInstagram, FaWhatsapp, FaYoutube } from 'react-icons/fa';
import type { IconType } from 'react-icons/lib';
import {
  LuCalendar1,
  LuFlag,
  LuGlobe,
  LuHistory,
  LuImages,
  LuMapPin,
  LuPencil,
  LuShirt,
  LuShoppingBag,
  LuTrendingUp,
  LuVideo,
} from 'react-icons/lu';
import { PiConfettiThin } from 'react-icons/pi';

const imagesPath = [
  '20241107-044545.jpg',
  '20241107-045103.jpg',
  '20241107-044432.jpg',
  '20241107-044103.jpg',
  '20241107-035403.jpg',
  '20241107-040112.jpg',
  'img20241106134634.jpg',
  '20241107-041629.jpg',
  '20241107-044210.jpg',
  '20241107-040138.jpg',
  '20241107-042409.jpg',
  '20241107-042214.jpg',
  '20241107-045032.jpg',
  '20241107-042836.jpg',
] as const;

interface StatsItem {
  title: string;
  stat: string;
  icon: IconType;
  statDesc: string;
  description: string;
  class?: string;
}

interface MenuItem {
  title: string;
  description: string;
  icon: IconType;
  link: string;
}

interface ShopItem {
  title: string;
  description: string;
  icon: IconType;
  comingSoon?: boolean;
}

export default async function Home() {
  const { data } = await getSingle<GlobalSite>('global', { populate: '*' });
  const year = getDateByIndex(data?.schedules, 0).getFullYear();
  const curYear = new Date().getFullYear();
  const btnYear = curYear > year ? curYear : year;

  const sliderImages = imagesPath.map((image: string) => ({
    src: `static/${image}`,
    alt: image,
  }));

  const shopItems: ShopItem[] = [
    {
      title: 'Stationery',
      description:
        'High-quality notebooks, pens, and other stationery items for your daily needs',
      icon: LuPencil,
    },
    {
      title: 'T-Shirts',
      description: 'Comfortable and stylish t-shirts with unique designs',
      icon: LuShirt,
    },
    {
      title: 'Hoodies',
      description: 'Stay warm and fashionable with our premium hoodies',
      icon: LuShoppingBag,
      comingSoon: true,
    },
  ];

  const items: MenuItem[] = [
    {
      title: 'History',
      description:
        'When the entire Bengal, nay India, was under the British rule, inspite of being under the French',
      icon: LuHistory,
      link: '/puja-history',
    },
    {
      title: 'Gallery',
      description:
        'Latest Online Photo Gallery for Chandannagar, Mankundu and Bhadreswar Jagadhatri Puja.',
      icon: LuImages,
      link: '/gallery',
    },
    {
      title: 'Videos',
      description:
        'Here are the latest Online Video Gallery for Chandannagar Jagadhatri Puja.',
      icon: LuVideo,
      link: 'https://www.youtube.com/c/JagadhatriOnline',
    },
    {
      title: 'Location',
      description:
        'Explore the Grand Festival of Chandannagar with CGR Utsav Android App.',
      icon: LuMapPin,
      link: 'https://play.google.com/store/apps/details?id=com.cgr.utsav',
    },
  ];

  const stats: StatsItem[] = [
    {
      title: 'Followers',
      stat: '76.1K',
      icon: FaFacebook,
      statDesc: '5.6M',
      description: 'views in last 30 days',
      class: 'text-[#1877F2]',
    },
    {
      title: 'Followers',
      stat: '8.1K',
      icon: FaInstagram,
      statDesc: '7.7L',
      description: 'views in last 30 days',
      class: 'text-[#E1306C]',
    },
    {
      title: 'Followers',
      stat: '1.01K',
      icon: FaWhatsapp,
      statDesc: '5%',
      description: 'more than last month',
      class: 'text-[#25D366]',
    },
    {
      title: 'Subscribers',
      stat: '4.59K',
      icon: FaYoutube,
      statDesc: '600+',
      description: 'new subs in last 1 year',
      class: 'text-[#FF0000]',
    },
    {
      title: 'Website Visitors',
      stat: '12.5K',
      icon: LuGlobe,
      statDesc: '710K',
      description: 'impressions in last 30 days',
      class: 'text-pink-500',
    },
  ];

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        '@id': `${process.env.NEXT_PUBLIC_SITE_URL}/#organization`,
        name: 'Jagadhatri Online',
        url: process.env.NEXT_PUBLIC_SITE_URL,
        logo: `${process.env.NEXT_PUBLIC_SITE_URL}/circle-logo.png`,
        email: 'info@jagadhatrionline.co.in',
        sameAs: [
          'https://www.facebook.com/JagadhatriOnlineOfficial/',
          'https://www.youtube.com/c/JagadhatriOnline?sub_confirmation=1',
          'https://www.instagram.com/jagadhatri_online',
          'https://www.threads.com/@jagadhatri_online',
          'https://x.com/Official_JO16',
          'https://www.pinterest.com/jagadhatrionline/',
          'https://www.whatsapp.com/channel/0029Va54b17DOQIQ6yoP9t39',
        ],
      },
      {
        '@type': 'WebSite',
        '@id': `${process.env.NEXT_PUBLIC_SITE_URL}/#website`,
        url: process.env.NEXT_PUBLIC_SITE_URL,
        name: 'Jagadhatri Online',
        publisher: {
          '@id': `${process.env.NEXT_PUBLIC_SITE_URL}/#organization`,
        },
        inLanguage: 'en-IN',
        potentialAction: {
          '@type': 'SearchAction',
          target: `${process.env.NEXT_PUBLIC_SITE_URL}/?q={search_term_string}`,
          'query-input': 'required name=search_term_string',
        },
      },
      {
        '@type': 'WebPage',
        '@id': `${process.env.NEXT_PUBLIC_SITE_URL}/#webpage`,
        url: process.env.NEXT_PUBLIC_SITE_URL,
        name: 'Jagadhatri Online | the #1 Puja Portal for Chandannagar Jagadhatri Puja',
        datePublished: '2016-05-06T00:00:00+05:30',
        dateModified: timeOrigin("yyyy-MM-dd'T'HH:mm:ssXXX"),
        isPartOf: {
          '@id': `${process.env.NEXT_PUBLIC_SITE_URL}/#website`,
        },
        inLanguage: 'en-IN',
      },
    ],
  };

  return (
    <Main jsonLd={jsonLd}>
      <HeroSlider>
        <div className="hero-content text-white-content z-2 p-0 text-center text-white">
          <div className="pt-36 pb-28">
            <div className="mb-10 inline-block">
              <div className="group relative flex items-center justify-center gap-3 rounded-full border border-white/20 bg-yellow-500/10 px-5 py-2.5 text-sm backdrop-blur-md transition-all duration-300 hover:bg-yellow-500/20">
                {/* Animated confetti icon */}
                <PiConfettiThin className="animate-bounce text-lg" />

                {/* Celebration text */}
                <span className="font-medium">Celebrating 10 Years</span>

                {/* Animated dots */}
                <div className="flex space-x-1">
                  <span className="h-1.5 w-1.5 animate-ping rounded-full bg-amber-400"></span>
                  {/* <span className="w-1.5 h-1.5 rounded-full bg-yellow-400 animate-pulse"></span>
                                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-bounce"></span> */}
                </div>
              </div>
            </div>

            <div className="relative">
              <h1
                className={`fl-text-2xl/6xl mb-3 leading-none ${paytoneOne.className}`}
              >
                CHANDANNAGAR <br /> JAGADHATRI PUJA
              </h1>
              <p className="mb-8">
                Explore the Grand Festival of Chandannagar.
              </p>
              <Link
                href={`/jagadhatri-puja/${year}`}
                className="btn h-auto rounded-md border-2 border-yellow-500 bg-yellow-500 px-6 py-3 uppercase shadow-none hover:border-yellow-500 hover:bg-transparent hover:text-yellow-500"
              >
                Jagadhatri Puja {btnYear}
              </Link>
            </div>
          </div>
        </div>
      </HeroSlider>

      <Section
        className="bg-gradient-to-b from-yellow-500/10 to-transparent"
        title="Welcome to the Online Puja Portal"
        description="Jagadhatri Online"
      >
        <div className="flex flex-col gap-6 text-center">
          <p className="m-auto text-center md:text-xl md:leading-relaxed">
            Jagadhatri Online is your online destination to visit the collection
            of most popular Jagadhatri Pujas of Chanannagar, Mankundu &
            Bhadreswar. It is a platform on internet where we display the
            Location, Photos & Videos of various Jagadhatri Pujas of
            Chandannagar. It will guide people who want directions to go Pandal
            Hopping around the city, looking for the best Pujas in town.
          </p>
          <div className="relative rounded-2xl border border-yellow-500/20 bg-gradient-to-r from-yellow-500/5 via-yellow-500/10 to-yellow-500/5 px-6 py-8">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 transform truncate">
              <span className="inline-block rounded-full bg-yellow-500 px-4 py-1 text-sm font-medium text-white">
                10 Years of Digital Heritage
              </span>
            </div>
            <div className="flex flex-col items-center gap-4">
              <p className="text-gray-700 md:text-lg">
                Since 2016, we've been documenting the grandeur of
                Chandannagar's Jagadhatri Puja, preserving its rich cultural
                heritage for future generations. As we celebrate our 10th
                anniversary in 2025, we remain committed to showcasing the
                beauty and tradition of this magnificent festival for many more
                years to come.
              </p>
              <div className="flex flex-wrap justify-center gap-4 text-center">
                <div className="rounded-xl bg-white px-6 py-3 shadow-sm">
                  <div className="text-2xl font-bold text-yellow-600">2016</div>
                  <div className="text-sm text-gray-600">Journey Began</div>
                </div>
                <div className="rounded-xl bg-white px-6 py-3 shadow-sm">
                  <div className="text-2xl font-bold text-yellow-600">2025</div>
                  <div className="text-sm text-gray-600">10th Anniversary</div>
                </div>
                <div className="rounded-xl bg-white px-6 py-3 shadow-sm">
                  <div className="text-2xl font-bold text-yellow-600">
                    Beyond
                  </div>
                  <div className="text-sm text-gray-600">Continuing Legacy</div>
                </div>
              </div>
            </div>
          </div>
          <div>
            <Link
              href="/achievements"
              className="btn h-auto rounded-md border-0 bg-yellow-500 px-6 py-3 uppercase shadow-none hover:bg-blue-700 hover:text-white"
            >
              <LuFlag /> Achievements
            </Link>
          </div>
          <div className="stats stats-vertical lg:stats-horizontal container text-left shadow-sm">
            {stats.map((item: StatsItem, index) => (
              <div className="stat !border-gray-200 bg-white" key={index}>
                <div
                  className={`${cn('stat-figure text-primary', item?.class)}`}
                >
                  {<item.icon className="inline-block size-8 stroke-current" />}
                </div>
                <div className="stat-title">{item.title}</div>
                <div
                  className={`${cn('stat-value text-primary', item?.class)}`}
                >
                  {item.stat}
                </div>
                <div className="stat-desc">
                  <span className="mr-1 font-semibold text-green-600">
                    <LuTrendingUp className="mr-1 inline-block size-3" />
                    {item.statDesc}
                  </span>
                  {item.description}
                </div>
              </div>
            ))}
          </div>
          <GallerySlider
            slides={sliderImages}
            sliderOptions={{
              lazyLoad: 'nearby',
              autoScroll: {
                speed: 1,
              },
              height: 800,
              breakpoints: {
                640: {
                  height: 300,
                },
              },
              drag: 'free',
              focus: 'center',
              pagination: false,
              // perPage: 2,
              // perMove: 1,
              gap: '6px',
              grid: {
                dimensions: [
                  [1, 2],
                  [2, 2],
                  [1, 3],
                  [1, 2],
                  [1, 3],
                ],
                // rows: 2,
                // cols: 2,
                gap: {
                  row: '6px',
                  col: '6px',
                },
              },
            }}
          />
          <div className="mt-5 grid grid-cols-2 gap-2 xl:grid-cols-4">
            {items.map((item: MenuItem, index) => (
              <Link
                key={index}
                href={item.link}
                target={item.link.includes('https') ? '_blank' : '_self'}
                className="flex flex-col items-center gap-2"
              >
                <span className="rounded-full border border-gray-200 p-5">
                  {<item.icon className="fl-size-6/10 text-yellow-500" />}
                </span>
                <span className="text-xl font-bold uppercase">
                  {item.title}
                </span>
                <span className="">{item.description}</span>
              </Link>
            ))}
          </div>
        </div>
      </Section>
      <Section
        title="Our Store"
        description="Discover Our Products"
        className="bg-gray-50"
      >
        <div className="flex flex-col items-center gap-8">
          <p className="mx-auto max-w-5xl text-center md:text-xl">
            Visit our online store to explore a curated collection of
            high-quality products. From premium stationery to trendy apparel,
            we've got something special for everyone.
          </p>

          <div className="grid w-full max-w-5xl grid-cols-1 gap-6 md:grid-cols-3">
            {shopItems.map((item: ShopItem, index) => (
              <div
                key={index}
                className="rounded-xl bg-white p-6 shadow-md transition-shadow duration-300 hover:shadow-lg"
              >
                <div className="flex flex-col items-center gap-4 text-center">
                  <div className="rounded-full bg-gray-50 p-4">
                    {<item.icon className="size-8 text-yellow-500" />}
                  </div>
                  <h3 className="text-xl font-bold">
                    {item.title}
                    {item.comingSoon && (
                      <span className="ml-2 rounded-full bg-yellow-100 px-2 py-1 text-xs text-yellow-800">
                        Coming Soon
                      </span>
                    )}
                  </h3>
                  <p className="text-gray-600">{item.description}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 flex flex-col items-center gap-4">
            <a
              href="https://store.jagadhatrionline.co.in"
              target="_blank"
              rel="noopener"
              className="btn h-auto rounded-md border-0 bg-yellow-500 px-6 py-3 uppercase shadow-none hover:bg-blue-700 hover:text-white"
            >
              Visit Store
            </a>
            {/* <p className="text-sm text-gray-500">
                            Free shipping available on orders above ₹499
                        </p> */}
          </div>
        </div>
      </Section>
      <Section title="Jagadhatri Puja" description={`Countdown ${year}`}>
        <div className="flex flex-col gap-8 text-center">
          {data?.schedules && (
            <CountdownTimer
              className="mt-3"
              targetDate={formatDate(data.schedules[0].date)}
            />
          )}
          <div className="grid grid-cols-2 gap-6 md:grid-cols-6">
            {data?.schedules
              ?.slice(-5)
              .map((item: SharedSchedule, index: number) => (
                <a
                  key={index}
                  href={buildGoogleCalendarUrl(
                    {
                      title: `${item.event} - Jagadhatri Puja ${year}`,
                      location: 'Chandannagar',
                      description: item.description,
                    },
                    item.date,
                    '00:00:00',
                    '23:59:59'
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn(
                    'col-span-2 flex gap-4 rounded-xl border border-gray-200 bg-gray-50 p-4',
                    index === 3 && 'md:col-start-2'
                  )}
                >
                  <div className="self-start rounded-full border border-gray-200 bg-white p-2">
                    <Image
                      width={56}
                      height={56}
                      src={`/images/dates/${index}.png`}
                      alt={item.event}
                      unoptimized={true}
                      loading="lazy"
                      className="h-fit"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5 text-left">
                    <span className="font-bold">{item.event}</span>
                    <span className="text-sm">{item.description}</span>
                    <span className="mt-1 flex items-center gap-1.5">
                      <LuCalendar1 className="inline-block size-4 text-violet-600" />
                      <span className="text-sm">
                        {formatDate(item.date, 'EEEE, do MMMM yyyy')}
                      </span>
                    </span>
                  </div>
                </a>
              ))}
          </div>
          {data?.videos && (
            <div className="relative">
              <p className="fl-text-base/3xl mb-4 font-bold">
                Glimps of{' '}
                <span className="text-yellow-500">Jagadhatri Puja</span>
              </p>
              <Videos videos={data.videos} />
            </div>
          )}
        </div>
      </Section>
    </Main>
  );
}
