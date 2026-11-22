/** Unicode "fancy font" transforms (Mathematical Alphanumeric Symbols etc.). */

const A = 65, a = 97, Z0 = 48;

/** Map A–Z / a–z / 0–9 to consecutive code points, with per-letter exceptions. */
function alpha(upper: number, lower: number | null, digit: number | null = null, exceptions: Record<string, string> = {}) {
  return (s: string) =>
    [...s]
      .map((ch) => {
        if (exceptions[ch]) return exceptions[ch];
        const c = ch.codePointAt(0)!;
        if (c >= A && c <= A + 25) return String.fromCodePoint(upper + c - A);
        if (c >= a && c <= a + 25) return lower === null ? String.fromCodePoint(upper + c - a) : String.fromCodePoint(lower + c - a);
        if (digit !== null && c >= Z0 && c <= Z0 + 9) return String.fromCodePoint(digit + c - Z0);
        return ch;
      })
      .join("");
}

const mapChars = (from: string, to: string[]) => {
  const m = new Map([...from].map((c, i) => [c, to[i]]));
  return (s: string) => [...s].map((c) => m.get(c) ?? c).join("");
};

const combine = (mark: string) => (s: string) => [...s].map((c) => (c === " " ? c : c + mark)).join("");

const SMALL_CAPS = mapChars("abcdefghijklmnopqrstuvwxyz", [..."ᴀʙᴄᴅᴇꜰɢʜɪᴊᴋʟᴍɴᴏᴘǫʀsᴛᴜᴠᴡxʏᴢ"]);
const UPSIDE = (() => {
  const m = mapChars("abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789.,!?'\"()[]{}<>_&", [..."ɐqɔpǝɟƃɥᴉɾʞlɯuodbɹsʇnʌʍxʎz∀ᗺƆᗡƎℲ⅁HIſꓘ˥WNOԀῸᴚS⊥∩ΛMX⅄Z0ƖᄅƐㄣϛ9ㄥ86˙'¡¿,„)(][}{><‾⅋"]);
  return (s: string) => [...m(s)].reverse().join("");
})();

export interface FancyStyle {
  name: string;
  fn: (s: string) => string;
}

export const styles: FancyStyle[] = [
  { name: "Bold", fn: alpha(0x1d400, 0x1d41a, 0x1d7ce) },
  { name: "Italic", fn: alpha(0x1d434, 0x1d44e, null, { h: "ℎ" }) },
  { name: "Bold Italic", fn: alpha(0x1d468, 0x1d482) },
  { name: "Script", fn: alpha(0x1d49c, 0x1d4b6, null, { B: "ℬ", E: "ℰ", F: "ℱ", H: "ℋ", I: "ℐ", L: "ℒ", M: "ℳ", R: "ℛ", e: "ℯ", g: "ℊ", o: "ℴ" }) },
  { name: "Bold Script", fn: alpha(0x1d4d0, 0x1d4ea) },
  { name: "Gothic (Fraktur)", fn: alpha(0x1d504, 0x1d51e, null, { C: "ℭ", H: "ℌ", I: "ℑ", R: "ℜ", Z: "ℨ" }) },
  { name: "Bold Gothic", fn: alpha(0x1d56c, 0x1d586) },
  { name: "Double-struck", fn: alpha(0x1d538, 0x1d552, 0x1d7d8, { C: "ℂ", H: "ℍ", N: "ℕ", P: "ℙ", Q: "ℚ", R: "ℝ", Z: "ℤ" }) },
  { name: "Sans", fn: alpha(0x1d5a0, 0x1d5ba, 0x1d7e2) },
  { name: "Sans Bold", fn: alpha(0x1d5d4, 0x1d5ee, 0x1d7ec) },
  { name: "Sans Italic", fn: alpha(0x1d608, 0x1d622) },
  { name: "Sans Bold Italic", fn: alpha(0x1d63c, 0x1d656) },
  { name: "Monospace", fn: alpha(0x1d670, 0x1d68a, 0x1d7f6) },
  { name: "Fullwidth", fn: (s) => alpha(0xff21, 0xff41, 0xff10)(s).replace(/ /g, "　") },
  { name: "Circled", fn: alpha(0x24b6, 0x24d0, null, { "0": "⓪", "1": "①", "2": "②", "3": "③", "4": "④", "5": "⑤", "6": "⑥", "7": "⑦", "8": "⑧", "9": "⑨" }) },
  { name: "Negative Circled", fn: alpha(0x1f150, null) },
  { name: "Squared", fn: alpha(0x1f130, null) },
  { name: "Negative Squared", fn: alpha(0x1f170, null) },
  { name: "Small Caps", fn: (s) => SMALL_CAPS(s.toLowerCase()) },
  { name: "Upside Down", fn: UPSIDE },
  { name: "Strikethrough", fn: combine("̶") },
  { name: "Underline", fn: combine("̲") },
  { name: "Slash", fn: combine("̸") },
  { name: "Wavy", fn: combine("̰") },
  { name: "Spaced", fn: (s) => [...s].join(" ") },
];

export const decorations: [string, string][] = [
  ["★彡 ", " 彡★"],
  ["꧁༺ ", " ༻꧂"],
  ["•°¯`•• ", " ••´¯°•"],
  ["(っ◔◡◔)っ ♥ ", " ♥"],
  ["▄︻デ ", " ══━一"],
  ["✿ ", " ✿"],
  ["【", "】"],
  ["『", "』"],
  ["⚡ ", " ⚡"],
  ["♛ ", " ♛"],
];
