"use client";

import { useEffect, useRef, useState } from "react";
import { Download, FileAudio, Loader2, Square, Cpu, Zap } from "lucide-react";
import FileDropzone from "@/components/FileDropzone";
import { CopyButton, Field, Panel, Segmented, baseName, downloadText, formatBytes } from "@/components/ui/kit";
import { usePersistentState } from "@/lib/local";
import type { OutMsg, Segment } from "@/lib/whisper.worker";

// Download sizes measured from the Hugging Face model files (GPU = fp32 encoder + q4 decoder, CPU = q8).
const MODELS = [
  { id: "onnx-community/whisper-tiny", label: "Fast", gpu: "120 MB", cpu: "41 MB", hint: "Quickest, good for clear English" },
  { id: "onnx-community/whisper-base", label: "Balanced", gpu: "206 MB", cpu: "77 MB", hint: "Recommended for most audio" },
  { id: "onnx-community/whisper-small", label: "Accurate", gpu: "586 MB", cpu: "249 MB", hint: "Best for accents & other languages" },
];

const LANGS: [string, string][] = [
  ["auto", "Detect automatically"], ["en", "English"], ["si", "Sinhala"], ["ta", "Tamil"], ["hi", "Hindi"], ["ar", "Arabic"],
  ["bn", "Bengali"], ["ur", "Urdu"], ["zh", "Chinese"], ["ja", "Japanese"], ["ko", "Korean"], ["es", "Spanish"], ["fr", "French"],
  ["de", "German"], ["it", "Italian"], ["pt", "Portuguese"], ["ru", "Russian"], ["tr", "Turkish"], ["nl", "Dutch"], ["id", "Indonesian"],
  ["ms", "Malay"], ["th", "Thai"], ["vi", "Vietnamese"], ["fil", "Filipino"],
];

const SR = 16000;

/** Decode any audio/video file the browser supports to 16 kHz mono Float32. */
async function decodeAudio(file: File): Promise<Float32Array> {
  const buf = await file.arrayBuffer();
  const ctx = new AudioContext();
  const decoded = await ctx.decodeAudioData(buf);
  ctx.close();
  const offline = new OfflineAudioContext(1, Math.ceil(decoded.duration * SR), SR);
  const src = offline.createBufferSource();
  src.buffer = decoded;
  src.connect(offline.destination);
  src.start();
  return (await offline.startRendering()).getChannelData(0);
}

const ts = (s: number, sep: "," | ".") => {
  const ms = Math.round(s * 1000);
  const h = Math.floor(ms / 3600000), m = Math.floor((ms % 3600000) / 60000), sec = Math.floor((ms % 60000) / 1000);
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}${sep}${String(ms % 1000).padStart(3, "0")}`;
};
const short = (s: number) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, "0")}`;

export default function Client() {
  const [file, setFile] = useState<File | null>(null);
  const [duration, setDuration] = useState(0);
  const [model, setModel] = usePersistentState("whisper-model", MODELS[1].id);
  const [lang, setLang] = usePersistentState("whisper-lang", "auto");
  const [task, setTask] = useState<"transcribe" | "translate">("transcribe");
  const [phase, setPhase] = useState<"idle" | "decoding" | "loading" | "transcribing" | "done">("idle");
  const [dl, setDl] = useState({ loaded: 0, total: 0, progress: 0 });
  const [prog, setProg] = useState({ done: 0, total: 0 });
  const [segments, setSegments] = useState<Segment[]>([]);
  const [device, setDevice] = useState("");
  const [err, setErr] = useState("");
  const [view, setView] = useState<"text" | "timed">("text");
  const [elapsed, setElapsed] = useState(0);
  const worker = useRef<Worker | null>(null);
  const audioRef = useRef<Float32Array | null>(null);
  const started = useRef(0);
  const settings = useRef({ lang: "auto", task: "transcribe" as "transcribe" | "translate" });

  useEffect(() => () => worker.current?.terminate(), []);

  const [hasGpu, setHasGpu] = useState(false);
  const [useGpu, setUseGpu] = usePersistentState("whisper-gpu", false);
  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    setHasGpu(!!(navigator as any).gpu);
  }, []);
  const gpu = hasGpu && useGpu;

  useEffect(() => {
    if (phase !== "transcribing" && phase !== "loading") return;
    const id = setInterval(() => setElapsed((Date.now() - started.current) / 1000), 500);
    return () => clearInterval(id);
  }, [phase]);

  const getWorker = () => {
    if (!worker.current) {
      worker.current = new Worker(new URL("../../../lib/whisper.worker.ts", import.meta.url), { type: "module" });
      worker.current.onmessage = (e: MessageEvent<OutMsg>) => {
        const m = e.data;
        if (m.type === "progress") setDl({ loaded: m.loaded, total: m.total, progress: m.progress });
        if (m.type === "ready") {
          setDevice(m.device);
          started.current = Date.now(); // time the transcription itself, not the model download
          setElapsed(0);
          setPhase("transcribing");
          worker.current!.postMessage({ type: "transcribe", audio: audioRef.current, language: settings.current.lang, task: settings.current.task, timestamps: true });
        }
        if (m.type === "partial") {
          setProg({ done: m.done, total: m.total });
          setSegments(m.chunks);
        }
        if (m.type === "complete") {
          setSegments(m.chunks);
          setPhase("done");
        }
        if (m.type === "error") {
          setErr(/memory|allocat/i.test(m.message) ? "Your device ran out of memory. Try the Fast model or a shorter file." : `Something went wrong: ${m.message}`);
          setPhase("idle");
        }
      };
    }
    return worker.current;
  };

  const pick = async (f: File) => {
    setFile(f);
    setSegments([]);
    setErr("");
    setPhase("decoding");
    try {
      const audio = await decodeAudio(f);
      audioRef.current = audio;
      setDuration(audio.length / SR);
      setPhase("idle");
    } catch {
      setErr("This file couldn't be read. Try MP3, WAV, M4A, OGG, WEBM or MP4.");
      setFile(null);
      setPhase("idle");
    }
  };

  const start = () => {
    if (!audioRef.current) return;
    setErr("");
    setSegments([]);
    setProg({ done: 0, total: 0 });
    settings.current = { lang, task }; // read by the worker callback, which outlives this render
    started.current = Date.now();
    setElapsed(0);
    setPhase("loading");
    getWorker().postMessage({ type: "load", model, useGpu: gpu });
  };

  const stop = () => {
    worker.current?.terminate();
    worker.current = null;
    setPhase(segments.length ? "done" : "idle");
  };

  const text = segments.map((s) => s.text.trim()).join(" ").replace(/\s+/g, " ").trim();
  const timed = segments.map((s) => `[${short(s.start)}] ${s.text.trim()}`).join("\n");
  const srt = segments.map((s, i) => `${i + 1}\n${ts(s.start, ",")} --> ${ts(s.end ?? s.start + 2, ",")}\n${s.text.trim()}\n`).join("\n");
  const vtt = "WEBVTT\n\n" + segments.map((s) => `${ts(s.start, ".")} --> ${ts(s.end ?? s.start + 2, ".")}\n${s.text.trim()}\n`).join("\n");
  const busy = phase === "loading" || phase === "transcribing" || phase === "decoding";
  const name = file ? baseName(file.name) : "transcript";

  return (
    <div className="space-y-6">
      {!file ? (
        <FileDropzone
          onFilesAdded={(f) => pick(f[0])}
          multiple={false}
          accept={{ "audio/*": [".mp3", ".wav", ".m4a", ".ogg", ".opus", ".aac", ".flac", ".webm", ".amr"], "video/*": [".mp4", ".mov", ".webm", ".mkv"] }}
          title="Select an audio or video file"
          subtitle="MP3, WAV, M4A, WhatsApp voice notes, MP4 videos and more"
        />
      ) : (
        <div className="card flex items-center gap-3 p-4">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-600 dark:text-cyan-400"><FileAudio className="h-5 w-5" /></span>
          <div className="min-w-0 flex-1">
            <p className="truncate font-medium text-gray-900">{file.name}</p>
            <p className="text-sm text-gray-500">{formatBytes(file.size)}{duration ? ` · ${short(duration)} long` : phase === "decoding" ? " · reading audio…" : ""}</p>
          </div>
          {!busy && <button className="btn-ghost text-sm" onClick={() => { setFile(null); setSegments([]); setPhase("idle"); }}>Change file</button>}
        </div>
      )}

      {file && phase !== "decoding" && (
        <Panel className="space-y-5">
          <div>
            <p className="label">Quality <span className="font-normal text-gray-500">· one-time download, then saved in your browser</span></p>
            <div className="grid gap-2 sm:grid-cols-3">
              {MODELS.map((m) => (
                <button key={m.id} disabled={busy} onClick={() => setModel(m.id)} className={`rounded-xl border p-3 text-left transition ${model === m.id ? "border-brand ring-4 ring-brand-soft" : "hover:border-gray-300"}`}>
                  <span className="block font-semibold text-gray-900">{m.label} <span className="text-xs font-normal text-gray-500">{gpu ? m.gpu : m.cpu}</span></span>
                  <span className="block text-xs text-gray-500">{m.hint}</span>
                </button>
              ))}
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Spoken language">
              <select className="input" value={lang} onChange={(e) => setLang(e.target.value)} disabled={busy}>
                {LANGS.map(([c, n]) => <option key={c} value={c}>{n}</option>)}
              </select>
            </Field>
            <Field label="Output">
              <Segmented value={task} onChange={setTask} options={[{ value: "transcribe", label: "Same language" }, { value: "translate", label: "Translate to English" }]} />
            </Field>
          </div>
          {hasGpu && (
            <label className="flex items-start gap-2 text-sm text-gray-700">
              <input type="checkbox" className="mt-0.5" checked={useGpu} onChange={(e) => setUseGpu(e.target.checked)} disabled={busy} />
              <span>Use my graphics card <span className="text-gray-500">— can be faster on powerful desktop PCs, but needs a larger download and is often slower on laptops.</span></span>
            </label>
          )}
          {duration > 0 && !busy && (
            <p className="text-sm text-gray-500">
              Estimated time: about {Math.max(1, Math.round((duration * ({ "onnx-community/whisper-tiny": 0.35, "onnx-community/whisper-base": 0.8, "onnx-community/whisper-small": 2.5 } as Record<string, number>)[model]) / 60))} min on a typical computer for {short(duration)} of audio, plus the one-time model download.
            </p>
          )}
          {(lang === "si" || lang === "ta") && model !== MODELS[2].id && (
            <p className="text-sm text-amber-600">Tip: for Sinhala and Tamil, choose “Accurate” — smaller models often struggle with these languages.</p>
          )}
          <div className="flex flex-wrap items-center gap-3">
            {!busy ? (
              <button className="btn-primary px-8 py-3.5 text-base" onClick={start} disabled={!duration}>
                {segments.length ? "Transcribe again" : "Transcribe audio"}
              </button>
            ) : (
              <button className="btn-secondary" onClick={stop}><Square className="h-4 w-4" /> Stop</button>
            )}
            {device && (
              <span className="inline-flex items-center gap-1.5 text-xs text-gray-500">
                {device === "webgpu" ? <><Zap className="h-3.5 w-3.5 text-amber-500" /> Using your GPU (fast)</> : <><Cpu className="h-3.5 w-3.5" /> Using your CPU</>}
              </span>
            )}
          </div>

          {phase === "loading" && (
            <div>
              <p className="flex items-center gap-2 text-sm text-gray-600">
                <Loader2 className="h-4 w-4 animate-spin" />
                {dl.total ? `Downloading speech model… ${formatBytes(dl.loaded)} of ${formatBytes(dl.total)} (one-time, then cached)` : "Preparing speech model…"}
              </p>
              <div className="mt-2 h-2 overflow-hidden rounded-full bg-gray-200"><div className="h-full bg-brand transition-all" style={{ width: `${dl.progress}%` }} /></div>
            </div>
          )}
          {phase === "transcribing" && (
            <div>
              <p className="flex items-center gap-2 text-sm text-gray-600">
                <Loader2 className="h-4 w-4 animate-spin" />
                Transcribing… {prog.total ? `${Math.min(100, Math.round((prog.done / prog.total) * 100))}%` : ""} · {Math.round(elapsed)}s
              </p>
              <div className="mt-2 h-2 overflow-hidden rounded-full bg-gray-200"><div className="h-full bg-brand transition-all" style={{ width: `${prog.total ? (prog.done / prog.total) * 100 : 3}%` }} /></div>
            </div>
          )}
        </Panel>
      )}

      {err && <p className="rounded-xl bg-rose-500/10 px-4 py-3 text-sm text-rose-600">{err}</p>}

      {segments.length > 0 && (
        <Panel className="space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <Segmented value={view} onChange={setView} options={[{ value: "text", label: "Text" }, { value: "timed", label: "With timestamps" }]} />
            <span className="text-sm text-gray-500">{text.split(/\s+/).filter(Boolean).length.toLocaleString()} words</span>
            <div className="ml-auto flex flex-wrap gap-2">
              <CopyButton text={view === "text" ? text : timed} />
              <button className="btn-secondary px-3 py-2" onClick={() => downloadText(view === "text" ? text : timed, `${name}.txt`)}><Download className="h-4 w-4" /> TXT</button>
              <button className="btn-secondary px-3 py-2" onClick={() => downloadText(srt, `${name}.srt`)}><Download className="h-4 w-4" /> SRT</button>
              <button className="btn-secondary px-3 py-2" onClick={() => downloadText(vtt, `${name}.vtt`, "text/vtt")}><Download className="h-4 w-4" /> VTT</button>
            </div>
          </div>
          <textarea className="textarea min-h-80 font-sans text-base leading-relaxed" readOnly value={view === "text" ? text : timed} aria-label="Transcript" />
          {phase === "transcribing" && <p className="text-xs text-gray-500">Transcript is updating as each part finishes…</p>}
        </Panel>
      )}
    </div>
  );
}
