"use client";

import { useState } from "react";
import { Trash2 } from "lucide-react";
import { CopyButton, downloadText } from "@/components/ui/kit";

const words = (s: string) => s.replace(/([a-z0-9])([A-Z])/g, "$1 $2").split(/[^\p{L}\p{N}]+/u).filter(Boolean);
const small = new Set("a an and as at but by for in nor of on or the to up via".split(" "));
const cap = (w: string) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase();

const cases: { name: string; fn: (s: string) => string }[] = [
  { name: "Sentence case", fn: (s) => s.toLowerCase().replace(/(^\s*\p{L}|[.!?]\s+\p{L})/gu, (m) => m.toUpperCase()) },
  { name: "lower case", fn: (s) => s.toLowerCase() },
  { name: "UPPER CASE", fn: (s) => s.toUpperCase() },
  { name: "Title Case", fn: (s) => s.toLowerCase().replace(/\p{L}[\p{L}'’]*/gu, (w, i: number) => (i > 0 && small.has(w) ? w : cap(w))) },
  { name: "Capitalized Case", fn: (s) => s.toLowerCase().replace(/\p{L}[\p{L}'’]*/gu, cap) },
  { name: "aLtErNaTiNg cAsE", fn: (s) => [...s].map((c, i) => (i % 2 ? c.toUpperCase() : c.toLowerCase())).join("") },
  { name: "InVeRsE CaSe", fn: (s) => [...s].map((c) => (c === c.toUpperCase() ? c.toLowerCase() : c.toUpperCase())).join("") },
  { name: "camelCase", fn: (s) => words(s).map((w, i) => (i ? cap(w) : w.toLowerCase())).join("") },
  { name: "PascalCase", fn: (s) => words(s).map(cap).join("") },
  { name: "snake_case", fn: (s) => words(s).map((w) => w.toLowerCase()).join("_") },
  { name: "kebab-case", fn: (s) => words(s).map((w) => w.toLowerCase()).join("-") },
  { name: "CONSTANT_CASE", fn: (s) => words(s).map((w) => w.toUpperCase()).join("_") },
];

export default function Client() {
  const [text, setText] = useState("");
  return (
    <div>
      <div className="mb-3 flex flex-wrap gap-2">
        {cases.map((c) => (
          <button key={c.name} className="chip bg-surface" onClick={() => setText(c.fn(text))}>{c.name}</button>
        ))}
      </div>
      <textarea className="textarea min-h-[340px] font-sans text-base" value={text} onChange={(e) => setText(e.target.value)} placeholder="Type or paste text, then choose a case above…" aria-label="Text" />
      <div className="mt-3 flex flex-wrap items-center gap-2">
        <CopyButton text={text} />
        <button className="btn-secondary px-3 py-2" onClick={() => downloadText(text, "text.txt")} disabled={!text}>Download</button>
        <button className="btn-secondary px-3 py-2" onClick={() => setText("")}><Trash2 className="h-4 w-4" /> Clear</button>
        <span className="ml-auto text-sm text-gray-500">{[...text].length} characters · {words(text).length} words</span>
      </div>
    </div>
  );
}
