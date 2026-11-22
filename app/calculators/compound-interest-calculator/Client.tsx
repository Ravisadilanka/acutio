"use client";

import { useMemo, useState } from "react";
import { Field, NumberField, Panel, Stat, fmt } from "@/components/ui/kit";

export default function Client() {
  const [initial, setInitial] = useState("10000");
  const [monthly, setMonthly] = useState("200");
  const [rate, setRate] = useState("8");
  const [years, setYears] = useState("15");
  const [freq, setFreq] = useState("12");

  const r = useMemo(() => {
    const n = +freq;
    const yrs = Math.min(100, Math.max(0, Math.round(+years)));
    const monthlyRate = (1 + +rate / 100 / n) ** (n / 12) - 1; // effective monthly rate
    let bal = +initial || 0;
    let contrib = bal;
    const rows = [];
    for (let y = 1; y <= yrs; y++) {
      for (let m = 0; m < 12; m++) {
        bal = bal * (1 + monthlyRate) + (+monthly || 0);
        contrib += +monthly || 0;
      }
      rows.push({ y, bal, contrib, interest: bal - contrib });
    }
    return { bal, contrib, interest: bal - contrib, rows };
  }, [initial, monthly, rate, years, freq]);

  const max = r.rows.at(-1)?.bal || 1;

  return (
    <div className="space-y-6">
      <div className="grid gap-6 lg:grid-cols-[1fr_1.3fr]">
        <Panel className="space-y-4">
          <NumberField label="Initial deposit" value={initial} onChange={setInitial} />
          <NumberField label="Monthly contribution" value={monthly} onChange={setMonthly} />
          <NumberField label="Annual interest rate" value={rate} onChange={setRate} suffix="%" />
          <NumberField label="Years" value={years} onChange={setYears} suffix="yrs" />
          <Field label="Compounding">
            <select className="input" value={freq} onChange={(e) => setFreq(e.target.value)}>
              <option value="1">Annually</option>
              <option value="4">Quarterly</option>
              <option value="12">Monthly</option>
              <option value="365">Daily</option>
            </select>
          </Field>
        </Panel>
        <div className="space-y-4">
          <Stat accent label="Future value" value={fmt(r.bal)} />
          <div className="grid gap-3 sm:grid-cols-2">
            <Stat label="Total contributions" value={fmt(r.contrib)} />
            <Stat label="Interest earned" value={fmt(r.interest)} />
          </div>
          <Panel>
            <p className="mb-3 text-sm font-medium text-gray-700">Growth over time</p>
            <div className="flex h-44 items-end gap-[3px]">
              {r.rows.map((row) => (
                <div key={row.y} className="flex flex-1 flex-col justify-end" title={`Year ${row.y}: ${fmt(row.bal)}`}>
                  <div className="rounded-t bg-emerald-400" style={{ height: `${(row.interest / max) * 176}px` }} />
                  <div className="bg-brand" style={{ height: `${(row.contrib / max) * 176}px` }} />
                </div>
              ))}
            </div>
            <div className="mt-3 flex gap-4 text-xs text-gray-600">
              <span><span className="mr-1 inline-block h-2.5 w-2.5 rounded-full bg-brand" />Contributions</span>
              <span><span className="mr-1 inline-block h-2.5 w-2.5 rounded-full bg-emerald-400" />Interest</span>
            </div>
          </Panel>
        </div>
      </div>
      <Panel className="overflow-x-auto p-0 sm:p-0">
        <table className="w-full text-sm tabular-nums">
          <thead className="bg-gray-50 text-left text-gray-500">
            <tr><th className="px-4 py-3 font-medium">Year</th><th className="px-4 py-3 text-right font-medium">Contributions</th><th className="px-4 py-3 text-right font-medium">Interest</th><th className="px-4 py-3 text-right font-medium">Balance</th></tr>
          </thead>
          <tbody className="divide-y">
            {r.rows.map((row) => (
              <tr key={row.y}><td className="px-4 py-2.5">{row.y}</td><td className="px-4 py-2.5 text-right">{fmt(row.contrib)}</td><td className="px-4 py-2.5 text-right">{fmt(row.interest)}</td><td className="px-4 py-2.5 text-right font-medium">{fmt(row.bal)}</td></tr>
            ))}
          </tbody>
        </table>
      </Panel>
    </div>
  );
}
