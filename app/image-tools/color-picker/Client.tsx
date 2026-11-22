"use client";

import { useRef, useState } from "react";
import { Pipette } from "lucide-react";
import FileDropzone from "@/components/FileDropzone";
import { CopyButton, Panel, loadImage } from "@/components/ui/kit";
import { rgbToHex, rgbToHsl, type RGB } from "@/lib/color";

function palette(ctx: CanvasRenderingContext2D, w: number, h: number): string[] {
  const { data } = ctx.getImageData(0, 0, w, h);
  const buckets = new Map<string, { n: number; r: number; g: number; b: number }>();
  const step = Math.max(1, Math.floor((w * h) / 40000)) * 4;
  for (let i = 0; i < data.length; i += step) {
    if (data[i + 3] < 128) continue;
    const k = `${data[i] >> 5},${data[i + 1] >> 5},${data[i + 2] >> 5}`;
    const b = buckets.get(k) ?? { n: 0, r: 0, g: 0, b: 0 };
    b.n++; b.r += data[i]; b.g += data[i + 1]; b.b += data[i + 2];
    buckets.set(k, b);
  }
  return [...buckets.values()].sort((a, b) => b.n - a.n).slice(0, 8).map((b) => rgbToHex([b.r / b.n, b.g / b.n, b.b / b.n]));
}

export default function Client() {
  const canvas = useRef<HTMLCanvasElement>(null);
  const [ready, setReady] = useState(false);
  const [color, setColor] = useState<RGB | null>(null);
  const [hover, setHover] = useState<RGB | null>(null);
  const [pal, setPal] = useState<string[]>([]);
  const [picked, setPicked] = useState<string[]>([]);

  const load = async (f: File) => {
    const img = await loadImage(f);
    setReady(true);
    requestAnimationFrame(() => {
      const c = canvas.current!;
      const scale = Math.min(1, 1600 / Math.max(img.naturalWidth, img.naturalHeight));
      c.width = Math.round(img.naturalWidth * scale);
      c.height = Math.round(img.naturalHeight * scale);
      const ctx = c.getContext("2d", { willReadFrequently: true })!;
      ctx.drawImage(img, 0, 0, c.width, c.height);
      setPal(palette(ctx, c.width, c.height));
    });
  };

  const sample = (e: React.MouseEvent<HTMLCanvasElement>): RGB => {
    const c = canvas.current!;
    const r = c.getBoundingClientRect();
    const x = Math.floor(((e.clientX - r.left) / r.width) * c.width);
    const y = Math.floor(((e.clientY - r.top) / r.height) * c.height);
    const d = c.getContext("2d")!.getImageData(x, y, 1, 1).data;
    return [d[0], d[1], d[2]];
  };

  const pickEye = async () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const ED = (window as any).EyeDropper;
    if (!ED) return;
    const { sRGBHex } = await new ED().open();
    const h = sRGBHex.replace("#", "");
    setColor([0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16)) as RGB);
  };

  const show = color ?? hover;
  const hex = show ? rgbToHex(show).toUpperCase() : "";
  const hsl = show ? rgbToHsl(show) : null;

  return (
    <div className="space-y-4">
      {!ready && <FileDropzone onFilesAdded={(f) => load(f[0])} multiple={false} accept={{ "image/*": [".heic", ".heif"] }} title="Select an image" />}
      <div className={ready ? "grid gap-4 lg:grid-cols-[1.6fr_1fr]" : "hidden"}>
        <Panel className="flex items-center justify-center bg-gray-50 p-3 sm:p-3">
          <canvas
            ref={canvas}
            className="max-h-[560px] max-w-full cursor-crosshair rounded-lg"
            onMouseMove={(e) => setHover(sample(e))}
            onMouseLeave={() => setHover(null)}
            onClick={(e) => { const c = sample(e); setColor(c); setPicked((p) => [rgbToHex(c), ...p.filter((x) => x !== rgbToHex(c))].slice(0, 12)); }}
          />
        </Panel>
        <div className="space-y-4">
          <Panel>
            <div className="h-24 rounded-xl border" style={{ background: hex || "transparent" }} />
            {show ? (
              <div className="mt-4 space-y-2">
                {[["HEX", hex], ["RGB", `rgb(${show.join(", ")})`], ["HSL", `hsl(${hsl![0]}, ${hsl![1]}%, ${hsl![2]}%)`]].map(([k, v]) => (
                  <div key={k} className="flex items-center justify-between gap-2">
                    <span className="w-10 text-xs font-semibold text-gray-500">{k}</span>
                    <code className="flex-1 font-mono text-sm text-gray-900">{v}</code>
                    <CopyButton text={v} label="" />
                  </div>
                ))}
              </div>
            ) : (
              <p className="mt-3 text-sm text-gray-500">Hover over the image and click to pick a colour.</p>
            )}
            <div className="mt-4 flex gap-2">
              <button className="btn-secondary flex-1 text-xs" onClick={pickEye}><Pipette className="h-4 w-4" /> Pick from screen</button>
              <button className="btn-ghost text-xs" onClick={() => { setReady(false); setColor(null); setPal([]); }}>New image</button>
            </div>
          </Panel>
          <Panel>
            <p className="label">Dominant colours</p>
            <div className="grid grid-cols-4 gap-2">
              {pal.map((c) => (
                <button key={c} className="group text-center" onClick={() => navigator.clipboard.writeText(c)} title="Copy">
                  <span className="block h-12 rounded-lg border" style={{ background: c }} />
                  <span className="mt-1 block font-mono text-[11px] text-gray-600">{c.toUpperCase()}</span>
                </button>
              ))}
            </div>
          </Panel>
          {picked.length > 0 && (
            <Panel>
              <p className="label">Picked</p>
              <div className="flex flex-wrap gap-2">{picked.map((c) => <button key={c} onClick={() => navigator.clipboard.writeText(c)} className="h-8 w-8 rounded-lg border" style={{ background: c }} title={c} />)}</div>
            </Panel>
          )}
        </div>
      </div>
    </div>
  );
}
