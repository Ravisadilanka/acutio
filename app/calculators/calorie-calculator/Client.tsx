"use client";

import { useState } from "react";
import { Field, NumberField, Panel, Segmented, Stat, fmt } from "@/components/ui/kit";

const activity = [
  { v: 1.2, l: "Sedentary (little or no exercise)" },
  { v: 1.375, l: "Light (1–3 days/week)" },
  { v: 1.55, l: "Moderate (3–5 days/week)" },
  { v: 1.725, l: "Active (6–7 days/week)" },
  { v: 1.9, l: "Very active (physical job / 2x day)" },
];

export default function Client() {
  const [unit, setUnit] = useState<"metric" | "imperial">("metric");
  const [sex, setSex] = useState<"male" | "female">("male");
  const [age, setAge] = useState("30");
  const [h, setH] = useState("175");
  const [w, setW] = useState("75");
  const [act, setAct] = useState("1.55");

  const cm = unit === "metric" ? +h : +h * 2.54;
  const kg = unit === "metric" ? +w : +w * 0.45359237;
  const bmr = 10 * kg + 6.25 * cm - 5 * +age + (sex === "male" ? 5 : -161);
  const tdee = bmr * +act;
  const ok = kg > 0 && cm > 0 && +age > 0;

  const goals = [
    { l: "Extreme weight loss", d: -1000, s: "≈1 kg / week" },
    { l: "Weight loss", d: -500, s: "≈0.5 kg / week" },
    { l: "Mild weight loss", d: -250, s: "≈0.25 kg / week" },
    { l: "Maintain weight", d: 0, s: "" },
    { l: "Mild weight gain", d: 250, s: "≈0.25 kg / week" },
    { l: "Weight gain", d: 500, s: "≈0.5 kg / week" },
  ];

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_1.3fr]">
      <Panel className="space-y-4">
        <Segmented value={unit} onChange={setUnit} options={[{ value: "metric", label: "Metric" }, { value: "imperial", label: "Imperial" }]} />
        <Segmented value={sex} onChange={setSex} options={[{ value: "male", label: "Male" }, { value: "female", label: "Female" }]} />
        <NumberField label="Age" value={age} onChange={setAge} suffix="years" />
        <NumberField label="Height" value={h} onChange={setH} suffix={unit === "metric" ? "cm" : "in"} />
        <NumberField label="Weight" value={w} onChange={setW} suffix={unit === "metric" ? "kg" : "lb"} />
        <Field label="Activity level">
          <select className="input" value={act} onChange={(e) => setAct(e.target.value)}>
            {activity.map((a) => <option key={a.v} value={a.v}>{a.l}</option>)}
          </select>
        </Field>
      </Panel>
      <div className="space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <Stat accent label="Maintenance (TDEE)" value={ok ? `${fmt(tdee, 0)} kcal` : "—"} />
          <Stat label="BMR" value={ok ? `${fmt(bmr, 0)} kcal` : "—"} hint="Calories at complete rest" />
        </div>
        {ok && (
          <Panel className="divide-y p-0 sm:p-0">
            {goals.map((g) => {
              const kcal = Math.max(tdee + g.d, sex === "male" ? 1500 : 1200);
              return (
                <div key={g.l} className="flex items-center justify-between px-5 py-3">
                  <div>
                    <p className="font-medium text-gray-900">{g.l}</p>
                    {g.s && <p className="text-xs text-gray-500">{g.s}</p>}
                  </div>
                  <p className="font-bold tabular-nums text-gray-900">{fmt(kcal, 0)} kcal/day</p>
                </div>
              );
            })}
          </Panel>
        )}
        <p className="text-xs text-gray-500">Estimates only, using the Mifflin-St Jeor equation. Not medical advice.</p>
      </div>
    </div>
  );
}
