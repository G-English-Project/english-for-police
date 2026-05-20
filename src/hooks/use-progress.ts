import { useState, useCallback } from "react";
import {
  progressService,
  type ProgressFilters,
} from "@/services/progress.service";
import { useAuth } from "./use-auth";
import type {
  QuizAttemptRequest,
  QuizAttemptResponse,
  ProgressData,
  DashboardSummary,
  UnitProgress,
} from "@/models/progress.model";
import { useSonner } from "@/hooks/use-sonner";

export function useProgress() {
  const { user } = useAuth();
  const { notifySuccess, notifyError } = useSonner();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [progressData, setProgressData] = useState<ProgressData | null>(null);
  const [dashboardData, setDashboardData] = useState<DashboardSummary | null>(
    null,
  );
  const [unitsProgress, setUnitsProgress] = useState<UnitProgress[]>([]);

  const refetchProgressViews = useCallback(async () => {
    if (!user?.userId) return;

    const [overviewRes, unitsRes] = await Promise.all([
      progressService.getProgress({
        userId: user.userId,
        view: "overview",
      }),
      progressService.getProgress({
        userId: user.userId,
        view: "units",
      }),
    ]);
    setDashboardData(overviewRes.overview);
    setUnitsProgress(unitsRes.units ?? []);
  }, [user?.userId]);

  const submitAttempt = async (
    data: QuizAttemptRequest,
  ): Promise<QuizAttemptResponse> => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await progressService.submitAttempt(data);
      await refetchProgressViews();
      notifySuccess("Nộp bài thành công", "Kết quả đã được cập nhật.");
      return result;
    } catch (err) {
      const apiError = err as { message?: string };
      const message = apiError.message || "Không thể gửi kết quả làm bài.";
      setError(message);
      notifyError("Nộp bài thất bại", message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const fetchProgress = useCallback(
    async (filters?: Omit<ProgressFilters, "userId">) => {
      if (!user?.userId) return;

      setIsLoading(true);
      setError(null);
      try {
        const data = await progressService.getProgress({
          userId: user.userId,
          ...filters,
        });
        setProgressData(data);
        return data;
      } catch (err) {
        const apiError = err as { message?: string };
        const message = apiError.message || "Không thể tải dữ liệu tiến độ.";
        setError(message);
        notifyError("Tải tiến độ thất bại", message);
      } finally {
        setIsLoading(false);
      }
    },
    [notifyError, user],
  );

  const fetchDashboard = useCallback(async () => {
    if (!user?.userId) return;

    setIsLoading(true);
    setError(null);
    try {
      const data = await progressService.getProgress({
        userId: user.userId,
        view: "overview",
      });
      const overview = data.overview;
      setDashboardData(overview);
      return overview;
    } catch (err) {
      const apiError = err as { message?: string };
      const message = apiError.message || "Không thể tải bảng điều khiển.";
      setError(message);
      notifyError("Tải bảng điều khiển thất bại", message);
    } finally {
      setIsLoading(false);
    }
  }, [notifyError, user]);

  const fetchUnitsProgress = useCallback(async () => {
    if (!user?.userId) return;

    setIsLoading(true);
    setError(null);
    try {
      const data = await progressService.getProgress({
        userId: user.userId,
        view: "units",
      });
      const units = data.units ?? [];
      setUnitsProgress(units);
      return units;
    } catch (err) {
      const apiError = err as { message?: string };
      const message = apiError.message || "Không thể tải lộ trình học.";
      setError(message);
      notifyError("Tải lộ trình thất bại", message);
    } finally {
      setIsLoading(false);
    }
  }, [notifyError, user]);

  return {
    isLoading,
    error,
    progressData,
    dashboardData,
    unitsProgress,
    submitAttempt,
    fetchProgress,
    fetchDashboard,
    fetchUnitsProgress,
    refetchProgressViews,
  };
}
