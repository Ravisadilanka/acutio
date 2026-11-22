"use client";

import { useMemo, useState } from "react";
import { CopyButton, Panel } from "@/components/ui/kit";

const sample =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkFjdXRpbyBVc2VyIiwiaWF0IjoxNzAwMDAwMDAwLCJleHAiOjQxMDI0NDQ4MDB9.signature";

function b64url(s: string) {
  let b = s.replace(/-/g, "+").replace(/_/g, "/");
  while (b.length % 4) b += "=";
  const bin = atob(b);
  return new TextDecoder().decode(Uint8Array.from(bin, (c) => c.charCodeAt(0)));
}

export default function Client() {
  const [token, setToken] = useState(sample);

  const r = useMemo(() => {
    const parts = token.trim().split(".");
    if (parts.length < 2) return { err: "A JWT has three parts separated by dots." };
    try {
      const header = JSON.parse(b64url(parts[0]));
      const payload = JSON.parse(b64url(parts[1]));
      return { header, payload, sig: parts[2] ?? "" };
    } catch {
      return { err: "Could not decode this token. Check that it's a valid JWT." };
    }
  }, [token]);

  const time = (k: string) => {
    const v = r.payload?.[k];
    return typeof v === "number" ? new Date(v * 1000).toLocaleString() : null;
  };
  const exp = r.payload?.exp;
  const expired = typeof exp === "number" && exp * 1000 < Date.now();

  return (
    <div className="space-y-4">
      <div>
        <label className="label">JSON Web Token</label>
        <textarea className="textarea min-h-28 break-all" value={token} onChange={(e) => setToken(e.target.value)} spellCheck={false} />
        <p className="mt-1 text-xs text-gray-500">Decoded locally — your token is never sent anywhere.</p>
      </div>
      {r.err ? (
        <p className="rounded-xl bg-rose-500/10 px-4 py-3 text-sm text-rose-600">{r.err}</p>
      ) : (
        <>
          {typeof exp === "number" && (
            <p className={`rounded-xl px-4 py-3 text-sm font-medium ${expired ? "bg-rose-500/10 text-rose-600" : "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400"}`}>
              {expired ? `Expired on ${time("exp")}` : `Valid until ${time("exp")}`}
            </p>
          )}
          <div className="grid gap-4 lg:grid-cols-2">
            {[["Header", r.header], ["Payload", r.payload]].map(([name, obj]) => {
              const s = JSON.stringify(obj, null, 2);
              return (
                <Panel key={name as string}>
                  <div className="mb-2 flex items-center justify-between"><p className="font-semibold text-gray-900">{name as string}</p><CopyButton text={s} label="" /></div>
                  <pre className="overflow-x-auto rounded-xl bg-gray-50 p-4 font-mono text-sm text-gray-800">{s}</pre>
                </Panel>
              );
            })}
          </div>
          <Panel className="text-sm">
            <p className="mb-2 font-semibold text-gray-900">Standard claims</p>
            <dl className="grid gap-2 sm:grid-cols-2">
              {["iat", "nbf", "exp"].map((k) => time(k) && (
                <div key={k} className="flex justify-between gap-2"><dt className="text-gray-500">{k === "iat" ? "Issued at" : k === "nbf" ? "Not before" : "Expires"}</dt><dd className="text-gray-900">{time(k)}</dd></div>
              ))}
              {["iss", "sub", "aud"].map((k) => r.payload?.[k] !== undefined && (
                <div key={k} className="flex justify-between gap-2"><dt className="text-gray-500">{k}</dt><dd className="truncate text-gray-900">{String(r.payload[k])}</dd></div>
              ))}
            </dl>
          </Panel>
        </>
      )}
    </div>
  );
}
