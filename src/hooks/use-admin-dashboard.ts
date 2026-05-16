import { useCallback, useEffect, useState } from "react";
import { adminService } from "@/services/admin.service";
import { useSonner } from "@/hooks/use-sonner";
import type {
  AdminReportOverview,
  AdminReportStudentDashboard,
  AdminReportStudentSummary,
} from "@/models/admin.model";
import {
  defaultEvaluationPeriod,
  periodPresetDays,
} from "@/utils/evaluation-period";

export function useAdminDashboard() {
  const { notifyError } = useSonner();
  const [period, setPeriod] = useState(defaultEvaluationPeriod);
  const [overview, setOverview] = useState<AdminReportOverview | null>(null);
  const [students, setStudents] = useState<AdminReportStudentSummary[]>([]);
  const [studentDashboard, setStudentDashboard] =
    useState<AdminReportStudentDashboard | null>(null);
  const [selectedStudentId, setSelectedStudentId] = useState<number | null>(
    null,
  );
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingDetail, setIsLoadingDetail] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadOverviewAndStudents = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [overviewData, studentsData] = await Promise.all([
        adminService.getDashboardOverview({
          from: period.from,
          to: period.to,
        }),
        adminService.getStudentSummaries(),
      ]);
      setOverview(overviewData);
      setStudents(studentsData);
    } catch (err) {
      const message =
        (err as { message?: string }).message ||
        "Không thể tải bảng điều khiển.";
      setError(message);
      notifyError("Tải dashboard thất bại", message);
      setOverview(null);
      setStudents([]);
    } finally {
      setIsLoading(false);
    }
  }, [notifyError, period.from, period.to]);

  useEffect(() => {
    queueMicrotask(() => {
      void loadOverviewAndStudents();
    });
  }, [loadOverviewAndStudents]);

  const applyPreset = useCallback((days: number) => {
    setPeriod(periodPresetDays(days));
  }, []);

  const openStudentDetail = useCallback(
    async (userId: number) => {
      setSelectedStudentId(userId);
      setStudentDashboard(null);
      setIsLoadingDetail(true);
      try {
        const data = await adminService.getStudentDashboard(userId);
        setStudentDashboard(data);
      } catch (err) {
        const message =
          (err as { message?: string }).message ||
          "Không thể tải hồ sơ học viên.";
        notifyError("Tải chi tiết thất bại", message);
        setSelectedStudentId(null);
      } finally {
        setIsLoadingDetail(false);
      }
    },
    [notifyError],
  );

  const closeStudentDetail = useCallback(() => {
    setSelectedStudentId(null);
    setStudentDashboard(null);
  }, []);

  return {
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
    reload: loadOverviewAndStudents,
    openStudentDetail,
    closeStudentDetail,
  };
}
