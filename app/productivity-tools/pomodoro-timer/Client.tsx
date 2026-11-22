"use client";

import { useEffect, useRef, useState } from "react";
import { Play, Pause, RotateCcw, SkipForward } from "lucide-react";
import { NumberField, Panel, Segmented } from "@/components/ui/kit";
import { usePersistentState } from "@/lib/local";
import { beep, mmss, notify } from "@/lib/beep";

type Mode = "focus" | "short" | "long";
const LABEL: Record<Mode, string> = { focus: "Focus", short: "Short break", long: "Long break" };

export default function Client() {
  const [cfg, setCfg] = usePersistentState("pomodoro", { focus: 25, short: 5, long: 15, every: 4, auto: true });
  const [mode, setMode] = useState<Mode>("focus");
  const [left, setLeft] = useState(cfg.focus * 60);
  const [running, setRunning] = useState(false);
  const [done, setDone] = useState(0);
  const end = useRef(0);

  const total = cfg[mode] * 60;

  useEffect(() => { if (!running) setLeft(cfg[mode] * 60); }, [cfg, mode]); // eslint-disable-line react-hooks/exhaustive-deps

  const switchTo = (m: Mode, autoStart = false) => {
    setMode(m);
    setLeft(cfg[m] * 60);
    if (autoStart) { end.current = Date.now() + cfg[m] * 60000; setRunning(true); } else setRunning(false);
  };

  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => {
      const l = (end.current - Date.now()) / 1000;
      if (l <= 0) {
        beep(4);
        if (mode === "focus") {
          const n = done + 1;
          setDone(n);
          notify("Focus session done! 🍅", "Time for a break.");
          switchTo(n % cfg.every === 0 ? "long" : "short", cfg.auto);
        } else {
          notify("Break over", "Back to focus.");
          switchTo("focus", cfg.auto);
        }
      } else setLeft(l);
    }, 250);
    return () => clearInterval(id);
  }, [running, mode, done, cfg]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    document.title = running ? `${mmss(left)} · ${LABEL[mode]}` : "Pomodoro Timer Online – Focus Timer 25/5 | Acutio";
  }, [left, running, mode]);

  const toggle = () => {
    if (running) { setRunning(false); return; }
    if ("Notification" in window && Notification.permission === "default") Notification.requestPermission();
    end.current = Date.now() + left * 1000;
    setRunning(true);
  };

  const pct = 1 - left / total;
  const R = 130, C = 2 * Math.PI * R;
  const color = mode === "focus" ? "#f43f5e" : mode === "short" ? "#10b981" : "#3b82f6";

  return (
    <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
      <Panel className="flex flex-col items-center py-10">
        <Segmented value={mode} onChange={(m) => switchTo(m)} options={[{ value: "focus", label: "Focus" }, { value: "short", label: "Short break" }, { value: "long", label: "Long break" }]} />
        <div className="relative mt-8">
          <svg width="300" height="300" viewBox="0 0 300 300" className="-rotate-90">
            <circle cx="150" cy="150" r={R} fill="none" strokeWidth="14" className="stroke-gray-200" />
            <circle cx="150" cy="150" r={R} fill="none" strokeWidth="14" stroke={color} strokeLinecap="round" strokeDasharray={C} strokeDashoffset={C * (1 - pct)} style={{ transition: "stroke-dashoffset .3s linear" }} />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <p className="font-mono text-6xl font-bold tabular-nums text-gray-900">{mmss(left)}</p>
            <p className="mt-1 text-sm font-medium" style={{ color }}>{LABEL[mode]}</p>
          </div>
        </div>
        <div className="mt-8 flex gap-3">
          <button className="btn-secondary p-3.5" onClick={() => switchTo(mode)} aria-label="Reset"><RotateCcw className="h-5 w-5" /></button>
          <button className="btn h-14 w-40 text-lg text-white shadow-lg" style={{ background: color }} onClick={toggle}>
            {running ? <><Pause className="h-5 w-5" /> Pause</> : <><Play className="h-5 w-5" /> Start</>}
          </button>
          <button className="btn-secondary p-3.5" onClick={() => switchTo(mode === "focus" ? "short" : "focus")} aria-label="Skip"><SkipForward className="h-5 w-5" /></button>
        </div>
        <p className="mt-6 text-gray-600">🍅 × {done} completed today</p>
      </Panel>
      <Panel className="space-y-4 self-start">
        <p className="font-semibold text-gray-900">Settings (minutes)</p>
        <div className="grid grid-cols-3 gap-3">
          <NumberField label="Focus" value={cfg.focus} onChange={(v) => setCfg({ ...cfg, focus: Math.max(1, +v || 1) })} min={1} />
          <NumberField label="Short" value={cfg.short} onChange={(v) => setCfg({ ...cfg, short: Math.max(1, +v || 1) })} min={1} />
          <NumberField label="Long" value={cfg.long} onChange={(v) => setCfg({ ...cfg, long: Math.max(1, +v || 1) })} min={1} />
        </div>
        <NumberField label="Long break every" value={cfg.every} onChange={(v) => setCfg({ ...cfg, every: Math.max(1, Math.round(+v) || 4) })} suffix="sessions" />
        <label className="flex items-center gap-2 text-sm text-gray-700"><input type="checkbox" checked={cfg.auto} onChange={(e) => setCfg({ ...cfg, auto: e.target.checked })} /> Auto-start next session</label>
      </Panel>
    </div>
  );
}
