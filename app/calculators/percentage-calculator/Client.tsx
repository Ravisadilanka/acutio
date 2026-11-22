"use client";

import { useState } from "react";
import { Panel, fmt } from "@/components/ui/kit";

function Row({
  before,
  mid,
  after,
  a,
  b,
  setA,
  setB,
  result,
  formula,
}: {
  before: string;
  mid: string;
  after?: string;
  a: string;
  b: string;
  setA: (v: string) => void;
  setB: (v: string) => void;
  result: string;
  formula: string;
}) {
  return (
    <Panel>
      <div className="flex flex-wrap items-center gap-3 text-gray-700">
        <span>{before}</span>
        <input type="number" className="input w-32" value={a} onChange={(e) => setA(e.target.value)} />
        <span>{mid}</span>
        <input type="number" className="input w-32" value={b} onChange={(e) => setB(e.target.value)} />
        {after && <span>{after}</span>}
        <span className="text-gray-400">=</span>
        <span className="rounded-xl bg-brand-soft px-4 py-2.5 text-xl font-bold text-brand tabular-nums">{result}</span>
      </div>
      <p className="mt-3 font-mono text-xs text-gray-500">{formula}</p>
    </Panel>
  );
}

export default function Client() {
  const [a1, sa1] = useState("20");
  const [b1, sb1] = useState("150");
  const [a2, sa2] = useState("30");
  const [b2, sb2] = useState("120");
  const [a3, sa3] = useState("80");
  const [b3, sb3] = useState("100");
  const [a4, sa4] = useState("50");
  const [b4, sb4] = useState("70");

  const r1 = (+a1 / 100) * +b1;
  const r2 = (+a2 / +b2) * 100;
  const r3 = ((+b3 - +a3) / Math.abs(+a3)) * 100;
  const r4 = (Math.abs(+a4 - +b4) / ((+a4 + +b4) / 2)) * 100;

  return (
    <div className="space-y-4">
      <Row before="What is" mid="% of" a={a1} b={b1} setA={sa1} setB={sb1} result={fmt(r1, 4)} formula={`${a1} ÷ 100 × ${b1} = ${fmt(r1, 4)}`} />
      <Row before="" mid="is what percent of" a={a2} b={b2} setA={sa2} setB={sb2} result={`${fmt(r2, 4)}%`} formula={`${a2} ÷ ${b2} × 100 = ${fmt(r2, 4)}%`} />
      <Row
        before="Change from"
        mid="to"
        a={a3}
        b={b3}
        setA={sa3}
        setB={sb3}
        result={`${r3 > 0 ? "+" : ""}${fmt(r3, 4)}%`}
        formula={`(${b3} − ${a3}) ÷ |${a3}| × 100 = ${fmt(r3, 4)}% ${r3 >= 0 ? "increase" : "decrease"}`}
      />
      <Row before="Difference between" mid="and" a={a4} b={b4} setA={sa4} setB={sb4} result={`${fmt(r4, 4)}%`} formula={`|${a4} − ${b4}| ÷ ((${a4} + ${b4}) ÷ 2) × 100`} />
    </div>
  );
}
