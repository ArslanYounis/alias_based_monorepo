/**
 * Shared date helpers for DateSelect, ApplicationDetail, and other components.
 * Use date-fns in app when available; these are format/parse helpers that avoid
 * hard-coding locale in shared code.
 */

/** Format a Date or ISO string for display (YYYY-MM-DD). */
export function formatDateISO(date: Date | string | number | undefined | null): string {
  if (date == null) return "";
  const d = typeof date === "object" ? date : new Date(date);
  if (Number.isNaN(d.getTime())) return "";
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

/** Parse ISO date string to Date; returns undefined if invalid. */
export function parseISODate(value: string | undefined | null): Date | undefined {
  if (value == null || value === "") return undefined;
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? undefined : d;
}

/** Check if a string is a valid date (parsable and reasonable). */
export function isValidDateString(value: string | undefined | null): boolean {
  return parseISODate(value) !== undefined;
}
