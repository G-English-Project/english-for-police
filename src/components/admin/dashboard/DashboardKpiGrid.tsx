import {
  Activity,
  AlertTriangle,
  BarChart3,
  TrendingUp,
  Users,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import type { AdminReportOverview } from "@/models/admin.model";

interface DashboardKpiGridProps {
  overview: AdminReportOverview;
}

const KPI_ITEMS = [
  {
    key: "totalStudents" as const,
    label: "Tổng học viên",
    icon: Users,
    color: "text-slate-700",
    bg: "bg-slate-100",
    format: (v: number) => String(v),
  },
  {
    key: "activeStudents7d" as const,
    label: "Hoạt động 7 ngày",
    icon: Activity,
    color: "text-blue-600",
    bg: "bg-blue-50",
    format: (v: number) => String(v),
  },
  {
    key: "avgOverallProgressPercent" as const,
    label: "Tiến độ TB",
    icon: TrendingUp,
    color: "text-emerald-600",
    bg: "bg-emerald-50",
    format: (v: number) => `${Math.round(v)}%`,
  },
  {
    key: "avgOverallScorePercent" as const,
    label: "Điểm TB",
    icon: BarChart3,
    color: "text-violet-600",
    bg: "bg-violet-50",
    format: (v: number) => `${(v / 10).toFixed(1)}/10`,
  },
  {
    key: "studentsAtRiskCount" as const,
    label: "Cần chú ý",
    icon: AlertTriangle,
    color: "text-amber-600",
    bg: "bg-amber-50",
    format: (v: number) => String(v),
  },
];

export function DashboardKpiGrid({ overview }: DashboardKpiGridProps) {
  return (
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-5">
      {KPI_ITEMS.map(({ key, label, icon: Icon, color, bg, format }) => {
        const value = overview[key];
        return (
          <Card
            key={key}
            className="border border-slate-200 bg-white shadow-sm"
          >
            <CardContent className="flex items-center justify-between gap-3 p-4">
              <div className="min-w-0">
                <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                  {label}
                </p>
                <p className="mt-1 text-xl font-bold tabular-nums text-slate-900">
                  {format(value)}
                </p>
              </div>
              <div
                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${bg}`}
              >
                <Icon className={`h-5 w-5 ${color}`} aria-hidden />
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
