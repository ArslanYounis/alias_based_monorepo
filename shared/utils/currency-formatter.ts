/**
 * Shared currency formatting for CurrencyInput and payment forms.
 * Used for display and amount-in-words (apps can replace with locale/API).
 */

export type CurrencyCode = "AED" | "USD" | "EUR" | "GBP" | "SAR" | "QAR" | "OMR" | "KWD" | "BHD";

const SYMBOLS: Record<CurrencyCode, string> = {
  AED: "د.إ",
  USD: "$",
  EUR: "€",
  GBP: "£",
  SAR: "﷼",
  QAR: "﷼",
  OMR: "﷼",
  KWD: "د.ك",
  BHD: "د.ب",
};

/** Format number as currency string with symbol (no locale). */
export function formatCurrency(
  value: number | string,
  currency: CurrencyCode = "AED",
  decimals = 2
): string {
  const n = typeof value === "string" ? parseFloat(value) : value;
  if (Number.isNaN(n)) return "";
  const symbol = SYMBOLS[currency] ?? currency;
  const fixed = n.toFixed(decimals);
  return `${symbol} ${fixed}`;
}

/** Parse string to number for currency input (strip non-numeric). */
export function parseCurrencyInput(raw: string): string {
  const cleaned = raw.replace(/[^\d.]/g, "");
  const parts = cleaned.split(".");
  if (parts.length <= 1) return cleaned;
  return parts[0] + "." + parts.slice(1).join("").slice(0, 2);
}

/** Stub for amount in words — apps can replace with API or locale library. */
export function amountInWords(_value: number | string, _language?: "en" | "ar"): string {
  return "";
}
