# Acutio growth & SEO plan

## How the market leaders win (and what Acutio copied)

| Site | What drives their traffic | Applied to Acutio |
|---|---|---|
| **iLovePDF / Smallpdf** | One tool = one page with the exact keyword in URL, title and H1. Huge dropzone above the fold. Dozens of near-duplicate "X to Y" pages, each targeting its own keyword. | Every tool has its own URL/title/H1. Alias pages (`png-to-pdf`, `png-to-jpg`, `webp-to-jpg`, `heic-to-jpg`, `remove-pdf-pages`) reuse code but target separate keywords with unique copy. |
| **TinyWow / 123apps** | Very wide catalogue, "free, no sign-up" promise, strong internal linking between tools. | 68 tools across 9 categories, "free / no sign-up / private" badges on every page, related-tools block, mega-menu, footer link mesh, A–Z list on the homepage. |
| **Calculator.net / Omni** | Long-tail calculators with formulas explained and FAQ content. | 12 calculators showing their formulas, FAQ + HowTo structured data. |
| **CodeBeautify / JSONFormatter** | Developer utilities that rank on "online" + tool name and get bookmarked. | 6 developer tools, all with no server round-trip. |
| **Wheel of Names / Pomofocus** | Viral single-purpose tools people share and come back to. | Spin the Wheel, Pomodoro, Stopwatch, Countdown, saved state in the browser so people come back. |

**Acutio's differentiator: privacy.** Most competitors upload files to their servers. Acutio processes everything in the browser. Put this front and centre in every social post, directory listing and ad.

## What's built into the site now

- Central registry (`lib/tools.ts`) drives the nav, search, homepage, category pages, related tools and `sitemap.xml`.
- Per-tool metadata with canonical URL, Open Graph/Twitter tags and a share image.
- JSON-LD on every tool: `WebApplication`, `BreadcrumbList`, `HowTo` and `FAQPage`. Plus `Organization`, `WebSite` + `SearchAction` site-wide, and `CollectionPage` on categories.
- `robots.txt`, `sitemap.xml` and a PWA `manifest.webmanifest` (installable to the home screen).
- Fast static HTML, self-hosted font, analytics loaded last.
- Retention features stored only in the visitor's browser: favourites, recently used tools, saved settings.

## Do these after deploying (cannot be done in code)

1. **Google Search Console**: verify the domain, submit `https://acutio.com/sitemap.xml`, then request indexing for the top 20 tool URLs. Do the same in **Bing Webmaster Tools** (it also feeds ChatGPT search and DuckDuckGo).
2. **Fix 301s on the host**: make sure `http://` → `https://` and `www.` → apex both redirect, and that URLs without a trailing slash 301 to the trailing-slash version.
3. **Backlinks (biggest ranking factor you control)**:
   - Launch on Product Hunt, Hacker News ("Show HN: 65 browser-only tools, nothing uploaded"), Reddit (r/InternetIsBeautiful, r/webdev, r/productivity, r/srilanka) and Indie Hackers.
   - Submit to free-tool directories: AlternativeTo (list as an alternative to iLovePDF, Smallpdf, TinyWow), SaaSHub, Futurepedia-style tool lists, and "free tools" GitHub awesome-lists.
   - Write a short guest post or answer on Quora/Stack Exchange where a tool genuinely solves the question.
4. **Content**: add a short guide (300–800 words) under each high-volume tool, e.g. "How to compress a PDF to under 1 MB" or "How to convert HEIC to JPG on Windows". Long-tail guides bring a lot of traffic.
5. **Localisation**: Sinhala, Tamil, Hindi, Spanish and Portuguese versions of the top 15 tools (`/si/`, `/ta/`…). iLovePDF gets most of its traffic from non-English pages. The registry makes this a translation job, not a rebuild.
6. **Track**: watch Search Console impressions per tool weekly. Expand categories that get impressions, and improve titles where impressions are high but CTR is low.

## Next tools worth adding (high search volume, browser-only)

Not yet verified with keyword data — confirm volumes in Ahrefs/Search Console first.

- **Medium effort, very high demand:** background remover (on-device ML), image to text / OCR (tesseract.js, supports Sinhala & Tamil), video compressor / video to MP3 / GIF maker (ffmpeg.wasm), protect & unlock PDF (qpdf-wasm).
- **Easy:** MP3 cutter / ringtone maker, signature generator, invoice generator, meme generator, collage maker, barcode generator, passport photo maker, CSV↔JSON converter, mic/webcam test.
- **Sri Lanka niche:** FM Abhaya / legacy Sinhala font → Unicode converter (needs an accurate glyph mapping table — test against real FM documents before launch).
- **Deliberately skipped:** PDF↔Word/Excel and AI writing/translation (need a server, which breaks the no-data policy), YouTube/Instagram downloaders (terms-of-service and copyright risk), internet speed test (needs server bandwidth).
