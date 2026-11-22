"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, X, Search, ChevronDown } from "lucide-react";
import Logo from "./Logo";
import ThemeToggle from "./ThemeToggle";
import SearchDialog, { openSearch } from "./SearchDialog";
import { categories, toolsIn } from "@/lib/tools";

const primary = ["pdf", "image", "calculators", "converters", "text"] as const;

export default function Navbar() {
  const [mobile, setMobile] = useState(false);
  const [mega, setMega] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setMobile(false);
    setMega(false);
  }, [pathname]);

  return (
    <header className="sticky top-0 z-50 border-b bg-page/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-4 px-4 sm:px-6">
        <Link href="/" aria-label="Acutio home" className="shrink-0">
          <Logo />
        </Link>

        <nav className="ml-4 hidden items-center gap-1 text-sm font-medium lg:flex" aria-label="Main">
          {primary.map((id) => {
            const c = categories.find((x) => x.id === id)!;
            const active = pathname?.startsWith(c.href);
            return (
              <Link
                key={id}
                href={c.href}
                className={`rounded-lg px-3 py-2 transition hover:bg-gray-100 hover:text-gray-900 ${active ? "text-brand" : "text-gray-600"}`}
              >
                {c.name}
              </Link>
            );
          })}
          <div className="relative" onMouseLeave={() => setMega(false)}>
            <button
              onClick={() => setMega((v) => !v)}
              onMouseEnter={() => setMega(true)}
              className="flex items-center gap-1 rounded-lg px-3 py-2 text-gray-600 transition hover:bg-gray-100 hover:text-gray-900"
              aria-expanded={mega}
            >
              All tools <ChevronDown className={`h-4 w-4 transition ${mega ? "rotate-180" : ""}`} />
            </button>
            {mega && (
              <div className="absolute left-1/2 top-full z-50 w-[min(92vw,960px)] -translate-x-1/2 pt-2">
                <div className="card grid max-h-[75vh] grid-cols-3 gap-x-6 gap-y-5 overflow-y-auto p-6 shadow-2xl animate-fade-up">
                  {categories.map((c) => (
                    <div key={c.id}>
                      <Link href={c.href} className="mb-2 flex items-center gap-2 text-sm font-semibold text-gray-900 hover:text-brand">
                        <span className={`flex h-7 w-7 items-center justify-center rounded-lg ${c.tint}`}>
                          <c.icon className="h-4 w-4" />
                        </span>
                        {c.name}
                      </Link>
                      <ul className="space-y-1">
                        {toolsIn(c.id).slice(0, 7).map((t) => (
                          <li key={t.slug}>
                            <Link href={t.href} className="block truncate rounded px-1 py-0.5 text-sm text-gray-600 hover:text-brand">
                              {t.name}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </nav>

        <div className="ml-auto flex items-center gap-1">
          <button
            onClick={() => openSearch()}
            className="hidden items-center gap-2 rounded-xl border bg-gray-50 py-2 pl-3 pr-2 text-sm text-gray-500 transition hover:border-gray-300 sm:flex"
          >
            <Search className="h-4 w-4" />
            <span className="w-28 text-left">Search tools…</span>
            <kbd className="rounded-md border bg-surface px-1.5 py-0.5 font-sans text-[11px] text-gray-500">Ctrl K</kbd>
          </button>
          <button onClick={() => openSearch()} className="rounded-xl p-2.5 text-gray-600 hover:bg-gray-100 sm:hidden" aria-label="Search tools">
            <Search className="h-5 w-5" />
          </button>
          <ThemeToggle />
          <button onClick={() => setMobile((v) => !v)} className="rounded-xl p-2.5 text-gray-600 hover:bg-gray-100 lg:hidden" aria-label="Menu" aria-expanded={mobile}>
            {mobile ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {mobile && (
        <nav className="max-h-[calc(100vh-4rem)] overflow-y-auto border-t bg-page px-4 py-4 lg:hidden" aria-label="Mobile">
          <div className="grid grid-cols-2 gap-2">
            {categories.map((c) => (
              <Link key={c.id} href={c.href} className="flex items-center gap-2 rounded-xl border p-3 text-sm font-medium text-gray-800">
                <span className={`flex h-8 w-8 items-center justify-center rounded-lg ${c.tint}`}>
                  <c.icon className="h-4 w-4" />
                </span>
                {c.name}
              </Link>
            ))}
          </div>
        </nav>
      )}

      <SearchDialog />
    </header>
  );
}
