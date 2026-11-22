import Link from "next/link";
import type { Metadata } from "next";
import { ArrowRight, Lock, Server, Cookie, ChevronDown } from "lucide-react";
import Hero from "@/components/Hero";
import RecentTools from "@/components/RecentTools";
import ToolCard from "@/components/tool/ToolCard";
import { categories, popularTools, tools, toolsIn } from "@/lib/tools";

export const metadata: Metadata = {
  title: { absolute: "Acutio – 65+ Free Online Tools for PDF, Images, Calculators & More" },
  alternates: { canonical: "/" },
};

const homeFaqs = [
  { q: "Are Acutio tools really free?", a: "Yes. Every tool is completely free with no sign-up, no watermarks and no daily limits." },
  { q: "Do you upload or store my files?", a: "No. Tools run entirely in your web browser using JavaScript, so your PDFs, images and text are processed on your own device and never sent to our servers." },
  { q: "Do I need to install anything?", a: "No installation is needed. Acutio works in any modern browser on Windows, macOS, Linux, Android and iOS." },
  { q: "Can I use Acutio on my phone?", a: "Yes. All tools are mobile-friendly, and you can add Acutio to your home screen like an app." },
];

export default function Home() {
  const count = Math.floor(tools.length / 5) * 5;
  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: homeFaqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
          }),
        }}
      />
      <Hero toolCount={count} />
      <RecentTools />

      {/* Popular */}
      <section className="mx-auto mt-14 max-w-7xl px-4 sm:px-6">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">Most popular tools</h2>
            <p className="mt-1 text-gray-500">The tools people use every day.</p>
          </div>
        </div>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {popularTools().slice(0, 16).map((t) => (
            <ToolCard key={t.slug} tool={t} />
          ))}
        </div>
      </section>

      {/* Category browser */}
      <section className="mx-auto mt-20 max-w-7xl px-4 sm:px-6">
        <h2 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">Browse by category</h2>
        <div className="mt-6 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {categories.map((c) => {
            const list = toolsIn(c.id);
            return (
              <div key={c.id} className="card group relative overflow-hidden p-6 transition hover:shadow-xl hover:shadow-brand/5">
                <div className={`pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-gradient-to-br ${c.gradient} opacity-10 blur-2xl transition group-hover:opacity-25`} />
                <Link href={c.href} className="flex items-center gap-3">
                  <span className={`flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${c.gradient} text-white shadow-lg`}>
                    <c.icon className="h-6 w-6" />
                  </span>
                  <span>
                    <span className="block text-lg font-bold text-gray-900">{c.name}</span>
                    <span className="block text-sm text-gray-500">{list.length} tools · {c.short}</span>
                  </span>
                </Link>
                <ul className="mt-5 grid grid-cols-2 gap-x-4 gap-y-2">
                  {list.slice(0, 8).map((t) => (
                    <li key={t.slug}>
                      <Link href={t.href} className="block truncate text-sm text-gray-600 hover:text-brand">
                        {t.name}
                      </Link>
                    </li>
                  ))}
                </ul>
                <Link href={c.href} className="mt-5 inline-flex items-center gap-1 text-sm font-semibold text-brand">
                  View all <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
                </Link>
              </div>
            );
          })}
        </div>
      </section>

      {/* Privacy pitch */}
      <section className="mx-auto mt-20 max-w-7xl px-4 sm:px-6">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-600 via-violet-600 to-fuchsia-600 p-8 text-white sm:p-12">
          <div className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full bg-white/10 blur-2xl" />
          <h2 className="max-w-2xl text-3xl font-extrabold tracking-tight sm:text-4xl">Your files stay on your device. Always.</h2>
          <p className="mt-3 max-w-2xl text-white/80">
            Most “free” online tools upload your documents to their servers. Acutio doesn&apos;t. Every tool runs locally in your browser, so there&apos;s nothing to leak, sell or delete.
          </p>
          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            {[
              { icon: Server, t: "No uploads", d: "Files are processed with your own computer's power." },
              { icon: Lock, t: "No accounts", d: "No email, no password, no tracking of what you edit." },
              { icon: Cookie, t: "Nothing stored", d: "Close the tab and everything is gone." },
            ].map(({ icon: I, t, d }) => (
              <div key={t} className="rounded-2xl bg-white/10 p-5 backdrop-blur">
                <I className="h-6 w-6" />
                <p className="mt-3 font-semibold">{t}</p>
                <p className="mt-1 text-sm text-white/75">{d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* All tools A–Z: strong internal linking for SEO */}
      <section className="mx-auto mt-20 max-w-7xl px-4 sm:px-6">
        <h2 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">All free tools</h2>
        <ul className="mt-6 columns-2 gap-6 text-sm sm:columns-3 lg:columns-5">
          {[...tools].sort((a, b) => a.name.localeCompare(b.name)).map((t) => (
            <li key={t.slug} className="mb-2 break-inside-avoid">
              <Link href={t.href} className="text-gray-600 hover:text-brand">
                {t.name}
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section className="mx-auto mt-20 max-w-3xl px-4 sm:px-6">
        <h2 className="text-center text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">Questions?</h2>
        <div className="mt-6 divide-y rounded-2xl border bg-surface">
          {homeFaqs.map((f) => (
            <details key={f.q} className="group p-5">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-semibold text-gray-900">
                {f.q}
                <ChevronDown className="h-5 w-5 shrink-0 text-gray-400 transition group-open:rotate-180" />
              </summary>
              <p className="mt-3 text-gray-600">{f.a}</p>
            </details>
          ))}
        </div>
      </section>
    </main>
  );
}
