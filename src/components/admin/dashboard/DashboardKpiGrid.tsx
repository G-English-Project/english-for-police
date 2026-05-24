import { Activity, Users, Radio } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { AdminReportOverview } from "@/models/admin.model";
import { useActiveVisitors } from "@/hooks/useActiveVisitors";

interface DashboardKpiGridProps {
  overview: AdminReportOverview;
  /** grid = 2 cột ngang; stack = xếp dọc (cạnh chart) */
  layout?: "grid" | "stack";
  /** embedded = nằm trong card chung với chart (không bọc Card riêng) */
  variant?: "card" | "embedded";
  className?: string;
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
];

function KpiMetricRow({
  label,
  value,
  icon: Icon,
  color,
  bg,
}: (typeof KPI_ITEMS)[number] & { value: string }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <div className="min-w-0">
        <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-500">
          {label}
        </p>
        <p className="mt-0.5 text-2xl font-bold leading-none tabular-nums text-slate-900">
          {value}
        </p>
      </div>
      <div
        className={cn(
          "flex h-9 w-9 shrink-0 items-center justify-center rounded-md",
          bg,
        )}
      >
        <Icon className={cn("h-4 w-4", color)} aria-hidden />
      </div>
    </div>
  );
}

function ActiveVisitorsRow() {
  const count = useActiveVisitors();
  return (
    <div className="px-4 py-3.5">
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-500">
            Đang truy cập
          </p>
          <p className="mt-0.5 text-2xl font-bold leading-none tabular-nums text-emerald-600">
            {count ?? "—"}
          </p>
        </div>
        <div className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-emerald-50">
          <Radio className="h-4 w-4 text-emerald-600" aria-hidden />
          {count !== null && (
            <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-emerald-500">
              <span className="absolute inset-0 rounded-full bg-emerald-500 animate-ping opacity-75" />
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

function KpiStackMetrics({
  overview,
  className,
}: {
  overview: AdminReportOverview;
  className?: string;
}) {
  return (
    <div className={cn("divide-y divide-slate-200/80", className)}>
      {KPI_ITEMS.map((item) => (
        <div key={item.key} className="px-4 py-3.5">
          <KpiMetricRow
            {...item}
            value={item.format(overview[item.key])}
          />
        </div>
      ))}
      <ActiveVisitorsRow />
    </div>
  );
}

export function DashboardKpiGrid({
  overview,
  layout = "grid",
  variant = "card",
  className,
}: DashboardKpiGridProps) {
  const isStack = layout === "stack";

  if (isStack && variant === "embedded") {
    return (
      <KpiStackMetrics
        overview={overview}
        className={cn("flex h-full flex-col justify-center", className)}
      />
    );
  }

  if (isStack) {
    return (
      <Card
        className={cn(
          "w-full shrink-0 border border-slate-200 bg-white shadow-sm lg:w-[220px]",
          className,
        )}
      >
        <CardContent className="p-0">
          <KpiStackMetrics overview={overview} />
        </CardContent>
      </Card>
    );
  }

  return (
    <div className={cn("grid grid-cols-2 gap-3", className)}>
      {KPI_ITEMS.map((item) => (
        <Card
          key={item.key}
          className="border border-slate-200 bg-white shadow-sm"
        >
          <CardContent className="p-4">
            <KpiMetricRow
              {...item}
              value={item.format(overview[item.key])}
            />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
