interface Parent {
    title: string;
    slug: string;
}

interface SchemaOptions {
    path: string;
    title: string;
    parents?: Parent[];
    dates?: {
        published?: string;
        modified?: string;
    };
    type?: {
        collection?: boolean;
    };
}

interface SchemaItem {
    "@type": string;
    "@id": string;
    [key: string]: any;
}

interface BreadcrumbItem {
    "@type": "ListItem";
    position: string;
    item: {
        "@id": string;
        name: string;
    };
}

export const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "";

function generateBreadcrumbs(path: string, title: string, parents?: Parent[]): Array<BreadcrumbItem> {
    const homeBreadcrumb = {
        "@type": "ListItem" as const,
        position: "1",
        item: {
            "@id": baseUrl,
            "@type": "Thing",
            name: "Home",
        },
    };

    const parentsBreadcrumbs =
        parents?.map((parent, index) => {
            return {
                "@type": "ListItem" as const,
                position: String(index + 2),
                item: {
                    "@id": `${baseUrl}/${parents
                        .slice(0, index + 1)
                        .map((p) => p.slug)
                        .join("/")}`,
                    "@type": "Thing",
                    name: parent.title,
                },
            };
        }) || [];

    const currentBreadcrumb = {
        "@type": "ListItem" as const,
        position: String(parentsBreadcrumbs.length + 2),
        item: {
            "@id": `${baseUrl}/${path}`,
            "@type": "Thing",
            name: title,
        },
    };

    return [homeBreadcrumb, ...parentsBreadcrumbs, currentBreadcrumb];
}

export default function schema({ path, title, parents, type, dates }: SchemaOptions) {
    const siteSchema: { "@context": string; "@graph": SchemaItem[] } = {
        "@context": "https://schema.org",
        "@graph": [
            {
                "@type": "Organization",
                "@id": `${baseUrl}/#organization`,
                name: "Jagadhatri Online",
                url: baseUrl,
                logo: `${baseUrl}/circle-logo.png`,
                email: "info@jagadhatrionline.co.in",
                sameAs: [
                    "https://www.facebook.com/JagadhatriOnlineOfficial/",
                    "https://www.youtube.com/c/JagadhatriOnline?sub_confirmation=1",
                    "https://www.instagram.com/jagadhatri_online",
                    "https://www.threads.com/@jagadhatri_online",
                    "https://x.com/Official_JO16",
                    "https://www.pinterest.com/jagadhatrionline/",
                    "https://www.whatsapp.com/channel/0029Va54b17DOQIQ6yoP9t39",
                ],
            },
            {
                "@type": "WebSite",
                "@id": `${baseUrl}/#website`,
                url: baseUrl,
                name: "Jagadhatri Online",
                publisher: {
                    "@id": `${baseUrl}/#organization`,
                },
                inLanguage: "en-IN",
                potentialAction: {
                    "@type": "SearchAction",
                    target: `${baseUrl}/?q={search_term_string}`,
                    "query-input": "required name=search_term_string",
                },
            },
            {
                "@type": "BreadcrumbList",
                "@id": `${baseUrl}/${path}/#breadcrumb`,
                name: `Navigate to ${title}`,
                itemListElement: generateBreadcrumbs(path, title, parents),
            },
            {
                "@type": "WebPage",
                "@id": `${baseUrl}/${path}/#webpage`,
                url: `${baseUrl}/${path}`,
                name: `${title} - Jagadhatri Online™ | the #1 Popular Jagadhatri Puja Portal`,
                datePublished: dates?.published ?? "2016-05-06T00:00:00+05:30",
                dateModified: dates?.modified ?? "2024-11-01T11:26:00+05:30",
                isPartOf: {
                    "@id": `${baseUrl}/#website`,
                },
                inLanguage: "en-IN",
                breadcrumb: {
                    "@id": `${baseUrl}/${path}/#breadcrumb`,
                },
            },
        ],
    };

    if (type?.collection) {
        siteSchema["@graph"].push({
            "@type": "CollectionPage",
            "@id": `${baseUrl}/${path}/#webpage`,
            url: `${baseUrl}/${path}`,
            name: title,
            isPartOf: {
                "@id": `${baseUrl}/#website`,
            },
            inLanguage: "en-IN",
            breadcrumb: {
                "@id": `${baseUrl}/${path}/#breadcrumb`,
            },
        });
    }

    return siteSchema;
}
