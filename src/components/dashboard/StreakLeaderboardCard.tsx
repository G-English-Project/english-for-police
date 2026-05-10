import { useEffect } from "react";
import { Loader2, Trophy } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useStreakLeaderboard } from "@/hooks/use-streak-leaderboard";
import { useAuth } from "@/hooks/use-auth";

export function StreakLeaderboardCard() {
  const { isAuthenticated } = useAuth();
  const { rankedLeaderboard, isLoading, fetchStreakLeaderboard } =
    useStreakLeaderboard();

  useEffect(() => {
    if (!isAuthenticated) return;
    void fetchStreakLeaderboard();
  }, [fetchStreakLeaderboard, isAuthenticated]);

  if (!isAuthenticated) {
    return (
      <Card className="police-shadow border-dashed border-2 bg-slate-50/50 p-6 flex flex-col items-center justify-center text-center opacity-60">
        <Trophy className="h-8 w-8 text-slate-300 mb-2" />
        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
          Bảng xếp hạng
        </p>
        <p className="text-[10px] text-slate-400 mt-1 italic">
          Đăng nhập để xem bảng xếp hạng chuỗi học tập
        </p>
      </Card>
    );
  }

  return (
    <Card className="police-shadow border-none bg-white overflow-hidden">
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2 text-slate-800">
          <Trophy className="h-4 w-4 text-amber-500" />
          Bảng xếp hạng chuỗi học tập
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0 space-y-2">
        {isLoading ? (
          <div className="h-24 flex items-center justify-center text-slate-400">
            <Loader2 className="h-5 w-5 animate-spin" />
          </div>
        ) : rankedLeaderboard.length === 0 ? (
          <p className="text-xs text-slate-400 italic">
            Chưa có dữ liệu xếp hạng.
          </p>
        ) : (
          rankedLeaderboard.slice(0, 5).map((item) => (
            <div
              key={`${item.rank}-${item.name}`}
              className="flex items-center justify-between rounded-md border border-slate-100 px-3 py-2"
            >
              <div className="flex items-center gap-2 min-w-0">
                <Badge
                  variant="outline"
                  className="h-6 min-w-6 px-1.5 justify-center text-[10px] font-bold"
                >
                  #{item.rank}
                </Badge>
                <span className="text-sm font-medium text-slate-700 truncate">
                  {item.name}
                </span>
              </div>
              <span className="text-xs font-bold text-emerald-600">
                {item.streak} ngày
              </span>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}
