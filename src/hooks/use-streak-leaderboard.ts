import { useCallback, useState } from "react";
import type { StreakLeaderboardItem } from "@/models/progress.model";
import { progressService } from "@/services/progress.service";
import {
  toRankedStreakLeaderboard,
  type RankedStreakLeaderboardItem,
} from "@/utils/leaderboard";
import { useSonner } from "@/hooks/use-sonner";

export function useStreakLeaderboard() {
  const { notifyError } = useSonner();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [leaderboard, setLeaderboard] = useState<StreakLeaderboardItem[]>([]);
  const [rankedLeaderboard, setRankedLeaderboard] = useState<
    RankedStreakLeaderboardItem[]
  >([]);

  const fetchStreakLeaderboard = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await progressService.getStreakLeaderboard();
      setLeaderboard(data);
      setRankedLeaderboard(toRankedStreakLeaderboard(data));
      return data;
    } catch (err) {
      const apiError = err as { message?: string; status?: number };
      if (apiError.status === 401 || apiError.status === 403) {
        setLeaderboard([]);
        setRankedLeaderboard([]);
        return [];
      }
      const message =
        apiError.message || "Không thể tải bảng xếp hạng chuỗi học tập.";
      setError(message);
      notifyError("Tải bảng xếp hạng thất bại", message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [notifyError]);

  return {
    isLoading,
    error,
    leaderboard,
    rankedLeaderboard,
    fetchStreakLeaderboard,
  };
}
