#!/usr/bin/env node
/**
 * Post-build: give every sitemap URL an accurate <lastmod>.
 *
 * Each page's visible content (<main>, incl. its JSON-LD) is fingerprinted and
 * compared with the fingerprints from the previous deploy, read from the live
 * https://acutio.com/lastmod.json (one request). Unchanged pages keep their old
 * date; changed or new pages get today's date. Search engines then re-crawl
 * only what really changed, instead of seeing "everything changed" on every deploy.
 *
 * Outputs:
 *   out/sitemap.xml       rewritten with per-page <lastmod>
 *   out/lastmod.json      fingerprints + dates, deployed for the next comparison
 *   .changed-urls.txt     URLs that changed (used by scripts/indexnow.mjs; not deployed)
 *
 * Env: LASTMOD_OFFLINE=1 skips fetching the previous manifest (dates = today).
 *      LASTMOD_PREV=<file> reads the previous manifest from a local file (for testing).
 */
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";

const SITE = "https://acutio.com";
const OUT = "out";
const today = new Date().toISOString().slice(0, 10);

const sitemapPath = path.join(OUT, "sitemap.xml");
if (!fs.existsSync(sitemapPath)) {
  console.error("lastmod: out/sitemap.xml not found — run after `next build`.");
  process.exit(1);
}
const xml = fs.readFileSync(sitemapPath, "utf8");
const urls = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1].trim());

function fingerprint(url) {
  const file = path.join(OUT, new URL(url).pathname, "index.html");
  if (!fs.existsSync(file)) return null;
  const html = fs.readFileSync(file, "utf8");
  const main = html.match(/<main[\s\S]*<\/main>/)?.[0] ?? html;
  // Keep structured data (it's content); drop framework scripts and whitespace noise.
  const normalized = main
    .replace(/<script(?![^>]*application\/ld\+json)[\s\S]*?<\/script>/g, "")
    .replace(/\s+/g, " ");
  return crypto.createHash("sha256").update(normalized).digest("hex").slice(0, 16);
}

async function previousManifest() {
  if (process.env.LASTMOD_OFFLINE === "1") return { status: "offline", pages: {} };
  if (process.env.LASTMOD_PREV) {
    const json = JSON.parse(fs.readFileSync(process.env.LASTMOD_PREV, "utf8"));
    return { status: "ok", pages: json.pages ?? {} };
  }
  try {
    const res = await fetch(`${SITE}/lastmod.json`, {
      signal: AbortSignal.timeout(15000),
      headers: { "user-agent": "AcutioDeploy/1.0 (+https://acutio.com)" },
    });
    if (res.status === 404) return { status: "first-run", pages: {} };
    if (!res.ok) return { status: `http-${res.status}`, pages: {} };
    const json = await res.json();
    return { status: "ok", pages: json.pages ?? {} };
  } catch (e) {
    return { status: `error: ${e.message}`, pages: {} };
  }
}

const prev = await previousManifest();
const pages = {};
const changed = [];
for (const url of urls) {
  const hash = fingerprint(url);
  const old = prev.pages[url];
  if (hash && old && old.hash === hash) {
    pages[url] = { hash, lastmod: old.lastmod };
  } else {
    pages[url] = { hash, lastmod: today };
    changed.push(url);
  }
}

// Rewrite <lastmod> for each <url> entry.
const rewritten = xml.replace(/<url>([\s\S]*?)<\/url>/g, (block, inner) => {
  const loc = inner.match(/<loc>([^<]+)<\/loc>/)?.[1].trim();
  const date = loc && pages[loc]?.lastmod;
  if (!date) return block;
  const withoutOld = inner.replace(/<lastmod>[^<]*<\/lastmod>\s*/g, "");
  return `<url>${withoutOld.replace(/(<loc>[^<]+<\/loc>)/, `$1\n<lastmod>${date}</lastmod>`)}</url>`;
});
fs.writeFileSync(sitemapPath, rewritten);
fs.writeFileSync(path.join(OUT, "lastmod.json"), JSON.stringify({ generated: new Date().toISOString(), pages }, null, 1));

// Only notify search engines when we could actually compare with the last deploy
// (or it's the very first run). A failed fetch must not mark the whole site as changed.
const trustworthy = prev.status === "ok" || prev.status === "first-run";
fs.writeFileSync(".changed-urls.txt", trustworthy ? changed.join("\n") : "");

console.log(
  `lastmod: ${urls.length} URLs, ${changed.length} changed (previous manifest: ${prev.status})` +
    (trustworthy ? "" : " — skipping IndexNow list because the previous manifest was unavailable"),
);
