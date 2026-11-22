"use client";

import { useState } from "react";
import { CheckCircle2, AlertCircle } from "lucide-react";
import { CopyButton, downloadText } from "@/components/ui/kit";

function sortKeys(v: unknown): unknown {
  if (Array.isArray(v)) return v.map(sortKeys);
  if (v && typeof v === "object") return Object.fromEntries(Object.keys(v as object).sort().map((k) => [k, sortKeys((v as Record<string, unknown>)[k])]));
  return v;
}

function locate(text: string, msg: string) {
  const m = msg.match(/position (\d+)/i);
  const lc = msg.match(/line (\d+) column (\d+)/i);
  if (lc) return `line ${lc[1]}, column ${lc[2]}`;
  if (!m) return "";
  const pos = +m[1];
  const before = text.slice(0, pos);
  const line = before.split("\n").length;
  const col = pos - before.lastIndexOf("\n");
  return `line ${line}, column ${col}`;
}

const sample = `{"name":"Acutio","tools":72,"free":true,"categories":["pdf","image","text"],"owner":{"country":"LK"}}`;

export default function Client() {
  const [input, setInput] = useState(sample);
  const [output, setOutput] = useState("");
  const [indent, setIndent] = useState("2");
  const [sort, setSort] = useState(false);
  const [status, setStatus] = useState<{ ok: boolean; msg: string } | null>(null);

  const run = (mode: "format" | "minify" | "validate") => {
    try {
      let v = JSON.parse(input);
      if (sort) v = sortKeys(v);
      const ind = indent === "tab" ? "\t" : +indent;
      if (mode !== "validate") setOutput(mode === "minify" ? JSON.stringify(v) : JSON.stringify(v, null, ind));
      const size = new Blob([input]).size;
      setStatus({ ok: true, msg: `Valid JSON · ${Array.isArray(v) ? `array of ${v.length}` : typeof v} · ${size.toLocaleString()} bytes` });
    } catch (e) {
      const msg = (e as Error).message;
      const where = locate(input, msg);
      setStatus({ ok: false, msg: `${msg}${where ? ` (${where})` : ""}` });
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        <button className="btn-primary" onClick={() => run("format")}>Format / Beautify</button>
        <button className="btn-secondary" onClick={() => run("minify")}>Minify</button>
        <button className="btn-secondary" onClick={() => run("validate")}>Validate</button>
        <select className="input w-auto py-2.5" value={indent} onChange={(e) => setIndent(e.target.value)} aria-label="Indentation">
          <option value="2">2 spaces</option><option value="4">4 spaces</option><option value="tab">Tabs</option>
        </select>
        <label className="flex items-center gap-2 text-sm text-gray-700"><input type="checkbox" checked={sort} onChange={(e) => setSort(e.target.checked)} /> Sort keys</label>
      </div>
      {status && (
        <div className={`flex items-start gap-2 rounded-xl px-4 py-3 text-sm ${status.ok ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400" : "bg-rose-500/10 text-rose-700 dark:text-rose-400"}`}>
          {status.ok ? <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" /> : <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />}
          <span className="font-mono">{status.msg}</span>
        </div>
      )}
      <div className="grid gap-4 lg:grid-cols-2">
        <div>
          <label className="label">Input JSON</label>
          <textarea className="textarea min-h-[460px]" value={input} onChange={(e) => setInput(e.target.value)} spellCheck={false} placeholder="Paste JSON here…" />
        </div>
        <div>
          <label className="label">Output</label>
          <textarea className="textarea min-h-[460px] bg-gray-50" value={output} readOnly spellCheck={false} />
          <div className="mt-2 flex gap-2">
            <CopyButton text={output} />
            <button className="btn-secondary px-3 py-2" disabled={!output} onClick={() => downloadText(output, "formatted.json", "application/json")}>Download</button>
            <button className="btn-secondary px-3 py-2" disabled={!output} onClick={() => setInput(output)}>Use as input</button>
          </div>
        </div>
      </div>
    </div>
  );
}
