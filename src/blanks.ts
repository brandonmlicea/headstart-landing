import form from "../blanks.json";

export type Blank = keyof typeof form.blanks;

export function b(key: Blank | `${string}.${number}.${string}`): string {
  const f = (form.blanks as Record<string, { ask: string; value: string }>)[key];
  if (!f) throw new Error(`blanks.json has no ${key}`);
  return f.value.trim() || `REQUIRED: ${f.ask}`;
}

const esc = (s: string) => s.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]!);

export const em = (s: string) => esc(s).replace(/\*([^*]+)\*/g, "<em>$1</em>");

export const plain = (s: string) => s.replace(/\*/g, "");

export const range = (n: number) => Array.from({ length: n }, (_, i) => i + 1);

export const words = (s: string) =>
  s
    .replace(/\*([^*]+)\*/g, (_, inner: string) => inner.split(/\s+/).map((w) => `\u0001${w}\u0002`).join(" "))
    .split(/\s+/)
    .filter(Boolean)
    .map((w) => `<span class="w"><span class="wi">${esc(w).replace(/\u0001(.*?)\u0002/g, "<em>$1</em>")}</span></span>`)
    .join(" ");
