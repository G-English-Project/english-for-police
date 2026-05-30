import { useEffect, useMemo, useState } from "react";
import { Activity, AlertTriangle } from "lucide-react";
import { AdminPageLayout } from "@/components/admin/AdminPageLayout";
import {
  DashboardKpiActivityRow,
  DashboardStudentTable,
  DashboardUnitTracksChart,
  StudentDashboardSheet,
} from "@/components/admin/dashboard";
import { useAdminUnitTrackAverages } from "@/hooks/use-admin-unit-track-averages";
import { Button } from "@/components/ui/button";
import { usePagination } from "@/hooks/app/use-pagination";
import { useDebouncedValue } from "@/hooks/app/use-debounced-value";
import { useAdminDashboard } from "@/hooks/use-admin-dashboard";

const STUDENT_PAGE_SIZE = 10;

export default function UnitsProgressPage() {
  const {
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

  const { unitTrackAverages, isLoadingTracks, tracksError } =
    useAdminUnitTrackAverages(students, !isLoading && students.length > 0);

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
      description="Tổng quan hệ thống và danh sách học viên từ API reports dashboard."
    >
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
          <DashboardKpiActivityRow overview={overview} />

          <DashboardUnitTracksChart
            data={unitTrackAverages}
            isLoading={isLoadingTracks}
            error={tracksError}
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
