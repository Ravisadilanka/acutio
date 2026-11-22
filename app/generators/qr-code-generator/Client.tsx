"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import QRCode from "qrcode";
import { Download } from "lucide-react";
import { Field, Panel, downloadText } from "@/components/ui/kit";

type Kind = "url" | "text" | "wifi" | "email" | "phone" | "sms" | "vcard";

const esc = (s: string) => s.replace(/([\\;,:"])/g, "\\$1");

export default function Client() {
  const [kind, setKind] = useState<Kind>("url");
  const [f, setF] = useState<Record<string, string>>({ url: "https://acutio.com", text: "", ssid: "", pass: "", enc: "WPA", hidden: "", email: "", subject: "", body: "", phone: "", sms: "", first: "", last: "", org: "", vphone: "", vemail: "", site: "" });
  const [fg, setFg] = useState("#111827");
  const [bg, setBg] = useState("#ffffff");
  const [size, setSize] = useState(1024);
  const [ecl, setEcl] = useState<"L" | "M" | "Q" | "H">("M");
  const canvas = useRef<HTMLCanvasElement>(null);
  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => setF({ ...f, [k]: e.target.value });

  const data = useMemo(() => {
    switch (kind) {
      case "url": return f.url.trim();
      case "text": return f.text;
      case "wifi": return f.ssid ? `WIFI:T:${f.enc};S:${esc(f.ssid)};P:${esc(f.pass)};${f.hidden ? "H:true;" : ""};` : "";
      case "email": return f.email ? `mailto:${f.email}?subject=${encodeURIComponent(f.subject)}&body=${encodeURIComponent(f.body)}` : "";
      case "phone": return f.phone ? `tel:${f.phone.replace(/\s/g, "")}` : "";
      case "sms": return f.phone ? `SMSTO:${f.phone.replace(/\s/g, "")}:${f.sms}` : "";
      case "vcard":
        return f.first || f.last
          ? ["BEGIN:VCARD", "VERSION:3.0", `N:${f.last};${f.first};;;`, `FN:${f.first} ${f.last}`.trim(), f.org && `ORG:${f.org}`, f.vphone && `TEL:${f.vphone}`, f.vemail && `EMAIL:${f.vemail}`, f.site && `URL:${f.site}`, "END:VCARD"].filter(Boolean).join("\n")
          : "";
    }
  }, [kind, f]);

  useEffect(() => {
    if (!canvas.current) return;
    if (!data) {
      canvas.current.getContext("2d")?.clearRect(0, 0, canvas.current.width, canvas.current.height);
      return;
    }
    QRCode.toCanvas(canvas.current, data, { width: 320, margin: 2, errorCorrectionLevel: ecl, color: { dark: fg, light: bg } }).catch(() => {});
  }, [data, fg, bg, ecl]);

  const downloadPng = async () => {
    const url = await QRCode.toDataURL(data, { width: size, margin: 2, errorCorrectionLevel: ecl, color: { dark: fg, light: bg } });
    const a = document.createElement("a");
    a.href = url;
    a.download = "qr-code.png";
    a.click();
  };
  const downloadSvg = async () => downloadText(await QRCode.toString(data, { type: "svg", margin: 2, errorCorrectionLevel: ecl, color: { dark: fg, light: bg } }), "qr-code.svg", "image/svg+xml");

  const tabs: [Kind, string][] = [["url", "URL"], ["text", "Text"], ["wifi", "Wi-Fi"], ["email", "Email"], ["phone", "Phone"], ["sms", "SMS"], ["vcard", "Contact"]];

  return (
    <div className="grid gap-6 lg:grid-cols-[1.3fr_1fr]">
      <div className="space-y-4">
        <div className="flex flex-wrap gap-2">
          {tabs.map(([k, l]) => <button key={k} className={`chip ${kind === k ? "chip-active" : ""}`} onClick={() => setKind(k)}>{l}</button>)}
        </div>
        <Panel className="space-y-4">
          {kind === "url" && <Field label="Website URL"><input className="input" value={f.url} onChange={set("url")} placeholder="https://example.com" /></Field>}
          {kind === "text" && <Field label="Text"><textarea className="input min-h-32" value={f.text} onChange={set("text")} /></Field>}
          {kind === "wifi" && (
            <>
              <Field label="Network name (SSID)"><input className="input" value={f.ssid} onChange={set("ssid")} /></Field>
              <Field label="Password"><input className="input" value={f.pass} onChange={set("pass")} /></Field>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Security"><select className="input" value={f.enc} onChange={set("enc")}><option value="WPA">WPA/WPA2/WPA3</option><option value="WEP">WEP</option><option value="nopass">None</option></select></Field>
                <label className="mt-7 flex items-center gap-2 text-sm text-gray-700"><input type="checkbox" checked={!!f.hidden} onChange={(e) => setF({ ...f, hidden: e.target.checked ? "1" : "" })} /> Hidden network</label>
              </div>
            </>
          )}
          {kind === "email" && (
            <>
              <Field label="Email address"><input className="input" type="email" value={f.email} onChange={set("email")} /></Field>
              <Field label="Subject"><input className="input" value={f.subject} onChange={set("subject")} /></Field>
              <Field label="Message"><textarea className="input min-h-24" value={f.body} onChange={set("body")} /></Field>
            </>
          )}
          {(kind === "phone" || kind === "sms") && <Field label="Phone number"><input className="input" type="tel" value={f.phone} onChange={set("phone")} placeholder="+94 77 123 4567" /></Field>}
          {kind === "sms" && <Field label="Message"><textarea className="input min-h-24" value={f.sms} onChange={set("sms")} /></Field>}
          {kind === "vcard" && (
            <div className="grid gap-3 sm:grid-cols-2">
              <Field label="First name"><input className="input" value={f.first} onChange={set("first")} /></Field>
              <Field label="Last name"><input className="input" value={f.last} onChange={set("last")} /></Field>
              <Field label="Company"><input className="input" value={f.org} onChange={set("org")} /></Field>
              <Field label="Phone"><input className="input" value={f.vphone} onChange={set("vphone")} /></Field>
              <Field label="Email"><input className="input" value={f.vemail} onChange={set("vemail")} /></Field>
              <Field label="Website"><input className="input" value={f.site} onChange={set("site")} /></Field>
            </div>
          )}
        </Panel>
        <Panel className="grid gap-4 sm:grid-cols-2">
          <Field label="Foreground"><input type="color" className="h-11 w-full rounded-xl border bg-surface p-1" value={fg} onChange={(e) => setFg(e.target.value)} /></Field>
          <Field label="Background"><input type="color" className="h-11 w-full rounded-xl border bg-surface p-1" value={bg} onChange={(e) => setBg(e.target.value)} /></Field>
          <Field label="Error correction"><select className="input" value={ecl} onChange={(e) => setEcl(e.target.value as typeof ecl)}><option value="L">Low (7%)</option><option value="M">Medium (15%)</option><option value="Q">Quartile (25%)</option><option value="H">High (30%)</option></select></Field>
          <Field label="PNG size"><select className="input" value={size} onChange={(e) => setSize(+e.target.value)}>{[256, 512, 1024, 2048, 4096].map((s) => <option key={s} value={s}>{s} × {s}px</option>)}</select></Field>
        </Panel>
      </div>
      <Panel className="flex flex-col items-center self-start lg:sticky lg:top-24">
        <div className="rounded-2xl border bg-white p-3">
          <canvas ref={canvas} width={320} height={320} className="h-64 w-64 sm:h-72 sm:w-72" aria-label="QR code preview" />
        </div>
        {!data && <p className="mt-3 text-sm text-gray-500">Fill in the details to create your QR code.</p>}
        <div className="mt-5 grid w-full grid-cols-2 gap-2">
          <button className="btn-primary" disabled={!data} onClick={downloadPng}><Download className="h-4 w-4" /> PNG</button>
          <button className="btn-secondary" disabled={!data} onClick={downloadSvg}><Download className="h-4 w-4" /> SVG</button>
        </div>
        <p className="mt-3 text-center text-xs text-gray-500">Static QR code — works forever, no tracking.</p>
      </Panel>
    </div>
  );
}
