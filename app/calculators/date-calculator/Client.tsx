"use client";

import { useMemo, useState } from "react";
import { Field, NumberField, Panel, Segmented, Stat, fmt } from "@/components/ui/kit";

const iso = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
const parse = (s: string) => new Date(s + "T00:00:00");

export default function Client() {
  const [mode, setMode] = useState<"diff" | "add">("diff");
  const now = new Date();
  const [start, setStart] = useState(iso(now));
  const [end, setEnd] = useState(iso(new Date(now.getFullYear(), 11, 31)));
  const [inclusive, setInclusive] = useState(false);
  const [base, setBase] = useState(iso(now));
  const [n, setN] = useState("30");
  const [unit, setUnit] = useState("days");
  const [sign, setSign] = useState<"+" | "-">("+");

  const d = useMemo(() => {
    const a = parse(start);
    const b = parse(end);
    if (isNaN(+a) || isNaN(+b)) return null;
    const [s, e] = a <= b ? [a, b] : [b, a];
    let days = Math.round((+e - +s) / 86400000) + (inclusive ? 1 : 0);
    let business = 0;
    const cur = new Date(s);
    const stop = new Date(e);
    if (inclusive) stop.setDate(stop.getDate() + 1);
    while (cur < stop) {
      const w = cur.getDay();
      if (w !== 0 && w !== 6) business++;
      cur.setDate(cur.getDate() + 1);
    }
    let months = (e.getFullYear() - s.getFullYear()) * 12 + e.getMonth() - s.getMonth();
    if (e.getDate() < s.getDate()) months--;
    return { days, weeks: Math.floor(days / 7), rem: days % 7, months, years: months / 12, business };
  }, [start, end, inclusive]);

  const added = useMemo(() => {
    const b = parse(base);
    if (isNaN(+b)) return null;
    const k = (sign === "+" ? 1 : -1) * (Math.round(+n) || 0);
    const r = new Date(b);
    if (unit === "days") r.setDate(r.getDate() + k);
    if (unit === "weeks") r.setDate(r.getDate() + k * 7);
    if (unit === "months") r.setMonth(r.getMonth() + k);
    if (unit === "years") r.setFullYear(r.getFullYear() + k);
    if (unit === "business") {
      let left = Math.abs(k);
      const step = k >= 0 ? 1 : -1;
      while (left > 0) {
        r.setDate(r.getDate() + step);
        if (r.getDay() !== 0 && r.getDay() !== 6) left--;
      }
    }
    return r;
  }, [base, n, unit, sign]);

  return (
    <div className="space-y-6">
      <Segmented value={mode} onChange={setMode} options={[{ value: "diff", label: "Days between dates" }, { value: "add", label: "Add / subtract days" }]} />
      {mode === "diff" ? (
        <div className="grid gap-6 lg:grid-cols-[1fr_1.3fr]">
          <Panel className="space-y-4">
            <Field label="Start date"><input type="date" className="input" value={start} onChange={(e) => setStart(e.target.value)} /></Field>
            <Field label="End date"><input type="date" className="input" value={end} onChange={(e) => setEnd(e.target.value)} /></Field>
            <label className="flex items-center gap-2 text-sm text-gray-700"><input type="checkbox" checked={inclusive} onChange={(e) => setInclusive(e.target.checked)} /> Include end date (+1 day)</label>
          </Panel>
          {d && (
            <div className="space-y-3">
              <Stat accent label="Total days" value={fmt(d.days, 0)} hint={`${d.weeks} weeks and ${d.rem} days`} />
              <div className="grid grid-cols-2 gap-3">
                <Stat label="Business days" value={fmt(d.business, 0)} hint="Mon–Fri" />
                <Stat label="Months" value={fmt(d.months, 0)} />
                <Stat label="Years" value={fmt(d.years, 2)} />
                <Stat label="Hours" value={fmt(d.days * 24, 0)} />
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="grid gap-6 lg:grid-cols-[1fr_1.3fr]">
          <Panel className="space-y-4">
            <Field label="Start date"><input type="date" className="input" value={base} onChange={(e) => setBase(e.target.value)} /></Field>
            <Segmented value={sign} onChange={setSign} options={[{ value: "+", label: "Add" }, { value: "-", label: "Subtract" }]} />
            <div className="grid grid-cols-2 gap-3">
              <NumberField label="Amount" value={n} onChange={setN} />
              <Field label="Unit">
                <select className="input" value={unit} onChange={(e) => setUnit(e.target.value)}>
                  <option value="days">Days</option>
                  <option value="business">Business days</option>
                  <option value="weeks">Weeks</option>
                  <option value="months">Months</option>
                  <option value="years">Years</option>
                </select>
              </Field>
            </div>
          </Panel>
          {added && <Stat accent label="Result date" value={added.toLocaleDateString(undefined, { weekday: "long", year: "numeric", month: "long", day: "numeric" })} />}
        </div>
      )}
    </div>
  );
}
