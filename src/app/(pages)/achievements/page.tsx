import type { Metadata } from 'next';
import MainLayout from '@/components/main-layout';
import Markdown from '@/components/markdown';
import Section from '@/components/section';
import schema from '@/utils/schema';
import { getSingle } from '@/utils/fetch';
import { metadata as metadataSchema } from '@/app/layout';
import { LuCircleCheck } from 'react-icons/lu';
import type { GlobalSite, SharedAchievement } from '@/types';

export const metadata: Metadata = {
    title: 'Achievements',
    description:
        'Celebrating a decade of digital service—view our milestones, media features, and honors as Chandannagar’s official online puja archive.',
    openGraph: {
        ...metadataSchema.openGraph,
        url: '/achievements',
    },
    alternates: {
        canonical: '/achievements',
    },
};

export default async function Page() {
    const { data } = await getSingle<GlobalSite>('global', { populate: '*' });

    const jsonLd = schema({
        path: 'achievements',
        title: 'Achievements',
    });

    return (
        <MainLayout title="Achievements" jsonLd={jsonLd}>
            <Section title="Know More About" description="The Journey So Far">
                <div className="mb-4 flex flex-col gap-4 text-justify">
                    <p>
                        From humble beginnings in 2016, Jagadhatri Online has
                        blossomed into one of the most trusted and widely
                        recognized digital platforms dedicated to celebrating
                        and promoting Jagadhatri Puja. Over the past decade, our
                        journey has been marked by passion, innovation, and an
                        unwavering commitment to our community. We have
                        consistently evolved to meet the changing needs of
                        devotees, organizers, and cultural enthusiasts
                        alike—bridging tradition with technology, and local
                        celebrations with a global audience.
                    </p>
                    <p>
                        Through tireless efforts and the support of our vibrant
                        community, we’ve achieved remarkable milestones—from
                        pioneering virtual puja experiences and launching mobile
                        apps to organizing prestigious award ceremonies and
                        expanding our digital reach beyond borders. Each
                        accomplishment represents a step toward preserving our
                        rich cultural heritage while embracing the possibilities
                        of the digital age. Here’s a snapshot of some of our
                        proudest and most impactful achievements along this
                        incredible journey:
                    </p>
                </div>
                <ul className="timeline timeline-snap-icon max-md:timeline-compact timeline-vertical">
                    {data?.achievements &&
                        data.achievements.map(
                            (item: SharedAchievement, index: number) => (
                                <li key={index}>
                                    <div className="timeline-middle">
                                        <LuCircleCheck className="text-success size-5" />
                                    </div>
                                    <div
                                        className={`timeline-box flex flex-col gap-2 ${index % 2 !== 0 ? 'timeline-start md:text-end' : 'timeline-end md:text-start'}`}
                                    >
                                        <time className="font-mono italic">
                                            {item.year}
                                        </time>
                                        <div className="text-lg font-bold text-green-600">
                                            {item.title}
                                        </div>
                                        {item.details && (
                                            <Markdown
                                                className="text-sm leading-6"
                                                content={item.details}
                                            />
                                        )}
                                    </div>
                                    {data.achievements &&
                                        index !==
                                            data.achievements.length - 1 && (
                                            <hr className="bg-success" />
                                        )}
                                </li>
                            ),
                        )}
                </ul>
            </Section>
        </MainLayout>
    );
}
