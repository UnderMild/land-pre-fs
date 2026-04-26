export function parseCommaNumber(s: string): number {
  const cleaned = s.replace(/,/g, "");
  const num = Number(cleaned);
  return Number.isNaN(num) ? 0 : num;
}
