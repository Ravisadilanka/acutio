"use client";

import { useCallback, useEffect, useState } from "react";
import { RefreshCw } from "lucide-react";
import { CopyButton, Panel, Segmented } from "@/components/ui/kit";

const SETS = {
  upper: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
  lower: "abcdefghijklmnopqrstuvwxyz",
  digits: "0123456789",
  symbols: "!@#$%^&*()-_=+[]{};:,.<>?/~",
};
const AMBIG = /[Il1O0o]/g;
const WORDS = "able acid aged also area army away baby back ball band bank base bath bear beat bell belt best bird blue boat body bone book boom born boss both bowl bulk burn bush busy cake calm came camp card care cash cast cave chat chef chip city clay clip club coal coat code coin cold cook cool copy corn cost crew crop cube cure dark data dawn deal deep deer desk dial diet dish dock door dove draw drop drum duck dune dust duty each east easy echo edge epic even exit face fact fair fall farm fast fern film fire fish five flag flat flow foam fold folk food foot fork form fort fox free frog fuel full fund gain game gate gear gift glad glow goat gold golf good gray grid grow gulf hair half hall hand harp hawk heat herb hero high hill hint home hope horn host huge hunt idea inch iron isle jade jazz jeep join joke jump jury keen kept kick kind king kite knee knot lake lamp land lane lava leaf lens life lift lime line lion list loaf lock loft logo long loop lord luck lung mail main mall mango map mars mask math maze meal melt menu mild milk mind mint mist moon moss moth move myth nail name navy neat nest news nice nine node noon nose note oak oath ocean oven owl pack page palm park path peak pear pine pink pipe plan play plum poem pond pool port post quiz race rain ramp rare raven reef rice ride ring road rock roof room root rope rose ruby rule safe sage sail salt sand seal seed ship shoe silk sing site sky slow snow soap sock sofa soil song soup star stem step sun surf swan tail tank taxi team tent tide tile time tiny tool tour town tree trip tuba tune twin unit vast vase verb view vine volt wave wax week west whale wide wild wind wing wise wolf wood wool word yard yarn year yoga zero zinc zone".split(" ");

function rand(n: number) {
  // Unbiased crypto random int in [0, n)
  const max = Math.floor(0x100000000 / n) * n;
  const buf = new Uint32Array(1);
  do crypto.getRandomValues(buf);
  while (buf[0] >= max);
  return buf[0] % n;
}

export default function Client() {
  const [mode, setMode] = useState<"password" | "passphrase">("password");
  const [len, setLen] = useState(16);
  const [opts, setOpts] = useState({ upper: true, lower: true, digits: true, symbols: true, noAmbig: false });
  const [wordCount, setWordCount] = useState(5);
  const [sep, setSep] = useState("-");
  const [capWords, setCapWords] = useState(true);
  const [addNum, setAddNum] = useState(true);
  const [pw, setPw] = useState("");
  const [history, setHistory] = useState<string[]>([]);

  const generate = useCallback(() => {
    let out = "";
    if (mode === "password") {
      const active = (Object.keys(SETS) as (keyof typeof SETS)[]).filter((k) => opts[k]);
      if (!active.length) return setPw("");
      let pool = active.map((k) => SETS[k]).join("");
      if (opts.noAmbig) pool = pool.replace(AMBIG, "");
      const chars = active.map((k) => { const s = opts.noAmbig ? SETS[k].replace(AMBIG, "") : SETS[k]; return s[rand(s.length)]; });
      while (chars.length < len) chars.push(pool[rand(pool.length)]);
      for (let i = chars.length - 1; i > 0; i--) { const j = rand(i + 1); [chars[i], chars[j]] = [chars[j], chars[i]]; }
      out = chars.slice(0, len).join("");
    } else {
      const ws = Array.from({ length: wordCount }, () => { const w = WORDS[rand(WORDS.length)]; return capWords ? w[0].toUpperCase() + w.slice(1) : w; });
      if (addNum) ws[rand(ws.length)] += rand(100);
      out = ws.join(sep);
    }
    setPw(out);
    setHistory((h) => [out, ...h].slice(0, 6));
  }, [mode, len, opts, wordCount, sep, capWords, addNum]);

  useEffect(generate, [generate]);

  const poolSize = mode === "password" ? (Object.keys(SETS) as (keyof typeof SETS)[]).filter((k) => opts[k]).reduce((s, k) => s + SETS[k].length, 0) : WORDS.length;
  const entropy = mode === "password" ? len * Math.log2(Math.max(poolSize, 1)) : wordCount * Math.log2(WORDS.length) + (addNum ? 6.6 : 0);
  const strength = entropy < 40 ? ["Weak", "bg-rose-500", 25] : entropy < 60 ? ["Fair", "bg-amber-500", 50] : entropy < 90 ? ["Strong", "bg-emerald-500", 75] : ["Very strong", "bg-emerald-600", 100];

  const Toggle = ({ k, label }: { k: keyof typeof opts; label: string }) => (
    <label className="flex items-center gap-2 rounded-xl border p-3 text-sm text-gray-700"><input type="checkbox" checked={opts[k]} onChange={(e) => setOpts({ ...opts, [k]: e.target.checked })} /> {label}</label>
  );

  return (
    <div className="space-y-6">
      <Panel>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <output className="min-h-14 flex-1 break-all rounded-xl border bg-gray-50 px-4 py-3 font-mono text-xl font-semibold text-gray-900 sm:text-2xl" aria-live="polite">{pw || "Select at least one character type"}</output>
          <div className="flex gap-2">
            <button className="btn-secondary p-3" onClick={generate} aria-label="Generate new password"><RefreshCw className="h-5 w-5" /></button>
            <CopyButton text={pw} className="px-5 py-3" />
          </div>
        </div>
        <div className="mt-4 flex items-center gap-3">
          <div className="h-2 flex-1 overflow-hidden rounded-full bg-gray-200"><div className={`h-full transition-all ${strength[1]}`} style={{ width: `${strength[2]}%` }} /></div>
          <span className="w-40 text-right text-sm font-medium text-gray-700">{strength[0]} · {Math.round(entropy)} bits</span>
        </div>
      </Panel>

      <Panel className="space-y-5">
        <Segmented value={mode} onChange={setMode} options={[{ value: "password", label: "Password" }, { value: "passphrase", label: "Passphrase" }]} />
        {mode === "password" ? (
          <>
            <div>
              <div className="flex justify-between"><span className="label">Length</span><span className="font-semibold tabular-nums text-gray-900">{len}</span></div>
              <input type="range" min={4} max={128} value={len} onChange={(e) => setLen(+e.target.value)} className="w-full" aria-label="Password length" />
            </div>
            <div className="grid gap-2 sm:grid-cols-3">
              <Toggle k="upper" label="Uppercase (A-Z)" />
              <Toggle k="lower" label="Lowercase (a-z)" />
              <Toggle k="digits" label="Numbers (0-9)" />
              <Toggle k="symbols" label="Symbols (!@#$)" />
              <Toggle k="noAmbig" label="Avoid look-alikes (l, 1, O, 0)" />
            </div>
          </>
        ) : (
          <>
            <div>
              <div className="flex justify-between"><span className="label">Words</span><span className="font-semibold text-gray-900">{wordCount}</span></div>
              <input type="range" min={3} max={12} value={wordCount} onChange={(e) => setWordCount(+e.target.value)} className="w-full" aria-label="Word count" />
            </div>
            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-700">
              <label className="flex items-center gap-2">Separator
                <select className="input w-auto py-2" value={sep} onChange={(e) => setSep(e.target.value)}>
                  <option value="-">- hyphen</option><option value=" ">space</option><option value=".">. dot</option><option value="_">_ underscore</option><option value="">none</option>
                </select>
              </label>
              <label className="flex items-center gap-2"><input type="checkbox" checked={capWords} onChange={(e) => setCapWords(e.target.checked)} /> Capitalize</label>
              <label className="flex items-center gap-2"><input type="checkbox" checked={addNum} onChange={(e) => setAddNum(e.target.checked)} /> Include a number</label>
            </div>
          </>
        )}
      </Panel>

      {history.length > 1 && (
        <Panel>
          <p className="mb-2 text-sm font-semibold text-gray-900">Recently generated (this page only, not saved)</p>
          <ul className="space-y-1">
            {history.slice(1).map((h, i) => (
              <li key={i} className="flex items-center justify-between gap-2 rounded-lg px-2 py-1 font-mono text-sm text-gray-600 hover:bg-gray-50">
                <span className="truncate">{h}</span><CopyButton text={h} label="" className="border-0 p-1.5" />
              </li>
            ))}
          </ul>
        </Panel>
      )}
    </div>
  );
}
