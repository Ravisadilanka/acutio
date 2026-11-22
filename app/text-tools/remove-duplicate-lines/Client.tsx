"use client";

import { useMemo, useState } from "react";
import { CopyButton, downloadText } from "@/components/ui/kit";

export default function Client() {
  const [text, setText] = useState("apple\nbanana\nApple\ncherry\nbanana\n\n  cherry  ");
  const [o, setO] = useState({ dedupe: true, ignoreCase: false, trim: true, removeEmpty: true, sort: "none" as "none" | "asc" | "desc" | "len" });
  const set = (patch: Partial<typeof o>) => setO({ ...o, ...patch });

  const { out, removed } = useMemo(() => {
    let lines = text.split(/\r?\n/);
    const before = lines.length;
    if (o.trim) lines = lines.map((l) => l.trim());
    if (o.removeEmpty) lines = lines.filter((l) => l.trim() !== "");
    if (o.dedupe) {
      const seen = new Set<string>();
      lines = lines.filter((l) => {
        const k = o.ignoreCase ? l.toLowerCase() : l;
        if (seen.has(k)) return false;
        seen.add(k);
        return true;
      });
    }
    const coll = new Intl.Collator(undefined, { numeric: true, sensitivity: "base" });
    if (o.sort === "asc") lines.sort(coll.compare);
    if (o.sort === "desc") lines.sort((a, b) => coll.compare(b, a));
    if (o.sort === "len") lines.sort((a, b) => a.length - b.length);
    return { out: lines.join("\n"), removed: before - lines.length };
  }, [text, o]);

  const Check = ({ k, label }: { k: "dedupe" | "ignoreCase" | "trim" | "removeEmpty"; label: string }) => (
    <label className="flex items-center gap-2"><input type="checkbox" checked={o[k]} onChange={(e) => set({ [k]: e.target.checked })} /> {label}</label>
  );

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-gray-700">
        <Check k="dedupe" label="Remove duplicates" />
        <Check k="ignoreCase" label="Ignore case" />
        <Check k="trim" label="Trim spaces" />
        <Check k="removeEmpty" label="Remove empty lines" />
        <select className="input w-auto py-2" value={o.sort} onChange={(e) => set({ sort: e.target.value as typeof o.sort })} aria-label="Sort">
          <option value="none">Keep order</option>
          <option value="asc">Sort A → Z</option>
          <option value="desc">Sort Z → A</option>
          <option value="len">Sort by length</option>
        </select>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="label">Input ({text ? text.split("\n").length : 0} lines)</label>
          <textarea className="textarea min-h-80" value={text} onChange={(e) => setText(e.target.value)} />
        </div>
        <div>
          <label className="label">Result ({out ? out.split("\n").length : 0} lines · {removed} removed)</label>
          <textarea className="textarea min-h-80 bg-gray-50" readOnly value={out} />
          <div className="mt-2 flex gap-2">
            <CopyButton text={out} />
            <button className="btn-secondary px-3 py-2" onClick={() => downloadText(out, "cleaned.txt")}>Download</button>
          </div>
        </div>
      </div>
    </div>
  );
}
