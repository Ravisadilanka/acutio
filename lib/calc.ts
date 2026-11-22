/**
 * Safe arithmetic expression evaluator (no eval). Recursive descent:
 *   expr   := term (('+'|'-') term)*
 *   term   := factor (('*'|'/'|implicit) factor)*
 *   unary  := ('-'|'+') unary | power        (so -2^2 = -4)
 *   power  := postfix ('^' unary)?            (right-associative)
 *   postfix:= primary ('!' | '%')*
 *   primary:= number | const | func '(' expr ')' | '(' expr ')'
 */

export type AngleMode = "deg" | "rad";

const FUNCS: Record<string, (x: number, deg: boolean) => number> = {
  sin: (x, d) => Math.sin(d ? (x * Math.PI) / 180 : x),
  cos: (x, d) => Math.cos(d ? (x * Math.PI) / 180 : x),
  tan: (x, d) => Math.tan(d ? (x * Math.PI) / 180 : x),
  asin: (x, d) => (d ? (Math.asin(x) * 180) / Math.PI : Math.asin(x)),
  acos: (x, d) => (d ? (Math.acos(x) * 180) / Math.PI : Math.acos(x)),
  atan: (x, d) => (d ? (Math.atan(x) * 180) / Math.PI : Math.atan(x)),
  sqrt: (x) => Math.sqrt(x),
  cbrt: (x) => Math.cbrt(x),
  log: (x) => Math.log10(x),
  ln: (x) => Math.log(x),
  abs: (x) => Math.abs(x),
  exp: (x) => Math.exp(x),
};

function factorial(n: number) {
  if (n < 0 || !Number.isInteger(n)) return NaN;
  if (n > 170) return Infinity;
  let r = 1;
  for (let i = 2; i <= n; i++) r *= i;
  return r;
}

/** Fix float noise like 0.1+0.2 = 0.30000000000000004 */
export const tidy = (n: number) => (Number.isFinite(n) ? parseFloat(n.toPrecision(14)) : n);

export function evaluate(input: string, mode: AngleMode = "deg", ans = 0): number {
  const src = input
    .replace(/×/g, "*")
    .replace(/÷/g, "/")
    .replace(/−/g, "-")
    .replace(/π/g, "pi")
    .replace(/√/g, "sqrt")
    .replace(/\s+/g, "");
  let i = 0;
  const deg = mode === "deg";
  const peek = () => src[i];
  const fail = (): never => {
    throw new Error("Invalid expression");
  };

  function expr(): number {
    let v = term();
    while (peek() === "+" || peek() === "-") v = src[i++] === "+" ? v + term() : v - term();
    return v;
  }
  function term(): number {
    let v = factor();
    for (;;) {
      const c = peek();
      if (c === "*" || c === "/") {
        i++;
        const r = factor();
        v = c === "*" ? v * r : v / r;
      } else if (c && (c === "(" || /[a-zπ]/i.test(c) || (/[\d.]/.test(c) && /[)!%a-z]/i.test(src[i - 1] ?? "")))) {
        v *= factor(); // implicit multiplication: 2(3), 2pi, (1)(2)
      } else return v;
    }
  }
  function factor(): number {
    return unary();
  }
  function unary(): number {
    if (peek() === "-") { i++; return -unary(); }
    if (peek() === "+") { i++; return unary(); }
    return power();
  }
  function power(): number {
    const b = postfix();
    if (peek() === "^") {
      i++;
      return Math.pow(b, unary()); // right-associative; allows 2^-1
    }
    return b;
  }
  function postfix(): number {
    let v = primary();
    while (peek() === "!" || peek() === "%") v = src[i++] === "!" ? factorial(v) : v / 100;
    return v;
  }
  function primary(): number {
    const c = peek();
    if (c === "(") {
      i++;
      const v = expr();
      if (peek() === ")") i++; // tolerate a missing closing bracket at the end
      return v;
    }
    const num = /^(\d+\.?\d*|\.\d+)(e[+-]?\d+)?/i.exec(src.slice(i));
    if (num) {
      i += num[0].length;
      return parseFloat(num[0]);
    }
    const id = /^[a-z]+/i.exec(src.slice(i));
    if (id) {
      const name = id[0].toLowerCase();
      i += id[0].length;
      if (name === "pi") return Math.PI;
      if (name === "e") return Math.E;
      if (name === "ans") return ans;
      const f = FUNCS[name];
      if (!f) fail();
      return f(primary(), deg);
    }
    return fail();
  }

  if (!src) return 0;
  const v = expr();
  if (i < src.length) fail();
  return tidy(v);
}
