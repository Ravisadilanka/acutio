"use client";

import { useMemo, useState } from "react";
import { NumberField, Panel, Segmented, Stat, fmt } from "@/components/ui/kit";

export default function Client() {
  const [amount, setAmount] = useState("250000");
  const [rate, setRate] = useState("7.5");
  const [term, setTerm] = useState("20");
  const [unit, setUnit] = useState<"years" | "months">("years");

  const r = useMemo(() => {
    const P = +amount;
    const n = Math.round(unit === "years" ? +term * 12 : +term);
    const i = +rate / 100 / 12;
    if (!(P > 0) || !(n > 0)) return null;
    const emi = i === 0 ? P / n : (P * i * (1 + i) ** n) / ((1 + i) ** n - 1);
    const rows: { year: number; principal: number; interest: number; balance: number }[] = [];
    let bal = P;
    let yp = 0;
    let yi = 0;
    for (let m = 1; m <= n; m++) {
      const int = bal * i;
      const pr = emi - int;
      bal = Math.max(0, bal - pr);
      yp += pr;
      yi += int;
      if (m % 12 === 0 || m === n) {
        rows.push({ year: Math.ceil(m / 12), principal: yp, interest: yi, balance: bal });
        yp = yi = 0;
      }
    }
    return { emi, total: emi * n, interest: emi * n - P, P, rows };
  }, [amount, rate, term, unit]);

  const pct = r ? (r.P / r.total) * 100 : 0;

  return (
    <div className="space-y-6">
      <div className="grid gap-6 lg:grid-cols-[1fr_1.3fr]">
        <Panel className="space-y-4">
          <NumberField label="Loan amount" value={amount} onChange={setAmount} />
          <NumberField label="Annual interest rate" value={rate} onChange={setRate} suffix="%" />
          <div>
            <NumberField label="Loan term" value={term} onChange={setTerm} suffix={unit} />
            <Segmented className="mt-2" value={unit} onChange={setUnit} options={[{ value: "years", label: "Years" }, { value: "months", label: "Months" }]} />
          </div>
        </Panel>
        <div className="space-y-4">
          <Stat accent label="Monthly payment (EMI)" value={r ? fmt(r.emi) : "—"} />
          <div className="grid gap-3 sm:grid-cols-2">
            <Stat label="Total interest" value={r ? fmt(r.interest) : "—"} />
            <Stat label="Total payable" value={r ? fmt(r.total) : "—"} />
          </div>
          {r && (
            <Panel>
              <div className="flex h-4 overflow-hidden rounded-full">
                <div className="bg-brand" style={{ width: `${pct}%` }} />
                <div className="flex-1 bg-amber-400" />
              </div>
              <div className="mt-3 flex justify-between text-sm text-gray-600">
                <span><span className="mr-1.5 inline-block h-2.5 w-2.5 rounded-full bg-brand" />Principal {fmt(pct, 1)}%</span>
                <span><span className="mr-1.5 inline-block h-2.5 w-2.5 rounded-full bg-amber-400" />Interest {fmt(100 - pct, 1)}%</span>
              </div>
            </Panel>
          )}
        </div>
      </div>

      {r && (
        <Panel className="overflow-x-auto p-0 sm:p-0">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-left text-gray-500">
              <tr>
                <th className="px-4 py-3 font-medium">Year</th>
                <th className="px-4 py-3 text-right font-medium">Principal</th>
                <th className="px-4 py-3 text-right font-medium">Interest</th>
                <th className="px-4 py-3 text-right font-medium">Balance</th>
              </tr>
            </thead>
            <tbody className="divide-y tabular-nums">
              {r.rows.map((row) => (
                <tr key={row.year}>
                  <td className="px-4 py-2.5">{row.year}</td>
                  <td className="px-4 py-2.5 text-right">{fmt(row.principal)}</td>
                  <td className="px-4 py-2.5 text-right">{fmt(row.interest)}</td>
                  <td className="px-4 py-2.5 text-right font-medium">{fmt(row.balance)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Panel>
      )}
    </div>
  );
}
