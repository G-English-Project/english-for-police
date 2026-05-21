import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { UnitTrackAverages } from "@/lib/admin-unit-tracks";

interface DashboardUnitTracksChartProps {
  data: UnitTrackAverages[];
  isLoading?: boolean;
  error?: string | null;
}

export function DashboardUnitTracksChart({
  data,
  isLoading,
  error,
}: DashboardUnitTracksChartProps) {
  const chartData = data.map((row) => ({
    label: row.label,
    unitNumber: row.unitNumber,
    title: row.title,
    flash: row.flashAvg,
    tools: row.toolsAvg,
    practice: row.practiceAvg,
  }));

  const chartHeight = Math.max(280, Math.min(520, data.length * 36 + 120));

  return (
    <Card className="border border-slate-200 bg-white shadow-sm">
      <CardHeader className="border-b border-slate-100 bg-slate-50 px-5 py-4">
        <CardTitle className="text-sm font-bold text-slate-900">
          Lộ trình trung bình theo chương
        </CardTitle>
        <p className="mt-1 text-xs text-slate-500">
          Mỗi chương có 3 cột: Flashcard, Công cụ và Luyện tập (% trung bình học
          viên).
        </p>
      </CardHeader>
      <CardContent className="p-4">
        {isLoading ? (
          <div className="flex h-[280px] items-center justify-center gap-2 text-sm text-slate-500">
            <Loader2 className="h-5 w-5 animate-spin" />
            Đang tính tiến độ theo chương...
          </div>
        ) : error ? (
          <p className="py-12 text-center text-sm text-red-600">{error}</p>
        ) : chartData.length === 0 ? (
          <p className="py-12 text-center text-sm text-slate-500">
            Chưa có dữ liệu chương học.
          </p>
        ) : (
          <div className="w-full min-w-0" style={{ height: chartHeight }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={chartData}
                margin={{ top: 8, right: 12, left: -8, bottom: 8 }}
                barCategoryGap="18%"
                barGap={4}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#e2e8f0"
                  vertical={false}
                />
                <XAxis
                  dataKey="label"
                  tick={{ fontSize: 10, fill: "#64748b" }}
                  axisLine={{ stroke: "#e2e8f0" }}
                  tickLine={false}
                />
                <YAxis
                  domain={[0, 100]}
                  tick={{ fontSize: 10, fill: "#64748b" }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(v) => `${v}%`}
                />
                <Tooltip
                  contentStyle={{
                    fontSize: 12,
                    borderRadius: 6,
                    border: "1px solid #e2e8f0",
                  }}
                  formatter={(value, name) => {
                    const labels: Record<string, string> = {
                      flash: "Flashcard",
                      tools: "Công cụ",
                      practice: "Luyện tập",
                    };
                    return [`${Number(value ?? 0)}%`, labels[String(name)] ?? name];
                  }}
                  labelFormatter={(_, payload) => {
                    const row = payload?.[0]?.payload as
                      | { unitNumber?: number; title?: string }
                      | undefined;
                    if (!row?.unitNumber) return "";
                    return `Chương ${row.unitNumber}${row.title ? ` — ${row.title}` : ""}`;
                  }}
                />
                <Legend
                  wrapperStyle={{ fontSize: 11 }}
                  formatter={(value) => {
                    const labels: Record<string, string> = {
                      flash: "Flashcard",
                      tools: "Công cụ",
                      practice: "Luyện tập",
                    };
                    return labels[value] ?? value;
                  }}
                />
                <Bar
                  dataKey="flash"
                  name="flash"
                  fill="#2563eb"
                  radius={[4, 4, 0, 0]}
                  maxBarSize={28}
                />
                <Bar
                  dataKey="tools"
                  name="tools"
                  fill="#7c3aed"
                  radius={[4, 4, 0, 0]}
                  maxBarSize={28}
                />
                <Bar
                  dataKey="practice"
                  name="practice"
                  fill="#059669"
                  radius={[4, 4, 0, 0]}
                  maxBarSize={28}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
