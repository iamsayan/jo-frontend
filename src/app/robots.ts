import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
    return {
        rules: [
            {
                userAgent: "*",
                allow: "/",
                disallow: ["/cinematics/register"],
            },
            ...[
                "GPTBot",
                "ChatGPT-User",
                "CCBot",
                "anthropic-ai",
                "ClaudeBot",
                "Bytespider",
                "Amazonbot",
                "Claude-User",
                "MistralAI-User",
                "OAI-SearchBot",
                "Perplexity-User",
                "PerplexityBot",
                "Grok",
                "GrokBot",
                "xAI",
            ].map((userAgent) => ({ userAgent, disallow: "/" })),
        ],
        sitemap: `${process.env.NEXT_PUBLIC_SITE_URL}/sitemap.xml`,
    };
}
