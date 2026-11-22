"use client";

import { useState } from "react";
import FileDropzone from "@/components/FileDropzone";
import { CopyButton, Panel, Segmented, formatBytes } from "@/components/ui/kit";

export default function Client() {
  const [data, setData] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [view, setView] = useState<"uri" | "raw" | "html" | "css">("uri");

  const load = (f: File) => {
    const r = new FileReader();
    r.onload = () => setData(String(r.result));
    r.readAsDataURL(f);
    setFile(f);
  };

  const raw = data.split(",")[1] ?? "";
  const out = view === "uri" ? data : view === "raw" ? raw : view === "html" ? `<img src="${data}" alt="" />` : `background-image: url("${data}");`;

  return (
    <div className="space-y-4">
      <FileDropzone onFilesAdded={(f) => load(f[0])} multiple={false} accept={{ "image/*": [] }} title="Select an image" compact={!!data} />
      {data && (
        <div className="grid gap-4 lg:grid-cols-[260px_1fr]">
          <Panel className="text-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={data} alt="Preview" className="mx-auto max-h-48 rounded-lg" />
            <p className="mt-3 truncate text-sm text-gray-700">{file?.name}</p>
            <p className="text-xs text-gray-500">{formatBytes(file?.size ?? 0)} → {formatBytes(data.length)} as Base64</p>
          </Panel>
          <div>
            <Segmented value={view} onChange={setView} options={[{ value: "uri", label: "Data URI" }, { value: "raw", label: "Base64 only" }, { value: "html", label: "HTML <img>" }, { value: "css", label: "CSS" }]} />
            <textarea className="textarea mt-3 min-h-60 break-all text-xs" readOnly value={out} aria-label="Base64 output" />
            <div className="mt-2"><CopyButton text={out} /></div>
          </div>
        </div>
      )}
    </div>
  );
}
