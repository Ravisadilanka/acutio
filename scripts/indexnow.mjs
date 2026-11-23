#!/usr/bin/env node
/**
 * After deploy: tell IndexNow search engines (Bing, Yandex, Seznam, Naver…)
 * which pages changed, so they re-crawl them within minutes. Google does not
 * use IndexNow — it relies on the sitemap's <lastmod> dates instead.
 *
 * Reads .changed-urls.txt written by scripts/lastmod.mjs. The key file
 * public/<key>.txt proves site ownership (IndexNow keys are public by design).
 * Never fails the deploy: errors are logged and the script exits 0.
 * INDEXNOW_DRY=1 prints the request instead of sending it.
 */
import fs from "node:fs";

const HOST = "acutio.com";

try {
  const list = fs.existsSync(".changed-urls.txt")
    ? fs.readFileSync(".changed-urls.txt", "utf8").split("\n").map((s) => s.trim()).filter(Boolean)
    : [];
  if (!list.length) {
    console.log("IndexNow: no changed pages — nothing to submit.");
    process.exit(0);
  }

  const keyFile = fs.readdirSync("public").find((f) => /^[a-f0-9]{32}\.txt$/.test(f));
  if (!keyFile) {
    console.log("IndexNow: no key file in public/ — skipping.");
    process.exit(0);
  }
  const key = keyFile.replace(/\.txt$/, "");

  const payload = { host: HOST, key, keyLocation: `https://${HOST}/${keyFile}`, urlList: list.slice(0, 10000) };
  if (process.env.INDEXNOW_DRY === "1") {
    console.log("IndexNow (dry run) would POST:", JSON.stringify(payload, null, 1));
    process.exit(0);
  }

  const res = await fetch("https://api.indexnow.org/indexnow", {
    method: "POST",
    headers: { "Content-Type": "application/json; charset=utf-8" },
    body: JSON.stringify(payload),
    signal: AbortSignal.timeout(30000),
  });
  // 200 = accepted, 202 = accepted (key validation pending).
  console.log(`IndexNow: submitted ${list.length} URL(s) → HTTP ${res.status}`);
  if (!res.ok) console.log(await res.text().catch(() => ""));
} catch (e) {
  console.log(`IndexNow: failed (${e.message}) — deploy is unaffected.`);
}
