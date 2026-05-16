import {
  Bar,
  BarChart,
  CartesianGrid,
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

function DistributionChart({
  title,
  buckets,
  barColor,
}: {
  title: string;
  buckets: AdminReportDistributionBucket[];
  barColor: string;
}) {
  const data = buckets.map((b) => ({
    label: b.label,
    count: b.count,
  }));

  return (
    <Card className="border border-slate-200 bg-white shadow-sm">
      <CardHeader className="border-b border-slate-100 bg-slate-50 px-5 py-4">
        <CardTitle className="text-sm font-bold text-slate-900">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        {data.length === 0 ? (
          <p className="py-8 text-center text-sm text-slate-500">
            Chưa có dữ liệu.
          </p>
        ) : (
          <div className="h-[200px] w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={data}
                margin={{ top: 4, right: 8, left: -16, bottom: 0 }}
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
                    "Số lượng",
                  ]}
                />
                <Bar
                  dataKey="count"
                  fill={barColor}
                  radius={[4, 4, 0, 0]}
                  maxBarSize={48}
                />
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
      <DistributionChart
        title="Phân bố tiến độ"
        buckets={progressBuckets}
        barColor="#2563eb"
      />
      <DistributionChart
        title="Phân bố điểm"
        buckets={scoreBuckets}
        barColor="#059669"
      />
    </div>
  );
}
