import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { AdminReportDailyActiveUser } from "@/models/admin.model";

interface DashboardDailyActiveChartProps {
  points: AdminReportDailyActiveUser[];
  /** embedded = nằm trong card chung với KPI (không bọc Card riêng) */
  embedded?: boolean;
  className?: string;
  chartHeight?: number;
}

function formatChartDate(iso: string): string {
  const [, m, d] = iso.split("-");
  return `${d}/${m}`;
}

function DailyActiveChartBody({
  data,
  chartHeight,
}: {
  data: { date: string; activeStudents: number }[];
  chartHeight: number;
}) {
  if (data.length === 0) {
    return (
      <p className="py-12 text-center text-sm text-slate-500">Chưa có dữ liệu.</p>
    );
  }

  return (
    <div
      className="w-full min-w-0"
      style={{ minHeight: chartHeight, height: chartHeight }}
    >
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data}
          margin={{ top: 8, right: 12, left: -12, bottom: 0 }}
        >
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="#e2e8f0"
            vertical={false}
          />
          <XAxis
            dataKey="date"
            tick={{ fontSize: 10, fill: "#64748b" }}
            axisLine={{ stroke: "#e2e8f0" }}
            tickLine={false}
            interval="preserveStartEnd"
          />
          <YAxis
            allowDecimals={false}
            tick={{ fontSize: 10, fill: "#64748b" }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip
            contentStyle={{
              fontSize: 12,
              borderRadius: 6,
              border: "1px solid #e2e8f0",
            }}
            formatter={(value) => [
              `${Number(value ?? 0)} học viên`,
              "Hoạt động",
            ]}
          />
          <Line
            type="monotone"
            dataKey="activeStudents"
            stroke="#1e3a6e"
            strokeWidth={2}
            dot={{ r: 3, fill: "#1e3a6e" }}
            activeDot={{ r: 5 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export function DashboardDailyActiveChart({
  points,
  embedded = false,
  className,
  chartHeight = 220,
}: DashboardDailyActiveChartProps) {
  const data = points.map((p) => ({
    date: formatChartDate(p.date),
    activeStudents: p.activeStudents,
  }));

  const title = (
    <h3 className="text-sm font-bold text-slate-900">
      Học viên hoạt động theo ngày
    </h3>
  );

  if (embedded) {
    return (
      <div className={cn("flex min-w-0 flex-1 flex-col", className)}>
        <div className="border-b border-slate-100 bg-slate-50 px-5 py-3.5">
          {title}
        </div>
        <div className="p-4">
          <DailyActiveChartBody data={data} chartHeight={chartHeight} />
        </div>
      </div>
    );
  }

  return (
    <Card
      className={cn(
        "border border-slate-200 bg-white shadow-sm",
        className,
      )}
    >
      <CardHeader className="border-b border-slate-100 bg-slate-50 px-5 py-4">
        <CardTitle className="text-sm font-bold text-slate-900">
          Học viên hoạt động theo ngày
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <DailyActiveChartBody data={data} chartHeight={chartHeight} />
      </CardContent>
    </Card>
  );
}
