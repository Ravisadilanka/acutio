import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/tools";

export const dynamic = "force-static";

/**
 * Search engines and AI answer engines are explicitly welcome: being cited by
 * ChatGPT, Perplexity, Claude, Gemini and Copilot is a growth channel (GEO).
 */
const AI_AND_SEARCH_BOTS = [
  "Googlebot",
  "Bingbot",
  "Google-Extended", // Gemini / AI Overviews training opt-in
  "GPTBot", // OpenAI
  "OAI-SearchBot", // ChatGPT search
  "ChatGPT-User",
  "PerplexityBot",
  "Perplexity-User",
  "ClaudeBot", // Anthropic
  "Claude-User",
  "Claude-SearchBot",
  "Applebot",
  "Applebot-Extended",
  "DuckAssistBot",
  "meta-externalagent",
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: AI_AND_SEARCH_BOTS, allow: "/", disallow: ["/search/"] },
      { userAgent: "*", allow: "/", disallow: ["/search/"] },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
