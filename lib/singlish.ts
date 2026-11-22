/**
 * Phonetic Singlish → Sinhala Unicode transliteration.
 * Greedy longest-match: consonant, then optional vowel sign; a bare consonant
 * gets hal (්). "Cr"/"Cy" + vowel produce rakaransaya (්‍ර) / yansaya (්‍ය).
 */

const ZWJ = "‍";
const HAL = "්";

// Independent vowels (start of word / after another vowel)
const VOWELS: [string, string][] = [
  ["aee", "ඈ"], ["aa", "ආ"], ["Aa", "ඈ"], ["AA", "ඈ"], ["ae", "ඇ"], ["A", "ඇ"], ["a", "අ"],
  ["ii", "ඊ"], ["ee", "ඒ"], ["i", "ඉ"],
  ["uu", "ඌ"], ["oo", "ඕ"], ["u", "උ"],
  ["ai", "ඓ"], ["e", "එ"],
  ["au", "ඖ"], ["o", "ඔ"],
];

// Vowel signs (pili) after a consonant. "a" = inherent vowel, no sign.
const SIGNS: [string, string][] = [
  ["aee", "ෑ"], ["aa", "ා"], ["Aa", "ෑ"], ["AA", "ෑ"], ["ae", "ැ"], ["A", "ැ"], ["a", ""],
  ["ii", "ී"], ["ee", "ේ"], ["i", "ි"],
  ["uu", "ූ"], ["oo", "ෝ"], ["u", "ු"],
  ["ai", "ෛ"], ["e", "ෙ"],
  ["au", "ෞ"], ["o", "ො"],
  ["ru", "ෘ"], ["ruu", "ෲ"],
];

// Consonants — longer keys first matters; we sort by length below.
const CONS: [string, string][] = [
  ["chh", "ඡ"], ["Ch", "ඡ"], ["ch", "ච"],
  ["kh", "ඛ"], ["K", "ඛ"], ["k", "ක"],
  ["gh", "ඝ"], ["G", "ඟ"], ["g", "ග"],
  ["ng", "ඟ"], ["nG", "ඞ"],
  ["jh", "ඣ"], ["j", "ජ"],
  ["ny", "ඤ"], ["kn", "ඥ"],
  ["Th", "ථ"], ["th", "ත"], ["T", "ඨ"], ["t", "ට"],
  ["Dh", "ඪ"], ["dh", "ධ"], ["D", "ඩ"], ["d", "ද"],
  ["nd", "ඳ"], ["N", "ණ"], ["n", "න"],
  ["ph", "ඵ"], ["P", "ඵ"], ["p", "ප"], ["f", "ෆ"],
  ["bh", "භ"], ["B", "ඹ"], ["b", "බ"],
  ["m", "ම"], ["y", "ය"], ["r", "ර"], ["L", "ළ"], ["l", "ල"],
  ["v", "ව"], ["w", "ව"],
  ["Sh", "ෂ"], ["sh", "ශ"], ["S", "ෂ"], ["s", "ස"],
  ["h", "හ"],
];

const OTHER: [string, string][] = [
  ["x", "ං"], ["H", "ඃ"],
];

const byLen = <T extends [string, string]>(arr: T[]) => [...arr].sort((a, b) => b[0].length - a[0].length);
const V = byLen(VOWELS), S = byLen(SIGNS), C = byLen(CONS), O = byLen(OTHER);

const match = (table: [string, string][], s: string, i: number) => table.find(([k]) => s.startsWith(k, i));

export function singlishToSinhala(input: string): string {
  let out = "";
  let i = 0;
  while (i < input.length) {
    const c = match(C, input, i);
    if (c) {
      i += c[0].length;
      let base = c[1];
      // rakaransaya / yansaya: consonant + r|y + vowel (but not "ru" vowel sign)
      for (const [k, sinh] of [["r", "ර"], ["y", "ය"]] as const) {
        if (input[i] === k && !(k === "r" && input[i + 1] === "u") && match(S, input, i + 1) && !match(C, input, i + 1)) {
          base += HAL + ZWJ + sinh;
          i += 1;
          break;
        }
      }
      const sign = match(S, input, i);
      if (sign) {
        out += base + sign[1];
        i += sign[0].length;
      } else out += base + HAL;
      continue;
    }
    const v = match(V, input, i);
    if (v) {
      out += v[1];
      i += v[0].length;
      continue;
    }
    const o = match(O, input, i);
    if (o) {
      out += o[1];
      i += o[0].length;
      continue;
    }
    out += input[i];
    i++;
  }
  return out;
}

/** Cheat sheet rows for the UI. */
export const cheatSheet = {
  vowels: VOWELS,
  consonants: CONS,
  signs: SIGNS.filter(([k]) => k !== "a"),
  other: OTHER,
};
