"use client";

import { useState } from "react";
import { Download, Loader2, X } from "lucide-react";
import FileDropzone from "@/components/FileDropzone";
import { Field, Panel, Segmented, baseName, canvasToBlob, downloadBlob, extFor, formatBytes, loadImage } from "@/components/ui/kit";

type Fmt = "image/jpeg" | "image/png" | "image/webp";
interface Item { file: File; out?: Blob; url?: string; err?: string }

export default function ImageConverter({ defaultFormat = "image/jpeg", accept = { "image/*": [".heic", ".heif"] }, label = "Select images" }: { defaultFormat?: Fmt; accept?: Record<string, string[]>; label?: string }) {
  const [items, setItems] = useState<Item[]>([]);
  const [fmt, setFmt] = useState<Fmt>(defaultFormat);
  const [quality, setQuality] = useState(90);
  const [bg, setBg] = useState("#ffffff");
  const [busy, setBusy] = useState(false);

  const convert = async () => {
    setBusy(true);
    const next: Item[] = [];
    for (const it of items) {
      try {
        const img = await loadImage(it.file);
        const c = document.createElement("canvas");
        c.width = img.naturalWidth;
        c.height = img.naturalHeight;
        const ctx = c.getContext("2d")!;
        if (fmt === "image/jpeg") { ctx.fillStyle = bg; ctx.fillRect(0, 0, c.width, c.height); }
        ctx.drawImage(img, 0, 0);
        URL.revokeObjectURL(img.src);
        const out = await canvasToBlob(c, fmt, fmt === "image/png" ? undefined : quality / 100);
        if (it.url) URL.revokeObjectURL(it.url);
        next.push({ file: it.file, out, url: URL.createObjectURL(out) });
      } catch {
        next.push({ file: it.file, err: "Could not read this image" });
      }
      setItems([...next, ...items.slice(next.length)]);
    }
    setBusy(false);
  };

  const name = (f: File) => `${baseName(f.name)}.${extFor(fmt)}`;
  const done = items.filter((i) => i.out);

  return (
    <div className="space-y-6">
      <FileDropzone onFilesAdded={(f) => setItems((p) => [...p, ...f.map((file) => ({ file }))])} accept={accept} title={label} compact={items.length > 0} />

      {items.length > 0 && (
        <>
          <Panel className="grid gap-5 md:grid-cols-3">
            <Field label="Convert to">
              <Segmented value={fmt} onChange={(v) => { setFmt(v); setItems(items.map((i) => ({ file: i.file }))); }} options={[{ value: "image/jpeg", label: "JPG" }, { value: "image/png", label: "PNG" }, { value: "image/webp", label: "WEBP" }]} />
            </Field>
            {fmt !== "image/png" && (
              <div>
                <div className="flex justify-between"><span className="label">Quality</span><span className="text-sm text-gray-600">{quality}%</span></div>
                <input type="range" min={10} max={100} value={quality} onChange={(e) => setQuality(+e.target.value)} className="mt-3 w-full" />
              </div>
            )}
            {fmt === "image/jpeg" && (
              <Field label="Background for transparent areas">
                <input type="color" value={bg} onChange={(e) => setBg(e.target.value)} className="h-11 w-full rounded-xl border bg-surface p-1" />
              </Field>
            )}
          </Panel>

          <div className="flex flex-wrap gap-2">
            <button className="btn-primary px-8 py-3.5 text-base" onClick={convert} disabled={busy}>
              {busy ? <><Loader2 className="h-5 w-5 animate-spin" /> Converting…</> : `Convert ${items.length} image${items.length > 1 ? "s" : ""}`}
            </button>
            {done.length > 1 && (
              <button className="btn-secondary" onClick={() => done.forEach((i, k) => setTimeout(() => downloadBlob(i.out!, name(i.file)), k * 250))}>
                <Download className="h-4 w-4" /> Download all
              </button>
            )}
            <button className="btn-ghost" onClick={() => setItems([])}>Clear</button>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((it, i) => (
              <div key={i} className="card flex items-center gap-3 p-3">
                <div className="h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-gray-100">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  {it.url && <img src={it.url} alt="" className="h-full w-full object-cover" />}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-gray-900">{it.out ? name(it.file) : it.file.name}</p>
                  <p className="text-xs text-gray-500">
                    {formatBytes(it.file.size)}{it.out && <> → <span className="font-semibold text-gray-900">{formatBytes(it.out.size)}</span></>}
                    {it.err && <span className="text-rose-500"> · {it.err}</span>}
                  </p>
                </div>
                {it.out ? (
                  <button className="btn-primary p-2.5" onClick={() => downloadBlob(it.out!, name(it.file))} aria-label="Download"><Download className="h-4 w-4" /></button>
                ) : (
                  <button className="btn-ghost p-2" onClick={() => setItems(items.filter((_, j) => j !== i))} aria-label="Remove"><X className="h-4 w-4" /></button>
                )}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
