/// <reference lib="webworker" />
/**
 * Whisper speech recognition running entirely in the browser (transformers.js).
 * The model is downloaded once from Hugging Face and cached by the browser;
 * audio never leaves the device.
 */
import { pipeline, type AutomaticSpeechRecognitionPipeline } from "@huggingface/transformers";

type InMsg =
  | { type: "load"; model: string; useGpu?: boolean }
  | { type: "transcribe"; audio: Float32Array; language: string; task: "transcribe" | "translate"; timestamps: boolean };

export type OutMsg =
  | { type: "progress"; loaded: number; total: number; progress: number }
  | { type: "ready"; device: string }
  | { type: "partial"; done: number; total: number; chunks: Segment[] }
  | { type: "complete"; chunks: Segment[] }
  | { type: "error"; message: string };

export interface Segment {
  start: number;
  end: number | null;
  text: string;
}

const SR = 16000;
const PAD = Math.round(SR * 0.4);
const BLOCK_S = 29; // + 0.4 s padding stays inside Whisper's 30 s window; partial text every ~30 s

let asr: AutomaticSpeechRecognitionPipeline | null = null;
let loadedModel = "";
let device = "wasm";

const post = (m: OutMsg) => (self as unknown as Worker).postMessage(m);

async function hasWebGPU() {
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const gpu = (navigator as any).gpu;
    return !!(gpu && (await gpu.requestAdapter()));
  } catch {
    return false;
  }
}

async function create(model: string, dev: "webgpu" | "wasm") {
  return (await pipeline("automatic-speech-recognition", model, {
    device: dev,
    // GPU: fp32 encoder + q4 decoder is fast but larger; q8 runs very slowly on WebGPU.
    // CPU: q8 is both the smallest download and the fastest option.
    dtype: dev === "webgpu" ? { encoder_model: "fp32", decoder_model_merged: "q4" } : "q8",
    progress_callback: (p) => {
      if (p.status === "progress_total") post({ type: "progress", loaded: p.loaded, total: p.total, progress: p.progress });
    },
  })) as AutomaticSpeechRecognitionPipeline;
}

async function load(model: string, useGpu = false) {
  // CPU (q8) is the default: smallest download and, in testing, faster than WebGPU on typical laptops.
  const want = useGpu && (await hasWebGPU()) ? "webgpu" : "wasm";
  if (asr && loadedModel === model + want) return post({ type: "ready", device });
  if (asr) await asr.dispose();
  asr = null;
  try {
    asr = await create(model, want);
    device = want;
  } catch (e) {
    if (want !== "webgpu") throw e;
    asr = await create(model, "wasm"); // GPU path failed on this device — fall back to CPU
    device = "wasm";
  }
  loadedModel = model + want;
  post({ type: "ready", device });
}

/** Find the quietest 300 ms stretch in [from, to) and cut in its middle, so blocks split in pauses, not mid-word. */
function quietestCut(audio: Float32Array, from: number, to: number) {
  const frame = Math.round(SR * 0.3);
  const step = SR / 50;
  let best = to;
  let bestE = Infinity;
  for (let s = from; s + frame <= to; s += step) {
    let e = 0;
    for (let i = s; i < s + frame; i++) e += audio[i] * audio[i];
    if (e < bestE) {
      bestE = e;
      best = s + Math.floor(frame / 2);
    }
  }
  return Math.floor(best);
}

async function transcribe(audio: Float32Array, language: string, task: "transcribe" | "translate", timestamps: boolean) {
  if (!asr) throw new Error("Model not loaded");
  const blocks: [number, number][] = [];
  for (let start = 0; start < audio.length; ) {
    let end = Math.min(audio.length, start + BLOCK_S * SR);
    if (end < audio.length) end = quietestCut(audio, end - 4 * SR, end); // cut in a pause, not mid-word
    blocks.push([start, end]);
    start = end;
  }

  const all: Segment[] = [];
  for (let b = 0; b < blocks.length; b++) {
    const [s, e] = blocks[b];
    const offset = s / SR - PAD / SR; // timestamps are relative to the padded block
    // Lead each block with a little silence: Whisper tends to drop a word that starts at sample 0.
    const block = new Float32Array(PAD + (e - s));
    block.set(audio.subarray(s, e), PAD);
    const out = await asr(block, {
      language: language === "auto" ? undefined : language,
      task,
      return_timestamps: timestamps ? true : undefined,
    });
    const res = Array.isArray(out) ? out[0] : out;
    if (timestamps && res.chunks?.length) {
      for (const c of res.chunks) {
        const [cs, ce] = c.timestamp as [number, number | null];
        all.push({ start: Math.max(s / SR, offset + cs), end: ce == null ? e / SR : Math.max(s / SR, offset + ce), text: c.text });
      }
    } else if (res.text?.trim()) {
      all.push({ start: s / SR, end: e / SR, text: res.text });
    }
    post({ type: "partial", done: b + 1, total: blocks.length, chunks: [...all] });
  }
  post({ type: "complete", chunks: all });
}

self.onmessage = async (ev: MessageEvent<InMsg>) => {
  try {
    const m = ev.data;
    if (m.type === "load") await load(m.model, m.useGpu);
    if (m.type === "transcribe") await transcribe(m.audio, m.language, m.task, m.timestamps);
  } catch (err) {
    post({ type: "error", message: err instanceof Error ? err.message : String(err) });
  }
};
