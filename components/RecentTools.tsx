"use client";

import Link from "next/link";
import { History, Star } from "lucide-react";
import { tools } from "@/lib/tools";
import { useFavorites, useRecent } from "@/lib/local";

/** Shows the visitor's own favourites and recently used tools (stored only in their browser). */
export default function RecentTools() {
  const recent = useRecent();
  const { favs } = useFavorites();
  const pick = (slugs: string[]) => slugs.map((s) => tools.find((t) => t.slug === s)).filter(Boolean) as typeof tools;
  const favTools = pick(favs);
  const recentTools = pick(recent).filter((t) => !favs.includes(t.slug));
  if (!favTools.length && !recentTools.length) return null;

  const Row = ({ title, icon, list }: { title: string; icon: React.ReactNode; list: typeof tools }) =>
    list.length ? (
      <div className="flex flex-wrap items-center gap-2">
        <span className="mr-1 flex items-center gap-1.5 text-sm font-semibold text-gray-700">
          {icon}
          {title}
        </span>
        {list.map((t) => (
          <Link key={t.slug} href={t.href} className="chip flex items-center gap-1.5 bg-surface">
            <t.icon className="h-4 w-4" />
            {t.name}
          </Link>
        ))}
      </div>
    ) : null;

  return (
    <section className="mx-auto mt-10 max-w-7xl space-y-3 px-4 sm:px-6">
      <Row title="Favourites" icon={<Star className="h-4 w-4 fill-amber-400 text-amber-400" />} list={favTools} />
      <Row title="Recently used" icon={<History className="h-4 w-4" />} list={recentTools} />
    </section>
  );
}
