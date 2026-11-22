"use client";

/** Pick the best MediaRecorder container the browser supports. */
export function pickMime(kind: "audio" | "video"): { mime: string; ext: string } {
  const opts =
    kind === "audio"
      ? [["audio/webm;codecs=opus", "webm"], ["audio/mp4", "m4a"], ["audio/ogg;codecs=opus", "ogg"], ["audio/webm", "webm"]]
      : [["video/mp4;codecs=avc1", "mp4"], ["video/webm;codecs=vp9,opus", "webm"], ["video/webm;codecs=vp8,opus", "webm"], ["video/webm", "webm"], ["video/mp4", "mp4"]];
  for (const [mime, ext] of opts) if (typeof MediaRecorder !== "undefined" && MediaRecorder.isTypeSupported(mime)) return { mime, ext };
  return { mime: "", ext: kind === "audio" ? "webm" : "webm" };
}

export const clock = (ms: number) => {
  const s = Math.floor(ms / 1000);
  const h = Math.floor(s / 3600);
  const mm = String(Math.floor((s % 3600) / 60)).padStart(2, "0");
  const ss = String(s % 60).padStart(2, "0");
  return h ? `${h}:${mm}:${ss}` : `${mm}:${ss}`;
};
