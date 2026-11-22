"use client";

import { useState } from "react";
import { CopyButton } from "@/components/ui/kit";
import { decorations, styles } from "@/lib/fancy";

export default function Client() {
  const [text, setText] = useState("Acutio Tools");
  const [deco, setDeco] = useState(-1);
  const src = text || "Type something";
  const wrap = (s: string) => (deco >= 0 ? decorations[deco][0] + s + decorations[deco][1] : s);

  return (
    <div className="space-y-4">
      <input
        className="input h-16 text-xl"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Type your text here…"
        maxLength={200}
        autoFocus
        aria-label="Your text"
      />
      <div className="flex flex-wrap gap-2">
        <button className={`chip ${deco === -1 ? "chip-active" : ""}`} onClick={() => setDeco(-1)}>No frame</button>
        {decorations.map((d, i) => (
          <button key={i} className={`chip ${deco === i ? "chip-active" : ""}`} onClick={() => setDeco(i)}>{d[0].trim()}…{d[1].trim()}</button>
        ))}
      </div>
      <ul className="grid gap-3 md:grid-cols-2">
        {styles.map((s) => {
          const out = wrap(s.fn(src));
          return (
            <li key={s.name} className="card flex items-center gap-3 p-4">
              <div className="min-w-0 flex-1">
                <p className="text-xs font-medium uppercase tracking-wide text-gray-400">{s.name}</p>
                <p className="mt-1 break-words text-xl text-gray-900">{out}</p>
              </div>
              <CopyButton text={out} />
            </li>
          );
        })}
      </ul>
    </div>
  );
}
