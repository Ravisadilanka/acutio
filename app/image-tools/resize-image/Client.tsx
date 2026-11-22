"use client";

import { useState } from "react";
import { Download, Link2, Link2Off } from "lucide-react";
import FileDropzone from "@/components/FileDropzone";
import { Field, Panel, Segmented, baseName, canvasToBlob, downloadBlob, extFor, formatBytes, loadImage } from "@/components/ui/kit";

const presets = [
  { l: "Instagram post", w: 1080, h: 1080 },
  { l: "Instagram story", w: 1080, h: 1920 },
  { l: "Facebook cover", w: 820, h: 312 },
  { l: "YouTube thumbnail", w: 1280, h: 720 },
  { l: "X / Twitter post", w: 1600, h: 900 },
  { l: "LinkedIn banner", w: 1584, h: 396 },
  { l: "Passport 2×2 in (600px)", w: 600, h: 600 },
  { l: "Full HD", w: 1920, h: 1080 },
];

export default function Client() {
  const [img, setImg] = useState<HTMLImageElement | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [mode, setMode] = useState<"px" | "pct">("px");
  const [w, setW] = useState(0);
  const [h, setH] = useState(0);
  const [pct, setPct] = useState(50);
  const [lock, setLock] = useState(true);
  const [fit, setFit] = useState<"stretch" | "cover" | "contain">("cover");
  const [fmt, setFmt] = useState<"image/jpeg" | "image/png" | "image/webp">("image/jpeg");
  const [out, setOut] = useState<{ blob: Blob; url: string } | null>(null);

  const load = async (f: File) => {
    const i = await loadImage(f);
    setImg(i);
    setFile(f);
    setW(i.naturalWidth);
    setH(i.naturalHeight);
    setFmt(f.type === "image/png" ? "image/png" : f.type === "image/webp" ? "image/webp" : "image/jpeg");
    setOut(null);
  };

  const ratio = img ? img.naturalWidth / img.naturalHeight : 1;
  const tw = mode === "pct" && img ? Math.round((img.naturalWidth * pct) / 100) : w;
  const th = mode === "pct" && img ? Math.round((img.naturalHeight * pct) / 100) : h;
  const presetActive = mode === "px" && img && Math.abs(w / h - ratio) > 0.01;

  const resize = async () => {
    if (!img || !file || tw < 1 || th < 1) return;
    const c = document.createElement("canvas");
    c.width = tw;
    c.height = th;
    const ctx = c.getContext("2d")!;
    ctx.imageSmoothingQuality = "high";
    if (fmt === "image/jpeg") { ctx.fillStyle = "#fff"; ctx.fillRect(0, 0, tw, th); }
    const iw = img.naturalWidth, ih = img.naturalHeight;
    if (!presetActive || fit === "stretch") ctx.drawImage(img, 0, 0, tw, th);
    else {
      const s = fit === "cover" ? Math.max(tw / iw, th / ih) : Math.min(tw / iw, th / ih);
      const dw = iw * s, dh = ih * s;
      ctx.drawImage(img, (tw - dw) / 2, (th - dh) / 2, dw, dh);
    }
    const blob = await canvasToBlob(c, fmt, 0.92);
    if (out) URL.revokeObjectURL(out.url);
    setOut({ blob, url: URL.createObjectURL(blob) });
  };

  if (!img) return <FileDropzone onFilesAdded={(f) => load(f[0])} multiple={false} accept={{ "image/*": [".heic", ".heif"] }} title="Select an image" />;

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_1.2fr]">
      <Panel className="space-y-5">
        <div className="flex items-center justify-between text-sm">
          <span className="truncate text-gray-600">{file?.name} · {img.naturalWidth}×{img.naturalHeight}px · {formatBytes(file?.size ?? 0)}</span>
          <button className="text-brand hover:underline" onClick={() => { setImg(null); setOut(null); }}>Change</button>
        </div>
        <Segmented value={mode} onChange={setMode} options={[{ value: "px", label: "By pixels" }, { value: "pct", label: "By percentage" }]} />
        {mode === "px" ? (
          <>
            <div className="flex items-end gap-2">
              <Field label="Width (px)"><input type="number" className="input" value={w} min={1} onChange={(e) => { const v = +e.target.value; setW(v); if (lock) setH(Math.round(v / ratio)); }} /></Field>
              <button className="btn-secondary mb-0.5 p-3" onClick={() => setLock(!lock)} aria-label="Lock aspect ratio" title="Lock aspect ratio">{lock ? <Link2 className="h-4 w-4" /> : <Link2Off className="h-4 w-4" />}</button>
              <Field label="Height (px)"><input type="number" className="input" value={h} min={1} onChange={(e) => { const v = +e.target.value; setH(v); if (lock) setW(Math.round(v * ratio)); }} /></Field>
            </div>
            <div>
              <p className="label">Presets</p>
              <div className="flex flex-wrap gap-2">
                {presets.map((p) => <button key={p.l} className="chip text-xs" onClick={() => { setLock(false); setW(p.w); setH(p.h); }}>{p.l}</button>)}
              </div>
            </div>
            {presetActive && (
              <Field label="When aspect ratio changes">
                <Segmented value={fit} onChange={setFit} options={[{ value: "cover", label: "Crop to fill" }, { value: "contain", label: "Fit inside" }, { value: "stretch", label: "Stretch" }]} />
              </Field>
            )}
          </>
        ) : (
          <div>
            <div className="flex justify-between"><span className="label">Scale</span><span className="text-sm text-gray-600">{pct}% → {tw}×{th}px</span></div>
            <input type="range" min={1} max={200} value={pct} onChange={(e) => setPct(+e.target.value)} className="w-full" />
          </div>
        )}
        <Field label="Format">
          <Segmented value={fmt} onChange={setFmt} options={[{ value: "image/jpeg", label: "JPG" }, { value: "image/png", label: "PNG" }, { value: "image/webp", label: "WEBP" }]} />
        </Field>
        <button className="btn-primary w-full py-3.5 text-base" onClick={resize}>Resize image</button>
      </Panel>
      <Panel className="flex flex-col items-center justify-center">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={out?.url ?? img.src} alt="Preview" className="max-h-[420px] w-auto rounded-xl border object-contain" />
        {out && (
          <div className="mt-4 flex w-full flex-wrap items-center justify-between gap-3">
            <span className="text-sm text-gray-600">{tw}×{th}px · {formatBytes(out.blob.size)}</span>
            <button className="btn-primary" onClick={() => downloadBlob(out.blob, `${baseName(file!.name)}-${tw}x${th}.${extFor(fmt)}`)}><Download className="h-4 w-4" /> Download</button>
          </div>
        )}
      </Panel>
    </div>
  );
}
