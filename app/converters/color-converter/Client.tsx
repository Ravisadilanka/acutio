"use client";

import { useState } from "react";
import { CopyButton, Panel } from "@/components/ui/kit";
import { rgbToHex, rgbToHsl, hexToRgb, type RGB } from "@/lib/color";


const clamp = (n: number, a = 0, b = 255) => Math.min(b, Math.max(a, n));
function hslToRgb([h, s, l]: RGB): RGB {
  s /= 100; l /= 100;
  const k = (n: number) => (n + h / 30) % 12;
  const a = s * Math.min(l, 1 - l);
  const f = (n: number) => l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
  return [f(0) * 255, f(8) * 255, f(4) * 255].map(Math.round) as RGB;
}
const lum = ([r, g, b]: RGB) => {
  const c = [r, g, b].map((v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; });
  return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
};
const contrast = (a: RGB, b: RGB) => { const [x, y] = [lum(a), lum(b)].sort((m, n) => n - m); return (x + 0.05) / (y + 0.05); };

export default function Client() {
  const [rgb, setRgb] = useState<RGB>([80, 70, 229]);
  const [hexText, setHexText] = useState<string | null>(null);
  const hex = rgbToHex(rgb);
  const hsl = rgbToHsl(rgb);
  const cssRgb = `rgb(${rgb.join(", ")})`;
  const cssHsl = `hsl(${hsl[0]}, ${hsl[1]}%, ${hsl[2]}%)`;
  const shades = [95, 85, 70, 55, 40, 25, 12].map((l) => rgbToHex(hslToRgb([hsl[0], hsl[1], l])));

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_1.2fr]">
      <Panel className="space-y-4">
        <div className="h-40 rounded-2xl border" style={{ background: hex }} />
        <input type="color" value={hex} onChange={(e) => { setRgb(hexToRgb(e.target.value)!); setHexText(null); }} className="h-12 w-full cursor-pointer rounded-xl border bg-surface p-1" aria-label="Colour picker" />
        <div className="grid grid-cols-2 gap-3">
          {(["Black text", "White text"] as const).map((t, i) => {
            const c = contrast(rgb, i ? [255, 255, 255] : [0, 0, 0]);
            return (
              <div key={t} className="rounded-xl p-3 text-center text-sm font-semibold" style={{ background: hex, color: i ? "#fff" : "#000" }}>
                {t} · {c.toFixed(2)}:1 {c >= 4.5 ? "✓ AA" : "✗"}
              </div>
            );
          })}
        </div>
      </Panel>
      <div className="space-y-3">
        <Panel>
          <label className="label">HEX</label>
          <div className="flex gap-2">
            <input className="input font-mono" value={hexText ?? hex.toUpperCase()} onChange={(e) => { setHexText(e.target.value); const v = hexToRgb(e.target.value); if (v) setRgb(v); }} onBlur={() => setHexText(null)} />
            <CopyButton text={hex.toUpperCase()} label="" />
          </div>
        </Panel>
        <Panel>
          <label className="label">RGB</label>
          <div className="flex gap-2">
            {rgb.map((v, i) => (
              <input key={i} type="number" min={0} max={255} className="input font-mono" value={v} onChange={(e) => { const n = [...rgb] as RGB; n[i] = clamp(+e.target.value); setRgb(n); }} aria-label={"RGB"[i]} />
            ))}
            <CopyButton text={cssRgb} label="" />
          </div>
        </Panel>
        <Panel>
          <label className="label">HSL</label>
          <div className="flex gap-2">
            {hsl.map((v, i) => (
              <input key={i} type="number" min={0} max={i ? 100 : 360} className="input font-mono" value={v} onChange={(e) => { const n = [...hsl] as RGB; n[i] = clamp(+e.target.value, 0, i ? 100 : 360); setRgb(hslToRgb(n)); }} aria-label={"HSL"[i]} />
            ))}
            <CopyButton text={cssHsl} label="" />
          </div>
        </Panel>
        <Panel>
          <p className="label">Tints & shades (click to use)</p>
          <div className="flex overflow-hidden rounded-xl border">
            {shades.map((s) => (
              <button key={s} className="h-14 flex-1 transition hover:scale-y-110" style={{ background: s }} title={s} onClick={() => setRgb(hexToRgb(s)!)} />
            ))}
          </div>
        </Panel>
      </div>
    </div>
  );
}
