import Link from "next/link";
import { ChevronRight, ShieldCheck, Zap, BadgeCheck, ChevronDown } from "lucide-react";
import { getTool, getCategory, relatedTools } from "@/lib/tools";
import { getContent, commonFaqs } from "@/lib/tool-content";
import { toolJsonLd, JsonLd } from "@/lib/seo";
import ToolActions from "./ToolActions";
import ToolCard from "./ToolCard";

/**
 * Wraps every tool page with: breadcrumbs, H1 + intro, trust badges, the
 * interactive tool (children), how-to steps, features, FAQ accordion,
 * related tools and JSON-LD structured data.
 */
export default function ToolShell({ slug, children, wide = false }: { slug: string; children: React.ReactNode; wide?: boolean }) {
  const tool = getTool(slug);
  const cat = getCategory(tool.category);
  const c = getContent(slug);
  const faqs = [...c.faqs, ...commonFaqs(tool.name)];
  const Icon = tool.icon;

  return (
    <main>
      <JsonLd data={toolJsonLd(slug)} />

      <section className="relative overflow-hidden border-b">
        <div className="bg-grid pointer-events-none absolute inset-0 opacity-60" />
        <div className={`pointer-events-none absolute -top-24 left-1/2 h-64 w-[40rem] -translate-x-1/2 rounded-full bg-gradient-to-r ${cat.gradient} opacity-[0.12] blur-3xl`} />
        <div className="relative mx-auto max-w-5xl px-4 pb-8 pt-6 sm:px-6">
          <nav aria-label="Breadcrumb" className="flex items-center gap-1 text-sm text-gray-500">
            <Link href="/" className="hover:text-gray-900">Home</Link>
            <ChevronRight className="h-3.5 w-3.5" />
            <Link href={cat.href} className="hover:text-gray-900">{cat.name}</Link>
            <ChevronRight className="h-3.5 w-3.5" />
            <span className="truncate text-gray-900">{tool.name}</span>
          </nav>

          <div className="mt-6 flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex gap-4">
              <span className={`hidden h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br ${cat.gradient} text-white shadow-lg sm:flex`}>
                <Icon className="h-7 w-7" />
              </span>
              <div>
                <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">{c.h1 ?? tool.name}</h1>
                <p className="mt-2 max-w-2xl text-base leading-relaxed text-gray-600 sm:text-lg">{c.intro}</p>
              </div>
            </div>
            <ToolActions slug={slug} name={tool.name} />
          </div>

          <ul className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-sm text-gray-600">
            <li className="flex items-center gap-1.5"><BadgeCheck className="h-4 w-4 text-brand" />100% free</li>
            <li className="flex items-center gap-1.5"><ShieldCheck className="h-4 w-4 text-emerald-500" />Private — runs in your browser</li>
            <li className="flex items-center gap-1.5"><Zap className="h-4 w-4 text-amber-500" />No sign-up</li>
          </ul>
        </div>
      </section>

      <section className={`mx-auto px-4 py-8 sm:px-6 ${wide ? "max-w-7xl" : "max-w-5xl"}`}>{children}</section>

      <section className="mx-auto max-w-5xl px-4 sm:px-6">
        <div className="mt-10 grid gap-6 md:grid-cols-2">
          <div className="card p-6">
            <h2 className="text-xl font-bold text-gray-900">How to use {tool.name}</h2>
            <ol className="mt-4 space-y-3">
              {c.steps.map((s, i) => (
                <li key={s} className="flex gap-3 text-gray-700">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand-soft text-xs font-bold text-brand">{i + 1}</span>
                  <span>{s}</span>
                </li>
              ))}
            </ol>
          </div>
          <div className="card p-6">
            <h2 className="text-xl font-bold text-gray-900">Why use Acutio&apos;s {tool.name}?</h2>
            <ul className="mt-4 space-y-3">
              {c.features.map((f) => (
                <li key={f} className="flex gap-3 text-gray-700">
                  <BadgeCheck className="mt-0.5 h-5 w-5 shrink-0 text-emerald-500" />
                  <span>{f}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12">
          <h2 className="text-2xl font-bold text-gray-900">Frequently asked questions</h2>
          <div className="mt-5 divide-y rounded-2xl border bg-surface">
            {faqs.map((f, i) => (
              <details key={f.q} className="group p-5" open={i === 0}>
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-semibold text-gray-900">
                  {f.q}
                  <ChevronDown className="h-5 w-5 shrink-0 text-gray-400 transition group-open:rotate-180" />
                </summary>
                <p className="mt-3 leading-relaxed text-gray-600">{f.a}</p>
              </details>
            ))}
          </div>
        </div>

        <div className="mt-14">
          <div className="flex items-end justify-between">
            <h2 className="text-2xl font-bold text-gray-900">Related tools</h2>
            <Link href={cat.href} className="text-sm font-medium text-brand hover:underline">All {cat.name} →</Link>
          </div>
          <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {relatedTools(slug).map((t) => (
              <ToolCard key={t.slug} tool={t} />
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
