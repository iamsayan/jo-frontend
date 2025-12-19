import type { Metadata } from 'next';
import Image from 'next/image';
import {
    FaSquareFacebook,
    FaSquareXTwitter,
    FaSquareInstagram,
} from 'react-icons/fa6';
import { metadata as metadataSchema } from '@/app/layout';
import MainLayout from '@/components/main-layout';
import Section from '@/components/section';
import schema from '@/utils/schema';

export const metadata: Metadata = {
    title: 'About Us',
    description: `Jagadhatri Online is the leading digital portal covering Jagadhatri Pujas in Chandannagar, Mankundu, and Bhadreswar—celebrating 10 years of cultural storytelling.`,
    openGraph: {
        ...metadataSchema.openGraph,
        url: '/about-us',
    },
    alternates: {
        canonical: '/about-us',
    },
};

interface Person {
    name: string;
    role: string;
    icon: string;
}

export default function Page() {
    const admins: Person[] = [
        {
            name: 'Sayan Datta',
            role: 'Co-Founder & Engineering Head',
            icon: 'sayan.png',
        },
        {
            name: 'Pritam Mitra',
            role: 'Co-Founder & Creative Head',
            icon: 'pritam.png',
        },
    ];

    const members: Person[] = [
        {
            name: 'Sayan Mitra',
            role: 'Content Manager',
            icon: 'sayanmitra.png',
        },
        {
            name: 'Rohan Pal',
            role: 'Content Writer',
            icon: 'rohan.png',
        },
        {
            name: 'Sudipta Das',
            role: 'Executive Member',
            icon: 'sudipta.png',
        },
        {
            name: 'Arunava De',
            role: 'Executive Member',
            icon: 'arunava.png',
        },
        {
            name: 'Subhodeep Das',
            role: 'Executive Member',
            icon: 'subhodeep.png',
        },
        // {
        //     name: "Sinjan Das",
        //     role: "Executive Member",
        //     icon: "sinjan.png"
        // },
        {
            name: 'Raunak Pal',
            role: 'Executive Member',
            icon: 'raunak.png',
        },
        {
            name: 'Rupen Sen',
            role: 'Executive Member',
            icon: 'rupen.png',
        },
        {
            name: 'Suman Bhagat',
            role: 'Executive Member',
            icon: 'suman.png',
        },
        {
            name: 'Suvam Mohanty',
            role: 'Executive Member',
            icon: 'suvam.png',
        },
        {
            name: 'Joyjit Ghosh',
            role: 'Executive Member',
            icon: 'joyjit.png',
        },
        {
            name: 'Subhojit Hara',
            role: 'Executive Member',
            icon: 'subhojit.png',
        },
    ];

    const jsonLd = schema({
        path: 'about-us',
        title: 'About Us',
    });

    return (
        <MainLayout title="About Us" jsonLd={jsonLd}>
            <Section title="Know More" description="Who We Are">
                <div className="flex flex-col gap-6 text-center">
                    <p>
                        Jagadhatri Online is your online destination to visit
                        the collection of most popular Jagadhatri Pujas of
                        Chanannagar, Mankundu & Bhadreswar. It is a platform on
                        internet where we display the Location, Photos & Videos
                        of various Jagadhatri Pujas of Chandannagar. It will
                        guide people who want directions to go Pandal Hopping
                        around the city, looking for the best Pujas in town.
                        Jagadhatri Puja is the biggest and the grandest festival
                        celebrated in Chandannagar. Maa Jagadhatri is the
                        Goddess of divine power against all evils. Starting from
                        the day of the Kali Puja, the days of Sashthi, Saptami,
                        Ashtami, Nabami and Dashami every day has its own unique
                        rituals. The grandiosity and enthusiasm with which
                        Jagadhatri Puja is celebrated in Chandannagar is
                        unparalleled.
                    </p>
                    <p>
                        Jagadhatri Online is designed to capture the most
                        popular Jagadhatri Puja’s of Chandannagar, Mankundu &
                        Bhadrswar. Some of you, who are not in Chandannagar are
                        unable to experience the pleasure of Jagadhatri Puja in
                        Bengal with their own eyes. We have created this
                        Facebook page to share our experience with them.
                    </p>
                    <p>
                        We have created this site to share our experience with
                        them. You can share this website with your friends and
                        relatives through Facebook, Twitter, Whatsapp, Instagram
                        and Gmail.
                    </p>
                    <p>
                        Feel free to contribute content for uncovered Jagadhatri
                        Pujas of Chandannagar, Mankundu & Bhadreswar and for any
                        information relating to Chandannagar Jagadhatri Puja by
                        contacting us at our Facebook Page inbox or e-mail. We
                        appreciate your comments and suggestions.
                    </p>
                    <p>
                        OUR MISSION: Our Mission is to create the BEST
                        JAGADHATRI PUJA COLLECTIONS, ONLINE for people to see
                        and experience the Festivity of Chandannagar, Mankundu
                        and Bhadreswar.
                    </p>
                </div>
            </Section>
            <Section
                className="bg-gray-100"
                title="Meet Our"
                description="Passionate Team"
            >
                <div className="flex flex-col items-center justify-center gap-6">
                    <p className="m-auto text-center md:w-[1200px] md:text-[18px] md:leading-relaxed">
                        Jagadhatri Online is designed to capture the most
                        popular Jagadhatri Puja’s of Chandannagar, Mankundu &
                        Bhadreswar. Some of you, who are not in Chandannagar are
                        unable to experience the pleasure of Jagadhatri Puja in
                        Bengal with their own eyes. We have created this Website
                        to share our pride Jagadhatri Puja with the whole world.
                        A well organised team at their best. Know more about our
                        Team.
                    </p>
                    <div className="flex w-full flex-col items-center gap-5">
                        <h2 className="text-xl font-bold">The Visionaries</h2>
                        <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-2">
                            {admins.map((item, index) => (
                                <div
                                    key={index}
                                    className="bg-base-100 flex flex-col items-center gap-4 rounded-md p-10 shadow-sm md:flex-row md:items-start md:gap-10"
                                >
                                    <div className="avatar">
                                        <div className="w-32 rounded-full">
                                            <Image
                                                width={500}
                                                height={500}
                                                src={`/images/members/${item.icon}`}
                                                alt={item.name}
                                                unoptimized={true}
                                                loading="lazy"
                                            />
                                        </div>
                                    </div>
                                    <div className="flex flex-col items-center justify-center gap-2 md:items-start">
                                        <h2 className="card-title">
                                            {item.name}
                                        </h2>
                                        <p>{item.role}</p>
                                        <div className="mt-4 flex gap-2">
                                            <FaSquareFacebook className="facebook size-6 cursor-pointer" />
                                            <FaSquareXTwitter className="twitter size-6 cursor-pointer" />
                                            <FaSquareInstagram className="instagram size-6 cursor-pointer" />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="flex w-full flex-col items-center gap-5">
                        <h2 className="text-xl font-bold">
                            The Powerhouse Team
                        </h2>
                        <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-3 xl:grid-cols-5">
                            {members.map((item: Person, index: number) => (
                                <div
                                    key={index}
                                    className="bg-base-100 flex w-full flex-col items-center gap-4 rounded-md p-6 shadow-sm"
                                >
                                    <div className="avatar">
                                        <div className="w-24 rounded-full">
                                            <Image
                                                width={500}
                                                height={500}
                                                src={`/images/members/${item.icon}`}
                                                alt={item.name}
                                                unoptimized={true}
                                                loading="lazy"
                                            />
                                        </div>
                                    </div>
                                    <div className="flex flex-col items-center justify-center gap-2">
                                        <h2 className="card-title">
                                            {item.name}
                                        </h2>
                                        <p>{item.role}</p>
                                        <div className="mt-3 flex gap-2">
                                            <FaSquareFacebook className="facebook size-5 cursor-pointer" />
                                            <FaSquareXTwitter className="twitter size-5 cursor-pointer" />
                                            <FaSquareInstagram className="instagram size-5 cursor-pointer" />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </Section>
        </MainLayout>
    );
}
