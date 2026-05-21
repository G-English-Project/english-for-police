import { DashboardDailyActiveChart } from "@/components/admin/dashboard/DashboardDailyActiveChart";
import { DashboardKpiGrid } from "@/components/admin/dashboard/DashboardKpiGrid";
import { Card } from "@/components/ui/card";
import type { AdminReportOverview } from "@/models/admin.model";

interface DashboardKpiActivityRowProps {
  overview: AdminReportOverview;
}

export function DashboardKpiActivityRow({ overview }: DashboardKpiActivityRowProps) {
  return (
    <Card className="overflow-hidden border border-slate-200 bg-white shadow-sm">
      <div className="flex flex-col lg:grid lg:grid-cols-[220px_1fr] lg:items-stretch">
        <div className="flex h-full flex-col border-b border-slate-100 bg-slate-50/70 lg:border-b-0 lg:border-r">
          <DashboardKpiGrid
            overview={overview}
            layout="stack"
            variant="embedded"
          />
        </div>
        <DashboardDailyActiveChart
          points={overview.dailyActiveUsers}
          embedded
          chartHeight={220}
        />
      </div>
    </Card>
  );
}
