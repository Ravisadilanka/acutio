"use client";

import { useEffect, useRef, useState } from "react";
import { Play, Pause, RotateCcw } from "lucide-react";
import { Panel } from "@/components/ui/kit";
import { beep, mmss, notify } from "@/lib/beep";

const presets = [1, 2, 3, 5, 10, 15, 20, 30, 45, 60];

export default function Client() {
  const [h, setH] = useState(0);
  const [m, setM] = useState(5);
  const [s, setS] = useState(0);
  const [left, setLeft] = useState<number | null>(null);
  const [running, setRunning] = useState(false);
  const [finished, setFinished] = useState(false);
  const end = useRef(0);
  const total = useRef(0);

  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => {
      const l = (end.current - Date.now()) / 1000;
      if (l <= 0) {
        setLeft(0);
        setRunning(false);
        setFinished(true);
        beep(6);
        notify("⏰ Time's up!", "Your Acutio countdown has finished.");
      } else setLeft(l);
    }, 200);
    return () => clearInterval(id);
  }, [running]);

  useEffect(() => {
    document.title = left !== null && (running || finished) ? `${finished ? "⏰ Time's up" : mmss(left)} · Timer` : "Countdown Timer Online – Set a Timer with Alarm | Acutio";
  }, [left, running, finished]);

  const start = (secs?: number) => {
    const t = secs ?? (left !== null && left > 0 && !finished ? left : h * 3600 + m * 60 + s);
    if (t <= 0) return;
    if (secs !== undefined || left === null || finished) total.current = t;
    if ("Notification" in window && Notification.permission === "default") Notification.requestPermission();
    end.current = Date.now() + t * 1000;
    setLeft(t);
    setFinished(false);
    setRunning(true);
  };

  const reset = () => { setRunning(false); setLeft(null); setFinished(false); };
  const pct = left !== null && total.current ? left / total.current : 1;

  return (
    <div className="space-y-6">
      <Panel className={`flex flex-col items-center py-12 transition ${finished ? "animate-pulse border-rose-400 bg-rose-500/10" : ""}`}>
        {left === null ? (
          <div className="flex items-end gap-2 font-mono">
            {[["h", h, setH, 99], ["m", m, setM, 59], ["s", s, setS, 59]].map(([k, v, set, max]) => (
              <label key={k as string} className="flex flex-col items-center">
                <input
                  type="number"
                  min={0}
                  max={max as number}
                  value={v as number}
                  onChange={(e) => (set as (n: number) => void)(Math.min(max as number, Math.max(0, Math.floor(+e.target.value) || 0)))}
                  className="w-24 rounded-2xl border bg-surface py-3 text-center text-5xl font-bold tabular-nums text-gray-900 outline-none focus:border-brand sm:w-32 sm:text-6xl"
                  aria-label={k === "h" ? "Hours" : k === "m" ? "Minutes" : "Seconds"}
                />
                <span className="mt-1 font-sans text-xs text-gray-500">{k === "h" ? "hours" : k === "m" ? "minutes" : "seconds"}</span>
              </label>
            ))}
          </div>
        ) : (
          <>
            <p className={`font-mono text-7xl font-bold tabular-nums sm:text-9xl ${finished ? "text-rose-500" : "text-gray-900"}`}>{finished ? "00:00" : mmss(left)}</p>
            <div className="mt-6 h-2 w-full max-w-lg overflow-hidden rounded-full bg-gray-200"><div className="h-full bg-brand transition-all" style={{ width: `${pct * 100}%` }} /></div>
            {finished && <p className="mt-4 text-xl font-bold text-rose-500">⏰ Time&apos;s up!</p>}
          </>
        )}
        <div className="mt-8 flex gap-3">
          {left !== null && <button className="btn-secondary h-14 px-5" onClick={reset}><RotateCcw className="h-5 w-5" /> Reset</button>}
          {!finished && (
            <button className="btn-primary h-14 w-40 text-lg" onClick={() => (running ? setRunning(false) : start())}>
              {running ? <><Pause className="h-5 w-5" /> Pause</> : <><Play className="h-5 w-5" /> {left !== null ? "Resume" : "Start"}</>}
            </button>
          )}
        </div>
      </Panel>
      <div className="flex flex-wrap justify-center gap-2">
        {presets.map((p) => <button key={p} className="chip bg-surface" onClick={() => start(p * 60)}>{p} min</button>)}
      </div>
    </div>
  );
}
