import {
  Bar,
  BarChart,
  CartesianGrid,
  LabelList,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { AdminReportDistributionBucket } from "@/models/admin.model";

interface DashboardDistributionChartsProps {
  progressBuckets: AdminReportDistributionBucket[];
  scoreBuckets: AdminReportDistributionBucket[];
}

function DistributionBarChart({
  title,
  subtitle,
  buckets,
  barColor,
}: {
  title: string;
  subtitle: string;
  buckets: AdminReportDistributionBucket[];
  barColor: string;
}) {
  const data = buckets.map((b) => ({
    label: b.label,
    count: b.count,
  }));
  const maxCount = Math.max(1, ...data.map((d) => d.count));

  return (
    <Card className="border border-slate-200 bg-white shadow-sm">
      <CardHeader className="border-b border-slate-100 bg-slate-50 px-5 py-4">
        <CardTitle className="text-sm font-bold text-slate-900">{title}</CardTitle>
        <p className="mt-1 text-xs text-slate-500">{subtitle}</p>
      </CardHeader>
      <CardContent className="p-4">
        {data.length === 0 ? (
          <p className="py-10 text-center text-sm text-slate-500">
            Chưa có dữ liệu.
          </p>
        ) : (
          <div className="h-[240px] w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={data}
                margin={{ top: 20, right: 12, left: 0, bottom: 4 }}
                barCategoryGap="20%"
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#e2e8f0"
                  vertical={false}
                />
                <XAxis
                  dataKey="label"
                  tick={{ fontSize: 11, fill: "#64748b" }}
                  axisLine={{ stroke: "#e2e8f0" }}
                  tickLine={false}
                  label={{
                    value: "Khoảng %",
                    position: "insideBottom",
                    offset: -2,
                    fontSize: 10,
                    fill: "#94a3b8",
                  }}
                />
                <YAxis
                  allowDecimals={false}
                  domain={[0, Math.max(maxCount, 1)]}
                  tick={{ fontSize: 10, fill: "#64748b" }}
                  axisLine={false}
                  tickLine={false}
                  label={{
                    value: "Số học viên",
                    angle: -90,
                    position: "insideLeft",
                    fontSize: 10,
                    fill: "#94a3b8",
                  }}
                />
                <Tooltip
                  cursor={{ fill: "rgba(148, 163, 184, 0.12)" }}
                  contentStyle={{
                    fontSize: 12,
                    borderRadius: 8,
                    border: "1px solid #e2e8f0",
                  }}
                  formatter={(value) => [
                    `${Number(value ?? 0)} học viên`,
                    "Số lượng",
                  ]}
                  labelFormatter={(label) => `Khoảng ${label}%`}
                />
                <Bar
                  dataKey="count"
                  name="Học viên"
                  fill={barColor}
                  radius={[6, 6, 0, 0]}
                  maxBarSize={56}
                >
                  <LabelList
                    dataKey="count"
                    position="top"
                    className="fill-slate-600 text-[10px] font-bold"
                  />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export function DashboardDistributionCharts({
  progressBuckets,
  scoreBuckets,
}: DashboardDistributionChartsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <DistributionBarChart
        title="Phân bố tiến độ"
        subtitle="Số học viên theo khoảng % hoàn thành chương"
        buckets={progressBuckets}
        barColor="#2563eb"
      />
      <DistributionBarChart
        title="Phân bố điểm"
        subtitle="Số học viên theo khoảng % điểm trung bình"
        buckets={scoreBuckets}
        barColor="#059669"
      />
    </div>
  );
}
