"use client";

import { useState } from "react";
import imageCompression from "browser-image-compression";
import { Download, Loader2, X } from "lucide-react";
import FileDropzone from "@/components/FileDropzone";
import { Field, NumberField, Panel, Segmented, Stat, baseName, downloadBlob, formatBytes } from "@/components/ui/kit";
import { convertImageForCompression } from "./utils/imageConverter";

type OutFmt = "original" | "image/jpeg" | "image/webp" | "image/png";
interface Item {
  file: File;
  preview: string;
  out?: File;
  outUrl?: string;
  kept?: boolean; // original kept because compression made it bigger
  err?: string;
}

const ext = (t: string) => (t === "image/jpeg" ? "jpg" : t.split("/")[1]);

export default function CompressImageClient() {
  const [items, setItems] = useState<Item[]>([]);
  const [mode, setMode] = useState<"quality" | "size">("quality");
  const [quality, setQuality] = useState(75);
  const [targetKb, setTargetKb] = useState("200");
  const [maxDim, setMaxDim] = useState("0");
  const [fmt, setFmt] = useState<OutFmt>("original");
  const [busy, setBusy] = useState(false);
  const [progress, setProgress] = useState(0);

  const add = (files: File[]) =>
    setItems((p) => [...p, ...files.map((file) => ({ file, preview: URL.createObjectURL(file) }))]);

  const compress = async () => {
    setBusy(true);
    const next = [...items];
    for (let i = 0; i < next.length; i++) {
      setProgress(Math.round((i / next.length) * 100));
      const it = next[i];
      try {
        const src = await convertImageForCompression(it.file); // HEIC/BMP/etc → PNG
        const fileType = fmt === "original" ? (/jpeg|png|webp/.test(it.file.type) ? it.file.type : "image/jpeg") : fmt;
        const out = await imageCompression(src, {
          useWebWorker: true,
          fileType,
          initialQuality: mode === "quality" ? quality / 100 : 0.9,
          maxSizeMB: mode === "size" ? Math.max(0.01, (+targetKb || 200) / 1024) : 50,
          maxWidthOrHeight: +maxDim > 0 ? +maxDim : undefined,
          alwaysKeepResolution: mode === "quality" || +maxDim > 0,
          preserveExif: false, // strip GPS/camera metadata
        });
        const named = new File([out], `${baseName(it.file.name)}-compressed.${ext(fileType)}`, { type: fileType });
        const sameType = fileType === it.file.type;
        const kept = sameType && named.size >= it.file.size && +maxDim === 0;
        const final = kept ? it.file : named;
        if (it.outUrl) URL.revokeObjectURL(it.outUrl);
        next[i] = { ...it, out: final, outUrl: URL.createObjectURL(final), kept, err: undefined };
      } catch {
        next[i] = { ...it, err: "Could not compress this image" };
      }
      setItems([...next]);
    }
    setProgress(100);
    setBusy(false);
  };

  const remove = (i: number) => {
    URL.revokeObjectURL(items[i].preview);
    setItems(items.filter((_, j) => j !== i));
  };

  const done = items.filter((i) => i.out);
  const before = done.reduce((s, i) => s + i.file.size, 0);
  const after = done.reduce((s, i) => s + (i.out?.size ?? 0), 0);

  return (
    <div className="space-y-6">
      <FileDropzone onFilesAdded={add} title="Select images" subtitle="JPG, PNG, WEBP, HEIC, AVIF, GIF, BMP — or drag & drop" accept={{ "image/*": [".heic", ".heif"] }} compact={items.length > 0} />

      {items.length > 0 && (
        <>
          <Panel className="grid gap-5 md:grid-cols-2">
            <div className="space-y-4">
              <Segmented value={mode} onChange={setMode} options={[{ value: "quality", label: "By quality" }, { value: "size", label: "Target file size" }]} />
              {mode === "quality" ? (
                <div>
                  <div className="flex justify-between"><span className="label">Quality</span><span className="text-sm text-gray-600">{quality}% {quality >= 80 ? "· high" : quality >= 60 ? "· balanced" : "· small"}</span></div>
                  <input type="range" min={10} max={100} value={quality} onChange={(e) => setQuality(+e.target.value)} className="w-full" aria-label="Quality" />
                </div>
              ) : (
                <div>
                  <NumberField label="Maximum size per image" value={targetKb} onChange={setTargetKb} suffix="KB" min={10} />
                  <div className="mt-2 flex flex-wrap gap-2">{[20, 50, 100, 200, 500, 1000].map((k) => <button key={k} className={`chip text-xs ${+targetKb === k ? "chip-active" : ""}`} onClick={() => setTargetKb(String(k))}>{k >= 1000 ? `${k / 1000} MB` : `${k} KB`}</button>)}</div>
                </div>
              )}
            </div>
            <div className="space-y-4">
              <Field label="Output format">
                <Segmented value={fmt} onChange={setFmt} options={[{ value: "original", label: "Same" }, { value: "image/jpeg", label: "JPG" }, { value: "image/webp", label: "WEBP" }, { value: "image/png", label: "PNG" }]} />
              </Field>
              <Field label="Max width/height" hint="Shrinking large photos saves the most space.">
                <select className="input" value={maxDim} onChange={(e) => setMaxDim(e.target.value)}>
                  <option value="0">Keep original dimensions</option>
                  <option value="3840">3840 px (4K)</option>
                  <option value="2560">2560 px</option>
                  <option value="1920">1920 px (Full HD)</option>
                  <option value="1280">1280 px</option>
                  <option value="800">800 px</option>
                </select>
              </Field>
            </div>
          </Panel>

          <div className="flex flex-wrap items-center gap-2">
            <button className="btn-primary px-8 py-3.5 text-base" onClick={compress} disabled={busy}>
              {busy ? <><Loader2 className="h-5 w-5 animate-spin" /> Compressing… {progress}%</> : `Compress ${items.length} image${items.length > 1 ? "s" : ""}`}
            </button>
            {done.length > 1 && (
              <button className="btn-secondary" onClick={() => done.forEach((i, k) => setTimeout(() => downloadBlob(i.out!, i.out!.name), k * 250))}><Download className="h-4 w-4" /> Download all</button>
            )}
            <button className="btn-ghost" onClick={() => { items.forEach((i) => URL.revokeObjectURL(i.preview)); setItems([]); }}>Clear</button>
          </div>

          {done.length > 0 && (
            <div className="grid grid-cols-3 gap-3">
              <Stat label="Before" value={formatBytes(before)} />
              <Stat label="After" value={formatBytes(after)} />
              <Stat accent label="Saved" value={`${before ? Math.max(0, (1 - after / before) * 100).toFixed(0) : 0}%`} />
            </div>
          )}

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((it, i) => {
              const saved = it.out ? (1 - it.out.size / it.file.size) * 100 : 0;
              return (
                <div key={it.preview} className="card overflow-hidden">
                  <div className="relative h-44 bg-gray-100">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={it.outUrl ?? it.preview} alt={it.file.name} className="h-full w-full object-cover" />
                    {!it.out && !busy && <button onClick={() => remove(i)} className="absolute right-2 top-2 rounded-full bg-black/60 p-1.5 text-white" aria-label="Remove"><X className="h-4 w-4" /></button>}
                    {it.out && <span className={`absolute left-2 top-2 rounded-full px-2.5 py-1 text-xs font-bold text-white ${saved > 0 ? "bg-emerald-500" : "bg-gray-500"}`}>{saved > 0 ? `−${saved.toFixed(0)}%` : "Already optimal"}</span>}
                  </div>
                  <div className="p-4">
                    <p className="truncate text-sm font-medium text-gray-900">{it.out?.name ?? it.file.name}</p>
                    <p className="mt-1 text-sm text-gray-500">
                      {formatBytes(it.file.size)}{it.out && <> → <strong className="text-gray-900">{formatBytes(it.out.size)}</strong></>}
                    </p>
                    {it.kept && <p className="mt-1 text-xs text-gray-500">Original kept — it was already smaller.</p>}
                    {it.err && <p className="mt-1 text-xs text-rose-500">{it.err}</p>}
                    {it.out && <button className="btn-primary mt-3 w-full py-2.5" onClick={() => downloadBlob(it.out!, it.out!.name)}><Download className="h-4 w-4" /> Download</button>}
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
