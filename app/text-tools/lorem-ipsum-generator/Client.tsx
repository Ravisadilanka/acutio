"use client";

import { useEffect, useState } from "react";
import { RefreshCw } from "lucide-react";
import { CopyButton, NumberField, Panel, Segmented } from "@/components/ui/kit";

const W = "lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua enim ad minim veniam quis nostrud exercitation ullamco laboris nisi aliquip ex ea commodo consequat duis aute irure in reprehenderit voluptate velit esse cillum fugiat nulla pariatur excepteur sint occaecat cupidatat non proident sunt culpa qui officia deserunt mollit anim id est laborum curabitur pretium tincidunt lacus nulla gravida orci a odio nullam varius turpis facilisis mauris sagittis".split(" ");
const r = (n: number) => Math.floor(Math.random() * n);
const sentence = () => {
  const n = 6 + r(10);
  const s = Array.from({ length: n }, () => W[r(W.length)]).join(" ");
  return s[0].toUpperCase() + s.slice(1) + ".";
};
const paragraph = () => Array.from({ length: 4 + r(4) }, sentence).join(" ");

export default function Client() {
  const [kind, setKind] = useState<"paragraphs" | "sentences" | "words">("paragraphs");
  const [count, setCount] = useState("3");
  const [classic, setClassic] = useState(true);
  const [html, setHtml] = useState(false);
  const [out, setOut] = useState("");

  const gen = () => {
    const n = Math.min(500, Math.max(1, Math.round(+count) || 1));
    let parts: string[] =
      kind === "paragraphs" ? Array.from({ length: n }, paragraph) : kind === "sentences" ? Array.from({ length: n }, sentence) : [Array.from({ length: n }, () => W[r(W.length)]).join(" ")];
    if (classic) {
      const lead = "Lorem ipsum dolor sit amet, consectetur adipiscing elit";
      parts[0] = kind === "words" ? lead.split(" ").slice(0, n).join(" ").replace(/,$/, "") : lead + ". " + parts[0];
    }
    if (kind === "sentences") parts = [parts.join(" ")];
    setOut(html ? parts.map((p) => `<p>${p}</p>`).join("\n") : parts.join("\n\n"));
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(gen, [kind, count, classic, html]);

  return (
    <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
      <Panel className="space-y-4 self-start">
        <Segmented value={kind} onChange={setKind} options={[{ value: "paragraphs", label: "Paragraphs" }, { value: "sentences", label: "Sentences" }, { value: "words", label: "Words" }]} />
        <NumberField label={`Number of ${kind}`} value={count} onChange={setCount} min={1} max={500} />
        <label className="flex items-center gap-2 text-sm text-gray-700"><input type="checkbox" checked={classic} onChange={(e) => setClassic(e.target.checked)} /> Start with “Lorem ipsum…”</label>
        <label className="flex items-center gap-2 text-sm text-gray-700"><input type="checkbox" checked={html} onChange={(e) => setHtml(e.target.checked)} /> Wrap in &lt;p&gt; tags</label>
        <div className="flex gap-2">
          <button className="btn-primary flex-1" onClick={gen}><RefreshCw className="h-4 w-4" /> Regenerate</button>
          <CopyButton text={out} />
        </div>
      </Panel>
      <textarea className="textarea min-h-[420px] font-sans text-base leading-relaxed" readOnly value={out} aria-label="Generated text" />
    </div>
  );
}
