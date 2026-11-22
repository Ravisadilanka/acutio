import Link from "next/link";
import { ChevronRight } from "lucide-react";
import ToolCard from "@/components/tool/ToolCard";
import { getCategory, toolsIn, categories, SITE_URL, type CategoryId } from "@/lib/tools";
import { JsonLd } from "@/lib/seo";

export default function CategoryPage({ id }: { id: CategoryId }) {
  const cat = getCategory(id);
  const list = toolsIn(id);

  return (
    <main>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "CollectionPage",
              name: `Free ${cat.name}`,
              url: `${SITE_URL}${cat.href}`,
              description: cat.description,
              mainEntity: {
                "@type": "ItemList",
                itemListElement: list.map((t, i) => ({ "@type": "ListItem", position: i + 1, name: t.name, url: `${SITE_URL}${t.href}` })),
              },
            },
            {
              "@type": "BreadcrumbList",
              itemListElement: [
                { "@type": "ListItem", position: 1, name: "Home", item: `${SITE_URL}/` },
                { "@type": "ListItem", position: 2, name: cat.name, item: `${SITE_URL}${cat.href}` },
              ],
            },
          ],
        }}
      />
      <section className="relative overflow-hidden border-b">
        <div className="bg-grid pointer-events-none absolute inset-0" />
        <div className={`pointer-events-none absolute -top-32 left-1/2 h-72 w-[50rem] -translate-x-1/2 rounded-full bg-gradient-to-r ${cat.gradient} opacity-15 blur-3xl`} />
        <div className="relative mx-auto max-w-7xl px-4 py-12 sm:px-6">
          <nav aria-label="Breadcrumb" className="flex items-center gap-1 text-sm text-gray-500">
            <Link href="/" className="hover:text-gray-900">Home</Link>
            <ChevronRight className="h-3.5 w-3.5" />
            <span className="text-gray-900">{cat.name}</span>
          </nav>
          <div className="mt-6 flex items-center gap-4">
            <span className={`flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${cat.gradient} text-white shadow-lg`}>
              <cat.icon className="h-7 w-7" />
            </span>
            <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-5xl">Free {cat.name}</h1>
          </div>
          <p className="mt-4 max-w-3xl text-lg text-gray-600">{cat.description}</p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((t) => (
            <ToolCard key={t.slug} tool={t} />
          ))}
        </div>

        <h2 className="mt-16 text-xl font-bold text-gray-900">More categories</h2>
        <div className="mt-4 flex flex-wrap gap-2">
          {categories
            .filter((c) => c.id !== id)
            .map((c) => (
              <Link key={c.id} href={c.href} className="chip flex items-center gap-2 bg-surface">
                <c.icon className="h-4 w-4" /> {c.name}
              </Link>
            ))}
        </div>
      </section>
    </main>
  );
}
