"use client";

import { useState } from "react";
import { NumberField, Panel, Segmented, Stat, fmt } from "@/components/ui/kit";

export default function Client() {
  const [mode, setMode] = useState<"add" | "remove">("add");
  const [price, setPrice] = useState("100");
  const [rate, setRate] = useState("20");

  const p = +price || 0;
  const r = (+rate || 0) / 100;
  const net = mode === "add" ? p : p / (1 + r);
  const gross = mode === "add" ? p * (1 + r) : p;
  const tax = gross - net;

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Panel className="space-y-4">
        <Segmented value={mode} onChange={setMode} options={[{ value: "add", label: "Add tax" }, { value: "remove", label: "Remove tax" }]} />
        <NumberField label={mode === "add" ? "Net price (excl. tax)" : "Gross price (incl. tax)"} value={price} onChange={setPrice} />
        <div>
          <NumberField label="Tax rate" value={rate} onChange={setRate} suffix="%" />
          <div className="mt-2 flex flex-wrap gap-2">
            {[5, 7.5, 10, 12, 15, 18, 20, 21, 25].map((x) => (
              <button key={x} onClick={() => setRate(String(x))} className={`chip ${+rate === x ? "chip-active" : ""}`}>{x}%</button>
            ))}
          </div>
        </div>
      </Panel>
      <div className="space-y-3">
        <Stat accent label={mode === "add" ? "Price including tax" : "Price excluding tax"} value={fmt(mode === "add" ? gross : net)} />
        <div className="grid grid-cols-3 gap-3">
          <Stat label="Net" value={fmt(net)} />
          <Stat label="Tax" value={fmt(tax)} />
          <Stat label="Gross" value={fmt(gross)} />
        </div>
      </div>
    </div>
  );
}
