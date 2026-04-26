export function formatNumber(n: number): string {
  return n.toLocaleString("en-US");
}

export function formatMB(n: number): string {
  return (n / 1_000_000).toFixed(1);
}

/**
 * Format payback for display. When totalInvestment is 0, show "0".
 * When paybackPeriod is null (no payback in 15 yrs), show "> 15 yrs".
 * Otherwise show "X yrs".
 */
export function formatPaybackDisplay(
  paybackPeriod: number | null,
  totalInvestment: number
): string {
  if (totalInvestment === 0) return "0";
  if (paybackPeriod === null) return "> 15 yrs";
  return `${paybackPeriod} yrs`;
}
