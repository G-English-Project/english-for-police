import React, { useMemo } from "react";
import type { UserContributionItem } from "@/services/user.service";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface ContributionGraphProps {
  contributions: UserContributionItem[];
  weeks?: number;
}

export const ContributionGraph: React.FC<ContributionGraphProps> = ({
  contributions,
  weeks = 12,
}) => {
  const gridData = useMemo(() => {
    const today = new Date();
    const result = [];

    const contributionMap = new Map<string, number>();
    contributions.forEach((item) => {
      contributionMap.set(item.date, item.count);
    });

    const startDate = new Date(today);
    startDate.setDate(today.getDate() - weeks * 7 + 1);

    const dayOfWeek = startDate.getDay();
    startDate.setDate(startDate.getDate() - dayOfWeek);

    for (let i = 0; i < weeks * 7; i++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);
      const dateString = date.toISOString().split("T")[0];
      const count = contributionMap.get(dateString) || 0;

      result.push({
        date: dateString,
        count,
        level: getLevel(count),
      });
    }
    return result;
  }, [contributions, weeks]);

  function getLevel(count: number) {
    if (count === 0) return 0;
    if (count < 3) return 1;
    if (count < 6) return 2;
    if (count < 10) return 3;
    return 4;
  }

  const levelColors = [
    "bg-white/20",
    "bg-emerald-500/40",
    "bg-emerald-500/60",
    "bg-emerald-500/85",
    "bg-emerald-400",
  ];

  return (
    <TooltipProvider>
      <div className="flex flex-col gap-2">
        <div className="grid grid-rows-7 grid-flow-col gap-1.5 w-full justify-between">
          {gridData.map((day) => (
            <Tooltip key={day.date}>
              <TooltipTrigger asChild>
                <div
                  className={`w-3 h-3 rounded-[2px] transition-colors ${levelColors[day.level]}`}
                />
              </TooltipTrigger>
              <TooltipContent className="text-[10px] p-2 bg-slate-900 border-slate-800 text-white">
                <p className="font-bold">{day.count} bài học</p>
                <p className="text-white/60">{day.date}</p>
              </TooltipContent>
            </Tooltip>
          ))}
        </div>
        <div className="flex items-center gap-1.5 text-[9px] text-white/40 uppercase tracking-widest font-bold mt-1">
          <span>Ít</span>
          <div className="flex gap-1">
            {levelColors.map((color, i) => (
              <div key={i} className={`w-2 h-2 rounded-[1px] ${color}`} />
            ))}
          </div>
          <span>Nhiều</span>
        </div>
      </div>
    </TooltipProvider>
  );
};
