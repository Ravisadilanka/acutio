"use client";

import { useEffect, useMemo, useState } from "react";
import { Field, Panel, Stat, fmt } from "@/components/ui/kit";

// Local date (toISOString would give the UTC date — "yesterday" for part of the day east of UTC).
const today = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
};

function diff(from: Date, to: Date) {
  let y = to.getFullYear() - from.getFullYear();
  let m = to.getMonth() - from.getMonth();
  let d = to.getDate() - from.getDate();
  if (d < 0) {
    m -= 1;
    d += new Date(to.getFullYear(), to.getMonth(), 0).getDate();
  }
  if (m < 0) {
    y -= 1;
    m += 12;
  }
  return { y, m, d };
}

export default function Client() {
  const [dob, setDob] = useState("2000-01-01");
  // Today's date is set in the browser (not baked in at build time).
  const [on, setOn] = useState("");
  useEffect(() => setOn(today()), []);

  const r = useMemo(() => {
    const b = new Date(dob + "T00:00:00");
    const t = new Date(on + "T00:00:00");
    if (isNaN(+b) || isNaN(+t) || t < b) return null;
    const age = diff(b, t);
    const days = Math.round((+t - +b) / 86400000);
    let next = new Date(t.getFullYear(), b.getMonth(), b.getDate());
    if (next < t) next = new Date(t.getFullYear() + 1, b.getMonth(), b.getDate());
    const toNext = Math.round((+next - +t) / 86400000);
    return {
      age,
      days,
      weeks: Math.floor(days / 7),
      months: age.y * 12 + age.m,
      hours: days * 24,
      toNext,
      nextAge: next.getFullYear() - b.getFullYear(),
      weekday: b.toLocaleDateString(undefined, { weekday: "long" }),
    };
  }, [dob, on]);

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_1.4fr]">
      <Panel className="space-y-4">
        <Field label="Date of birth">
          <input type="date" className="input" value={dob} max={on} onChange={(e) => setDob(e.target.value)} />
        </Field>
        <Field label="Age on this date">
          <input type="date" className="input" value={on} onChange={(e) => setOn(e.target.value)} />
        </Field>
        <button className="btn-secondary w-full" onClick={() => setOn(today())}>Use today</button>
      </Panel>

      <div className="space-y-4">
        {r ? (
          <>
            <div className="rounded-3xl bg-gradient-to-br from-emerald-500 to-teal-500 p-6 text-white shadow-lg">
              <p className="text-sm font-medium text-white/80">Your age</p>
              <p className="mt-1 text-4xl font-extrabold tabular-nums sm:text-5xl">
                {r.age.y} <span className="text-2xl font-semibold">years</span> {r.age.m} <span className="text-2xl font-semibold">months</span> {r.age.d} <span className="text-2xl font-semibold">days</span>
              </p>
              <p className="mt-3 text-white/85">Born on a {r.weekday}. 🎂 {r.toNext === 0 ? "Happy birthday today!" : `${r.toNext} days until you turn ${r.nextAge}.`}</p>
            </div>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              <Stat label="Months" value={fmt(r.months, 0)} />
              <Stat label="Weeks" value={fmt(r.weeks, 0)} />
              <Stat label="Days" value={fmt(r.days, 0)} />
              <Stat label="Hours" value={fmt(r.hours, 0)} />
            </div>
          </>
        ) : (
          <Panel><p className="text-gray-500">Enter a valid date of birth before the selected date.</p></Panel>
        )}
      </div>
    </div>
  );
}
