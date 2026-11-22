"use client";

import { useEffect, useState } from "react";
import { Star, Share2, Check } from "lucide-react";
import { trackRecent, useFavorites } from "@/lib/local";

export default function ToolActions({ slug, name }: { slug: string; name: string }) {
  const { favs, toggle } = useFavorites();
  const [shared, setShared] = useState(false);
  const fav = favs.includes(slug);

  useEffect(() => trackRecent(slug), [slug]);

  const share = async () => {
    const url = window.location.href.split("?")[0];
    try {
      if (navigator.share) {
        await navigator.share({ title: `${name} – free online tool`, url });
        return;
      }
      await navigator.clipboard.writeText(url);
      setShared(true);
      setTimeout(() => setShared(false), 2000);
    } catch {
      /* user cancelled */
    }
  };

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={() => toggle(slug)}
        className={`btn-secondary px-3 py-2 ${fav ? "text-amber-500" : ""}`}
        aria-pressed={fav}
        title={fav ? "Remove from favourites" : "Add to favourites"}
      >
        <Star className={`h-4 w-4 ${fav ? "fill-current" : ""}`} />
        <span className="hidden sm:inline">{fav ? "Saved" : "Save"}</span>
      </button>
      <button onClick={share} className="btn-secondary px-3 py-2" title="Share this tool">
        {shared ? <Check className="h-4 w-4 text-emerald-500" /> : <Share2 className="h-4 w-4" />}
        <span className="hidden sm:inline">{shared ? "Link copied" : "Share"}</span>
      </button>
    </div>
  );
}
