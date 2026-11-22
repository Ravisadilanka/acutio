"use client";

import { useEffect, useRef, useState } from "react";
import { MonitorPlay, Square, Download, Trash2, Pause, Play } from "lucide-react";
import { Panel, downloadBlob, formatBytes } from "@/components/ui/kit";
import { clock, pickMime } from "@/lib/recorder";

export default function Client() {
  const [supported, setSupported] = useState(true);
  const [state, setState] = useState<"idle" | "recording" | "paused">("idle");
  const [mic, setMic] = useState(true);
  const [sysAudio, setSysAudio] = useState(true);
  const [elapsed, setElapsed] = useState(0);
  const [video, setVideo] = useState<{ url: string; blob: Blob; name: string } | null>(null);
  const [err, setErr] = useState("");
  const rec = useRef<MediaRecorder | null>(null);
  const streams = useRef<MediaStream[]>([]);
  const preview = useRef<HTMLVideoElement>(null);
  const timer = useRef({ start: 0, acc: 0 });

  useEffect(() => {
    setSupported(!!navigator.mediaDevices?.getDisplayMedia && typeof MediaRecorder !== "undefined");
    return () => streams.current.forEach((s) => s.getTracks().forEach((t) => t.stop()));
  }, []);

  useEffect(() => {
    if (state !== "recording") return;
    const id = setInterval(() => setElapsed(timer.current.acc + Date.now() - timer.current.start), 250);
    return () => clearInterval(id);
  }, [state]);

  const start = async () => {
    setErr("");
    try {
      const display = await navigator.mediaDevices.getDisplayMedia({ video: { frameRate: 30 }, audio: sysAudio });
      streams.current = [display];
      const tracks = [...display.getVideoTracks()];
      const audioTracks: MediaStreamTrack[] = [...display.getAudioTracks()];
      if (mic) {
        try {
          const m = await navigator.mediaDevices.getUserMedia({ audio: true });
          streams.current.push(m);
          audioTracks.push(...m.getAudioTracks());
        } catch { /* mic denied — continue without it */ }
      }
      if (audioTracks.length > 1) {
        const ac = new AudioContext();
        const dest = ac.createMediaStreamDestination();
        audioTracks.forEach((t) => ac.createMediaStreamSource(new MediaStream([t])).connect(dest));
        tracks.push(...dest.stream.getAudioTracks());
      } else tracks.push(...audioTracks);

      const combined = new MediaStream(tracks);
      if (preview.current) { preview.current.srcObject = display; preview.current.play().catch(() => {}); }
      const { mime, ext } = pickMime("video");
      const r = new MediaRecorder(combined, mime ? { mimeType: mime, videoBitsPerSecond: 5_000_000 } : undefined);
      const chunks: Blob[] = [];
      r.ondataavailable = (e) => e.data.size && chunks.push(e.data);
      r.onstop = () => {
        const blob = new Blob(chunks, { type: r.mimeType || "video/webm" });
        const name = `screen-recording-${new Date().toISOString().slice(0, 19).replace(/[T:]/g, "-")}.${ext}`;
        setVideo((v) => { if (v) URL.revokeObjectURL(v.url); return { url: URL.createObjectURL(blob), blob, name }; });
        streams.current.forEach((s) => s.getTracks().forEach((t) => t.stop()));
        if (preview.current) preview.current.srcObject = null;
        setState("idle");
      };
      display.getVideoTracks()[0].addEventListener("ended", () => r.state !== "inactive" && r.stop());
      r.start(1000);
      rec.current = r;
      timer.current = { start: Date.now(), acc: 0 };
      setElapsed(0);
      setState("recording");
    } catch (e) {
      if ((e as Error).name !== "NotAllowedError") setErr("Could not start screen recording on this browser/device.");
    }
  };

  const stop = () => rec.current?.state !== "inactive" && rec.current?.stop();

  if (!supported)
    return <Panel><p className="text-gray-600">Screen recording isn&apos;t supported in this browser. Please use Chrome, Edge, Firefox or Safari on a desktop computer.</p></Panel>;

  return (
    <div className="space-y-6">
      <Panel>
        <div className="relative overflow-hidden rounded-2xl bg-gray-950">
          <video ref={preview} muted playsInline className={`aspect-video w-full ${state === "idle" ? "hidden" : ""}`} />
          {state === "idle" && (
            <div className="flex aspect-video flex-col items-center justify-center text-center text-gray-400 dark:text-gray-500" style={{ color: "#94a3b8" }}>
              <MonitorPlay className="h-14 w-14" />
              <p className="mt-3">Your screen preview will appear here</p>
            </div>
          )}
          {state !== "idle" && (
            <span className="absolute left-4 top-4 flex items-center gap-2 rounded-full bg-black/70 px-3 py-1.5 font-mono text-sm text-white">
              <span className={`h-2.5 w-2.5 rounded-full bg-rose-500 ${state === "recording" ? "animate-pulse" : ""}`} /> {clock(elapsed)}
            </span>
          )}
        </div>
        <div className="mt-5 flex flex-wrap items-center gap-3">
          {state === "idle" ? (
            <>
              <button className="btn-primary px-6 py-3.5 text-base" onClick={start}><MonitorPlay className="h-5 w-5" /> Start recording</button>
              <label className="flex items-center gap-2 text-sm text-gray-700"><input type="checkbox" checked={mic} onChange={(e) => setMic(e.target.checked)} /> Microphone</label>
              <label className="flex items-center gap-2 text-sm text-gray-700"><input type="checkbox" checked={sysAudio} onChange={(e) => setSysAudio(e.target.checked)} /> Tab / system audio</label>
            </>
          ) : (
            <>
              <button className="btn-secondary" onClick={() => { if (state === "recording") { rec.current?.pause(); timer.current.acc += Date.now() - timer.current.start; setState("paused"); } else { rec.current?.resume(); timer.current.start = Date.now(); setState("recording"); } }}>
                {state === "recording" ? <><Pause className="h-4 w-4" /> Pause</> : <><Play className="h-4 w-4" /> Resume</>}
              </button>
              <button className="btn bg-rose-500 text-white hover:bg-rose-600" onClick={stop}><Square className="h-4 w-4" /> Stop</button>
            </>
          )}
        </div>
        {err && <p className="mt-3 text-sm text-rose-500">{err}</p>}
      </Panel>

      {video && (
        <Panel>
          <h2 className="mb-3 text-lg font-semibold text-gray-900">Your recording</h2>
          <video src={video.url} controls className="w-full rounded-xl bg-black" />
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <button className="btn-primary" onClick={() => downloadBlob(video.blob, video.name)}><Download className="h-4 w-4" /> Download ({formatBytes(video.blob.size)})</button>
            <button className="btn-ghost" onClick={() => { URL.revokeObjectURL(video.url); setVideo(null); }}><Trash2 className="h-4 w-4" /> Discard</button>
            <span className="text-xs text-gray-500">The video exists only in this tab until you download it.</span>
          </div>
        </Panel>
      )}
    </div>
  );
}
