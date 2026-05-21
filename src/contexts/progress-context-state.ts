import { createContext } from "react";
import type {
  QuizAttemptRequest,
  QuizAttemptResponse,
  ProgressData,
  DashboardSummary,
  UnitProgress,
  FlashcardViewItem,
} from "@/models/progress.model";
import type { ProgressFilters } from "@/services/progress.service";

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

export const ProgressContext = createContext<ProgressContextValue | null>(null);

export function mergeUnitProgress(
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
