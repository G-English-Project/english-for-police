import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Loader2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { effectiveScore } from "@/models/evaluation.model";
import type { UnitImprovementDetailResponse } from "@/models/evaluation.model";
import {
  deltaScoreClassName,
  formatDeltaScore,
  formatScore,
  trendBadgeClass,
  trendLabel,
} from "./evaluation-display";
import { Badge } from "@/components/ui/badge";

interface UnitImprovementDetailProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  unitDetail: UnitImprovementDetailResponse | null;
  isLoading: boolean;
}

export function UnitImprovementDetail({
  open,
  onOpenChange,
  unitDetail,
  isLoading,
}: UnitImprovementDetailProps) {
  const summary = unitDetail?.summary;
  const chartData =
    unitDetail?.attemptScores.map((p) => ({
      submittedAt: new Date(p.submittedAt).toLocaleDateString("vi-VN", {
        day: "2-digit",
        month: "2-digit",
      }),
      score: effectiveScore(p),
      rawSubmittedAt: p.submittedAt,
    })) ?? [];

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full overflow-y-auto sm:max-w-lg">
        <SheetHeader>
          <SheetTitle className="text-left">
            {summary
              ? `Chương ${summary.unitNumber}${summary.unitTitle ? ` — ${summary.unitTitle}` : ""}`
              : "Chi tiết cải thiện"}
          </SheetTitle>
        </SheetHeader>

        {isLoading ? (
          <div className="flex h-40 items-center justify-center text-slate-500">
            <Loader2 className="h-6 w-6 animate-spin" />
          </div>
        ) : summary ? (
          <div className="mt-4 space-y-4">
            <div className="flex flex-wrap gap-2">
              <Badge variant="outline" className="text-xs">
                {summary.attemptCount} lần nộp
              </Badge>
              <Badge
                variant="outline"
                className={`text-xs font-bold ${trendBadgeClass(summary.trendDirection)}`}
              >
                {trendLabel(summary.trendDirection)}
              </Badge>
              <span
                className={`text-sm font-bold ${deltaScoreClassName(summary.deltaScore)}`}
              >
                Δ {formatDeltaScore(summary.deltaScore)}
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2 text-center text-xs">
              <div className="rounded border bg-slate-50 p-2">
                <p className="text-slate-500">Đầu</p>
                <p className="font-bold">{formatScore(summary.firstScore)}</p>
              </div>
              <div className="rounded border bg-slate-50 p-2">
                <p className="text-slate-500">Cuối</p>
                <p className="font-bold">{formatScore(summary.lastScore)}</p>
              </div>
              <div className="rounded border bg-slate-50 p-2">
                <p className="text-slate-500">Cao</p>
                <p className="font-bold">{formatScore(summary.bestScore)}</p>
              </div>
            </div>

            {chartData.length === 0 ? (
              <p className="text-center text-sm text-slate-500">
                Chưa có lần nộp bài trong kỳ để vẽ biểu đồ.
              </p>
            ) : (
              <div className="h-56 w-full min-w-0">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="submittedAt" tick={{ fontSize: 10 }} />
                    <YAxis domain={[0, 100]} tick={{ fontSize: 10 }} />
                    <Tooltip
                      formatter={(value) => [
                        typeof value === "number"
                          ? value.toFixed(2)
                          : String(value ?? ""),
                        "Điểm",
                      ]}
                    />
                    <Line
                      type="monotone"
                      dataKey="score"
                      name="Điểm"
                      stroke="#1e3a6e"
                      strokeWidth={2}
                      dot={{ r: 4 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>
        ) : (
          <p className="mt-4 text-sm text-slate-500">Không có dữ liệu chi tiết.</p>
        )}

        <Button
          type="button"
          variant="outline"
          size="sm"
          className="mt-6"
          onClick={() => onOpenChange(false)}
        >
          <X className="mr-1 h-4 w-4" />
          Đóng
        </Button>
      </SheetContent>
    </Sheet>
  );
}
