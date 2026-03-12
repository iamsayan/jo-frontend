import type { Metadata } from 'next';
import Link from 'next/link';

import { metadata as metadataSchema } from '@/app/layout';
import MainLayout from '@/components/main-layout';
import Section from '@/components/section';
import schema from '@/utils/schema';

import { LuCheck, LuCircleCheck, LuX } from 'react-icons/lu';

export const metadata: Metadata = {
  title:
    'JO Cinematics Programme - Digital Media Partnership for Jagadhatri Puja',
  description:
    'JO Cinematics Programme is a digital media collaboration program for Jagadhatri Puja committees across Chandannagar, Mankundu, and Bhadreswar — offering cinematic reels, drone shoots, and online promotion.',
  keywords: [
    'jagadhatri puja cinematics',
    'chandannagar puja media partnership',
    'puja committee digital promotion',
    'jagadhatri puja video coverage',
    'chandannagar puja reels',
    'jo cinematics programme',
    'puja drone shoot chandannagar',
  ],
  openGraph: {
    ...metadataSchema.openGraph,
    url: '/digital-media-partnership',
  },
  alternates: {
    canonical: '/digital-media-partnership',
  },
};

interface Feature {
  title: string;
  description: string;
}

export default function Page() {
  const jsonLd = schema({
    path: 'digital-media-partnership',
    title: 'JO Cinematics Programme',
  });

  const features: Feature[] = [
    {
      title: 'Increased Brand Visibility',
      description:
        'By collaborating, partners can expanding their reach to new and engaged audiences.',
    },
    {
      title: 'Content Amplification',
      description:
        'Partners can get exclusive content, leading to higher engagement rates and more widespread content distribution.',
    },
    {
      title: 'Enhanced Credibility',
      description:
        'Associating with reputable brands or organizations can boost credibility and trust among followers.',
    },
    {
      title: 'Access to Exclusive Content',
      description:
        'Partners may gain early or exclusive access to content, promotions, or events, enhancing their appeal to followers.',
    },
    {
      title: 'Cost-Effective Marketing',
      description:
        'It can reduce costs while maximizing the impact of reaching higher perks.',
    },
    {
      title: 'Real-Time Interaction',
      description:
        'Partners can engage with their audience in real-time, interacting with their followers in real-time.',
    },
  ];

  return (
    <MainLayout title="JO Cinematics Programme" jsonLd={jsonLd}>
      <Section title="Know More About" description="JO Cinematics">
        <div className="flex flex-col gap-6 text-justify">
          <p>
            JO Cinematics Programme is a collaboration program for Jagadhatri
            Puja Commitees across Chandannagar Mankundu and Bhadreswar. In this
            partnership program, we promote the registered puja committee
            according to their plans. We will also provide high quality content
            for them. More than 25+ pujo committees had registered with us
            earlier. Already pujo committees like Helapukurdhar Sarbojanin,
            Tematha Sarbojanin, Doibokpara Sarbojanin, Madhyanchal Sarbojanin
            etc got benefitted with our digital media partnership program.
          </p>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, index) => (
              <div
                className="fl-px-4/5 flex gap-4 rounded-md border border-neutral-200 py-4 hover:shadow"
                key={index}
              >
                <div className="pt-1">
                  <LuCircleCheck className="size-6 text-green-500" />
                </div>
                <div className="flex flex-col gap-2 text-left">
                  <h2 className="text-xl font-medium">{feature.title}</h2>
                  <p>{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="overflow-x-auto">
            <table className="table border border-gray-200 text-center">
              <thead>
                <tr>
                  <th>Services</th>
                  <th>Basic Package</th>
                  <th>
                    Premium Package{' '}
                    <span className="ml-2 bg-red-500 px-2 py-1 text-xs text-white">
                      Best Choice
                    </span>
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <th className="bg-gray-100">Online Promotion</th>
                  <td>
                    <LuCheck className="inline size-6 text-green-500" />
                  </td>
                  <td className="bg-yellow-50">
                    <LuCheck className="inline size-6 text-green-500" />
                  </td>
                </tr>
                <tr>
                  <th className="bg-gray-100">Reels Videos</th>
                  <td>1 cinematic reel (Puja + Procession)</td>
                  <td className="bg-yellow-50">
                    3 cinematic reels (Pre-Puja, Puja Days, Post-Puja)
                  </td>
                </tr>
                <tr>
                  <th className="bg-gray-100">Audio & Video Content</th>
                  <td>
                    <LuX className="inline size-6 text-red-500" />
                  </td>
                  <td className="bg-yellow-50">
                    <LuCheck className="inline size-6 text-green-500" />
                    <br />
                    Edited high-quality content provided
                  </td>
                </tr>
                <tr>
                  <th className="bg-gray-100">Drone Shoot</th>
                  <td>
                    <LuX className="inline size-6 text-red-500" />
                    <br />
                    Available as add-on
                  </td>
                  <td className="bg-yellow-50">
                    <LuCheck className="inline size-6 text-green-500" />
                    <br />
                    Add-ons available, e.g. Idol lifting drone ₹3000
                  </td>
                </tr>
                <tr>
                  <th className="bg-gray-100">Package Price</th>
                  <td>
                    <span className="ml-2 text-xl font-bold">₹999</span>
                  </td>
                  <td className="bg-yellow-50">
                    <del>₹20,999</del>
                    <span className="ml-2 text-xl font-bold">₹11,999</span>
                    <br />
                    <small>(You save ₹9,000)</small>
                  </td>
                </tr>
                <tr>
                  <th className="bg-gray-100">Click to Register</th>
                  <td>
                    <Link
                      href="/digital-media-partnership/register?plan=basic"
                      className="btn h-auto rounded-md border-2 border-yellow-500 bg-yellow-500 px-4 py-2 shadow-none hover:border-yellow-500 hover:bg-transparent hover:text-yellow-500"
                    >
                      Register
                    </Link>
                  </td>
                  <td className="bg-yellow-50">
                    <Link
                      href="/digital-media-partnership/register?plan=premium"
                      className="btn h-auto rounded-md border-2 border-yellow-500 bg-yellow-500 px-4 py-2 shadow-none hover:border-yellow-500 hover:bg-transparent hover:text-yellow-500"
                    >
                      Register
                    </Link>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </Section>
    </MainLayout>
  );
}
