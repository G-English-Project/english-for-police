import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  progressService,
  type ProgressFilters,
} from "@/services/progress.service";
import { useAuth } from "@/hooks/use-auth";
import type {
  QuizAttemptRequest,
  QuizAttemptResponse,
  ProgressData,
  DashboardSummary,
  UnitProgress,
  FlashcardViewItem,
} from "@/models/progress.model";
import { useSonner } from "@/hooks/use-sonner";

function mergeUnitProgress(
  prev: UnitProgress[],
  incoming: UnitProgress,
): UnitProgress[] {
  const next = [...prev];
  const idx = next.findIndex((u) => u.unitNumber === incoming.unitNumber);
  if (idx >= 0) {
    next[idx] = { ...next[idx], ...incoming };
  } else {
    next.push(incoming);
  }
  return next;
}

export interface ProgressContextValue {
  isLoading: boolean;
  error: string | null;
  progressData: ProgressData | null;
  dashboardData: DashboardSummary | null;
  unitsProgress: UnitProgress[];
  submitAttempt: (data: QuizAttemptRequest) => Promise<QuizAttemptResponse>;
  markFlashcardViews: (
    unitNumber: number,
    cards: FlashcardViewItem[],
  ) => Promise<UnitProgress | null>;
  fetchProgress: (
    filters?: Omit<ProgressFilters, "userId">,
  ) => Promise<ProgressData | undefined>;
  fetchDashboard: () => Promise<DashboardSummary | undefined>;
  fetchUnitsProgress: () => Promise<UnitProgress[] | undefined>;
  refetchProgressViews: () => Promise<void>;
}

const ProgressContext = createContext<ProgressContextValue | null>(null);

export function ProgressProvider({ children }: { children: ReactNode }) {
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
  }, [user]);

  const markFlashcardViews = useCallback(
    async (
      unitNumber: number,
      cards: FlashcardViewItem[],
    ): Promise<UnitProgress | null> => {
      if (!user?.userId || cards.length === 0) return null;

      try {
        const updated = await progressService.markFlashcardViews({
          unitNumber,
          cards,
        });
        setUnitsProgress((prev) => mergeUnitProgress(prev, updated));
        const overviewRes = await progressService.getProgress({
          userId: user.userId,
          view: "overview",
        });
        setDashboardData(overviewRes.overview);
        return updated;
      } catch (err) {
        const apiError = err as { message?: string };
        notifyError(
          "Lưu tiến độ thất bại",
          apiError.message || "Không thể lưu tiến độ flashcard.",
        );
        return null;
      }
    },
    [notifyError, user],
  );

  const submitAttempt = useCallback(
    async (data: QuizAttemptRequest): Promise<QuizAttemptResponse> => {
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
    },
    [notifyError, notifySuccess, refetchProgressViews],
  );

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
      setDashboardData(data.overview);
      return data.overview;
    } catch (err) {
      const apiError = err as { message?: string };
      notifyError(
        "Tải bảng điều khiển thất bại",
        apiError.message || "Không thể tải bảng điều khiển.",
      );
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
      notifyError(
        "Tải lộ trình thất bại",
        apiError.message || "Không thể tải lộ trình học.",
      );
    } finally {
      setIsLoading(false);
    }
  }, [notifyError, user]);

  const value = useMemo(
    () => ({
      isLoading,
      error,
      progressData,
      dashboardData,
      unitsProgress,
      submitAttempt,
      markFlashcardViews,
      fetchProgress,
      fetchDashboard,
      fetchUnitsProgress,
      refetchProgressViews,
    }),
    [
      isLoading,
      error,
      progressData,
      dashboardData,
      unitsProgress,
      submitAttempt,
      markFlashcardViews,
      fetchProgress,
      fetchDashboard,
      fetchUnitsProgress,
      refetchProgressViews,
    ],
  );

  return (
    <ProgressContext.Provider value={value}>
      {children}
    </ProgressContext.Provider>
  );
}

export function useProgressContext(): ProgressContextValue {
  const ctx = useContext(ProgressContext);
  if (!ctx) {
    throw new Error("useProgress must be used within ProgressProvider");
  }
  return ctx;
}
