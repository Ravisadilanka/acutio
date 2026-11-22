"use client";

import { useEffect, useRef, useState } from "react";
import { Shuffle, X, Maximize2 } from "lucide-react";
import { Panel } from "@/components/ui/kit";
import { usePersistentState } from "@/lib/local";

const COLORS = ["#6366f1", "#ec4899", "#f59e0b", "#10b981", "#06b6d4", "#8b5cf6", "#ef4444", "#84cc16", "#f97316", "#3b82f6"];

function cryptoRandom() {
  const b = new Uint32Array(1);
  crypto.getRandomValues(b);
  return b[0] / 2 ** 32;
}

export default function Client() {
  const [text, setText] = usePersistentState("wheel-entries", "Alice\nBob\nCharlie\nDiana\nEthan\nFiona");
  const [rotation, setRotation] = useState(0);
  const [spinning, setSpinning] = useState(false);
  const [winner, setWinner] = useState<string | null>(null);
  const [history, setHistory] = useState<string[]>([]);
  const canvas = useRef<HTMLCanvasElement>(null);
  const wrap = useRef<HTMLDivElement>(null);
  const entries = text.split("\n").map((s) => s.trim()).filter(Boolean);

  useEffect(() => {
    const c = canvas.current;
    if (!c) return;
    const ctx = c.getContext("2d")!;
    const size = c.width;
    const r = size / 2;
    ctx.clearRect(0, 0, size, size);
    const n = Math.max(entries.length, 1);
    const arc = (2 * Math.PI) / n;
    for (let i = 0; i < n; i++) {
      ctx.beginPath();
      ctx.moveTo(r, r);
      ctx.arc(r, r, r - 4, i * arc, (i + 1) * arc);
      ctx.fillStyle = entries.length ? COLORS[i % COLORS.length] : "#cbd5e1";
      ctx.fill();
      ctx.strokeStyle = "#fff";
      ctx.lineWidth = 3;
      ctx.stroke();
      if (!entries.length) continue;
      ctx.save();
      ctx.translate(r, r);
      ctx.rotate(i * arc + arc / 2);
      ctx.fillStyle = "#fff";
      ctx.font = `600 ${Math.max(14, Math.min(34, 360 / n))}px Inter, system-ui, sans-serif`;
      ctx.textAlign = "right";
      ctx.textBaseline = "middle";
      const label = entries[i].length > 22 ? entries[i].slice(0, 21) + "…" : entries[i];
      ctx.fillText(label, r - 28, 0);
      ctx.restore();
    }
  }, [entries.join("\n")]); // eslint-disable-line react-hooks/exhaustive-deps

  const spin = () => {
    if (spinning || entries.length < 2) return;
    setWinner(null);
    const n = entries.length;
    const idx = Math.floor(cryptoRandom() * n);
    const seg = 360 / n;
    // Pointer is at the top (270° in canvas terms). Land the middle of segment idx under it.
    const target = 270 - (idx * seg + seg / 2) + (cryptoRandom() - 0.5) * seg * 0.7;
    const current = rotation % 360;
    const delta = ((target - current) % 360 + 360) % 360;
    const next = rotation + 360 * 6 + delta;
    setSpinning(true);
    setRotation(next);
    setTimeout(() => {
      setSpinning(false);
      setWinner(entries[idx]);
      setHistory((h) => [entries[idx], ...h].slice(0, 10));
    }, 5200);
  };

  const removeWinner = () => {
    if (!winner) return;
    const lines = text.split("\n");
    const i = lines.findIndex((l) => l.trim() === winner);
    if (i >= 0) lines.splice(i, 1);
    setText(lines.join("\n"));
    setWinner(null);
  };

  const shuffle = () => {
    const a = [...entries];
    for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(cryptoRandom() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
    setText(a.join("\n"));
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
      <div ref={wrap} className="relative flex flex-col items-center rounded-3xl bg-page p-2">
        <div className="relative w-full max-w-[560px]">
          <div className="absolute left-1/2 top-0 z-10 -translate-x-1/2 -translate-y-1" aria-hidden="true">
            <div className="h-0 w-0 border-x-[18px] border-t-[30px] border-x-transparent border-t-gray-900 drop-shadow" />
          </div>
          <canvas
            ref={canvas}
            width={800}
            height={800}
            onClick={spin}
            className="aspect-square w-full cursor-pointer rounded-full shadow-2xl"
            style={{ transform: `rotate(${rotation}deg)`, transition: spinning ? "transform 5.2s cubic-bezier(0.12, 0.8, 0.12, 1)" : "none" }}
            aria-label="Spin the wheel"
          />
          <button
            onClick={spin}
            disabled={spinning || entries.length < 2}
            className="absolute left-1/2 top-1/2 flex h-20 w-20 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white text-lg font-extrabold text-gray-900 shadow-xl ring-4 ring-white/60 transition hover:scale-105 disabled:opacity-80 dark:text-gray-50"
            style={{ color: "#111827" }}
          >
            SPIN
          </button>
        </div>
        {winner && (
          <div className="mt-6 w-full max-w-md rounded-2xl bg-gradient-to-r from-fuchsia-500 to-pink-500 p-5 text-center text-white shadow-lg animate-fade-up">
            <p className="text-sm font-medium text-white/80">🎉 The winner is</p>
            <p className="mt-1 break-words text-3xl font-extrabold">{winner}</p>
            <div className="mt-4 flex justify-center gap-2">
              <button className="btn bg-white/20 text-white hover:bg-white/30" onClick={removeWinner}>Remove & spin again</button>
              <button className="btn bg-white text-pink-600" onClick={spin}>Spin again</button>
            </div>
          </div>
        )}
      </div>

      <div className="space-y-4">
        <Panel>
          <div className="mb-2 flex items-center justify-between">
            <label className="label mb-0" htmlFor="entries">Entries ({entries.length})</label>
            <div className="flex gap-1">
              <button className="btn-ghost px-2 py-1.5 text-xs" onClick={shuffle}><Shuffle className="h-3.5 w-3.5" /> Shuffle</button>
              <button className="btn-ghost px-2 py-1.5 text-xs" onClick={() => wrap.current?.requestFullscreen?.()}><Maximize2 className="h-3.5 w-3.5" /> Fullscreen</button>
              <button className="btn-ghost px-2 py-1.5 text-xs" onClick={() => setText("")}><X className="h-3.5 w-3.5" /> Clear</button>
            </div>
          </div>
          <textarea id="entries" className="textarea min-h-72 font-sans" value={text} onChange={(e) => setText(e.target.value)} placeholder="One entry per line" />
          <p className="mt-2 text-xs text-gray-500">One name or option per line. Your list is saved only in this browser.</p>
        </Panel>
        {history.length > 0 && (
          <Panel>
            <p className="mb-2 text-sm font-semibold text-gray-900">Results</p>
            <ol className="list-decimal space-y-1 pl-5 text-sm text-gray-700">{history.map((h, i) => <li key={i}>{h}</li>)}</ol>
          </Panel>
        )}
      </div>
    </div>
  );
}
