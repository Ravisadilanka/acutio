"use client";

import { useEffect, useMemo, useState } from "react";
import { ArrowLeftRight, Plus, X } from "lucide-react";
import { Field, Panel } from "@/components/ui/kit";
import { usePersistentState } from "@/lib/local";

interface Rates { base: string; rates: Record<string, number>; updated: number; fetched: number }

const CACHE = "acutio:fx-rates";
const SOURCE = "https://open.er-api.com/v6/latest/USD";
const TTL = 6 * 60 * 60 * 1000;

const name = (code: string) => {
  try {
    return new Intl.DisplayNames([navigator.language], { type: "currency" }).of(code) ?? code;
  } catch {
    return code;
  }
};

export default function Client() {
  const [data, setData] = useState<Rates | null>(null);
  const [err, setErr] = useState("");
  const [amount, setAmount] = usePersistentState("fx-amount", "100");
  const [from, setFrom] = usePersistentState("fx-from", "USD");
  const [to, setTo] = usePersistentState("fx-to", "LKR");
  const [compare, setCompare] = usePersistentState<string[]>("fx-compare", ["EUR", "GBP", "INR", "AED", "AUD", "JPY"]);
  const [add, setAdd] = useState("");

  useEffect(() => {
    let cached: Rates | null = null;
    try {
      cached = JSON.parse(localStorage.getItem(CACHE) || "null");
    } catch {}
    if (cached) setData(cached);
    if (cached && Date.now() - cached.fetched < TTL) return;
    // Only the public rate table is downloaded; amounts never leave the device.
    fetch(SOURCE)
      .then((r) => r.json())
      .then((j) => {
        if (j.result !== "success") throw new Error();
        const d: Rates = { base: "USD", rates: j.rates, updated: j.time_last_update_unix * 1000, fetched: Date.now() };
        setData(d);
        localStorage.setItem(CACHE, JSON.stringify(d));
      })
      .catch(() => setErr(cached ? "Showing the last saved rates (you appear to be offline)." : "Couldn't load exchange rates. Check your connection and try again."));
  }, []);

  const codes = useMemo(() => (data ? Object.keys(data.rates).sort() : []), [data]);
  const conv = (amt: number, f: string, t: string) => (data ? (amt / data.rates[f]) * data.rates[t] : NaN);
  const a = parseFloat(amount) || 0;
  const result = conv(a, from, to);
  const money = (n: number, code: string) => {
    try {
      return n.toLocaleString(undefined, { style: "currency", currency: code, maximumFractionDigits: n < 1 ? 6 : 2 });
    } catch {
      return `${n.toFixed(2)} ${code}`;
    }
  };

  const Select = ({ value, onChange, label }: { value: string; onChange: (v: string) => void; label: string }) => (
    <Field label={label}>
      <select className="input" value={value} onChange={(e) => onChange(e.target.value)}>
        {(codes.length ? codes : [value]).map((c) => <option key={c} value={c}>{c} — {name(c)}</option>)}
      </select>
    </Field>
  );

  return (
    <div className="space-y-6">
      <Panel>
        <div className="grid items-end gap-4 md:grid-cols-[1fr_1.4fr_auto_1.4fr]">
          <Field label="Amount"><input type="number" inputMode="decimal" className="input text-lg" value={amount} onChange={(e) => setAmount(e.target.value)} /></Field>
          <Select label="From" value={from} onChange={setFrom} />
          <button className="btn-secondary mb-0.5 p-3" onClick={() => { setFrom(to); setTo(from); }} aria-label="Swap currencies"><ArrowLeftRight className="h-5 w-5" /></button>
          <Select label="To" value={to} onChange={setTo} />
        </div>
        <div className="mt-6 rounded-2xl bg-brand-soft p-5">
          <p className="text-gray-600">{money(a, from)} =</p>
          <p className="mt-1 text-4xl font-extrabold tabular-nums text-brand sm:text-5xl">{data ? money(result, to) : "…"}</p>
          {data && (
            <p className="mt-2 text-sm text-gray-600">
              1 {from} = {conv(1, from, to).toLocaleString(undefined, { maximumFractionDigits: 6 })} {to} · 1 {to} = {conv(1, to, from).toLocaleString(undefined, { maximumFractionDigits: 6 })} {from}
            </p>
          )}
        </div>
        {err && <p className="mt-3 text-sm text-amber-600">{err}</p>}
        {data && (
          <p className="mt-3 text-xs text-gray-500">
            Rates updated {new Date(data.updated).toLocaleString()} · <a href="https://www.exchangerate-api.com" target="_blank" rel="noopener noreferrer" className="underline">Rates by Exchange Rate API</a> · For reference only — banks add their own margin.
          </p>
        )}
      </Panel>

      {data && (
        <Panel className="p-0 sm:p-0">
          <p className="border-b px-5 py-3 text-sm font-semibold text-gray-900">{money(a, from)} in other currencies</p>
          <ul className="divide-y">
            {compare.filter((c) => data.rates[c] && c !== from).map((c) => (
              <li key={c} className="flex items-center justify-between gap-3 px-5 py-3">
                <span className="text-gray-700"><strong className="text-gray-900">{c}</strong> <span className="text-sm text-gray-500">{name(c)}</span></span>
                <span className="flex items-center gap-2 font-semibold tabular-nums text-gray-900">
                  {money(conv(a, from, c), c)}
                  <button className="btn-ghost p-1" onClick={() => setCompare(compare.filter((x) => x !== c))} aria-label={`Remove ${c}`}><X className="h-4 w-4" /></button>
                </span>
              </li>
            ))}
          </ul>
          <div className="flex gap-2 border-t p-4">
            <select className="input" value={add} onChange={(e) => setAdd(e.target.value)} aria-label="Add currency">
              <option value="">Add a currency…</option>
              {codes.filter((c) => !compare.includes(c)).map((c) => <option key={c} value={c}>{c} — {name(c)}</option>)}
            </select>
            <button className="btn-primary shrink-0" disabled={!add} onClick={() => { setCompare([...compare, add]); setAdd(""); }}><Plus className="h-4 w-4" /> Add</button>
          </div>
        </Panel>
      )}
    </div>
  );
}
