import { Link } from "react-router-dom";
import { Activity, Loader2, TrendingDown, TrendingUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import type { AdminReportStudentDashboard } from "@/models/admin.model";

interface StudentDashboardSheetProps {
  open: boolean;
  isLoading: boolean;
  dashboard: AdminReportStudentDashboard | null;
  onOpenChange: (open: boolean) => void;
}

function statusLabel(status: string): string {
  const n = status.toLowerCase();
  if (n.includes("complete")) return "Hoàn thành";
  if (n.includes("progress")) return "Đang học";
  return "Chưa mở";
}

function statusVariant(status: string): "default" | "secondary" | "outline" {
  const n = status.toLowerCase();
  if (n.includes("complete")) return "default";
  if (n.includes("progress")) return "secondary";
  return "outline";
}

export function StudentDashboardSheet({
  open,
  isLoading,
  dashboard,
  onOpenChange,
}: StudentDashboardSheetProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="flex w-full flex-col gap-0 overflow-y-auto p-0 sm:max-w-2xl">
        {isLoading ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-3 p-8 text-slate-500">
            <Loader2 className="h-8 w-8 animate-spin" />
            <span className="text-sm font-medium">Đang tải hồ sơ...</span>
          </div>
        ) : dashboard ? (
          <>
            <SheetHeader className="primary-gradient space-y-2 px-6 py-6 text-white">
              <SheetTitle className="text-xl font-heading font-black text-white">
                {dashboard.fullName}
              </SheetTitle>
              <SheetDescription className="text-sm text-white/85">
                {dashboard.email}
              </SheetDescription>
              <div className="flex flex-wrap gap-2 pt-1">
                <Badge className="bg-white/15 text-white hover:bg-white/20">
                  Tiến độ {Math.round(dashboard.overallProgressPercent)}%
                </Badge>
                <Badge className="bg-white/15 text-white hover:bg-white/20">
                  Điểm {(dashboard.overallScorePercent / 10).toFixed(1)}/10
                </Badge>
                <Badge className="bg-white/15 text-white hover:bg-white/20">
                  Hạng #{dashboard.rank.rankInCohort} · Top{" "}
                  {Math.round(dashboard.rank.percentileInCohort)}%
                </Badge>
              </div>
            </SheetHeader>

            <div className="space-y-6 p-6">
              <section className="grid grid-cols-2 gap-3">
                <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
                  <p className="text-[10px] font-semibold uppercase text-slate-500">
                    7 ngày
                  </p>
                  <p className="mt-1 flex items-center gap-1 text-sm font-bold text-slate-900">
                    {dashboard.trend.last7Days.progressDeltaPercent >= 0 ? (
                      <TrendingUp className="h-4 w-4 text-emerald-600" />
                    ) : (
                      <TrendingDown className="h-4 w-4 text-red-500" />
                    )}
                    {dashboard.trend.last7Days.progressDeltaPercent >= 0
                      ? "+"
                      : ""}
                    {dashboard.trend.last7Days.progressDeltaPercent.toFixed(1)}%
                    tiến độ
                  </p>
                </div>
                <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
                  <p className="text-[10px] font-semibold uppercase text-slate-500">
                    Hoạt động
                  </p>
                  <p className="mt-1 flex items-center gap-1 text-sm font-bold text-slate-900">
                    <Activity className="h-4 w-4 text-blue-600" />
                    {dashboard.activity.attemptsLast7Days} lần / 7 ngày
                  </p>
                  <p className="text-[10px] text-slate-500">
                    Tổng {dashboard.activity.totalAttempts} lần làm bài
                  </p>
                </div>
              </section>

              <section className="space-y-2">
                <h3 className="text-xs font-bold uppercase tracking-wide text-slate-600">
                  Tiến độ theo chương
                </h3>
                <div className="overflow-hidden rounded-md border border-slate-200">
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="border-b border-slate-200 bg-slate-50">
                        <th className="px-3 py-2 text-left font-semibold text-slate-700">
                          Chương
                        </th>
                        <th className="px-3 py-2 text-center font-semibold text-slate-700">
                          Trạng thái
                        </th>
                        <th className="px-3 py-2 text-center font-semibold text-slate-700">
                          Tiến độ
                        </th>
                        <th className="px-3 py-2 text-center font-semibold text-slate-700">
                          Điểm
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {dashboard.chapters.map((ch) => (
                        <tr
                          key={ch.unitNumber}
                          className="border-b border-slate-100 last:border-b-0"
                        >
                          <td className="px-3 py-2 text-slate-800">
                            {ch.unitNumber}. {ch.title}
                          </td>
                          <td className="px-3 py-2 text-center">
                            <Badge
                              variant={statusVariant(ch.status)}
                              className="text-[10px]"
                            >
                              {statusLabel(ch.status)}
                            </Badge>
                          </td>
                          <td className="px-3 py-2 text-center font-semibold tabular-nums">
                            {Math.round(ch.progressPercent)}%
                          </td>
                          <td className="px-3 py-2 text-center font-semibold tabular-nums">
                            {(ch.scorePercent / 10).toFixed(1)}/10
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>

              {dashboard.explain.length > 0 ? (
                <section className="space-y-2">
                  <h3 className="text-xs font-bold uppercase tracking-wide text-slate-600">
                    Ghi chú
                  </h3>
                  <ul className="list-disc space-y-1 pl-4 text-xs text-slate-600">
                    {dashboard.explain.map((line, i) => (
                      <li key={i}>{line}</li>
                    ))}
                  </ul>
                </section>
              ) : null}

              <Button className="w-full font-bold" asChild>
                <Link to={`/admin/students/${dashboard.userId}/evaluation`}>
                  Xem đánh giá Tham gia & Cải thiện
                </Link>
              </Button>
            </div>
          </>
        ) : (
          <div className="p-8 text-center text-sm text-slate-500">
            Không có dữ liệu học viên.
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
