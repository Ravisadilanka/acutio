"use client";

import { useState } from "react";
import { NumberField, Panel, Stat, fmt } from "@/components/ui/kit";

export default function Client() {
  const [bill, setBill] = useState("85");
  const [tip, setTip] = useState("15");
  const [people, setPeople] = useState("2");
  const [roundUp, setRoundUp] = useState(false);

  const b = +bill || 0;
  const n = Math.max(1, Math.round(+people || 1));
  const tipAmt = (b * (+tip || 0)) / 100;
  let per = (b + tipAmt) / n;
  if (roundUp) per = Math.ceil(per);

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Panel className="space-y-4">
        <NumberField label="Bill amount" value={bill} onChange={setBill} />
        <div>
          <NumberField label="Tip" value={tip} onChange={setTip} suffix="%" />
          <div className="mt-2 flex flex-wrap gap-2">
            {[10, 12, 15, 18, 20, 25].map((p) => (
              <button key={p} onClick={() => setTip(String(p))} className={`chip ${+tip === p ? "chip-active" : ""}`}>{p}%</button>
            ))}
          </div>
        </div>
        <NumberField label="Number of people" value={people} onChange={setPeople} min={1} step={1} />
        <label className="flex items-center gap-2 text-sm text-gray-700">
          <input type="checkbox" checked={roundUp} onChange={(e) => setRoundUp(e.target.checked)} /> Round up each person&apos;s share
        </label>
      </Panel>
      <div className="space-y-3">
        <Stat accent label="Each person pays" value={fmt(per)} />
        <div className="grid grid-cols-2 gap-3">
          <Stat label="Tip amount" value={fmt(tipAmt)} />
          <Stat label="Tip per person" value={fmt(tipAmt / n)} />
          <Stat label="Total bill" value={fmt(roundUp ? per * n : b + tipAmt)} />
          <Stat label="People" value={n} />
        </div>
      </div>
    </div>
  );
}
