"use client";

import { useState } from "react";
import { NumberField, Panel, Segmented, Stat, fmt } from "@/components/ui/kit";

const bands = [
  { max: 18.5, label: "Underweight", color: "text-sky-500", bar: "bg-sky-400" },
  { max: 25, label: "Healthy weight", color: "text-emerald-500", bar: "bg-emerald-400" },
  { max: 30, label: "Overweight", color: "text-amber-500", bar: "bg-amber-400" },
  { max: Infinity, label: "Obese", color: "text-rose-500", bar: "bg-rose-400" },
];

export default function Client() {
  const [unit, setUnit] = useState<"metric" | "imperial">("metric");
  const [cm, setCm] = useState("170");
  const [kg, setKg] = useState("65");
  const [ft, setFt] = useState("5");
  const [inch, setInch] = useState("7");
  const [lb, setLb] = useState("145");

  const hM = unit === "metric" ? +cm / 100 : (+ft * 12 + +inch) * 0.0254;
  const wKg = unit === "metric" ? +kg : +lb * 0.45359237;
  const bmi = hM > 0 && wKg > 0 ? wKg / (hM * hM) : NaN;
  const band = bands.find((b) => bmi < b.max) ?? bands[3];
  const lo = 18.5 * hM * hM;
  const hi = 24.9 * hM * hM;
  const showW = (k: number) => (unit === "metric" ? `${fmt(k, 1)} kg` : `${fmt(k / 0.45359237, 1)} lb`);
  const pos = Number.isFinite(bmi) ? Math.min(100, Math.max(0, ((bmi - 12) / (40 - 12)) * 100)) : 0;

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_1.3fr]">
      <Panel className="space-y-4">
        <Segmented value={unit} onChange={setUnit} options={[{ value: "metric", label: "Metric (cm, kg)" }, { value: "imperial", label: "Imperial (ft, lb)" }]} />
        {unit === "metric" ? (
          <>
            <NumberField label="Height" value={cm} onChange={setCm} suffix="cm" />
            <NumberField label="Weight" value={kg} onChange={setKg} suffix="kg" />
          </>
        ) : (
          <>
            <div className="grid grid-cols-2 gap-3">
              <NumberField label="Height" value={ft} onChange={setFt} suffix="ft" />
              <NumberField label="Inches" value={inch} onChange={setInch} suffix="in" />
            </div>
            <NumberField label="Weight" value={lb} onChange={setLb} suffix="lb" />
          </>
        )}
      </Panel>

      <Panel>
        <p className="stat-label">Your BMI</p>
        <p className={`mt-1 text-6xl font-extrabold tabular-nums ${band.color}`}>{Number.isFinite(bmi) ? bmi.toFixed(1) : "—"}</p>
        <p className={`text-lg font-semibold ${band.color}`}>{Number.isFinite(bmi) ? band.label : "Enter height and weight"}</p>

        <div className="relative mt-6">
          <div className="flex h-3 overflow-hidden rounded-full">
            <div className="w-[23%] bg-sky-400" />
            <div className="w-[23%] bg-emerald-400" />
            <div className="w-[18%] bg-amber-400" />
            <div className="flex-1 bg-rose-400" />
          </div>
          {Number.isFinite(bmi) && <div className="absolute -top-1 h-5 w-1.5 -translate-x-1/2 rounded-full bg-gray-900 ring-2 ring-surface" style={{ left: `${pos}%` }} />}
          <div className="mt-2 flex justify-between text-xs text-gray-500"><span>12</span><span>18.5</span><span>25</span><span>30</span><span>40</span></div>
        </div>

        {hM > 0 && (
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            <Stat label="Healthy weight range" value={`${showW(lo)} – ${showW(hi)}`} />
            <Stat label="BMI Prime" value={Number.isFinite(bmi) ? (bmi / 25).toFixed(2) : "—"} hint="1.00 = upper healthy limit" />
          </div>
        )}
      </Panel>
    </div>
  );
}
