"use client";

import { useMemo } from "react";
import { Trash2 } from "lucide-react";
import { CopyButton, Panel, Stat, fmt } from "@/components/ui/kit";
import { usePersistentState } from "@/lib/local";

const stop = new Set("the a an and or but of to in on at for with is are was were be been it this that as by from you your i we they he she his her its our their not have has had do does did will would can could should so if then than there here what which who when where why how all any about into over also just more most".split(" "));

const limits = [
  { name: "Tweet / X post", max: 280 },
  { name: "SEO title", max: 60 },
  { name: "Meta description", max: 160 },
  { name: "Instagram caption", max: 2200 },
  { name: "SMS", max: 160 },
];

export default function Client() {
  const [text, setText] = usePersistentState("word-counter-text", "");

  const s = useMemo(() => {
    const words = text.match(/[\p{L}\p{N}][\p{L}\p{N}'’-]*/gu) ?? [];
    const freq = new Map<string, number>();
    for (const w of words) {
      const k = w.toLowerCase();
      if (k.length > 2 && !stop.has(k)) freq.set(k, (freq.get(k) ?? 0) + 1);
    }
    return {
      words: words.length,
      chars: [...text].length,
      noSpace: [...text.replace(/\s/g, "")].length,
      sentences: (text.match(/[^.!?。！？]+[.!?。！？]+|[^.!?。！？]+$/g) ?? []).filter((x) => x.trim()).length,
      paragraphs: text.split(/\n\s*\n/).filter((p) => p.trim()).length,
      lines: text ? text.split("\n").length : 0,
      read: words.length / 238,
      speak: words.length / 140,
      top: [...freq.entries()].sort((a, b) => b[1] - a[1]).slice(0, 8),
    };
  }, [text]);

  const mins = (m: number) => (m < 1 ? `${Math.max(1, Math.round(m * 60))} sec` : `${Math.round(m)} min`);

  return (
    <div className="grid gap-6 lg:grid-cols-[1.6fr_1fr]">
      <div>
        <div className="mb-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <Stat accent label="Words" value={fmt(s.words, 0)} />
          <Stat label="Characters" value={fmt(s.chars, 0)} />
          <Stat label="Sentences" value={fmt(s.sentences, 0)} />
          <Stat label="Paragraphs" value={fmt(s.paragraphs, 0)} />
        </div>
        <textarea
          className="textarea min-h-[420px] font-sans text-base"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Start typing or paste your text here…"
          autoFocus
          aria-label="Text to count"
        />
        <div className="mt-3 flex gap-2">
          <CopyButton text={text} />
          <button className="btn-secondary px-3 py-2" onClick={() => setText("")}><Trash2 className="h-4 w-4" /> Clear</button>
        </div>
      </div>
      <div className="space-y-4">
        <Panel className="space-y-2 text-sm">
          {[
            ["Characters (no spaces)", fmt(s.noSpace, 0)],
            ["Lines", fmt(s.lines, 0)],
            ["Reading time", s.words ? mins(s.read) : "—"],
            ["Speaking time", s.words ? mins(s.speak) : "—"],
            ["Avg. word length", s.words ? (s.noSpace / s.words).toFixed(1) : "—"],
          ].map(([k, v]) => (
            <div key={k} className="flex justify-between"><span className="text-gray-500">{k}</span><span className="font-semibold tabular-nums text-gray-900">{v}</span></div>
          ))}
        </Panel>
        <Panel>
          <p className="mb-3 text-sm font-semibold text-gray-900">Character limits</p>
          <div className="space-y-3">
            {limits.map((l) => {
              const pct = Math.min(100, (s.chars / l.max) * 100);
              const over = s.chars > l.max;
              return (
                <div key={l.name}>
                  <div className="flex justify-between text-xs"><span className="text-gray-600">{l.name}</span><span className={over ? "font-semibold text-rose-500" : "text-gray-500"}>{s.chars}/{l.max}</span></div>
                  <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-gray-200"><div className={`h-full ${over ? "bg-rose-500" : "bg-brand"}`} style={{ width: `${pct}%` }} /></div>
                </div>
              );
            })}
          </div>
        </Panel>
        {s.top.length > 0 && (
          <Panel>
            <p className="mb-3 text-sm font-semibold text-gray-900">Top keywords</p>
            <div className="flex flex-wrap gap-2">
              {s.top.map(([w, c]) => <span key={w} className="rounded-lg bg-gray-100 px-2.5 py-1 text-sm text-gray-700">{w} <span className="text-gray-400">×{c}</span></span>)}
            </div>
          </Panel>
        )}
      </div>
    </div>
  );
}
