import React from "react";

interface FlashcardStatsProps {
  learningCount: number;
  knownCount: number;
}

export const FlashcardStats: React.FC<FlashcardStatsProps> = ({
  learningCount,
  knownCount,
}) => {
  return (
    <div className="w-full max-w-2xl flex justify-between items-center mb-8 px-4 py-3 rounded-2xl bg-slate-50 border border-slate-100 shadow-sm">
      <div className="flex items-center gap-3 group">
        <div className="h-10 w-10 rounded-xl bg-orange-50 border-2 border-orange-200 flex items-center justify-center text-orange-500 font-black text-sm shadow-sm group-hover:scale-110 transition-transform">
          {learningCount}
        </div>
        <div className="flex flex-col">
          <span className="text-orange-600 font-black text-[10px] uppercase tracking-widest leading-none">
            Đang học
          </span>
          <span className="text-slate-400 text-[9px] font-bold uppercase tracking-tighter mt-1">
            Learning
          </span>
        </div>
      </div>

      <div className="h-8 w-px bg-slate-200/60" />

      <div className="flex items-center gap-3 group">
        <div className="flex flex-col items-end">
          <span className="text-emerald-600 font-black text-[10px] uppercase tracking-widest leading-none">
            Đã thuộc
          </span>
          <span className="text-slate-400 text-[9px] font-bold uppercase tracking-tighter mt-1">
            Mastered
          </span>
        </div>
        <div className="h-10 w-10 rounded-xl bg-emerald-50 border-2 border-emerald-200 flex items-center justify-center text-emerald-600 font-black text-sm shadow-sm group-hover:scale-110 transition-transform">
          {knownCount}
        </div>
      </div>
    </div>
  );
};
