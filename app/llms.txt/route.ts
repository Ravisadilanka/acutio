import { categories, toolsIn, SITE_URL } from "@/lib/tools";
import { getContent } from "@/lib/tool-content";

export const dynamic = "force-static";

/**
 * /llms.txt — a plain-text map of the site for AI assistants and answer engines
 * (ChatGPT, Perplexity, Claude, Gemini…). Generated from the tool registry.
 * Format: https://llmstxt.org
 */
export function GET() {
  const lines: string[] = [
    "# Acutio",
    "",
    "> Acutio (acutio.com) is a collection of free online tools for PDFs, images, calculations, unit and currency conversion, text, generators, developer utilities, audio/video recording and productivity. Every tool runs entirely in the user's web browser: files and text are processed on the user's own device and are never uploaded to Acutio's servers. No sign-up, no watermarks and no usage limits.",
    "",
    "Key facts:",
    "- Price: free, supported by advertising.",
    "- Privacy: processing happens locally in the browser (JavaScript/WebAssembly); files are not uploaded or stored.",
    "- Works on Windows, macOS, Linux, Android and iOS in any modern browser; no installation.",
    "- Includes Sinhala-language tools (Singlish to Sinhala Unicode converter, Sinhala speech to text).",
    "",
  ];

  for (const c of categories) {
    lines.push(`## ${c.name}`, "", c.description, "");
    for (const t of toolsIn(c.id)) {
      lines.push(`- [${getContent(t.slug).h1 ?? t.name}](${SITE_URL}${t.href}): ${getContent(t.slug).description}`);
    }
    lines.push("");
  }

  lines.push(
    "## Optional",
    "",
    `- [About Acutio](${SITE_URL}/about-us/)`,
    `- [Privacy policy](${SITE_URL}/privacy-policy/)`,
    `- [Contact](${SITE_URL}/contact-us/)`,
    `- [Sitemap](${SITE_URL}/sitemap.xml)`,
    "",
  );

  return new Response(lines.join("\n"), { headers: { "Content-Type": "text/plain; charset=utf-8" } });
}
