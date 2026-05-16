import { useEffect, useMemo, useState } from "react";
import { Activity, AlertTriangle, RefreshCw } from "lucide-react";
import { AdminPageLayout } from "@/components/admin/AdminPageLayout";
import { EvaluationPeriodFilter } from "@/components/admin/evaluation/EvaluationPeriodFilter";
import {
  DashboardDailyActiveChart,
  DashboardDistributionCharts,
  DashboardHighlights,
  DashboardKpiGrid,
  DashboardStudentTable,
  StudentDashboardSheet,
} from "@/components/admin/dashboard";
import { Button } from "@/components/ui/button";
import { usePagination } from "@/hooks/app/use-pagination";
import { useDebouncedValue } from "@/hooks/app/use-debounced-value";
import { useAdminDashboard } from "@/hooks/use-admin-dashboard";

const STUDENT_PAGE_SIZE = 10;

export default function UnitsProgressPage() {
  const {
    period,
    setPeriod,
    applyPreset,
    overview,
    students,
    studentDashboard,
    selectedStudentId,
    isLoading,
    isLoadingDetail,
    error,
    reload,
    openStudentDetail,
    closeStudentDetail,
  } = useAdminDashboard();

  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearch = useDebouncedValue(searchQuery, 300);

  const filteredStudents = useMemo(() => {
    const q = debouncedSearch.trim().toLowerCase();
    if (!q) return students;
    return students.filter(
      (s) =>
        s.fullName.toLowerCase().includes(q) ||
        s.email.toLowerCase().includes(q),
    );
  }, [students, debouncedSearch]);

  const {
    currentPage,
    totalPages,
    pagedItems: paginatedStudents,
    goPrev,
    goNext,
    resetPage,
  } = usePagination(filteredStudents, { pageSize: STUDENT_PAGE_SIZE });

  useEffect(() => {
    resetPage();
  }, [debouncedSearch, resetPage]);

  return (
    <AdminPageLayout
      title="Bảng điều khiển học viên"
      description="Tổng quan hệ thống, phân bố tiến độ/điểm và danh sách học viên từ API reports dashboard."
    >
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <EvaluationPeriodFilter
          period={period}
          onPeriodChange={setPeriod}
          onPreset={applyPreset}
        />
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="h-8 gap-1.5 border-slate-300 text-xs font-semibold"
          disabled={isLoading}
          onClick={() => void reload()}
        >
          <RefreshCw
            className={`h-3.5 w-3.5 ${isLoading ? "animate-spin" : ""}`}
          />
          Làm mới
        </Button>
      </div>

      {isLoading ? (
        <div className="flex h-64 flex-col items-center justify-center gap-4 text-slate-500">
          <Activity className="h-8 w-8 animate-spin text-slate-700" />
          <span className="text-sm font-medium">Đang tải dashboard...</span>
        </div>
      ) : error && !overview ? (
        <div className="rounded-lg border border-red-200 bg-red-50 py-16 text-center text-red-800">
          <AlertTriangle className="mx-auto mb-4 h-10 w-10 opacity-60" />
          <p className="font-semibold">{error}</p>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="mt-4"
            onClick={() => void reload()}
          >
            Thử lại
          </Button>
        </div>
      ) : overview ? (
        <div className="space-y-6">
          <DashboardKpiGrid overview={overview} />

          <DashboardDistributionCharts
            progressBuckets={overview.progressDistributionBuckets}
            scoreBuckets={overview.scoreDistributionBuckets}
          />

          <DashboardDailyActiveChart points={overview.dailyActiveUsers} />

          <DashboardHighlights
            topStudents={overview.topStudents}
            atRiskStudents={overview.atRiskStudents}
            onSelectStudent={(id) => void openStudentDetail(id)}
          />

          <DashboardStudentTable
            students={students}
            filteredStudents={filteredStudents}
            paginatedStudents={paginatedStudents}
            searchQuery={searchQuery}
            onSearchQueryChange={setSearchQuery}
            currentPage={currentPage}
            totalPages={totalPages}
            onPrevPage={goPrev}
            onNextPage={goNext}
            onOpenStudent={(id) => void openStudentDetail(id)}
          />
        </div>
      ) : (
        <div className="rounded-lg border border-slate-200 bg-white py-16 text-center text-slate-600">
          <AlertTriangle className="mx-auto mb-4 h-10 w-10 opacity-30" />
          <p className="font-semibold">Không có dữ liệu dashboard</p>
        </div>
      )}

      <StudentDashboardSheet
        open={selectedStudentId !== null}
        isLoading={isLoadingDetail}
        dashboard={studentDashboard}
        onOpenChange={(open) => {
          if (!open) closeStudentDetail();
        }}
      />
    </AdminPageLayout>
  );
}
