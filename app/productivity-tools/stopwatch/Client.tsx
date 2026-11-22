"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Play, Pause, Flag, RotateCcw } from "lucide-react";
import { Panel, CopyButton } from "@/components/ui/kit";

const fmt = (ms: number) => {
  const h = Math.floor(ms / 3600000);
  const m = Math.floor((ms % 3600000) / 60000);
  const s = Math.floor((ms % 60000) / 1000);
  const cs = Math.floor((ms % 1000) / 10);
  return `${h ? h + ":" : ""}${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}.${String(cs).padStart(2, "0")}`;
};

export default function Client() {
  const [running, setRunning] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [laps, setLaps] = useState<number[]>([]);
  const base = useRef({ start: 0, acc: 0 });
  const raf = useRef(0);

  const tick = useCallback(() => {
    setElapsed(base.current.acc + performance.now() - base.current.start);
    raf.current = requestAnimationFrame(tick);
  }, []);

  const toggle = useCallback(() => {
    setRunning((r) => {
      if (r) { cancelAnimationFrame(raf.current); base.current.acc += performance.now() - base.current.start; setElapsed(base.current.acc); }
      else { base.current.start = performance.now(); raf.current = requestAnimationFrame(tick); }
      return !r;
    });
  }, [tick]);

  const lap = useCallback(() => setLaps((l) => [base.current.acc + (running ? performance.now() - base.current.start : 0), ...l]), [running]);
  const reset = useCallback(() => { cancelAnimationFrame(raf.current); base.current = { start: 0, acc: 0 }; setElapsed(0); setLaps([]); setRunning(false); }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (/INPUT|TEXTAREA/.test((e.target as HTMLElement).tagName)) return;
      if (e.code === "Space") { e.preventDefault(); toggle(); }
      if (e.key === "l" || e.key === "L") lap();
      if (e.key === "r" || e.key === "R") reset();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [toggle, lap, reset]);

  useEffect(() => () => cancelAnimationFrame(raf.current), []);

  const splits = laps.map((t, i) => t - (laps[i + 1] ?? 0));
  const best = splits.length > 1 ? Math.min(...splits) : -1;
  const worst = splits.length > 1 ? Math.max(...splits) : -1;

  return (
    <div className="space-y-6">
      <Panel className="flex flex-col items-center py-12">
        <p className="font-mono text-6xl font-bold tabular-nums tracking-tight text-gray-900 sm:text-8xl">{fmt(elapsed)}</p>
        <div className="mt-8 flex gap-3">
          <button className="btn-secondary h-14 px-5" onClick={running ? lap : reset} disabled={!running && elapsed === 0}>
            {running ? <><Flag className="h-5 w-5" /> Lap</> : <><RotateCcw className="h-5 w-5" /> Reset</>}
          </button>
          <button className={`btn h-14 w-40 text-lg text-white ${running ? "bg-rose-500 hover:bg-rose-600" : "bg-emerald-500 hover:bg-emerald-600"}`} onClick={toggle}>
            {running ? <><Pause className="h-5 w-5" /> Stop</> : <><Play className="h-5 w-5" /> Start</>}
          </button>
        </div>
        <p className="mt-5 text-xs text-gray-500">Shortcuts: <kbd className="rounded border px-1">Space</kbd> start/stop · <kbd className="rounded border px-1">L</kbd> lap · <kbd className="rounded border px-1">R</kbd> reset</p>
      </Panel>
      {laps.length > 0 && (
        <Panel className="p-0 sm:p-0">
          <div className="flex items-center justify-between border-b px-5 py-3">
            <p className="font-semibold text-gray-900">Laps ({laps.length})</p>
            <CopyButton text={laps.map((t, i) => `Lap ${laps.length - i}\t${fmt(splits[i])}\t${fmt(t)}`).reverse().join("\n")} label="Copy" />
          </div>
          <table className="w-full font-mono text-sm tabular-nums">
            <tbody className="divide-y">
              {laps.map((t, i) => (
                <tr key={i} className={splits[i] === best ? "text-emerald-600" : splits[i] === worst ? "text-rose-500" : "text-gray-700"}>
                  <td className="px-5 py-2.5 font-sans">Lap {laps.length - i}</td>
                  <td className="px-5 py-2.5 text-right">{fmt(splits[i])}</td>
                  <td className="px-5 py-2.5 text-right text-gray-500">{fmt(t)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Panel>
      )}
    </div>
  );
}
