"use client";

import { useCallback, useEffect, useState } from "react";
import { Delete, History, Trash2 } from "lucide-react";
import { Panel, Segmented } from "@/components/ui/kit";
import { evaluate, type AngleMode } from "@/lib/calc";

const fmtNum = (n: number) =>
  !Number.isFinite(n) ? (Number.isNaN(n) ? "Error" : n > 0 ? "∞" : "-∞") : Math.abs(n) >= 1e15 || (n !== 0 && Math.abs(n) < 1e-9) ? n.toExponential(8) : n.toLocaleString(undefined, { maximumFractionDigits: 10 });

export default function Client() {
  const [mode, setMode] = useState<"basic" | "sci">("basic");
  const [angle, setAngle] = useState<AngleMode>("deg");
  const [expr, setExpr] = useState("");
  const [ans, setAns] = useState(0);
  const [justEvaluated, setJustEvaluated] = useState(false);
  const [history, setHistory] = useState<{ e: string; r: string }[]>([]);
  const [error, setError] = useState(false);

  let preview = "";
  try {
    if (expr && !justEvaluated) preview = fmtNum(evaluate(expr, angle, ans));
  } catch {}

  const press = useCallback(
    (k: string) => {
      setError(false);
      if (k === "C") return setExpr(""), setJustEvaluated(false);
      if (k === "⌫") return setExpr((e) => (justEvaluated ? "" : e.slice(0, -1))), setJustEvaluated(false);
      if (k === "=") {
        try {
          const r = evaluate(expr, angle, ans);
          setHistory((h) => [{ e: expr, r: fmtNum(r) }, ...h].slice(0, 30));
          setAns(r);
          setExpr(Number.isFinite(r) ? String(r) : "");
          setJustEvaluated(true);
          if (Number.isNaN(r)) setError(true);
        } catch {
          setError(true);
        }
        return;
      }
      const isOp = /^[+\-×÷^%!)]$/.test(k);
      setExpr((e) => (justEvaluated && !isOp ? k : e + k));
      setJustEvaluated(false);
    },
    [expr, angle, ans, justEvaluated],
  );

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (/INPUT|TEXTAREA|SELECT/.test((e.target as HTMLElement).tagName) || e.ctrlKey || e.metaKey) return;
      const map: Record<string, string> = { "*": "×", "/": "÷", Enter: "=", "=": "=", Backspace: "⌫", Escape: "C", Delete: "C" };
      const k = map[e.key] ?? (/^[\d.+\-^%()!]$/.test(e.key) ? e.key : null);
      if (k) {
        e.preventDefault();
        press(k);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [press]);

  const sci = ["sin(", "cos(", "tan(", "π", "asin(", "acos(", "atan(", "e", "ln(", "log(", "√(", "^", "(", ")", "!", "ans"];
  const basic = ["C", "⌫", "%", "÷", "7", "8", "9", "×", "4", "5", "6", "-", "1", "2", "3", "+", "±", "0", ".", "="];

  const Key = ({ k }: { k: string }) => {
    const style =
      k === "=" ? "bg-brand text-white hover:bg-brand-hover" : /^[÷×\-+%]$/.test(k) ? "bg-brand-soft text-brand hover:bg-brand/20" : /^(C|⌫)$/.test(k) ? "bg-gray-200 text-gray-900 hover:bg-gray-300" : "bg-gray-100 text-gray-900 hover:bg-gray-200";
    return (
      <button
        onClick={() => (k === "±" ? setExpr((e) => (e.startsWith("-(") && e.endsWith(")") ? e.slice(2, -1) : e ? `-(${e})` : "-")) : press(k))}
        className={`flex h-14 items-center justify-center rounded-2xl text-xl font-semibold transition active:scale-95 sm:h-16 ${style}`}
        aria-label={k === "⌫" ? "Backspace" : k}
      >
        {k === "⌫" ? <Delete className="h-5 w-5" /> : k}
      </button>
    );
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_300px]" data-keyboard-tool>
      <Panel className="mx-auto w-full max-w-xl">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
          <Segmented value={mode} onChange={setMode} options={[{ value: "basic", label: "Basic" }, { value: "sci", label: "Scientific" }]} />
          {mode === "sci" && <Segmented value={angle} onChange={setAngle} options={[{ value: "deg", label: "DEG" }, { value: "rad", label: "RAD" }]} />}
        </div>
        <div className="mb-4 rounded-2xl bg-gray-50 p-4 text-right" aria-live="polite">
          <div className="min-h-7 break-all font-mono text-lg text-gray-500">{expr || "0"}</div>
          <div className={`mt-1 min-h-12 break-all text-4xl font-bold tabular-nums ${error ? "text-rose-500" : "text-gray-900"}`}>
            {error ? "Error" : justEvaluated ? fmtNum(ans) : preview || " "}
          </div>
        </div>
        {mode === "sci" && (
          <div className="mb-2 grid grid-cols-4 gap-2">
            {sci.map((k) => (
              <button key={k} onClick={() => press(k)} className="h-11 rounded-xl bg-gray-50 font-mono text-sm font-medium text-gray-700 ring-1 ring-gray-200 hover:bg-gray-100">
                {k.replace("(", "")}
              </button>
            ))}
          </div>
        )}
        <div className="grid grid-cols-4 gap-2">{basic.map((k) => <Key key={k} k={k} />)}</div>
        <p className="mt-4 text-center text-xs text-gray-500">Keyboard works too: numbers, + − * / ^ ( ), Enter, Backspace, Esc</p>
      </Panel>
      <Panel className="self-start">
        <div className="mb-2 flex items-center justify-between">
          <p className="flex items-center gap-2 font-semibold text-gray-900"><History className="h-4 w-4" /> History</p>
          {history.length > 0 && <button className="btn-ghost p-1.5" onClick={() => setHistory([])} aria-label="Clear history"><Trash2 className="h-4 w-4" /></button>}
        </div>
        {history.length === 0 ? (
          <p className="text-sm text-gray-500">Your calculations will appear here.</p>
        ) : (
          <ul className="max-h-96 space-y-1 overflow-y-auto">
            {history.map((h, i) => (
              <li key={i}>
                <button onClick={() => { setExpr(h.e); setJustEvaluated(false); }} className="w-full rounded-lg px-2 py-1.5 text-right hover:bg-gray-50">
                  <span className="block truncate font-mono text-xs text-gray-500">{h.e}</span>
                  <span className="block font-semibold tabular-nums text-gray-900">= {h.r}</span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </Panel>
    </div>
  );
}
