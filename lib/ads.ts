/**
 * Google AdSense configuration.
 *
 * After AdSense gives you a publisher ID, paste it here (format: "ca-pub-1234567890123456")
 * and redeploy. That single change:
 *   - adds the AdSense script to every page (needed for the site review), and
 *   - publishes https://acutio.com/ads.txt with your seller record.
 * Leave it empty until then — nothing ad-related is loaded.
 */
export const ADSENSE_CLIENT = "";

/** "ca-pub-123…" → "pub-123…" for ads.txt */
export const ADSENSE_PUB = ADSENSE_CLIENT.replace(/^ca-/, "");
