"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Search, CornerDownLeft, X } from "lucide-react";
import { tools, getCategory, type Tool } from "@/lib/tools";

/** Open the global search from anywhere: openSearch() */
export const openSearch = (query = "") =>
  window.dispatchEvent(new CustomEvent("acutio:search", { detail: query }));

export function scoreTool(tool: Tool, q: string): number {
  if (!q) return tool.popular ? 1 : 0;
  const name = tool.name.toLowerCase();
  const hay = `${name} ${tool.tags ?? ""} ${tool.description} ${getCategory(tool.category).name}`.toLowerCase();
  const words = q.toLowerCase().split(/\s+/).filter(Boolean);
  let score = 0;
  for (const w of words) {
    if (name.startsWith(w)) score += 10;
    else if (name.includes(w)) score += 6;
    else if (hay.includes(w)) score += 2;
    else return 0; // every word must match somewhere
  }
  return score + (tool.popular ? 1 : 0);
}

export function searchTools(q: string, limit = 12): Tool[] {
  return tools
    .map((t) => ({ t, s: scoreTool(t, q.trim()) }))
    .filter((x) => x.s > 0)
    .sort((a, b) => b.s - a.s)
    .slice(0, limit)
    .map((x) => x.t);
}

export default function SearchDialog() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const results = useMemo(() => searchTools(query, 10), [query]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      const typing = /INPUT|TEXTAREA|SELECT/.test(target.tagName) || target.isContentEditable;
      // Tools that use the keyboard themselves (e.g. the calculator) opt out of "/" via data-keyboard-tool.
      const slashOk = !typing && !document.querySelector("[data-keyboard-tool]");
      if ((e.key === "k" && (e.metaKey || e.ctrlKey)) || (e.key === "/" && slashOk)) {
        e.preventDefault();
        setOpen(true);
      }
    };
    const onOpen = (e: Event) => {
      setQuery((e as CustomEvent<string>).detail ?? "");
      setOpen(true);
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener("acutio:search", onOpen);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("acutio:search", onOpen);
    };
  }, []);

  useEffect(() => {
    if (open) {
      setActive(0);
      document.body.style.overflow = "hidden";
      setTimeout(() => inputRef.current?.focus(), 10);
    } else {
      document.body.style.overflow = "";
    }
  }, [open]);

  useEffect(() => setActive(0), [query]);

  const go = (tool?: Tool) => {
    if (!tool) return;
    setOpen(false);
    setQuery("");
    router.push(tool.href);
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-start justify-center bg-gray-950/40 p-4 pt-[10vh] backdrop-blur-sm dark:bg-black/60"
      onMouseDown={() => setOpen(false)}
      role="dialog"
      aria-modal="true"
      aria-label="Search tools"
    >
      <div
        className="card w-full max-w-xl overflow-hidden shadow-2xl animate-fade-up"
        onMouseDown={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3 border-b px-4">
          <Search className="h-5 w-5 shrink-0 text-gray-400" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Escape") setOpen(false);
              if (e.key === "ArrowDown") {
                e.preventDefault();
                setActive((a) => Math.min(a + 1, results.length - 1));
              }
              if (e.key === "ArrowUp") {
                e.preventDefault();
                setActive((a) => Math.max(a - 1, 0));
              }
              if (e.key === "Enter") go(results[active]);
            }}
            placeholder="Search 65+ free tools… e.g. compress pdf, bmi, qr"
            className="h-14 w-full bg-transparent text-base outline-none placeholder:text-gray-400"
            aria-label="Search tools"
          />
          <button onClick={() => setOpen(false)} className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100" aria-label="Close search">
            <X className="h-4 w-4" />
          </button>
        </div>

        <ul className="max-h-[60vh] overflow-y-auto p-2">
          {!query && <li className="px-3 pb-1 pt-2 text-xs font-semibold uppercase tracking-wide text-gray-400">Popular tools</li>}
          {results.map((tool, i) => {
            const cat = getCategory(tool.category);
            const Icon = tool.icon;
            return (
              <li key={tool.slug}>
                <button
                  onClick={() => go(tool)}
                  onMouseEnter={() => setActive(i)}
                  className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left ${i === active ? "bg-gray-100" : ""}`}
                >
                  <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${cat.tint}`}>
                    <Icon className="h-[18px] w-[18px]" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate font-medium text-gray-900">{tool.name}</span>
                    <span className="block truncate text-sm text-gray-500">{tool.description}</span>
                  </span>
                  {i === active && <CornerDownLeft className="h-4 w-4 text-gray-400" />}
                </button>
              </li>
            );
          })}
          {query && results.length === 0 && (
            <li className="px-3 py-10 text-center text-sm text-gray-500">
              No tools match “{query}”. Try a simpler word like “pdf” or “image”.
            </li>
          )}
        </ul>
      </div>
    </div>
  );
}
