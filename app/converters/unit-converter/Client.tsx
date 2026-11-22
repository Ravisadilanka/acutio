"use client";

import { useMemo, useState } from "react";
import { ArrowLeftRight } from "lucide-react";
import { CopyButton, Field, Panel } from "@/components/ui/kit";

type Units = Record<string, [label: string, toBase: number]>;

const groups: Record<string, Units> = {
  Length: { m: ["Meter", 1], km: ["Kilometer", 1000], cm: ["Centimeter", 0.01], mm: ["Millimeter", 0.001], um: ["Micrometer", 1e-6], mi: ["Mile", 1609.344], yd: ["Yard", 0.9144], ft: ["Foot", 0.3048], in: ["Inch", 0.0254], nmi: ["Nautical mile", 1852] },
  Weight: { kg: ["Kilogram", 1], g: ["Gram", 0.001], mg: ["Milligram", 1e-6], t: ["Metric ton", 1000], lb: ["Pound", 0.45359237], oz: ["Ounce", 0.028349523125], st: ["Stone", 6.35029318], ct: ["Carat", 0.0002] },
  Temperature: { C: ["Celsius", 1], F: ["Fahrenheit", 1], K: ["Kelvin", 1] },
  Volume: { l: ["Liter", 1], ml: ["Milliliter", 0.001], m3: ["Cubic meter", 1000], gal: ["US gallon", 3.785411784], qt: ["US quart", 0.946352946], pt: ["US pint", 0.473176473], cup: ["US cup", 0.2365882365], floz: ["US fl oz", 0.0295735295625], tbsp: ["Tablespoon", 0.01478676478125], tsp: ["Teaspoon", 0.00492892159375], ukgal: ["UK gallon", 4.54609] },
  Area: { m2: ["Square meter", 1], km2: ["Square km", 1e6], cm2: ["Square cm", 1e-4], ha: ["Hectare", 1e4], ac: ["Acre", 4046.8564224], ft2: ["Square foot", 0.09290304], in2: ["Square inch", 0.00064516], mi2: ["Square mile", 2589988.110336], perch: ["Perch", 25.29285264] },
  Speed: { "m/s": ["Meter/second", 1], "km/h": ["Km/hour", 1 / 3.6], mph: ["Miles/hour", 0.44704], kn: ["Knot", 0.514444], "ft/s": ["Foot/second", 0.3048] },
  Time: { s: ["Second", 1], ms: ["Millisecond", 0.001], min: ["Minute", 60], h: ["Hour", 3600], d: ["Day", 86400], wk: ["Week", 604800], mo: ["Month (avg)", 2629746], yr: ["Year (365.25d)", 31557600] },
  Data: { B: ["Byte", 1], KB: ["Kilobyte", 1e3], MB: ["Megabyte", 1e6], GB: ["Gigabyte", 1e9], TB: ["Terabyte", 1e12], KiB: ["Kibibyte", 1024], MiB: ["Mebibyte", 1048576], GiB: ["Gibibyte", 1073741824], bit: ["Bit", 0.125] },
  Energy: { J: ["Joule", 1], kJ: ["Kilojoule", 1000], cal: ["Calorie", 4.184], kcal: ["Kilocalorie", 4184], Wh: ["Watt-hour", 3600], kWh: ["Kilowatt-hour", 3.6e6], BTU: ["BTU", 1055.06] },
};

const toC = (v: number, u: string) => (u === "C" ? v : u === "F" ? ((v - 32) * 5) / 9 : v - 273.15);
const fromC = (c: number, u: string) => (u === "C" ? c : u === "F" ? (c * 9) / 5 + 32 : c + 273.15);

function convert(group: string, v: number, from: string, to: string) {
  if (group === "Temperature") return fromC(toC(v, from), to);
  const u = groups[group];
  return (v * u[from][1]) / u[to][1];
}

const show = (n: number) => {
  if (!Number.isFinite(n)) return "—";
  if (n !== 0 && (Math.abs(n) < 1e-6 || Math.abs(n) >= 1e15)) return n.toExponential(6);
  return String(parseFloat(n.toPrecision(12)));
};

export default function Client() {
  const [group, setGroup] = useState("Length");
  const [value, setValue] = useState("1");
  const keys = Object.keys(groups[group]);
  const [from, setFrom] = useState("m");
  const [to, setTo] = useState("ft");

  const pick = (g: string) => {
    setGroup(g);
    const k = Object.keys(groups[g]);
    setFrom(k[0]);
    setTo(k[1]);
  };

  const v = parseFloat(value);
  const main = useMemo(() => convert(group, v, from, to), [group, v, from, to]);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2">
        {Object.keys(groups).map((g) => (
          <button key={g} onClick={() => pick(g)} className={`chip ${g === group ? "chip-active" : ""}`}>{g}</button>
        ))}
      </div>

      <Panel>
        <div className="grid items-end gap-4 md:grid-cols-[1fr_auto_1fr]">
          <div className="grid grid-cols-[1fr_1fr] gap-2">
            <Field label="From"><input type="number" className="input text-lg" value={value} onChange={(e) => setValue(e.target.value)} /></Field>
            <Field label="Unit">
              <select className="input" value={from} onChange={(e) => setFrom(e.target.value)}>
                {keys.map((k) => <option key={k} value={k}>{groups[group][k][0]} ({k})</option>)}
              </select>
            </Field>
          </div>
          <button className="btn-secondary mb-0.5 self-end p-3" onClick={() => { setFrom(to); setTo(from); }} aria-label="Swap units"><ArrowLeftRight className="h-5 w-5" /></button>
          <div className="grid grid-cols-[1fr_1fr] gap-2">
            <Field label="To"><input readOnly className="input bg-gray-50 text-lg font-semibold" value={show(main)} /></Field>
            <Field label="Unit">
              <select className="input" value={to} onChange={(e) => setTo(e.target.value)}>
                {keys.map((k) => <option key={k} value={k}>{groups[group][k][0]} ({k})</option>)}
              </select>
            </Field>
          </div>
        </div>
        <p className="mt-4 text-center text-lg text-gray-700">
          <strong className="text-gray-900">{value || 0} {groups[group][from][0].toLowerCase()}</strong> = <strong className="text-brand">{show(main)} {groups[group][to][0].toLowerCase()}</strong>
        </p>
      </Panel>

      <Panel className="p-0 sm:p-0">
        <p className="border-b px-5 py-3 text-sm font-semibold text-gray-700">{value || 0} {groups[group][from][0]} in all units</p>
        <ul className="grid divide-y sm:grid-cols-2 sm:divide-y-0">
          {keys.filter((k) => k !== from).map((k) => {
            const r = show(convert(group, v, from, k));
            return (
              <li key={k} className="flex items-center justify-between gap-2 border-b px-5 py-2.5 sm:odd:border-r">
                <span className="text-gray-600">{groups[group][k][0]}</span>
                <span className="flex items-center gap-2 font-mono font-medium text-gray-900">
                  {r} <span className="text-xs text-gray-400">{k}</span>
                  <CopyButton text={r} label="" className="border-0 p-1.5" />
                </span>
              </li>
            );
          })}
        </ul>
      </Panel>
    </div>
  );
}
