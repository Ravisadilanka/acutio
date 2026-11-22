"use client";

import { useEffect, useState } from "react";
import { CopyButton, Field, Panel } from "@/components/ui/kit";

function relative(ms: number) {
  const s = Math.round((ms - Date.now()) / 1000);
  const rtf = new Intl.RelativeTimeFormat(undefined, { numeric: "auto" });
  const units: [Intl.RelativeTimeFormatUnit, number][] = [["year", 31536000], ["month", 2592000], ["day", 86400], ["hour", 3600], ["minute", 60], ["second", 1]];
  for (const [u, sec] of units) if (Math.abs(s) >= sec || u === "second") return rtf.format(Math.round(s / sec), u);
  return "";
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-3 border-b py-2.5 last:border-0">
      <span className="text-sm text-gray-500">{label}</span>
      <span className="flex items-center gap-2 text-right font-mono text-sm text-gray-900">
        {value}
        <CopyButton text={value} label="" className="border-0 p-1.5" />
      </span>
    </div>
  );
}

export default function Client() {
  const [now, setNow] = useState(0);
  const [ts, setTs] = useState("");
  const [date, setDate] = useState("");

  useEffect(() => {
    const t = Math.floor(Date.now() / 1000);
    setNow(t);
    setTs(String(t));
    const d = new Date();
    d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
    setDate(d.toISOString().slice(0, 19));
    const id = setInterval(() => setNow(Math.floor(Date.now() / 1000)), 1000);
    return () => clearInterval(id);
  }, []);

  const n = Number(ts.trim());
  const isMs = Math.abs(n) > 1e11;
  const ms = isMs ? n : n * 1000;
  const valid = ts.trim() !== "" && Number.isFinite(n) && !isNaN(new Date(ms).getTime());
  const d = new Date(ms);

  const fromDate = date ? new Date(date) : null;

  return (
    <div className="space-y-6">
      <Panel className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="stat-label">Current Unix timestamp</p>
          <p className="mt-1 font-mono text-3xl font-bold tabular-nums text-gray-900">{now || "…"}</p>
        </div>
        <CopyButton text={String(now)} />
      </Panel>

      <div className="grid gap-6 lg:grid-cols-2">
        <Panel>
          <h2 className="text-lg font-semibold text-gray-900">Timestamp → Date</h2>
          <Field label="Unix timestamp (seconds or milliseconds)">
            <input className="input mt-1 font-mono" value={ts} onChange={(e) => setTs(e.target.value)} />
          </Field>
          {valid ? (
            <div className="mt-4">
              <p className="mb-1 text-xs text-gray-500">Detected: {isMs ? "milliseconds" : "seconds"}</p>
              <Row label="UTC" value={d.toUTCString()} />
              <Row label="Local" value={d.toLocaleString()} />
              <Row label="ISO 8601" value={d.toISOString()} />
              <Row label="Relative" value={relative(ms)} />
            </div>
          ) : (
            <p className="mt-4 text-sm text-gray-500">Enter a numeric timestamp.</p>
          )}
        </Panel>

        <Panel>
          <h2 className="text-lg font-semibold text-gray-900">Date → Timestamp</h2>
          <Field label="Date & time (your local time)">
            <input type="datetime-local" step={1} className="input mt-1" value={date} onChange={(e) => setDate(e.target.value)} />
          </Field>
          {fromDate && !isNaN(+fromDate) && (
            <div className="mt-4">
              <Row label="Seconds" value={String(Math.floor(+fromDate / 1000))} />
              <Row label="Milliseconds" value={String(+fromDate)} />
              <Row label="ISO 8601 (UTC)" value={fromDate.toISOString()} />
            </div>
          )}
        </Panel>
      </div>
    </div>
  );
}
