"use client";

import { useState } from "react";
import { NumberField, Panel, Stat, fmt } from "@/components/ui/kit";

export default function Client() {
  const [price, setPrice] = useState("120");
  const [d1, setD1] = useState("25");
  const [d2, setD2] = useState("");
  const [tax, setTax] = useState("");

  const p = +price || 0;
  const after1 = p * (1 - (+d1 || 0) / 100);
  const after2 = after1 * (1 - (+d2 || 0) / 100);
  const final = after2 * (1 + (+tax || 0) / 100);
  const saved = p - after2;
  const eff = p ? (saved / p) * 100 : 0;

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Panel className="space-y-4">
        <NumberField label="Original price" value={price} onChange={setPrice} />
        <div>
          <NumberField label="Discount" value={d1} onChange={setD1} suffix="% off" />
          <div className="mt-2 flex flex-wrap gap-2">
            {[10, 15, 20, 25, 30, 40, 50, 70].map((x) => (
              <button key={x} onClick={() => setD1(String(x))} className={`chip ${+d1 === x ? "chip-active" : ""}`}>{x}%</button>
            ))}
          </div>
        </div>
        <NumberField label="Extra discount (optional)" value={d2} onChange={setD2} suffix="% off" />
        <NumberField label="Sales tax (optional)" value={tax} onChange={setTax} suffix="%" />
      </Panel>
      <div className="space-y-3">
        <Stat accent label="Final price" value={fmt(final)} hint={tax ? "Including tax" : undefined} />
        <div className="grid grid-cols-2 gap-3">
          <Stat label="You save" value={fmt(saved)} />
          <Stat label="Effective discount" value={`${fmt(eff, 2)}%`} />
        </div>
      </div>
    </div>
  );
}
