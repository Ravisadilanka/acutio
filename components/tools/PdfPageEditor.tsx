"use client";

import { useState } from "react";
import { Download, Loader2, RotateCw, Trash2, Undo2, ChevronLeft, ChevronRight } from "lucide-react";
import { PDFDocument, degrees } from "pdf-lib";
import FileDropzone from "@/components/FileDropzone";
import PdfFileBar from "@/components/tools/PdfFileBar";
import { baseName, downloadBlob } from "@/components/ui/kit";
import { openPdf, pdfBlob, renderPage, ENCRYPTED_MSG } from "@/lib/pdf";

interface PageItem { src: number; thumb: string; rot: number; deleted: boolean }

/** Visual page editor. mode="organize": reorder/rotate/delete. mode="remove": click to delete. */
export default function PdfPageEditor({ mode }: { mode: "organize" | "remove" }) {
  const [file, setFile] = useState<File | null>(null);
  const [pages, setPages] = useState<PageItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [dragIdx, setDragIdx] = useState<number | null>(null);
  const [err, setErr] = useState("");

  const load = async (f: File) => {
    setErr("");
    setLoading(true);
    try {
      const doc = await openPdf(f);
      setFile(f);
      const list: PageItem[] = [];
      for (let i = 1; i <= doc.numPages; i++) {
        const { canvas } = await renderPage(doc, i, 0.4);
        list.push({ src: i - 1, thumb: canvas.toDataURL("image/jpeg", 0.7), rot: 0, deleted: false });
        if (i % 6 === 0 || i === doc.numPages) setPages([...list]);
      }
      doc.destroy();
    } catch (e) {
      setErr((e as Error).name === "PasswordException" ? ENCRYPTED_MSG : "Could not open this PDF.");
      setFile(null);
    } finally {
      setLoading(false);
    }
  };

  const move = (from: number, to: number) => {
    if (to < 0 || to >= pages.length || from === to) return;
    const next = [...pages];
    const [x] = next.splice(from, 1);
    next.splice(to, 0, x);
    setPages(next);
  };
  const patch = (i: number, p: Partial<PageItem>) => setPages(pages.map((x, j) => (j === i ? { ...x, ...p } : x)));

  const save = async () => {
    if (!file) return;
    const keep = pages.filter((p) => !p.deleted);
    if (!keep.length) return setErr("You can't remove every page.");
    setSaving(true);
    try {
      const src = await PDFDocument.load(await file.arrayBuffer());
      const out = await PDFDocument.create();
      const copied = await out.copyPages(src, keep.map((p) => p.src));
      copied.forEach((pg, i) => {
        if (keep[i].rot) pg.setRotation(degrees((pg.getRotation().angle + keep[i].rot) % 360));
        out.addPage(pg);
      });
      downloadBlob(pdfBlob(await out.save()), `${baseName(file.name)}-${mode === "remove" ? "trimmed" : "organized"}.pdf`);
    } catch {
      setErr("Saving failed. The PDF may be encrypted or damaged.");
    } finally {
      setSaving(false);
    }
  };

  if (!file)
    return (
      <div className="space-y-3">
        <FileDropzone onFilesAdded={(f) => load(f[0])} multiple={false} accept={{ "application/pdf": [".pdf"] }} title="Select a PDF" />
        {loading && <p className="text-center text-sm text-gray-500">Loading pages…</p>}
        {err && <p className="text-center text-sm text-rose-500">{err}</p>}
      </div>
    );

  const removed = pages.filter((p) => p.deleted).length;

  return (
    <div className="space-y-5">
      <PdfFileBar file={file} pages={pages.length} onClear={() => { setFile(null); setPages([]); }} />
      <div className="sticky top-16 z-20 -mx-1 flex flex-wrap items-center gap-3 rounded-2xl border bg-page/90 p-3 backdrop-blur">
        <p className="text-sm text-gray-600">
          {mode === "remove" ? "Click pages to mark them for removal." : "Drag pages to reorder. Use the buttons to rotate or delete."}
          {removed > 0 && <span className="ml-2 font-semibold text-rose-500">{removed} to remove</span>}
        </p>
        <button className="btn-primary ml-auto" onClick={save} disabled={saving || loading}>
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />} Save PDF
        </button>
      </div>
      {err && <p className="text-sm text-rose-500">{err}</p>}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        {pages.map((p, i) => (
          <div
            key={p.src}
            draggable={mode === "organize"}
            onDragStart={() => setDragIdx(i)}
            onDragOver={(e) => { e.preventDefault(); if (dragIdx !== null && dragIdx !== i) { move(dragIdx, i); setDragIdx(i); } }}
            onDragEnd={() => setDragIdx(null)}
            onClick={() => mode === "remove" && patch(i, { deleted: !p.deleted })}
            className={`group relative rounded-2xl border bg-surface p-2 transition ${mode === "organize" ? "cursor-grab active:cursor-grabbing" : "cursor-pointer"} ${dragIdx === i ? "opacity-40" : ""} ${p.deleted ? "border-rose-400 ring-2 ring-rose-400/40" : "hover:border-brand"}`}
          >
            <div className="flex aspect-[3/4] items-center justify-center overflow-hidden rounded-lg bg-gray-100">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={p.thumb} alt={`Page ${p.src + 1}`} className={`max-h-full max-w-full shadow transition ${p.deleted ? "opacity-30 grayscale" : ""}`} style={{ transform: `rotate(${p.rot}deg)` }} draggable={false} />
            </div>
            {p.deleted && <Trash2 className="absolute left-1/2 top-1/2 h-10 w-10 -translate-x-1/2 -translate-y-1/2 text-rose-500" />}
            <div className="mt-2 flex items-center justify-between text-xs text-gray-500">
              <span>{i + 1}{mode === "organize" && p.src !== i ? <span className="text-gray-400"> (was {p.src + 1})</span> : null}</span>
              {mode === "organize" && (
                <span className="flex gap-0.5">
                  <button className="rounded p-1 hover:bg-gray-100 sm:hidden" onClick={() => move(i, i - 1)} aria-label="Move left"><ChevronLeft className="h-4 w-4" /></button>
                  <button className="rounded p-1 hover:bg-gray-100 sm:hidden" onClick={() => move(i, i + 1)} aria-label="Move right"><ChevronRight className="h-4 w-4" /></button>
                  <button className="rounded p-1 hover:bg-gray-100" onClick={() => patch(i, { rot: (p.rot + 90) % 360 })} aria-label="Rotate page"><RotateCw className="h-4 w-4" /></button>
                  <button className="rounded p-1 hover:bg-gray-100" onClick={() => patch(i, { deleted: !p.deleted })} aria-label={p.deleted ? "Restore page" : "Delete page"}>
                    {p.deleted ? <Undo2 className="h-4 w-4" /> : <Trash2 className="h-4 w-4" />}
                  </button>
                </span>
              )}
            </div>
          </div>
        ))}
        {loading && <div className="flex aspect-[3/4] items-center justify-center rounded-2xl border border-dashed text-sm text-gray-400"><Loader2 className="h-5 w-5 animate-spin" /></div>}
      </div>
    </div>
  );
}
