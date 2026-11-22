"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Search } from "lucide-react";
import { searchTools } from "@/components/SearchDialog";
import { getCategory } from "@/lib/tools";

export default function SearchResults() {
  const params = useSearchParams();
  const [q, setQ] = useState("");
  useEffect(() => setQ(params.get("q") ?? ""), [params]);
  const results = searchTools(q, 50);

  return (
    <>
      <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">Search tools</h1>
      <div className="relative mt-6">
        <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
        <input className="input h-14 pl-12 text-lg" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search tools…" autoFocus aria-label="Search tools" />
      </div>
      <ul className="mt-6 grid gap-3 sm:grid-cols-2">
        {results.map((t) => {
          const c = getCategory(t.category);
          return (
            <li key={t.slug}>
              <Link href={t.href} className="card flex items-center gap-3 p-4 hover:border-brand">
                <span className={`flex h-10 w-10 items-center justify-center rounded-xl ${c.tint}`}>
                  <t.icon className="h-5 w-5" />
                </span>
                <span>
                  <span className="block font-semibold text-gray-900">{t.name}</span>
                  <span className="block text-sm text-gray-500">{t.description}</span>
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
      {q && !results.length && <p className="mt-8 text-center text-gray-500">No tools found for “{q}”.</p>}
    </>
  );
}
