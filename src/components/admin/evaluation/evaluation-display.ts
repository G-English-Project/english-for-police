import type { TrendDirection } from "@/models/evaluation.model";

export function formatDeltaScore(delta: number | null): string {
  if (delta === null) return "—";
  const prefix = delta > 0 ? "+" : "";
  return `${prefix}${delta.toFixed(2)}`;
}

export function deltaScoreClassName(delta: number | null): string {
  if (delta === null) return "text-slate-500";
  if (delta > 0) return "text-emerald-600";
  if (delta < 0) return "text-red-600";
  return "text-slate-600";
}

export function trendLabel(direction: TrendDirection): string {
  switch (direction) {
    case "UP":
      return "Tăng";
    case "DOWN":
      return "Giảm";
    case "FLAT":
      return "Ổn định";
    default:
      return "Chưa đủ dữ liệu";
  }
}

export function trendBadgeClass(direction: TrendDirection): string {
  switch (direction) {
    case "UP":
      return "bg-emerald-50 text-emerald-700 border-emerald-200";
    case "DOWN":
      return "bg-red-50 text-red-700 border-red-200";
    case "FLAT":
      return "bg-slate-50 text-slate-700 border-slate-200";
    default:
      return "bg-amber-50 text-amber-800 border-amber-200";
  }
}

export function formatScore(score: number | null): string {
  if (score === null) return "—";
  return score.toFixed(2);
}
