"use client";

import { useState } from "react";
import { Download, Loader2 } from "lucide-react";
import FileDropzone from "@/components/FileDropzone";
import PdfFileBar from "@/components/tools/PdfFileBar";
import { Field, NumberField, Panel, baseName, downloadBlob } from "@/components/ui/kit";
import { pdfBlob, ENCRYPTED_MSG } from "@/lib/pdf";

const POS = ["top-left", "top-center", "top-right", "bottom-left", "bottom-center", "bottom-right"] as const;
type Pos = (typeof POS)[number];

export default function Client() {
  const [file, setFile] = useState<File | null>(null);
  const [count, setCount] = useState(0);
  const [pos, setPos] = useState<Pos>("bottom-center");
  const [format, setFormat] = useState("{n}");
  const [size, setSize] = useState("11");
  const [start, setStart] = useState("1");
  const [skipFirst, setSkipFirst] = useState(false);
  const [margin, setMargin] = useState("28");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");

  const pick = async (f: File) => {
    const { PDFDocument } = await import("pdf-lib"); // loaded on demand (keeps page load light)
    setErr("");
    try {
      const doc = await PDFDocument.load(await f.arrayBuffer());
      setCount(doc.getPageCount());
      setFile(f);
    } catch {
      setErr(ENCRYPTED_MSG + " (or the file is not a valid PDF)");
    }
  };

  const run = async () => {
    const { PDFDocument, StandardFonts, rgb } = await import("pdf-lib"); // loaded on demand (keeps page load light)
    if (!file) return;
    setBusy(true);
    try {
      const doc = await PDFDocument.load(await file.arrayBuffer());
      const font = await doc.embedFont(StandardFonts.Helvetica);
      const pages = doc.getPages();
      const fs = Math.max(6, +size || 11);
      const m = Math.max(0, +margin || 0);
      const total = pages.length - (skipFirst ? 1 : 0);
      pages.forEach((p, i) => {
        if (skipFirst && i === 0) return;
        const n = (Math.round(+start) || 1) + i - (skipFirst ? 1 : 0);
        const text = format.replace("{n}", String(n)).replace("{total}", String(total + (Math.round(+start) || 1) - 1));
        const { width, height } = p.getSize();
        const tw = font.widthOfTextAtSize(text, fs);
        const x = pos.endsWith("left") ? m : pos.endsWith("right") ? width - m - tw : (width - tw) / 2;
        const y = pos.startsWith("top") ? height - m - fs : m;
        p.drawText(text, { x, y, size: fs, font, color: rgb(0.2, 0.2, 0.2) });
      });
      downloadBlob(pdfBlob(await doc.save()), `${baseName(file.name)}-numbered.pdf`);
    } catch {
      setErr("Could not add page numbers to this PDF.");
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
      <div className="grid gap-6 lg:grid-cols-[auto_1fr]">
        <Panel>
          <p className="label">Position</p>
          <div className="relative grid h-64 w-48 grid-cols-3 grid-rows-[auto_1fr_auto] gap-1 rounded-xl border bg-white p-2 shadow-inner">
            {POS.slice(0, 3).map((p) => <button key={p} onClick={() => setPos(p)} className={`h-8 rounded-md text-xs font-semibold ${pos === p ? "bg-brand text-white" : "bg-gray-100 text-gray-400 hover:bg-gray-200"}`} style={pos === p ? {} : { color: "#94a3b8", background: "#f1f5f9" }}>1</button>)}
            <div className="col-span-3 m-2 space-y-2" aria-hidden="true">{Array.from({ length: 7 }).map((_, i) => <div key={i} className="h-1.5 rounded" style={{ background: "#e2e8f0", width: `${90 - (i % 3) * 15}%` }} />)}</div>
            {POS.slice(3).map((p) => <button key={p} onClick={() => setPos(p)} className={`h-8 rounded-md text-xs font-semibold ${pos === p ? "bg-brand text-white" : ""}`} style={pos === p ? {} : { color: "#94a3b8", background: "#f1f5f9" }}>1</button>)}
          </div>
        </Panel>
        <Panel className="grid gap-4 sm:grid-cols-2">
          <Field label="Format">
            <select className="input" value={format} onChange={(e) => setFormat(e.target.value)}>
              <option value="{n}">1, 2, 3</option>
              <option value="Page {n}">Page 1</option>
              <option value="{n} / {total}">1 / 10</option>
              <option value="Page {n} of {total}">Page 1 of 10</option>
              <option value="- {n} -">- 1 -</option>
            </select>
          </Field>
          <NumberField label="Font size" value={size} onChange={setSize} suffix="pt" />
          <NumberField label="Start at" value={start} onChange={setStart} step={1} />
          <NumberField label="Margin" value={margin} onChange={setMargin} suffix="pt" />
          <label className="flex items-center gap-2 text-sm text-gray-700 sm:col-span-2"><input type="checkbox" checked={skipFirst} onChange={(e) => setSkipFirst(e.target.checked)} /> Don&apos;t number the first page (cover)</label>
        </Panel>
      </div>
      <button className="btn-primary px-10 py-4 text-base" onClick={run} disabled={busy}>{busy ? <Loader2 className="h-5 w-5 animate-spin" /> : <Download className="h-5 w-5" />} Add numbers & download</button>
      {err && <p className="text-sm text-rose-500">{err}</p>}
    </div>
  );
}
