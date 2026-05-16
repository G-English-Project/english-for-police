/** Format Date as yyyy-MM-dd (local calendar). */
export function formatIsoDate(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function parseIsoDate(iso: string): Date {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, m - 1, d);
}

export function defaultEvaluationPeriod(): { from: string; to: string } {
  const to = new Date();
  const from = new Date();
  from.setDate(from.getDate() - 29);
  return { from: formatIsoDate(from), to: formatIsoDate(to) };
}

export function periodPresetDays(days: number): { from: string; to: string } {
  const to = new Date();
  const from = new Date();
  from.setDate(from.getDate() - (days - 1));
  return { from: formatIsoDate(from), to: formatIsoDate(to) };
}

export function isDateInInclusiveRange(
  isoDateTime: string,
  from: string,
  to: string,
): boolean {
  const day = isoDateTime.slice(0, 10);
  return day >= from && day <= to;
}
