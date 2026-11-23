"use client";

import { useEffect, useRef, useState } from "react";
import { Play, Pause, Square } from "lucide-react";
import { Field, Panel } from "@/components/ui/kit";

export default function Client() {
  const [supported, setSupported] = useState(true);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [voice, setVoice] = useState("");
  const [lang, setLang] = useState("");
  const [text, setText] = useState("Welcome to Acutio! Paste any text here and press play to hear it read aloud.");
  const [rate, setRate] = useState(1);
  const [pitch, setPitch] = useState(1);
  const [state, setState] = useState<"idle" | "playing" | "paused">("idle");
  const [pos, setPos] = useState<[number, number] | null>(null);
  const keepAlive = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (!("speechSynthesis" in window)) return setSupported(false);
    const load = () => {
      const v = speechSynthesis.getVoices();
      setVoices(v);
      if (v.length && !voice) {
        const nav = navigator.language.slice(0, 2);
        const def = v.find((x) => x.lang.startsWith(nav) && x.default) ?? v.find((x) => x.lang.startsWith(nav)) ?? v[0];
        setVoice(def.voiceURI);
        setLang(def.lang.slice(0, 2));
      }
    };
    load();
    speechSynthesis.addEventListener("voiceschanged", load);
    return () => {
      speechSynthesis.removeEventListener("voiceschanged", load);
      speechSynthesis.cancel();
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const langs = [...new Set(voices.map((v) => v.lang.slice(0, 2)))].sort();
  const langName = (code: string) => { try { return new Intl.DisplayNames([navigator.language], { type: "language" }).of(code) ?? code; } catch { return code; } };
  const filtered = voices.filter((v) => !lang || v.lang.startsWith(lang));

  const stop = () => {
    speechSynthesis.cancel();
    if (keepAlive.current) clearInterval(keepAlive.current);
    setState("idle");
    setPos(null);
  };

  const play = () => {
    if (state === "paused") { speechSynthesis.resume(); setState("playing"); return; }
    speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    const v = voices.find((x) => x.voiceURI === voice);
    if (v) { u.voice = v; u.lang = v.lang; }
    u.rate = rate;
    u.pitch = pitch;
    u.onboundary = (e) => { if (e.name === "word" || e.charLength) setPos([e.charIndex, e.charIndex + (e.charLength || text.slice(e.charIndex).search(/\s|$/))]); };
    u.onend = u.onerror = () => { setState("idle"); setPos(null); if (keepAlive.current) clearInterval(keepAlive.current); };
    speechSynthesis.speak(u);
    setState("playing");
    // Chrome stops long utterances after ~15s unless nudged.
    keepAlive.current = setInterval(() => { if (speechSynthesis.speaking && !speechSynthesis.paused) { speechSynthesis.pause(); speechSynthesis.resume(); } }, 12000);
  };

  if (!supported) return <Panel><p className="text-gray-600">Your browser doesn&apos;t support text to speech. Try Chrome, Edge or Safari.</p></Panel>;

  return (
    <div className="grid gap-6 lg:grid-cols-[1.6fr_1fr]">
      <div>
        {state !== "idle" && pos ? (
          <div className="min-h-[340px] whitespace-pre-wrap rounded-xl border bg-surface p-4 text-lg leading-relaxed text-gray-800">
            {text.slice(0, pos[0])}<mark className="rounded bg-brand-soft text-brand-ink">{text.slice(pos[0], pos[1])}</mark>{text.slice(pos[1])}
          </div>
        ) : (
          <textarea className="textarea min-h-[340px] font-sans text-lg" value={text} onChange={(e) => setText(e.target.value)} placeholder="Type or paste text to read aloud…" aria-label="Text to speak" />
        )}
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <button className="btn-primary px-6" onClick={state === "playing" ? () => { speechSynthesis.pause(); setState("paused"); } : play} disabled={!text.trim()}>
            {state === "playing" ? <><Pause className="h-4 w-4" /> Pause</> : <><Play className="h-4 w-4" /> {state === "paused" ? "Resume" : "Play"}</>}
          </button>
          <button className="btn-secondary" onClick={stop} disabled={state === "idle"}><Square className="h-4 w-4" /> Stop</button>
          <span className="ml-auto text-sm text-gray-500">{text.trim() ? text.trim().split(/\s+/).length : 0} words · ~{Math.max(1, Math.round(text.trim().split(/\s+/).length / (160 * rate)))} min</span>
        </div>
      </div>
      <Panel className="space-y-4 self-start">
        <Field label="Language">
          <select className="input" value={lang} onChange={(e) => { setLang(e.target.value); const v = voices.find((x) => x.lang.startsWith(e.target.value)); if (v) setVoice(v.voiceURI); }}>
            <option value="">All languages</option>
            {langs.map((l) => <option key={l} value={l}>{langName(l)}</option>)}
          </select>
        </Field>
        <Field label={`Voice (${filtered.length})`}>
          <select className="input" value={voice} onChange={(e) => setVoice(e.target.value)}>
            {filtered.map((v) => <option key={v.voiceURI} value={v.voiceURI}>{v.name} ({v.lang})</option>)}
          </select>
        </Field>
        <div>
          <div className="flex justify-between"><span className="label">Speed</span><span className="text-sm tabular-nums text-gray-600">{rate.toFixed(1)}×</span></div>
          <input type="range" min={0.5} max={2} step={0.1} value={rate} onChange={(e) => setRate(+e.target.value)} className="w-full" aria-label="Speed" />
        </div>
        <div>
          <div className="flex justify-between"><span className="label">Pitch</span><span className="text-sm tabular-nums text-gray-600">{pitch.toFixed(1)}</span></div>
          <input type="range" min={0} max={2} step={0.1} value={pitch} onChange={(e) => setPitch(+e.target.value)} className="w-full" aria-label="Pitch" />
        </div>
        <p className="text-xs text-gray-500">Voices are provided by your device. Install more voices in your operating system&apos;s language settings.</p>
      </Panel>
    </div>
  );
}
