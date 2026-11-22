"use client";

import { useState } from "react";
import { CopyButton, Panel } from "@/components/ui/kit";

const DIGITS = "0123456789abcdefghijklmnopqrstuvwxyz";

function parse(str: string, base: number): bigint | null {
  const s = str.trim().toLowerCase().replace(/[\s_]/g, "");
  if (!s) return null;
  const neg = s.startsWith("-");
  const body = neg ? s.slice(1) : s;
  if (!body) return null;
  let v = BigInt(0);
  const B = BigInt(base);
  for (const ch of body) {
    const d = DIGITS.indexOf(ch);
    if (d < 0 || d >= base) return null;
    v = v * B + BigInt(d);
  }
  return neg ? -v : v;
}

const toBase = (v: bigint, base: number) => (v < BigInt(0) ? "-" + (-v).toString(base) : v.toString(base));

export default function Client() {
  const [value, setValue] = useState<bigint | null>(BigInt(255));
  const [editing, setEditing] = useState<{ base: number; text: string } | null>(null);
  const [custom, setCustom] = useState(36);
  const [error, setError] = useState("");

  const bases = [
    { base: 2, name: "Binary" },
    { base: 8, name: "Octal" },
    { base: 10, name: "Decimal" },
    { base: 16, name: "Hexadecimal" },
    { base: custom, name: `Base ${custom}` },
  ];

  const onChange = (base: number, text: string) => {
    setEditing({ base, text });
    if (!text.trim()) {
      setValue(null);
      setError("");
      return;
    }
    const v = parse(text, base);
    if (v === null) setError(`“${text}” is not a valid base-${base} number`);
    else {
      setError("");
      setValue(v);
    }
  };

  return (
    <div className="space-y-4">
      {bases.map(({ base, name }, i) => {
        const shown = editing?.base === base ? editing.text : value === null ? "" : toBase(value, base).toUpperCase();
        return (
          <Panel key={i} className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="w-36 shrink-0">
              <p className="font-semibold text-gray-900">{name}</p>
              {i === 4 ? (
                <input type="range" min={2} max={36} value={custom} onChange={(e) => { setCustom(+e.target.value); setEditing(null); }} className="w-full" aria-label="Custom base" />
              ) : (
                <p className="text-xs text-gray-500">base {base}</p>
              )}
            </div>
            <input
              className="input font-mono"
              value={shown}
              onChange={(e) => onChange(base, e.target.value)}
              onBlur={() => setEditing(null)}
              spellCheck={false}
              aria-label={name}
            />
            <CopyButton text={shown} label="" />
          </Panel>
        );
      })}
      {error && <p className="text-sm text-rose-500">{error}</p>}
    </div>
  );
}
