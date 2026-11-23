"use client";

import { useState } from "react";
import { Dices, Coins } from "lucide-react";
import { CopyButton, NumberField, Panel } from "@/components/ui/kit";

function randInt(min: number, max: number) {
  const range = max - min + 1;
  const limit = Math.floor(0x100000000 / range) * range;
  const b = new Uint32Array(1);
  do crypto.getRandomValues(b);
  while (b[0] >= limit);
  return min + (b[0] % range);
}

export default function Client() {
  const [min, setMin] = useState("1");
  const [max, setMax] = useState("100");
  const [count, setCount] = useState("1");
  const [unique, setUnique] = useState(false);
  const [sorted, setSorted] = useState(false);
  const [out, setOut] = useState<number[]>([]);
  const [err, setErr] = useState("");
  const [coin, setCoin] = useState<string>("");
  const [dice, setDice] = useState<number[]>([]);

  const gen = () => {
    const a = Math.ceil(+min), b = Math.floor(+max), n = Math.min(10000, Math.max(1, Math.round(+count)));
    if (!Number.isFinite(a) || !Number.isFinite(b) || a > b) return setErr("Minimum must be less than or equal to maximum.");
    if (b - a + 1 > 2 ** 32) return setErr("Range is too large (max 4.29 billion values).");
    if (unique && n > b - a + 1) return setErr(`Only ${b - a + 1} unique numbers exist in this range.`);
    setErr("");
    const res: number[] = [];
    const seen = new Set<number>();
    while (res.length < n) {
      const v = randInt(a, b);
      if (unique) { if (seen.has(v)) continue; seen.add(v); }
      res.push(v);
    }
    if (sorted) res.sort((x, y) => x - y);
    setOut(res);
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_1.3fr]">
      <Panel className="space-y-4 self-start">
        <div className="grid grid-cols-2 gap-3">
          <NumberField label="Minimum" value={min} onChange={setMin} step={1} />
          <NumberField label="Maximum" value={max} onChange={setMax} step={1} />
        </div>
        <NumberField label="How many numbers?" value={count} onChange={setCount} min={1} max={10000} step={1} />
        <label className="flex items-center gap-2 text-sm text-gray-700"><input type="checkbox" checked={unique} onChange={(e) => setUnique(e.target.checked)} /> No repeats</label>
        <label className="flex items-center gap-2 text-sm text-gray-700"><input type="checkbox" checked={sorted} onChange={(e) => setSorted(e.target.checked)} /> Sort results</label>
        <button className="btn-primary w-full py-4 text-base" onClick={gen}>Generate</button>
        {err && <p className="text-sm text-rose-500">{err}</p>}
      </Panel>
      <div className="space-y-4">
        <Panel className="min-h-48">
          {out.length === 0 ? (
            <p className="py-12 text-center text-gray-500">Press Generate to get your random number{+count > 1 ? "s" : ""}.</p>
          ) : out.length === 1 ? (
            <p className="py-6 text-center text-7xl font-extrabold tabular-nums text-brand-ink animate-fade-up">{out[0]}</p>
          ) : (
            <>
              <div className="flex max-h-80 flex-wrap gap-2 overflow-y-auto">
                {out.map((n, i) => <span key={i} className="rounded-lg bg-brand-soft px-3 py-1.5 font-mono font-semibold text-brand-ink">{n}</span>)}
              </div>
              <div className="mt-4"><CopyButton text={out.join(", ")} label="Copy all" /></div>
            </>
          )}
        </Panel>
        <div className="grid grid-cols-2 gap-4">
          <Panel className="text-center">
            <button className="btn-secondary w-full" onClick={() => setCoin(randInt(0, 1) ? "Heads" : "Tails")}><Coins className="h-4 w-4" /> Flip a coin</button>
            <p className="mt-3 h-8 text-2xl font-bold text-gray-900">{coin}</p>
          </Panel>
          <Panel className="text-center">
            <button className="btn-secondary w-full" onClick={() => setDice([randInt(1, 6), randInt(1, 6)])}><Dices className="h-4 w-4" /> Roll 2 dice</button>
            <p className="mt-3 h-8 text-2xl font-bold text-gray-900">{dice.length ? `${"⚀⚁⚂⚃⚄⚅"[dice[0] - 1]} ${"⚀⚁⚂⚃⚄⚅"[dice[1] - 1]}  = ${dice[0] + dice[1]}` : ""}</p>
          </Panel>
        </div>
      </div>
    </div>
  );
}
