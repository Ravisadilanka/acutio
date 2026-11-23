"use client";

import { useState, type ReactNode } from "react";
import { Check, Copy } from "lucide-react";

export function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export const downloadText = (text: string, filename: string, type = "text/plain") =>
  downloadBlob(new Blob([text], { type: `${type};charset=utf-8` }), filename);

export function formatBytes(bytes: number) {
  if (!bytes) return "0 B";
  const k = 1024;
  const units = ["B", "KB", "MB", "GB"];
  const i = Math.min(Math.floor(Math.log(bytes) / Math.log(k)), units.length - 1);
  return `${(bytes / k ** i).toFixed(i ? 1 : 0)} ${units[i]}`;
}

export const fmt = (n: number, digits = 2) =>
  Number.isFinite(n) ? n.toLocaleString(undefined, { maximumFractionDigits: digits }) : "—";

export const baseName = (name: string) => name.replace(/\.[^.]+$/, "");

export function CopyButton({ text, label = "Copy", className = "" }: { text: string; label?: string; className?: string }) {
  const [done, setDone] = useState(false);
  return (
    <button
      type="button"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(text);
          setDone(true);
          setTimeout(() => setDone(false), 1500);
        } catch {}
      }}
      disabled={!text}
      className={`btn-secondary px-3 py-2 ${className}`}
    >
      {done ? <Check className="h-4 w-4 text-emerald-500" /> : <Copy className="h-4 w-4" />}
      {label && <span>{done ? "Copied" : label}</span>}
    </button>
  );
}

export function Segmented<T extends string>({
  value,
  onChange,
  options,
  className = "",
}: {
  value: T;
  onChange: (v: T) => void;
  options: { value: T; label: ReactNode }[];
  className?: string;
}) {
  return (
    <div className={`inline-flex flex-wrap gap-1 rounded-xl border bg-gray-50 p-1 ${className}`} role="tablist">
      {options.map((o) => (
        <button
          key={o.value}
          type="button"
          role="tab"
          aria-selected={value === o.value}
          onClick={() => onChange(o.value)}
          className={`rounded-lg px-3.5 py-2 text-sm font-medium transition ${
            value === o.value ? "bg-surface text-gray-900 shadow-sm ring-1 ring-gray-200" : "text-gray-500 hover:text-gray-900"
          }`}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

export function Stat({ label, value, hint, accent = false }: { label: string; value: ReactNode; hint?: ReactNode; accent?: boolean }) {
  return (
    <div className={accent ? "rounded-2xl border border-brand/30 bg-brand-soft p-4" : "stat"}>
      <div className="stat-label">{label}</div>
      <div className={`stat-value ${accent ? "text-brand-ink" : ""}`}>{value}</div>
      {hint && <div className="mt-1 text-sm text-gray-500">{hint}</div>}
    </div>
  );
}

export function Field({ label, children, hint }: { label: string; children: ReactNode; hint?: ReactNode }) {
  return (
    <label className="block">
      <span className="label">{label}</span>
      {children}
      {hint && <span className="mt-1 block text-xs text-gray-500">{hint}</span>}
    </label>
  );
}

export function NumberField({
  label,
  value,
  onChange,
  suffix,
  prefix,
  min,
  max,
  step = "any",
  hint,
}: {
  label: string;
  value: number | string;
  onChange: (v: string) => void;
  suffix?: string;
  prefix?: string;
  min?: number;
  max?: number;
  step?: number | "any";
  hint?: ReactNode;
}) {
  return (
    <Field label={label} hint={hint}>
      <div className="relative">
        {prefix && <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">{prefix}</span>}
        <input
          type="number"
          inputMode="decimal"
          className={`input ${prefix ? "pl-9" : ""} ${suffix ? "pr-14" : ""}`}
          value={value}
          min={min}
          max={max}
          step={step}
          onChange={(e) => onChange(e.target.value)}
        />
        {suffix && <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-sm text-gray-400">{suffix}</span>}
      </div>
    </Field>
  );
}

export function Panel({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`card p-5 sm:p-6 ${className}`}>{children}</div>;
}

/** Load an image file into an HTMLImageElement (supports HEIC via lazy heic2any). */
export async function loadImage(file: File): Promise<HTMLImageElement> {
  let blob: Blob = file;
  if (/heic|heif/i.test(file.type) || /\.(heic|heif)$/i.test(file.name)) {
    const heic2any = (await import("heic2any")).default;
    const out = await heic2any({ blob: file, toType: "image/png" });
    blob = Array.isArray(out) ? out[0] : out;
  }
  const url = URL.createObjectURL(blob);
  const img = new Image();
  img.decoding = "async";
  img.src = url;
  await img.decode();
  return img;
}

export function canvasToBlob(canvas: HTMLCanvasElement, type: string, quality?: number): Promise<Blob> {
  return new Promise((resolve, reject) =>
    canvas.toBlob((b) => (b ? resolve(b) : reject(new Error("Export failed"))), type, quality),
  );
}

export const extFor = (mime: string) => (mime === "image/jpeg" ? "jpg" : mime.split("/")[1]);
