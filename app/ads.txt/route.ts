import { ADSENSE_PUB } from "@/lib/ads";

export const dynamic = "force-static";

/** Authorized Digital Sellers file → /ads.txt (filled in once lib/ads.ts has a publisher ID). */
export function GET() {
  const body = ADSENSE_PUB
    ? `google.com, ${ADSENSE_PUB}, DIRECT, f08c47fec0942fa0\n`
    : "# Add your AdSense publisher ID in lib/ads.ts to publish your ads.txt record.\n";
  return new Response(body, { headers: { "Content-Type": "text/plain; charset=utf-8" } });
}
