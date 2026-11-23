"use client";

import { useState } from "react";
import { Download, Loader2 } from "lucide-react";
import FileDropzone from "@/components/FileDropzone";
import PdfFileBar from "@/components/tools/PdfFileBar";
import { Panel, Stat, baseName, canvasToBlob, downloadBlob, formatBytes } from "@/components/ui/kit";
import { openPdf, pdfBlob, renderPage, ENCRYPTED_MSG } from "@/lib/pdf";

const LEVELS = {
  low: { label: "Low", desc: "Best quality, ~150 dpi", scale: 2.08, q: 0.8 },
  recommended: { label: "Recommended", desc: "Good quality, ~110 dpi", scale: 1.5, q: 0.62 },
  extreme: { label: "Extreme", desc: "Smallest file, ~72 dpi", scale: 1, q: 0.42 },
} as const;
type Level = keyof typeof LEVELS;

export default function Client() {
  const [file, setFile] = useState<File | null>(null);
  const [pages, setPages] = useState(0);
  const [level, setLevel] = useState<Level>("recommended");
  const [gray, setGray] = useState(false);
  const [busy, setBusy] = useState(false);
  const [progress, setProgress] = useState(0);
  const [out, setOut] = useState<Blob | null>(null);
  const [err, setErr] = useState("");

  const pick = async (f: File) => {
    setErr("");
    setOut(null);
    try {
      const doc = await openPdf(f);
      setPages(doc.numPages);
      setFile(f);
      doc.destroy();
    } catch (e) {
      setErr((e as Error).name === "PasswordException" ? ENCRYPTED_MSG : "This file doesn't look like a valid PDF.");
    }
  };

  const compress = async () => {
    const { PDFDocument } = await import("pdf-lib"); // loaded on demand (keeps page load light)
    if (!file) return;
    setBusy(true);
    setOut(null);
    setProgress(0);
    try {
      const { scale, q } = LEVELS[level];
      const doc = await openPdf(file);
      const outDoc = await PDFDocument.create();
      for (let i = 1; i <= doc.numPages; i++) {
        const { canvas, page } = await renderPage(doc, i, scale);
        if (gray) {
          const ctx = canvas.getContext("2d")!;
          ctx.globalCompositeOperation = "saturation";
          ctx.fillStyle = "#000";
          ctx.fillRect(0, 0, canvas.width, canvas.height);
        }
        const vp = page.getViewport({ scale: 1 });
        const jpg = await outDoc.embedJpg(await (await canvasToBlob(canvas, "image/jpeg", q)).arrayBuffer());
        const p = outDoc.addPage([vp.width, vp.height]);
        p.drawImage(jpg, { x: 0, y: 0, width: vp.width, height: vp.height });
        page.cleanup();
        canvas.width = canvas.height = 0;
        setProgress(Math.round((i / doc.numPages) * 100));
      }
      doc.destroy();
      setOut(pdfBlob(await outDoc.save()));
    } catch (e) {
      console.error(e);
      setErr("Something went wrong while compressing this PDF.");
    } finally {
      setBusy(false);
    }
  };

  if (!file)
    return (
      <div className="space-y-3">
        <FileDropzone onFilesAdded={(f) => pick(f[0])} multiple={false} accept={{ "application/pdf": [".pdf"] }} title="Select a PDF to compress" />
        {err && <p className="text-center text-sm text-rose-500">{err}</p>}
      </div>
    );

  const saved = out ? (1 - out.size / file.size) * 100 : 0;

  return (
    <div className="space-y-6">
      <PdfFileBar file={file} pages={pages} onClear={() => { setFile(null); setOut(null); }} />
      <div className="grid gap-3 sm:grid-cols-3">
        {(Object.keys(LEVELS) as Level[]).map((k) => (
          <button key={k} onClick={() => { setLevel(k); setOut(null); }} className={`card p-5 text-left transition ${level === k ? "border-brand ring-4 ring-brand-soft" : "hover:border-gray-300"}`}>
            <p className="font-semibold text-gray-900">{LEVELS[k].label}</p>
            <p className="mt-1 text-sm text-gray-500">{LEVELS[k].desc}</p>
          </button>
        ))}
      </div>
      <label className="flex items-center gap-2 text-sm text-gray-700"><input type="checkbox" checked={gray} onChange={(e) => { setGray(e.target.checked); setOut(null); }} /> Convert to grayscale (even smaller)</label>

      <button className="btn-primary w-full py-4 text-base sm:w-auto sm:px-10" onClick={compress} disabled={busy}>
        {busy ? <><Loader2 className="h-5 w-5 animate-spin" /> Compressing… {progress}%</> : "Compress PDF"}
      </button>
      {busy && <div className="h-2 overflow-hidden rounded-full bg-gray-200"><div className="h-full bg-brand transition-all" style={{ width: `${progress}%` }} /></div>}
      {err && <p className="text-sm text-rose-500">{err}</p>}

      {out && (
        <Panel className="space-y-4">
          <div className="grid gap-3 sm:grid-cols-3">
            <Stat label="Original" value={formatBytes(file.size)} />
            <Stat label="Compressed" value={formatBytes(out.size)} />
            <Stat accent label="Saved" value={saved > 0 ? `${saved.toFixed(0)}%` : "0%"} />
          </div>
          {saved <= 0 ? (
            <p className="text-sm text-amber-600">This PDF is already well optimized — the compressed version isn&apos;t smaller. Try “Extreme” or keep your original.</p>
          ) : (
            <button className="btn-primary" onClick={() => downloadBlob(out, `${baseName(file.name)}-compressed.pdf`)}><Download className="h-4 w-4" /> Download compressed PDF</button>
          )}
          <p className="text-xs text-gray-500">Note: compressed pages are stored as images, so text can no longer be selected or searched.</p>
        </Panel>
      )}
    </div>
  );
}
