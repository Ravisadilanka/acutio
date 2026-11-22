"use client";

import { useEffect, useRef, useState } from "react";
import { Download } from "lucide-react";
import FileDropzone from "@/components/FileDropzone";
import { Panel, Segmented, baseName, canvasToBlob, downloadBlob, extFor, loadImage } from "@/components/ui/kit";

type Box = { x: number; y: number; w: number; h: number }; // fractions of image (0..1)
const RATIOS: [string, number | null][] = [["Free", null], ["1:1", 1], ["4:3", 4 / 3], ["3:4", 3 / 4], ["16:9", 16 / 9], ["9:16", 9 / 16], ["3:2", 3 / 2], ["2:3", 2 / 3]];

export default function Client() {
  const [img, setImg] = useState<HTMLImageElement | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [box, setBox] = useState<Box>({ x: 0.1, y: 0.1, w: 0.8, h: 0.8 });
  const [ratio, setRatio] = useState<number | null>(null);
  const [fmt, setFmt] = useState<"image/jpeg" | "image/png" | "image/webp">("image/jpeg");
  const area = useRef<HTMLDivElement>(null);
  const drag = useRef<{ mode: string; sx: number; sy: number; start: Box } | null>(null);

  const imgRatio = img ? img.naturalWidth / img.naturalHeight : 1;

  const applyRatio = (r: number | null) => {
    setRatio(r);
    if (!r) return;
    // r is w/h in pixels; convert to fractional box
    const fr = r / imgRatio;
    let w = 0.8, h = w / fr;
    if (h > 0.8) { h = 0.8; w = h * fr; }
    setBox({ x: (1 - w) / 2, y: (1 - h) / 2, w, h });
  };

  useEffect(() => {
    const move = (e: PointerEvent) => {
      const d = drag.current;
      const el = area.current;
      if (!d || !el) return;
      const r = el.getBoundingClientRect();
      const dx = (e.clientX - d.sx) / r.width, dy = (e.clientY - d.sy) / r.height;
      let { x, y, w, h } = d.start;
      if (d.mode === "move") {
        x = Math.min(1 - w, Math.max(0, x + dx));
        y = Math.min(1 - h, Math.max(0, y + dy));
      } else {
        if (d.mode.includes("e")) w = Math.min(1 - x, Math.max(0.02, w + dx));
        if (d.mode.includes("s")) h = Math.min(1 - y, Math.max(0.02, h + dy));
        if (d.mode.includes("w")) { const nx = Math.min(x + w - 0.02, Math.max(0, x + dx)); w += x - nx; x = nx; }
        if (d.mode.includes("n")) { const ny = Math.min(y + h - 0.02, Math.max(0, y + dy)); h += y - ny; y = ny; }
        if (ratio) {
          const fr = ratio / imgRatio;
          h = w / fr;
          if (y + h > 1) { h = 1 - y; w = h * fr; }
        }
      }
      setBox({ x, y, w, h });
    };
    const up = () => (drag.current = null);
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
    return () => { window.removeEventListener("pointermove", move); window.removeEventListener("pointerup", up); };
  }, [ratio, imgRatio]);

  const start = (mode: string) => (e: React.PointerEvent) => {
    e.preventDefault();
    e.stopPropagation();
    drag.current = { mode, sx: e.clientX, sy: e.clientY, start: box };
  };

  const px = img ? { x: Math.round(box.x * img.naturalWidth), y: Math.round(box.y * img.naturalHeight), w: Math.round(box.w * img.naturalWidth), h: Math.round(box.h * img.naturalHeight) } : null;

  const crop = async () => {
    if (!img || !px || !file) return;
    const c = document.createElement("canvas");
    c.width = px.w;
    c.height = px.h;
    const ctx = c.getContext("2d")!;
    if (fmt === "image/jpeg") { ctx.fillStyle = "#fff"; ctx.fillRect(0, 0, px.w, px.h); }
    ctx.drawImage(img, px.x, px.y, px.w, px.h, 0, 0, px.w, px.h);
    downloadBlob(await canvasToBlob(c, fmt, 0.92), `${baseName(file.name)}-cropped.${extFor(fmt)}`);
  };

  if (!img)
    return <FileDropzone onFilesAdded={async (f) => { setFile(f[0]); setImg(await loadImage(f[0])); setFmt(f[0].type === "image/png" ? "image/png" : "image/jpeg"); }} multiple={false} accept={{ "image/*": [".heic", ".heif"] }} title="Select an image to crop" />;

  const handles = ["nw", "n", "ne", "e", "se", "s", "sw", "w"];
  const pos: Record<string, string> = { nw: "-left-2 -top-2 cursor-nwse-resize", n: "left-1/2 -top-2 -translate-x-1/2 cursor-ns-resize", ne: "-right-2 -top-2 cursor-nesw-resize", e: "-right-2 top-1/2 -translate-y-1/2 cursor-ew-resize", se: "-right-2 -bottom-2 cursor-nwse-resize", s: "left-1/2 -bottom-2 -translate-x-1/2 cursor-ns-resize", sw: "-left-2 -bottom-2 cursor-nesw-resize", w: "-left-2 top-1/2 -translate-y-1/2 cursor-ew-resize" };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        {RATIOS.map(([l, r]) => <button key={l} className={`chip ${ratio === r ? "chip-active" : ""}`} onClick={() => applyRatio(r)}>{l}</button>)}
      </div>
      <Panel className="flex justify-center bg-gray-50 p-4 sm:p-6">
        <div ref={area} className="relative inline-block touch-none select-none" style={{ maxWidth: "100%" }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={img.src} alt="To crop" className="block max-h-[520px] max-w-full" draggable={false} />
          <div className="absolute inset-0 bg-black/50" style={{ clipPath: `polygon(0 0,100% 0,100% 100%,0 100%,0 0,${box.x * 100}% ${box.y * 100}%,${box.x * 100}% ${(box.y + box.h) * 100}%,${(box.x + box.w) * 100}% ${(box.y + box.h) * 100}%,${(box.x + box.w) * 100}% ${box.y * 100}%,${box.x * 100}% ${box.y * 100}%)` }} />
          <div
            className="absolute cursor-move border-2 border-white shadow-[0_0_0_1px_rgba(0,0,0,.4)]"
            style={{ left: `${box.x * 100}%`, top: `${box.y * 100}%`, width: `${box.w * 100}%`, height: `${box.h * 100}%` }}
            onPointerDown={start("move")}
          >
            <div className="pointer-events-none absolute inset-0 grid grid-cols-3 grid-rows-3">
              {Array.from({ length: 9 }).map((_, i) => <div key={i} className="border border-white/30" />)}
            </div>
            {handles.map((h) => <span key={h} onPointerDown={start(h)} className={`absolute h-4 w-4 rounded-full border-2 border-white bg-brand ${pos[h]}`} />)}
          </div>
        </div>
      </Panel>
      <div className="flex flex-wrap items-center gap-3">
        <span className="text-sm text-gray-600">Crop: <strong className="text-gray-900">{px?.w} × {px?.h}px</strong></span>
        <Segmented value={fmt} onChange={setFmt} options={[{ value: "image/jpeg", label: "JPG" }, { value: "image/png", label: "PNG" }, { value: "image/webp", label: "WEBP" }]} />
        <button className="btn-primary ml-auto" onClick={crop}><Download className="h-4 w-4" /> Crop & download</button>
        <button className="btn-ghost" onClick={() => setImg(null)}>New image</button>
      </div>
    </div>
  );
}
