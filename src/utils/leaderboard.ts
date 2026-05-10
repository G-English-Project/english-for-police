import type { StreakLeaderboardItem } from "@/models/progress.model";

export interface RankedStreakLeaderboardItem extends StreakLeaderboardItem {
  rank: number;
}

export function toRankedStreakLeaderboard(
  items: StreakLeaderboardItem[],
): RankedStreakLeaderboardItem[] {
  return [...items]
    .sort((a, b) => b.streak - a.streak)
    .map((item, index) => ({
      name: item.name?.trim() || "Unknown",
      streak: Math.max(0, item.streak || 0),
      rank: index + 1,
    }));
}
