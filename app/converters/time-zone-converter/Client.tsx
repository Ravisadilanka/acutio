"use client";

import { useEffect, useMemo, useState } from "react";
import { Plus, X } from "lucide-react";
import { Field, Panel } from "@/components/ui/kit";
import { usePersistentState } from "@/lib/local";

const popular = ["UTC", "America/New_York", "America/Los_Angeles", "Europe/London", "Europe/Paris", "Asia/Dubai", "Asia/Kolkata", "Asia/Colombo", "Asia/Singapore", "Asia/Tokyo", "Australia/Sydney"];

function allZones(): string[] {
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (Intl as any).supportedValuesOf("timeZone");
  } catch {
    return popular;
  }
}

/** Offset in minutes of tz at the given UTC instant. */
function offset(tz: string, date: Date) {
  const parts = new Intl.DateTimeFormat("en-US", { timeZone: tz, hourCycle: "h23", year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit", second: "2-digit" }).formatToParts(date);
  const g = (t: string) => +parts.find((p) => p.type === t)!.value;
  const asUtc = Date.UTC(g("year"), g("month") - 1, g("day"), g("hour") % 24, g("minute"), g("second"));
  return Math.round((asUtc - date.getTime()) / 60000);
}

/** Convert a wall-clock time in tz to a UTC Date. */
function zonedToUtc(local: string, tz: string) {
  const guess = new Date(local + ":00Z");
  const o1 = offset(tz, guess);
  const d = new Date(guess.getTime() - o1 * 60000);
  const o2 = offset(tz, d);
  return o1 === o2 ? d : new Date(guess.getTime() - o2 * 60000);
}

const label = (tz: string) => tz.split("/").pop()!.replace(/_/g, " ");
const fmtOffset = (m: number) => `UTC${m >= 0 ? "+" : "−"}${String(Math.floor(Math.abs(m) / 60)).padStart(2, "0")}:${String(Math.abs(m) % 60).padStart(2, "0")}`;

export default function Client() {
  const zones = useMemo(allZones, []);
  const [src, setSrc] = useState("UTC");
  const [local, setLocal] = useState("");
  const [targets, setTargets] = usePersistentState<string[]>("tz-targets", ["America/New_York", "Europe/London", "Asia/Kolkata", "Asia/Tokyo"]);
  const [add, setAdd] = useState("");

  useEffect(() => {
    const here = Intl.DateTimeFormat().resolvedOptions().timeZone;
    setSrc(here);
    const now = new Date();
    const o = offset(here, now);
    setLocal(new Date(now.getTime() + o * 60000).toISOString().slice(0, 16));
  }, []);

  const instant = local ? zonedToUtc(local, src) : new Date();

  return (
    <div className="space-y-6">
      <Panel className="grid gap-4 sm:grid-cols-2">
        <Field label="Date & time">
          <input type="datetime-local" className="input" value={local} onChange={(e) => setLocal(e.target.value)} />
        </Field>
        <Field label="In time zone">
          <select className="input" value={src} onChange={(e) => setSrc(e.target.value)}>
            {zones.map((z) => <option key={z} value={z}>{z.replace(/_/g, " ")}</option>)}
          </select>
        </Field>
      </Panel>

      <div className="grid gap-3 sm:grid-cols-2">
        {/* Times depend on the visitor's clock, so render them only after mount (avoids a hydration mismatch). */}
        {!local && <p className="text-sm text-gray-500">Loading your local time…</p>}
        {local && targets.map((tz) => {
          const time = instant.toLocaleTimeString(undefined, { timeZone: tz, hour: "2-digit", minute: "2-digit" });
          const date = instant.toLocaleDateString(undefined, { timeZone: tz, weekday: "short", month: "short", day: "numeric" });
          const hour = +new Intl.DateTimeFormat("en-US", { timeZone: tz, hour: "numeric", hourCycle: "h23" }).format(instant);
          const working = hour >= 9 && hour < 18;
          return (
            <div key={tz} className="card flex items-center justify-between p-5">
              <div>
                <p className="font-semibold text-gray-900">{label(tz)}</p>
                <p className="text-xs text-gray-500">{tz} · {fmtOffset(offset(tz, instant))}</p>
              </div>
              <div className="flex items-center gap-3 text-right">
                <div>
                  <p className="text-2xl font-bold tabular-nums text-gray-900">{time}</p>
                  <p className={`text-xs ${working ? "text-emerald-600" : "text-gray-500"}`}>{date}{working ? " · work hours" : ""}</p>
                </div>
                <button onClick={() => setTargets(targets.filter((t) => t !== tz))} className="btn-ghost p-1.5" aria-label={`Remove ${tz}`}><X className="h-4 w-4" /></button>
              </div>
            </div>
          );
        })}
      </div>

      <Panel className="flex flex-col gap-3 sm:flex-row">
        <select className="input" value={add} onChange={(e) => setAdd(e.target.value)} aria-label="Add a time zone">
          <option value="">Add a city / time zone…</option>
          {zones.filter((z) => !targets.includes(z)).map((z) => <option key={z} value={z}>{z.replace(/_/g, " ")}</option>)}
        </select>
        <button className="btn-primary shrink-0" disabled={!add} onClick={() => { setTargets([...targets, add]); setAdd(""); }}><Plus className="h-4 w-4" /> Add</button>
      </Panel>
    </div>
  );
}
