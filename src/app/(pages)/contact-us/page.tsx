import type { Metadata } from "next";
import { GoogleMapsEmbed } from "@next/third-parties/google";
import Contact from "@/components/contact";
import MainLayout from "@/components/main-layout";
import Section from "@/components/section";
import schema from "@/utils/schema";
import { metadata as metadataSchema } from "@/app/layout";
export const metadata: Metadata = {
    title: "Contact Us",
    description:
        "Contact Jagadhatri Online™ for coverage, collaboration, or festival queries. Based in Chandannagar, we’re here to help 24×7 during puja season.",
    openGraph: {
        ...metadataSchema.openGraph,
        url: "/contact-us",
    },
    alternates: {
        canonical: "/contact-us",
    },
};

export default function Page() {
    const jsonLd = schema({
        path: "contact-us",
        title: "Contact Us",
    });

    return (
        <MainLayout title="Contact Us" jsonLd={jsonLd}>
            <Section title="Need any help?" description="Contact Us">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                    <div className="relative">
                        <Contact />
                    </div>
                    <GoogleMapsEmbed
                        apiKey={process.env.GOOGLE_MAP_API_KEY!}
                        height={400}
                        width="100%"
                        mode="place"
                        zoom="18"
                        q="Chandannagar,Hooghly,West+Bengal,712136"
                    />
                </div>
            </Section>
        </MainLayout>
    );
}
