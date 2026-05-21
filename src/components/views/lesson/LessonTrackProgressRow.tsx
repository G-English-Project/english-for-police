import { Progress } from "@/components/ui/progress";

interface LessonTrackProgressRowProps {
  attempted: number;
  total: number;
  percent: number;
  detailLabel: string;
}

export function LessonTrackProgressRow({
  attempted,
  total,
  percent,
  detailLabel,
}: LessonTrackProgressRowProps) {
  if (total <= 0) {
    return null;
  }

  return (
    <div className="space-y-1.5" onClick={(e) => e.stopPropagation()}>
      <div className="flex justify-between text-[10px] font-bold uppercase tracking-wider">
        <span className="text-slate-400">
          {detailLabel} {attempted}/{total}
        </span>
        <span className="text-slate-500">{percent}%</span>
      </div>
      <Progress value={percent} className="h-1 bg-slate-100" />
    </div>
  );
}
