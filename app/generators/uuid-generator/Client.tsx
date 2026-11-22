"use client";

import { useCallback, useEffect, useState } from "react";
import { RefreshCw } from "lucide-react";
import { CopyButton, NumberField, Panel, downloadText } from "@/components/ui/kit";

const uuid = () => {
  if (crypto.randomUUID) return crypto.randomUUID();
  const b = crypto.getRandomValues(new Uint8Array(16));
  b[6] = (b[6] & 0x0f) | 0x40;
  b[8] = (b[8] & 0x3f) | 0x80;
  const h = [...b].map((x) => x.toString(16).padStart(2, "0")).join("");
  return `${h.slice(0, 8)}-${h.slice(8, 12)}-${h.slice(12, 16)}-${h.slice(16, 20)}-${h.slice(20)}`;
};

export default function Client() {
  const [count, setCount] = useState("10");
  const [upper, setUpper] = useState(false);
  const [noDash, setNoDash] = useState(false);
  const [braces, setBraces] = useState(false);
  const [list, setList] = useState<string[]>([]);

  const gen = useCallback(() => {
    const n = Math.min(10000, Math.max(1, Math.round(+count) || 1));
    setList(Array.from({ length: n }, () => {
      let u = uuid();
      if (noDash) u = u.replace(/-/g, "");
      if (upper) u = u.toUpperCase();
      return braces ? `{${u}}` : u;
    }));
  }, [count, upper, noDash, braces]);

  useEffect(gen, [gen]);
  const all = list.join("\n");

  return (
    <div className="grid gap-6 lg:grid-cols-[300px_1fr]">
      <Panel className="space-y-4 self-start">
        <NumberField label="How many?" value={count} onChange={setCount} min={1} max={10000} step={1} />
        <label className="flex items-center gap-2 text-sm text-gray-700"><input type="checkbox" checked={upper} onChange={(e) => setUpper(e.target.checked)} /> Uppercase</label>
        <label className="flex items-center gap-2 text-sm text-gray-700"><input type="checkbox" checked={noDash} onChange={(e) => setNoDash(e.target.checked)} /> Remove hyphens</label>
        <label className="flex items-center gap-2 text-sm text-gray-700"><input type="checkbox" checked={braces} onChange={(e) => setBraces(e.target.checked)} /> Wrap in {"{ }"} (GUID)</label>
        <button className="btn-primary w-full" onClick={gen}><RefreshCw className="h-4 w-4" /> Generate</button>
      </Panel>
      <div>
        <textarea className="textarea min-h-[400px]" readOnly value={all} aria-label="Generated UUIDs" />
        <div className="mt-3 flex gap-2">
          <CopyButton text={all} label="Copy all" />
          <button className="btn-secondary px-3 py-2" onClick={() => downloadText(all, "uuids.txt")}>Download .txt</button>
        </div>
      </div>
    </div>
  );
}
