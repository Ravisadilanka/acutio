"use client";

import { useState } from "react";
import { Download, Loader2 } from "lucide-react";
import FileDropzone from "@/components/FileDropzone";
import PdfFileBar from "@/components/tools/PdfFileBar";
import { Field, Panel, baseName, downloadBlob } from "@/components/ui/kit";
import { hexToRgb } from "@/lib/color";
import { pdfBlob, ENCRYPTED_MSG } from "@/lib/pdf";

export default function Client() {
  const [file, setFile] = useState<File | null>(null);
  const [count, setCount] = useState(0);
  const [text, setText] = useState("CONFIDENTIAL");
  const [size, setSize] = useState(64);
  const [opacity, setOpacity] = useState(20);
  const [angle, setAngle] = useState(45);
  const [color, setColor] = useState("#e11d48");
  const [tile, setTile] = useState(false);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");

  const pick = async (f: File) => {
    const { PDFDocument } = await import("pdf-lib"); // loaded on demand (keeps page load light)
    setErr("");
    try {
      const d = await PDFDocument.load(await f.arrayBuffer());
      setCount(d.getPageCount());
      setFile(f);
    } catch {
      setErr(ENCRYPTED_MSG + " (or the file is not a valid PDF)");
    }
  };

  const run = async () => {
    const { PDFDocument, StandardFonts, degrees, rgb } = await import("pdf-lib"); // loaded on demand (keeps page load light)
    if (!file || !text.trim()) return;
    setBusy(true);
    try {
      const doc = await PDFDocument.load(await file.arrayBuffer());
      const font = await doc.embedFont(StandardFonts.HelveticaBold);
      const [r, g, b] = hexToRgb(color) ?? [0, 0, 0];
      // Standard fonts only support Latin-1; strip anything else.
      const safe = text.replace(/[^\x20-\xFF]/g, "");
      const tw = font.widthOfTextAtSize(safe, size);
      const rad = (angle * Math.PI) / 180;
      for (const p of doc.getPages()) {
        const { width, height } = p.getSize();
        const draw = (cx: number, cy: number) =>
          p.drawText(safe, {
            x: cx - (Math.cos(rad) * tw) / 2 + (Math.sin(rad) * size) / 3,
            y: cy - (Math.sin(rad) * tw) / 2 - (Math.cos(rad) * size) / 3,
            size,
            font,
            color: rgb(r / 255, g / 255, b / 255),
            opacity: opacity / 100,
            rotate: degrees(angle),
          });
        if (tile) {
          const stepX = tw * 0.9 + 80, stepY = size * 4;
          for (let y = 0; y < height + stepY; y += stepY) for (let x = (y / stepY) % 2 ? stepX / 2 : 0; x < width + stepX; x += stepX) draw(x, y);
        } else draw(width / 2, height / 2);
      }
      downloadBlob(pdfBlob(await doc.save()), `${baseName(file.name)}-watermarked.pdf`);
    } catch {
      setErr("Could not watermark this PDF.");
    } finally {
      setBusy(false);
    }
  };

  if (!file)
    return (
      <div className="space-y-3">
        <FileDropzone onFilesAdded={(f) => pick(f[0])} multiple={false} accept={{ "application/pdf": [".pdf"] }} title="Select a PDF" />
        {err && <p className="text-center text-sm text-rose-500">{err}</p>}
      </div>
    );

  return (
    <div className="space-y-6">
      <PdfFileBar file={file} pages={count} onClear={() => setFile(null)} />
      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        <Panel className="grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2"><Field label="Watermark text"><input className="input" value={text} onChange={(e) => setText(e.target.value)} maxLength={60} /></Field></div>
          {[["Font size", size, setSize, 12, 160, "pt"], ["Opacity", opacity, setOpacity, 5, 100, "%"], ["Rotation", angle, setAngle, -90, 90, "°"]].map(([l, v, set, min, max, u]) => (
            <div key={l as string}>
              <div className="flex justify-between"><span className="label">{l as string}</span><span className="text-sm text-gray-600">{v as number}{u as string}</span></div>
              <input type="range" min={min as number} max={max as number} value={v as number} onChange={(e) => (set as (n: number) => void)(+e.target.value)} className="w-full" />
            </div>
          ))}
          <Field label="Colour"><input type="color" value={color} onChange={(e) => setColor(e.target.value)} className="h-11 w-full rounded-xl border bg-surface p-1" /></Field>
          <label className="flex items-center gap-2 text-sm text-gray-700"><input type="checkbox" checked={tile} onChange={(e) => setTile(e.target.checked)} /> Repeat across page (tiled)</label>
        </Panel>
        <Panel className="flex items-center justify-center">
          <div className="relative flex aspect-[1/1.414] w-full max-w-[260px] items-center justify-center overflow-hidden rounded-lg border shadow-inner" style={{ background: "#fff" }}>
            <div className="absolute inset-6 space-y-2" aria-hidden="true">{Array.from({ length: 14 }).map((_, i) => <div key={i} className="h-1.5 rounded" style={{ background: "#e2e8f0", width: `${95 - (i % 4) * 12}%` }} />)}</div>
            <span className="relative whitespace-nowrap font-bold" style={{ color, opacity: opacity / 100, fontSize: size / 3.2, transform: `rotate(${-angle}deg)` }}>{text}</span>
          </div>
        </Panel>
      </div>
      <button className="btn-primary px-10 py-4 text-base" onClick={run} disabled={busy || !text.trim()}>{busy ? <Loader2 className="h-5 w-5 animate-spin" /> : <Download className="h-5 w-5" />} Add watermark & download</button>
      {/[^\x20-\xFF]/.test(text) && <p className="text-sm text-amber-600">Note: only Latin characters are supported in watermarks; other characters will be removed.</p>}
      {err && <p className="text-sm text-rose-500">{err}</p>}
    </div>
  );
}
