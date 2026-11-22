"use client";

import { useEffect, useRef, useState } from "react";
import { Mic, Pause, Play, Square, Download, Trash2 } from "lucide-react";
import { Panel, downloadBlob, formatBytes } from "@/components/ui/kit";
import { clock, pickMime } from "@/lib/recorder";

interface Clip { url: string; blob: Blob; name: string; ms: number }

export default function Client() {
  const [state, setState] = useState<"idle" | "recording" | "paused">("idle");
  const [elapsed, setElapsed] = useState(0);
  const [clips, setClips] = useState<Clip[]>([]);
  const [err, setErr] = useState("");
  const rec = useRef<MediaRecorder | null>(null);
  const stream = useRef<MediaStream | null>(null);
  const chunks = useRef<Blob[]>([]);
  const canvas = useRef<HTMLCanvasElement>(null);
  const raf = useRef(0);
  const timer = useRef({ start: 0, acc: 0 });
  const mime = useRef(pickMime("audio"));

  useEffect(() => () => { cancelAnimationFrame(raf.current); stream.current?.getTracks().forEach((t) => t.stop()); }, []);

  useEffect(() => {
    if (state !== "recording") return;
    const id = setInterval(() => setElapsed(timer.current.acc + Date.now() - timer.current.start), 200);
    return () => clearInterval(id);
  }, [state]);

  const draw = (analyser: AnalyserNode) => {
    const c = canvas.current;
    if (!c) return;
    const ctx = c.getContext("2d")!;
    const data = new Uint8Array(analyser.frequencyBinCount);
    const loop = () => {
      analyser.getByteTimeDomainData(data);
      ctx.clearRect(0, 0, c.width, c.height);
      ctx.lineWidth = 3;
      ctx.strokeStyle = getComputedStyle(document.documentElement).getPropertyValue("--color-brand") || "#5046e5";
      ctx.beginPath();
      const step = c.width / data.length;
      data.forEach((v, i) => { const y = (v / 255) * c.height; if (i) ctx.lineTo(i * step, y); else ctx.moveTo(0, y); });
      ctx.stroke();
      raf.current = requestAnimationFrame(loop);
    };
    loop();
  };

  const start = async () => {
    setErr("");
    try {
      mime.current = pickMime("audio");
      const s = await navigator.mediaDevices.getUserMedia({ audio: { echoCancellation: true, noiseSuppression: true } });
      stream.current = s;
      const ac = new AudioContext();
      const an = ac.createAnalyser();
      an.fftSize = 2048;
      ac.createMediaStreamSource(s).connect(an);
      draw(an);
      const r = new MediaRecorder(s, mime.current.mime ? { mimeType: mime.current.mime } : undefined);
      chunks.current = [];
      r.ondataavailable = (e) => e.data.size && chunks.current.push(e.data);
      r.onstop = () => {
        const blob = new Blob(chunks.current, { type: r.mimeType || "audio/webm" });
        const ms = timer.current.acc;
        const name = `recording-${new Date().toISOString().slice(0, 19).replace(/[T:]/g, "-")}.${mime.current.ext}`;
        setClips((c) => [{ url: URL.createObjectURL(blob), blob, name, ms }, ...c]);
        s.getTracks().forEach((t) => t.stop());
        ac.close();
        cancelAnimationFrame(raf.current);
      };
      r.start(250);
      rec.current = r;
      timer.current = { start: Date.now(), acc: 0 };
      setElapsed(0);
      setState("recording");
    } catch {
      setErr("Microphone access was blocked or no microphone was found. Allow microphone access in your browser's address bar and try again.");
    }
  };

  const pause = () => { rec.current?.pause(); timer.current.acc += Date.now() - timer.current.start; setState("paused"); };
  const resume = () => { rec.current?.resume(); timer.current.start = Date.now(); setState("recording"); };
  const stop = () => { if (state === "recording") timer.current.acc += Date.now() - timer.current.start; rec.current?.stop(); setState("idle"); };

  return (
    <div className="space-y-6">
      <Panel className="flex flex-col items-center py-10">
        <canvas ref={canvas} width={800} height={120} className={`h-24 w-full max-w-2xl ${state === "idle" ? "opacity-30" : ""}`} aria-hidden="true" />
        <p className="mt-4 font-mono text-5xl font-bold tabular-nums text-gray-900">{clock(elapsed)}</p>
        <p className="mt-1 text-sm text-gray-500">{state === "recording" ? "● Recording…" : state === "paused" ? "Paused" : "Ready"}</p>
        <div className="mt-6 flex gap-3">
          {state === "idle" ? (
            <button onClick={start} className="flex h-20 w-20 items-center justify-center rounded-full bg-rose-500 text-white shadow-xl shadow-rose-500/30 transition hover:scale-105" aria-label="Start recording">
              <Mic className="h-9 w-9" />
            </button>
          ) : (
            <>
              <button onClick={state === "recording" ? pause : resume} className="btn-secondary h-14 px-6">{state === "recording" ? <><Pause className="h-5 w-5" /> Pause</> : <><Play className="h-5 w-5" /> Resume</>}</button>
              <button onClick={stop} className="btn h-14 bg-rose-500 px-6 text-white hover:bg-rose-600"><Square className="h-5 w-5" /> Stop</button>
            </>
          )}
        </div>
        {err && <p className="mt-4 max-w-md text-center text-sm text-rose-500">{err}</p>}
      </Panel>

      {clips.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-lg font-semibold text-gray-900">Your recordings</h2>
          {clips.map((c, i) => (
            <Panel key={c.url} className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <div className="min-w-0 sm:w-52">
                <p className="truncate font-medium text-gray-900">{c.name}</p>
                <p className="text-xs text-gray-500">{clock(c.ms)} · {formatBytes(c.blob.size)}</p>
              </div>
              <audio controls src={c.url} className="h-10 w-full flex-1" />
              <div className="flex gap-2">
                <button className="btn-primary px-3 py-2" onClick={() => downloadBlob(c.blob, c.name)}><Download className="h-4 w-4" /> Download</button>
                <button className="btn-ghost p-2" onClick={() => { URL.revokeObjectURL(c.url); setClips(clips.filter((_, j) => j !== i)); }} aria-label="Delete recording"><Trash2 className="h-4 w-4" /></button>
              </div>
            </Panel>
          ))}
          <p className="text-xs text-gray-500">Recordings exist only in this tab. Download them before closing the page.</p>
        </div>
      )}
    </div>
  );
}
