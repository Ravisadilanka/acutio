"use client";

import { useMemo, useState } from "react";
import { CopyButton, Panel, Segmented } from "@/components/ui/kit";

export default function Client() {
  const [mode, setMode] = useState<"encode" | "decode">("encode");
  const [full, setFull] = useState(false);
  const [input, setInput] = useState("https://acutio.com/search/?q=compress pdf&lang=en");

  const { out, err } = useMemo(() => {
    try {
      if (mode === "encode") return { out: full ? encodeURI(input) : encodeURIComponent(input), err: "" };
      return { out: decodeURIComponent(input.replace(/\+/g, " ")), err: "" };
    } catch {
      return { out: "", err: "Malformed percent-encoding." };
    }
  }, [input, mode, full]);

  const params = useMemo(() => {
    try {
      const src = mode === "decode" ? out : input;
      const u = new URL(src);
      return { base: `${u.origin}${u.pathname}`, list: [...u.searchParams.entries()] };
    } catch {
      return null;
    }
  }, [input, out, mode]);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        <Segmented value={mode} onChange={setMode} options={[{ value: "encode", label: "Encode" }, { value: "decode", label: "Decode" }]} />
        {mode === "encode" && <label className="flex items-center gap-2 text-sm text-gray-700"><input type="checkbox" checked={full} onChange={(e) => setFull(e.target.checked)} /> Full URL (keep : / ? &amp; =)</label>}
      </div>
      <textarea className="textarea min-h-32" value={input} onChange={(e) => setInput(e.target.value)} spellCheck={false} aria-label="Input" />
      <textarea className="textarea min-h-32 bg-gray-50" readOnly value={err || out} spellCheck={false} aria-label="Output" />
      <CopyButton text={out} />
      {params && params.list.length > 0 && (
        <Panel className="p-0 sm:p-0">
          <p className="border-b px-5 py-3 text-sm font-semibold text-gray-900">Query parameters · <span className="font-mono font-normal text-gray-500">{params.base}</span></p>
          <table className="w-full text-sm">
            <tbody className="divide-y">
              {params.list.map(([k, v], i) => (
                <tr key={i}><td className="px-5 py-2 font-mono font-medium text-gray-900">{k}</td><td className="break-all px-5 py-2 font-mono text-gray-600">{v}</td></tr>
              ))}
            </tbody>
          </table>
        </Panel>
      )}
    </div>
  );
}
