"use client";

import { useMemo } from "react";
import { Trash2 } from "lucide-react";
import { CopyButton, Panel, downloadText } from "@/components/ui/kit";
import { usePersistentState } from "@/lib/local";
import { cheatSheet, singlishToSinhala } from "@/lib/singlish";

const examples = ["mama", "oyaa", "kohomada", "aayuboovan", "sthuthiyi", "laxkaa", "shrii", "gedara", "paaDam"];

export default function Client() {
  const [text, setText] = usePersistentState("singlish-text", "aayuboovan! oyaata kohomada?");
  const sinhala = useMemo(() => singlishToSinhala(text), [text]);

  const Table = ({ title, rows }: { title: string; rows: [string, string][] }) => (
    <div>
      <p className="mb-2 text-sm font-semibold text-gray-900">{title}</p>
      <div className="flex flex-wrap gap-1.5">
        {rows.map(([k, v]) => (
          <span key={k + v} className="inline-flex items-center gap-1.5 rounded-lg border bg-surface px-2 py-1 text-sm">
            <code className="font-mono text-gray-500">{k}</code>
            <span className="text-base text-gray-900">{title === "Vowel signs" ? "ක" + v : v}</span>
          </span>
        ))}
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="grid gap-4 lg:grid-cols-2">
        <div>
          <label className="label" htmlFor="singlish">Type in Singlish (English letters)</label>
          <textarea id="singlish" className="textarea min-h-64 font-sans text-lg" value={text} onChange={(e) => setText(e.target.value)} placeholder="mama sinhalen liyanavaa" spellCheck={false} autoCapitalize="off" autoComplete="off" />
          <div className="mt-2 flex flex-wrap gap-1.5">
            <span className="text-xs text-gray-500">Try:</span>
            {examples.map((x) => (
              <button key={x} className="rounded-md bg-gray-100 px-2 py-0.5 font-mono text-xs text-gray-700 hover:bg-gray-200" onClick={() => setText((t) => (t ? t + " " : "") + x)}>{x}</button>
            ))}
          </div>
        </div>
        <div>
          <label className="label">Sinhala Unicode</label>
          <div className="min-h-64 whitespace-pre-wrap break-words rounded-xl border bg-gray-50 p-4 text-2xl leading-relaxed text-gray-900" lang="si">{sinhala || <span className="text-gray-400">සිංහල අකුරු මෙතන පෙන්වයි</span>}</div>
          <div className="mt-2 flex flex-wrap gap-2">
            <CopyButton text={sinhala} label="Copy Sinhala" />
            <button className="btn-secondary px-3 py-2" disabled={!sinhala} onClick={() => downloadText(sinhala, "sinhala.txt")}>Download</button>
            <button className="btn-ghost px-3 py-2" onClick={() => setText("")}><Trash2 className="h-4 w-4" /> Clear</button>
          </div>
        </div>
      </div>

      <Panel className="space-y-5">
        <h2 className="text-lg font-bold text-gray-900">Cheat sheet</h2>
        <Table title="Vowels" rows={cheatSheet.vowels} />
        <Table title="Consonants" rows={cheatSheet.consonants} />
        <Table title="Vowel signs" rows={cheatSheet.signs} />
        <Table title="Other" rows={[...cheatSheet.other, ["kr / pr", "ක්‍ර / ප්‍ර"], ["dy / ky", "ද්‍ය / ක්‍ය"]]} />
        <p className="text-sm text-gray-500">Tip: a consonant with no vowel after it gets ් automatically (pothak → පොතක්). Capital letters give related sounds (t ට · T ඨ · d ද · D ඩ · n න · N ණ · l ල · L ළ).</p>
      </Panel>
    </div>
  );
}
