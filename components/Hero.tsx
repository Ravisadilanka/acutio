"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Search, ShieldCheck, Zap, Infinity as InfinityIcon, WifiOff } from "lucide-react";
import { getTool } from "@/lib/tools";
import { searchTools, openSearch } from "./SearchDialog";

const quick = ["merge-pdf", "compress-image", "qr-code-generator", "password-generator", "word-counter", "bmi-calculator", "compress-pdf", "spin-the-wheel"];

export default function Hero({ toolCount }: { toolCount: number }) {
  const [q, setQ] = useState("");
  const suggestions = useMemo(() => (q ? searchTools(q, 6) : []), [q]);

  return (
    <section className="relative overflow-hidden border-b">
      <div className="bg-grid pointer-events-none absolute inset-0" />
      <div className="pointer-events-none absolute -top-40 left-1/2 h-[28rem] w-[60rem] -translate-x-1/2 rounded-full bg-gradient-to-r from-indigo-500 via-fuchsia-500 to-pink-500 opacity-20 blur-3xl dark:opacity-25" />

      <div className="relative mx-auto max-w-4xl px-4 pb-16 pt-14 text-center sm:px-6 sm:pt-20">
        <p className="mx-auto inline-flex items-center gap-2 rounded-full border bg-surface/70 px-3 py-1 text-sm font-medium text-gray-700 backdrop-blur animate-fade-up">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
          </span>
          {toolCount}+ tools · 100% free · no sign-up
        </p>

        <h1 className="mt-6 text-4xl font-extrabold tracking-tight text-gray-900 sm:text-6xl">
          Every tool you need,
          <br />
          <span className="bg-gradient-to-r from-indigo-500 via-fuchsia-500 to-pink-500 bg-clip-text text-transparent">free & private.</span>
        </h1>

        <p className="mx-auto mt-5 max-w-2xl text-lg text-gray-600">
          Edit PDFs, compress images, generate QR codes, calculate anything and more — all inside your browser. Your files never touch our servers.
        </p>

        <form
          className="relative mx-auto mt-8 max-w-2xl animate-fade-up"
          style={{ animationDelay: "180ms" }}
          action="/search/"
          onSubmit={(e) => {
            if (suggestions[0]) {
              e.preventDefault();
              window.location.href = suggestions[0].href;
            }
          }}
          role="search"
        >
          <Search className="pointer-events-none absolute left-5 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
          <input
            name="q"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            onFocus={() => {
              if (window.matchMedia("(max-width: 640px)").matches) openSearch(q);
            }}
            placeholder="What do you want to do? Try “compress pdf”"
            className="h-16 w-full rounded-2xl border bg-surface pl-14 pr-32 text-lg text-gray-900 shadow-xl shadow-gray-900/5 outline-none transition focus:border-brand focus:ring-4 focus:ring-brand-soft"
            autoComplete="off"
            aria-label="Search tools"
          />
          <button type="submit" className="btn-primary absolute right-2 top-1/2 -translate-y-1/2">
            Search
          </button>
          {suggestions.length > 0 && (
            <ul className="card absolute left-0 right-0 top-full z-20 mt-2 overflow-hidden p-2 text-left shadow-2xl">
              {suggestions.map((t) => (
                <li key={t.slug}>
                  <Link href={t.href} className="flex items-center gap-3 rounded-xl px-3 py-2.5 hover:bg-gray-100">
                    <t.icon className="h-5 w-5 text-brand-ink" />
                    <span className="font-medium text-gray-900">{t.name}</span>
                    <span className="hidden truncate text-sm text-gray-500 sm:inline">— {t.description}</span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </form>

        <div className="mt-5 flex flex-wrap justify-center gap-2 animate-fade-up" style={{ animationDelay: "240ms" }}>
          {quick.map((s) => {
            const t = getTool(s);
            return (
              <Link key={s} href={t.href} className="chip bg-surface/70 backdrop-blur">
                {t.name}
              </Link>
            );
          })}
        </div>

        <ul className="mx-auto mt-12 grid max-w-3xl grid-cols-2 gap-4 text-sm sm:grid-cols-4">
          {[
            { icon: ShieldCheck, label: "Private by design", sub: "Processed on your device", c: "text-emerald-500" },
            { icon: Zap, label: "Instant", sub: "No upload wait", c: "text-amber-500" },
            { icon: InfinityIcon, label: "No limits", sub: "Use as much as you like", c: "text-brand-ink" },
            { icon: WifiOff, label: "Works offline", sub: "Once the page loads", c: "text-sky-500" },
          ].map(({ icon: I, label, sub, c }) => (
            <li key={label} className="flex flex-col items-center gap-1">
              <I className={`h-6 w-6 ${c}`} />
              <span className="font-semibold text-gray-900">{label}</span>
              <span className="text-gray-500">{sub}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
