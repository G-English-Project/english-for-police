import { useEffect } from "react";
import { Loader2, Trophy } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useStreakLeaderboard } from "@/hooks/use-streak-leaderboard";

export function StreakLeaderboardCard() {
  const { rankedLeaderboard, isLoading, fetchStreakLeaderboard } =
    useStreakLeaderboard();

  useEffect(() => {
    void fetchStreakLeaderboard();
  }, [fetchStreakLeaderboard]);

  return (
    <Card className="police-shadow border border-slate-200 bg-white overflow-hidden rounded-md">
      <CardHeader className="pb-3 bg-linear-to-r from-amber-50 to-white border-b border-slate-100">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base flex items-center gap-2 text-slate-800">
            <Trophy className="h-4 w-4 text-amber-500" />
            Bảng xếp hạng chuỗi học tập
          </CardTitle>
          <Badge className="h-6 rounded-md px-2 text-[10px] font-bold bg-emerald-100 text-emerald-700 border border-emerald-200">
            TOP 5
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="pt-3 space-y-2.5">
        {isLoading ? (
          <div className="h-24 flex items-center justify-center text-slate-400">
            <Loader2 className="h-5 w-5 animate-spin" />
          </div>
        ) : rankedLeaderboard.length === 0 ? (
          <p className="text-xs text-slate-500">Chưa có dữ liệu xếp hạng.</p>
        ) : (
          rankedLeaderboard.slice(0, 5).map((item) => (
            <div
              key={`${item.rank}-${item.name}`}
              className="flex items-center justify-between rounded-md border border-slate-200 bg-slate-50/60 px-3 py-2.5 transition-colors hover:bg-slate-50"
            >
              <div className="flex items-center gap-2 min-w-0">
                <Badge
                  variant="outline"
                  className={`h-6 min-w-6 px-1.5 justify-center text-[10px] font-bold rounded-md ${
                    item.rank === 1
                      ? "border-amber-300 bg-amber-50 text-amber-700"
                      : item.rank === 2
                        ? "border-slate-300 bg-slate-100 text-slate-700"
                        : item.rank === 3
                          ? "border-orange-300 bg-orange-50 text-orange-700"
                          : "border-slate-300 bg-white text-slate-700"
                  }`}
                >
                  #{item.rank}
                </Badge>
                <span className="text-sm font-semibold text-slate-700 truncate">
                  {item.name}
                </span>
              </div>
              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-md px-2 py-1">
                {item.streak} ngày
              </span>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}
