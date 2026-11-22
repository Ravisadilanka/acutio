"use client";

import { useEffect, useState } from "react";
import { FileUp } from "lucide-react";
import { CopyButton, Panel, Segmented, formatBytes } from "@/components/ui/kit";

/* Compact MD5 (RFC 1321) — WebCrypto doesn't provide MD5. */
function md5(bytes: Uint8Array): string {
  const K = new Uint32Array(64).map((_, i) => Math.floor(Math.abs(Math.sin(i + 1)) * 2 ** 32));
  const S = [7, 12, 17, 22, 5, 9, 14, 20, 4, 11, 16, 23, 6, 10, 15, 21];
  const len = bytes.length;
  const n = (((len + 8) >>> 6) + 1) * 16;
  const w = new Uint32Array(n);
  for (let i = 0; i < len; i++) w[i >> 2] |= bytes[i] << ((i % 4) * 8);
  w[len >> 2] |= 0x80 << ((len % 4) * 8);
  w[n - 2] = (len * 8) >>> 0;
  w[n - 1] = Math.floor(len / 0x20000000);
  let [a0, b0, c0, d0] = [0x67452301, 0xefcdab89, 0x98badcfe, 0x10325476];
  for (let o = 0; o < n; o += 16) {
    let [A, B, C, D] = [a0, b0, c0, d0];
    for (let i = 0; i < 64; i++) {
      let F: number, g: number;
      if (i < 16) { F = (B & C) | (~B & D); g = i; }
      else if (i < 32) { F = (D & B) | (~D & C); g = (5 * i + 1) % 16; }
      else if (i < 48) { F = B ^ C ^ D; g = (3 * i + 5) % 16; }
      else { F = C ^ (B | ~D); g = (7 * i) % 16; }
      F = (F + A + K[i] + w[o + g]) >>> 0;
      A = D; D = C; C = B;
      const s = S[(i >> 4) * 4 + (i % 4)];
      B = (B + ((F << s) | (F >>> (32 - s)))) >>> 0;
    }
    a0 = (a0 + A) >>> 0; b0 = (b0 + B) >>> 0; c0 = (c0 + C) >>> 0; d0 = (d0 + D) >>> 0;
  }
  return [a0, b0, c0, d0].map((x) => [0, 8, 16, 24].map((s) => ((x >>> s) & 255).toString(16).padStart(2, "0")).join("")).join("");
}

const hex = (buf: ArrayBuffer) => [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, "0")).join("");
const ALGOS = ["MD5", "SHA-1", "SHA-256", "SHA-384", "SHA-512"] as const;

export default function Client() {
  const [mode, setMode] = useState<"text" | "file">("text");
  const [text, setText] = useState("hello world");
  const [file, setFile] = useState<File | null>(null);
  const [hashes, setHashes] = useState<Record<string, string>>({});
  const [upper, setUpper] = useState(false);
  const [compare, setCompare] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    let cancel = false;
    (async () => {
      setBusy(true);
      const bytes = mode === "text" ? new TextEncoder().encode(text) : file ? new Uint8Array(await file.arrayBuffer()) : null;
      if (!bytes) { setHashes({}); setBusy(false); return; }
      const out: Record<string, string> = { MD5: bytes.length < 512 * 1024 * 1024 ? md5(bytes) : "File too large for MD5" };
      for (const a of ALGOS.slice(1)) out[a] = hex(await crypto.subtle.digest(a, bytes as BufferSource));
      if (!cancel) { setHashes(out); setBusy(false); }
    })();
    return () => { cancel = true; };
  }, [mode, text, file]);

  const cmp = compare.trim().toLowerCase();

  return (
    <div className="space-y-4">
      <Segmented value={mode} onChange={setMode} options={[{ value: "text", label: "Text" }, { value: "file", label: "File" }]} />
      {mode === "text" ? (
        <textarea className="textarea min-h-32" value={text} onChange={(e) => setText(e.target.value)} aria-label="Text to hash" />
      ) : (
        <label className="flex cursor-pointer items-center gap-3 rounded-2xl border-2 border-dashed border-gray-300 bg-gray-50 p-6 hover:border-brand">
          <FileUp className="h-6 w-6 text-brand" />
          <span className="text-gray-700">{file ? `${file.name} (${formatBytes(file.size)})` : "Choose a file to hash (stays on your device)"}</span>
          <input type="file" className="hidden" onChange={(e) => setFile(e.target.files?.[0] ?? null)} />
        </label>
      )}
      <div className="flex flex-wrap items-center gap-4">
        <label className="flex items-center gap-2 text-sm text-gray-700"><input type="checkbox" checked={upper} onChange={(e) => setUpper(e.target.checked)} /> Uppercase</label>
        <input className="input max-w-md py-2 font-mono text-sm" placeholder="Paste a checksum to compare…" value={compare} onChange={(e) => setCompare(e.target.value)} />
        {busy && <span className="text-sm text-gray-500">Hashing…</span>}
      </div>
      <Panel className="divide-y p-0 sm:p-0">
        {ALGOS.map((a) => {
          const h = hashes[a] ?? "";
          const v = upper ? h.toUpperCase() : h;
          const match = cmp && h.toLowerCase() === cmp;
          return (
            <div key={a} className={`flex flex-col gap-2 px-5 py-3 sm:flex-row sm:items-center ${match ? "bg-emerald-500/10" : ""}`}>
              <span className="w-24 shrink-0 text-sm font-semibold text-gray-900">{a}{match && " ✓"}</span>
              <code className="flex-1 break-all font-mono text-sm text-gray-700">{v || "—"}</code>
              <CopyButton text={v} label="" />
            </div>
          );
        })}
      </Panel>
      {cmp && !ALGOS.some((a) => hashes[a]?.toLowerCase() === cmp) && <p className="text-sm text-rose-500">No hash matches the checksum you entered.</p>}
    </div>
  );
}
