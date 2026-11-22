"use client";

import { useMemo, useState } from "react";
import { ArrowDownUp } from "lucide-react";
import { CopyButton, Segmented } from "@/components/ui/kit";

const enc = (s: string, urlSafe: boolean) => {
  const bytes = new TextEncoder().encode(s);
  let bin = "";
  bytes.forEach((b) => (bin += String.fromCharCode(b)));
  const out = btoa(bin);
  return urlSafe ? out.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "") : out;
};
const dec = (s: string) => {
  let b = s.trim().replace(/\s/g, "").replace(/-/g, "+").replace(/_/g, "/");
  while (b.length % 4) b += "=";
  const bin = atob(b);
  return new TextDecoder("utf-8", { fatal: true }).decode(Uint8Array.from(bin, (c) => c.charCodeAt(0)));
};

export default function Client() {
  const [mode, setMode] = useState<"encode" | "decode">("encode");
  const [input, setInput] = useState("Hello, world! 👋");
  const [urlSafe, setUrlSafe] = useState(false);

  const { out, err } = useMemo(() => {
    try {
      return { out: mode === "encode" ? enc(input, urlSafe) : dec(input), err: "" };
    } catch {
      return { out: "", err: "Invalid Base64 input (or not UTF-8 text)." };
    }
  }, [input, mode, urlSafe]);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        <Segmented value={mode} onChange={setMode} options={[{ value: "encode", label: "Encode" }, { value: "decode", label: "Decode" }]} />
        {mode === "encode" && <label className="flex items-center gap-2 text-sm text-gray-700"><input type="checkbox" checked={urlSafe} onChange={(e) => setUrlSafe(e.target.checked)} /> URL-safe</label>}
      </div>
      <div>
        <label className="label">{mode === "encode" ? "Text" : "Base64"}</label>
        <textarea className="textarea" value={input} onChange={(e) => setInput(e.target.value)} spellCheck={false} />
      </div>
      <button className="btn-secondary mx-auto flex" onClick={() => { if (out) { setInput(out); setMode(mode === "encode" ? "decode" : "encode"); } }}><ArrowDownUp className="h-4 w-4" /> Swap</button>
      <div>
        <label className="label">{mode === "encode" ? "Base64" : "Text"}</label>
        <textarea className="textarea bg-gray-50" readOnly value={err || out} spellCheck={false} />
        <div className="mt-2"><CopyButton text={out} /></div>
      </div>
    </div>
  );
}
