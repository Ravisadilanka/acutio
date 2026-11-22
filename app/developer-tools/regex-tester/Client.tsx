"use client";

import { Fragment, useMemo, useState } from "react";
import { Panel } from "@/components/ui/kit";

const library = [
  { name: "Email", p: "[\\w.+-]+@[\\w-]+\\.[\\w.-]+" },
  { name: "URL", p: "https?:\\/\\/[^\\s/$.?#].[^\\s]*" },
  { name: "Phone", p: "\\+?\\d[\\d\\s()-]{7,}\\d" },
  { name: "IPv4", p: "\\b(?:\\d{1,3}\\.){3}\\d{1,3}\\b" },
  { name: "Date YYYY-MM-DD", p: "\\d{4}-\\d{2}-\\d{2}" },
  { name: "Hex colour", p: "#(?:[0-9a-fA-F]{3}){1,2}\\b" },
  { name: "Numbers", p: "-?\\d+(?:\\.\\d+)?" },
];

export default function Client() {
  const [pattern, setPattern] = useState("[\\w.+-]+@[\\w-]+\\.[\\w.-]+");
  const [flags, setFlags] = useState("g");
  const [text, setText] = useState("Contact hello@acutio.com or support@example.org.\nCall +94 77 123 4567 on 2026-11-22.");
  const [replace, setReplace] = useState("");

  const r = useMemo(() => {
    if (!pattern) return { matches: [] as RegExpMatchArray[] };
    try {
      const re = new RegExp(pattern, flags.includes("g") ? flags : flags + "g");
      const matches = [...text.matchAll(re)].slice(0, 1000);
      const replaced = replace ? text.replace(new RegExp(pattern, flags), replace) : "";
      return { matches, replaced };
    } catch (e) {
      return { err: (e as Error).message, matches: [] as RegExpMatchArray[] };
    }
  }, [pattern, flags, text, replace]);

  const pieces = useMemo(() => {
    const out: { s: string; m: boolean }[] = [];
    let last = 0;
    for (const m of r.matches) {
      const i = m.index ?? 0;
      if (m[0] === "") continue;
      out.push({ s: text.slice(last, i), m: false }, { s: m[0], m: true });
      last = i + m[0].length;
    }
    out.push({ s: text.slice(last), m: false });
    return out;
  }, [r.matches, text]);

  const toggle = (f: string) => setFlags(flags.includes(f) ? flags.replace(f, "") : flags + f);

  return (
    <div className="space-y-4">
      <Panel>
        <div className="flex items-center gap-2 rounded-xl border bg-surface px-4 font-mono focus-within:border-brand focus-within:ring-4 focus-within:ring-brand-soft">
          <span className="text-gray-400">/</span>
          <input className="h-12 flex-1 bg-transparent outline-none" value={pattern} onChange={(e) => setPattern(e.target.value)} spellCheck={false} aria-label="Pattern" />
          <span className="text-gray-400">/{flags}</span>
        </div>
        <div className="mt-3 flex flex-wrap items-center gap-2">
          {[["g", "global"], ["i", "ignore case"], ["m", "multiline"], ["s", "dotall"], ["u", "unicode"]].map(([f, l]) => (
            <button key={f} className={`chip font-mono ${flags.includes(f) ? "chip-active" : ""}`} onClick={() => toggle(f)} title={l}>{f} <span className="font-sans text-xs opacity-70">{l}</span></button>
          ))}
        </div>
        {r.err && <p className="mt-3 text-sm text-rose-500">{r.err}</p>}
        <div className="mt-3 flex flex-wrap gap-2 text-xs">
          <span className="text-gray-500">Library:</span>
          {library.map((x) => <button key={x.name} className="text-brand hover:underline" onClick={() => setPattern(x.p)}>{x.name}</button>)}
        </div>
      </Panel>

      <div className="grid gap-4 lg:grid-cols-2">
        <div>
          <label className="label">Test string</label>
          <textarea className="textarea min-h-64" value={text} onChange={(e) => setText(e.target.value)} spellCheck={false} />
        </div>
        <div>
          <label className="label">Matches highlighted ({r.matches.length})</label>
          <div className="min-h-64 whitespace-pre-wrap break-words rounded-xl border bg-gray-50 p-4 font-mono text-sm leading-relaxed text-gray-800">
            {pieces.map((p, i) => p.m ? <mark key={i} className="rounded bg-amber-300/70 px-0.5 text-gray-950">{p.s}</mark> : <Fragment key={i}>{p.s}</Fragment>)}
          </div>
        </div>
      </div>

      {r.matches.length > 0 && (
        <Panel className="max-h-80 overflow-auto p-0 sm:p-0">
          <table className="w-full text-sm">
            <thead className="sticky top-0 bg-gray-50 text-left text-gray-500"><tr><th className="px-4 py-2 font-medium">#</th><th className="px-4 py-2 font-medium">Match</th><th className="px-4 py-2 font-medium">Index</th><th className="px-4 py-2 font-medium">Groups</th></tr></thead>
            <tbody className="divide-y font-mono">
              {r.matches.map((m, i) => (
                <tr key={i}><td className="px-4 py-2 text-gray-400">{i + 1}</td><td className="px-4 py-2 text-gray-900">{m[0]}</td><td className="px-4 py-2 text-gray-500">{m.index}</td><td className="px-4 py-2 text-gray-600">{m.slice(1).map((g, j) => <span key={j} className="mr-2">${j + 1}: {g ?? "∅"}</span>)}{m.groups && Object.entries(m.groups).map(([k, v]) => <span key={k} className="mr-2">{k}: {v}</span>)}</td></tr>
              ))}
            </tbody>
          </table>
        </Panel>
      )}

      <Panel>
        <label className="label">Replace with (supports $1, $&lt;name&gt;)</label>
        <input className="input font-mono" value={replace} onChange={(e) => setReplace(e.target.value)} placeholder="e.g. [hidden]" />
        {r.replaced !== undefined && replace && <pre className="mt-3 whitespace-pre-wrap rounded-xl bg-gray-50 p-4 font-mono text-sm text-gray-800">{r.replaced}</pre>}
      </Panel>
    </div>
  );
}
