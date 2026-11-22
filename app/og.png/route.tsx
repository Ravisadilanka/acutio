import { ImageResponse } from "next/og";
import { categories, tools } from "@/lib/tools";

export const dynamic = "force-static";

/** Social share image (1200×630) rendered at build time → /og.png */
export function GET() {
  const count = Math.floor(tools.length / 5) * 5;
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", padding: 72, background: "#0a0d14", color: "#fff", fontFamily: "sans-serif" }}>
        <div style={{ display: "flex", position: "absolute", top: -260, left: 150, width: 900, height: 500, borderRadius: 999, background: "linear-gradient(90deg,#6366f1,#d946ef,#ec4899)", opacity: 0.35 }} />
        <div style={{ display: "flex", alignItems: "center", gap: 20, fontSize: 44, fontWeight: 800 }}>
          <div style={{ width: 72, height: 72, borderRadius: 20, display: "flex", alignItems: "center", justifyContent: "center", background: "linear-gradient(135deg,#6366f1,#a855f7,#ec4899)", fontSize: 48 }}>A</div>
          Acutio
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 80, fontWeight: 800, lineHeight: 1.05, letterSpacing: -2 }}>{`${count}+ free online tools.`}</div>
          <div style={{ fontSize: 80, fontWeight: 800, lineHeight: 1.05, letterSpacing: -2, color: "#c4b5fd" }}>Private. No sign-up.</div>
        </div>
        <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
          {categories.map((c) => (
            <div key={c.id} style={{ display: "flex", padding: "10px 20px", borderRadius: 999, background: "rgba(255,255,255,0.12)", fontSize: 26 }}>
              {c.name}
            </div>
          ))}
        </div>
      </div>
    ),
    { width: 1200, height: 630 },
  );
}
