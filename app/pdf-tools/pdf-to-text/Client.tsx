"use client";

import { useState } from "react";
import { Download, Loader2 } from "lucide-react";
import FileDropzone from "@/components/FileDropzone";
import PdfFileBar from "@/components/tools/PdfFileBar";
import { CopyButton, baseName, downloadText } from "@/components/ui/kit";
import { openPdf, ENCRYPTED_MSG } from "@/lib/pdf";

export default function Client() {
  const [file, setFile] = useState<File | null>(null);
  const [pages, setPages] = useState(0);
  const [text, setText] = useState("");
  const [progress, setProgress] = useState(0);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const [markers, setMarkers] = useState(true);

  const run = async (f: File, withMarkers = markers) => {
    setErr("");
    setBusy(true);
    setText("");
    try {
      const doc = await openPdf(f);
      setFile(f);
      setPages(doc.numPages);
      const out: string[] = [];
      for (let i = 1; i <= doc.numPages; i++) {
        const page = await doc.getPage(i);
        const tc = await page.getTextContent();
        let s = "";
        for (const it of tc.items) {
          if ("str" in it) s += it.str + (it.hasEOL ? "\n" : "");
        }
        out.push((withMarkers ? `--- Page ${i} ---\n` : "") + s.replace(/[ \t]+\n/g, "\n").trim());
        setProgress(Math.round((i / doc.numPages) * 100));
      }
      doc.destroy();
      const joined = out.join("\n\n");
      setText(joined);
      if (!joined.replace(/--- Page \d+ ---/g, "").trim()) setErr("No selectable text found. This PDF is probably a scanned image.");
    } catch (e) {
      setErr((e as Error).name === "PasswordException" ? ENCRYPTED_MSG : "Could not read this PDF.");
    } finally {
      setBusy(false);
    }
  };

  if (!file)
    return (
      <div className="space-y-3">
        <FileDropzone onFilesAdded={(f) => run(f[0])} multiple={false} accept={{ "application/pdf": [".pdf"] }} title="Select a PDF" />
        {busy && <p className="text-center text-sm text-gray-500">Extracting… {progress}%</p>}
        {err && <p className="text-center text-sm text-rose-500">{err}</p>}
      </div>
    );

  return (
    <div className="space-y-4">
      <PdfFileBar file={file} pages={pages} onClear={() => { setFile(null); setText(""); }} />
      <div className="flex flex-wrap items-center gap-3">
        <label className="flex items-center gap-2 text-sm text-gray-700"><input type="checkbox" checked={markers} onChange={(e) => { setMarkers(e.target.checked); run(file, e.target.checked); }} /> Page markers</label>
        <span className="text-sm text-gray-500">{text.trim() ? text.trim().split(/\s+/).length.toLocaleString() : 0} words</span>
        <div className="ml-auto flex gap-2">
          <CopyButton text={text} />
          <button className="btn-primary px-3 py-2" disabled={!text} onClick={() => downloadText(text, `${baseName(file.name)}.txt`)}><Download className="h-4 w-4" /> .txt</button>
        </div>
      </div>
      {busy && <p className="flex items-center gap-2 text-sm text-gray-500"><Loader2 className="h-4 w-4 animate-spin" /> Extracting… {progress}%</p>}
      {err && <p className="text-sm text-amber-600">{err}</p>}
      <textarea className="textarea min-h-[480px] font-sans" value={text} onChange={(e) => setText(e.target.value)} aria-label="Extracted text" />
    </div>
  );
}
