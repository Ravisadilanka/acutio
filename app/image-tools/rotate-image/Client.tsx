"use client";

import { useState } from "react";
import { RotateCcw, RotateCw, FlipHorizontal, FlipVertical, Download } from "lucide-react";
import FileDropzone from "@/components/FileDropzone";
import { Panel, baseName, canvasToBlob, downloadBlob, extFor, loadImage } from "@/components/ui/kit";

export default function Client() {
  const [img, setImg] = useState<HTMLImageElement | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [rot, setRot] = useState(0);
  const [fx, setFx] = useState(false);
  const [fy, setFy] = useState(false);

  const save = async () => {
    if (!img || !file) return;
    const swap = rot % 180 !== 0;
    const w = img.naturalWidth, h = img.naturalHeight;
    const c = document.createElement("canvas");
    c.width = swap ? h : w;
    c.height = swap ? w : h;
    const ctx = c.getContext("2d")!;
    ctx.translate(c.width / 2, c.height / 2);
    ctx.rotate((rot * Math.PI) / 180);
    ctx.scale(fx ? -1 : 1, fy ? -1 : 1);
    ctx.drawImage(img, -w / 2, -h / 2);
    const type = file.type === "image/png" || file.type === "image/webp" ? file.type : "image/jpeg";
    downloadBlob(await canvasToBlob(c, type, 0.95), `${baseName(file.name)}-edited.${extFor(type)}`);
  };

  if (!img) return <FileDropzone onFilesAdded={async (f) => { setFile(f[0]); setImg(await loadImage(f[0])); setRot(0); setFx(false); setFy(false); }} multiple={false} accept={{ "image/*": [".heic", ".heif"] }} title="Select an image" />;

  return (
    <div className="space-y-4">
      <Panel className="flex min-h-[420px] items-center justify-center overflow-hidden bg-gray-50">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={img.src} alt="Preview" className="max-h-[380px] max-w-full transition-transform duration-300" style={{ transform: `rotate(${rot}deg) scale(${fx ? -1 : 1}, ${fy ? -1 : 1})` }} />
      </Panel>
      <div className="flex flex-wrap justify-center gap-2">
        <button className="btn-secondary" onClick={() => setRot((r) => (r + 270) % 360)}><RotateCcw className="h-4 w-4" /> Rotate left</button>
        <button className="btn-secondary" onClick={() => setRot((r) => (r + 90) % 360)}><RotateCw className="h-4 w-4" /> Rotate right</button>
        <button className={`btn-secondary ${fx ? "border-brand text-brand-ink" : ""}`} onClick={() => setFx(!fx)}><FlipHorizontal className="h-4 w-4" /> Flip horizontal</button>
        <button className={`btn-secondary ${fy ? "border-brand text-brand-ink" : ""}`} onClick={() => setFy(!fy)}><FlipVertical className="h-4 w-4" /> Flip vertical</button>
        <button className="btn-primary" onClick={save}><Download className="h-4 w-4" /> Download</button>
        <button className="btn-ghost" onClick={() => setImg(null)}>New image</button>
      </div>
    </div>
  );
}
