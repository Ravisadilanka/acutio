"use client";

import { useMemo, useState } from "react";
import { ArrowLeftRight } from "lucide-react";
import { Panel } from "@/components/ui/kit";

type Op = { t: "same" | "add" | "del"; a?: number; b?: number; text: string };

/** LCS line diff (O(n·m), fine for documents up to a few thousand lines). */
function diffLines(a: string[], b: string[], norm: (s: string) => string): Op[] {
  const n = a.length, m = b.length;
  if (n * m > 25_000_000) return [{ t: "del", text: "Texts are too large to compare in the browser." }];
  const A = a.map(norm), B = b.map(norm);
  const dp = Array.from({ length: n + 1 }, () => new Uint32Array(m + 1));
  for (let i = n - 1; i >= 0; i--) for (let j = m - 1; j >= 0; j--) dp[i][j] = A[i] === B[j] ? dp[i + 1][j + 1] + 1 : Math.max(dp[i + 1][j], dp[i][j + 1]);
  const out: Op[] = [];
  let i = 0, j = 0;
  while (i < n && j < m) {
    if (A[i] === B[j]) { out.push({ t: "same", a: i + 1, b: j + 1, text: b[j] }); i++; j++; }
    else if (dp[i + 1][j] >= dp[i][j + 1]) { out.push({ t: "del", a: i + 1, text: a[i] }); i++; }
    else { out.push({ t: "add", b: j + 1, text: b[j] }); j++; }
  }
  while (i < n) { out.push({ t: "del", a: i + 1, text: a[i] }); i++; }
  while (j < m) { out.push({ t: "add", b: j + 1, text: b[j] }); j++; }
  return out;
}

export default function Client() {
  const [left, setLeft] = useState("The quick brown fox\njumps over\nthe lazy dog.");
  const [right, setRight] = useState("The quick brown fox\nleaps over\nthe lazy dog.\nThe end.");
  const [ignoreWs, setIgnoreWs] = useState(false);
  const [ignoreCase, setIgnoreCase] = useState(false);
  const [onlyChanges, setOnlyChanges] = useState(false);

  const ops = useMemo(() => {
    const norm = (s: string) => { let x = ignoreWs ? s.replace(/\s+/g, " ").trim() : s; if (ignoreCase) x = x.toLowerCase(); return x; };
    return diffLines(left.split("\n"), right.split("\n"), norm);
  }, [left, right, ignoreWs, ignoreCase]);

  const added = ops.filter((o) => o.t === "add").length;
  const removed = ops.filter((o) => o.t === "del").length;
  const shown = onlyChanges ? ops.filter((o) => o.t !== "same") : ops;

  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-[1fr_auto_1fr]">
        <div>
          <label className="label">Original text</label>
          <textarea className="textarea min-h-64" value={left} onChange={(e) => setLeft(e.target.value)} spellCheck={false} />
        </div>
        <button className="btn-secondary self-center p-3" onClick={() => { setLeft(right); setRight(left); }} aria-label="Swap texts"><ArrowLeftRight className="h-5 w-5" /></button>
        <div>
          <label className="label">Changed text</label>
          <textarea className="textarea min-h-64" value={right} onChange={(e) => setRight(e.target.value)} spellCheck={false} />
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-4 text-sm text-gray-700">
        <label className="flex items-center gap-2"><input type="checkbox" checked={ignoreWs} onChange={(e) => setIgnoreWs(e.target.checked)} /> Ignore whitespace</label>
        <label className="flex items-center gap-2"><input type="checkbox" checked={ignoreCase} onChange={(e) => setIgnoreCase(e.target.checked)} /> Ignore case</label>
        <label className="flex items-center gap-2"><input type="checkbox" checked={onlyChanges} onChange={(e) => setOnlyChanges(e.target.checked)} /> Show only changes</label>
        <span className="ml-auto flex gap-3 font-medium">
          <span className="text-emerald-600">+{added} added</span>
          <span className="text-rose-600">−{removed} removed</span>
        </span>
      </div>

      <Panel className="overflow-x-auto p-0 sm:p-0">
        {added + removed === 0 ? (
          <p className="p-6 text-center font-medium text-emerald-600">✓ The texts are identical.</p>
        ) : (
          <table className="w-full font-mono text-sm">
            <tbody>
              {shown.map((o, i) => (
                <tr key={i} className={o.t === "add" ? "bg-emerald-500/10" : o.t === "del" ? "bg-rose-500/10" : ""}>
                  <td className="w-12 select-none border-r px-2 text-right text-xs text-gray-400">{o.a ?? ""}</td>
                  <td className="w-12 select-none border-r px-2 text-right text-xs text-gray-400">{o.b ?? ""}</td>
                  <td className={`w-6 select-none text-center ${o.t === "add" ? "text-emerald-600" : o.t === "del" ? "text-rose-600" : "text-gray-300"}`}>{o.t === "add" ? "+" : o.t === "del" ? "−" : ""}</td>
                  <td className="whitespace-pre-wrap break-all px-2 py-0.5 text-gray-800">{o.text || " "}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </Panel>
    </div>
  );
}
