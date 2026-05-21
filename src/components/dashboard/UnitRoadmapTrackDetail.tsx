import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import type { UnitProgress } from "@/models/progress.model";
import {
  isFlashcardTrackComplete,
  isPracticeTrackComplete,
  isToolsTrackComplete,
  unitFlashcardCounts,
  unitPracticeSubLessonCounts,
  unitToolsCounts,
} from "@/lib/unit-progress";

interface TrackRowProps {
  label: string;
  done: number;
  total: number;
  complete: boolean;
  detailLabel: string;
}

function TrackRow({
  label,
  done,
  total,
  complete,
  detailLabel,
}: TrackRowProps) {
  const percent = total > 0 ? Math.round((done / total) * 100) : 0;

  return (
    <div className="flex items-center justify-between gap-2 text-[9px]">
      <span className="flex min-w-0 items-center gap-1 font-semibold text-slate-600">
        {complete ? (
          <Check className="h-3 w-3 shrink-0 text-emerald-600" aria-hidden />
        ) : (
          <span
            className="h-1.5 w-1.5 shrink-0 rounded-full bg-slate-300"
            aria-hidden
          />
        )}
        <span className="truncate">{label}</span>
      </span>
      <span
        className={cn(
          "shrink-0 tabular-nums font-bold",
          complete ? "text-emerald-600" : "text-slate-500",
        )}
      >
        {detailLabel} {done}/{total}
        {total > 0 ? ` · ${percent}%` : ""}
      </span>
    </div>
  );
}

interface UnitRoadmapTrackDetailProps {
  unitProgress?: UnitProgress;
}

export function UnitRoadmapTrackDetail({
  unitProgress,
}: UnitRoadmapTrackDetailProps) {
  const flash = unitFlashcardCounts(unitProgress);
  const tools = unitToolsCounts(unitProgress);
  const practice = unitPracticeSubLessonCounts(unitProgress);

  const rows: TrackRowProps[] = [];

  if (flash && flash.total > 0) {
    rows.push({
      label: "Flashcard",
      done: flash.viewed,
      total: flash.total,
      complete: isFlashcardTrackComplete(unitProgress),
      detailLabel: "Đã xem",
    });
  }
  if (tools && tools.total > 0) {
    rows.push({
      label: "Công cụ",
      done: tools.attempted,
      total: tools.total,
      complete: isToolsTrackComplete(unitProgress),
      detailLabel: "Đã luyện",
    });
  }
  if (practice && practice.total > 0) {
    rows.push({
      label: "Luyện tập",
      done: practice.attempted,
      total: practice.total,
      complete: isPracticeTrackComplete(unitProgress),
      detailLabel: "Đã làm",
    });
  }

  if (rows.length === 0) {
    return null;
  }

  return (
    <div
      className="space-y-1 rounded-md border border-slate-100 bg-slate-50/90 px-2.5 py-2"
      onClick={(e) => e.stopPropagation()}
    >
      {rows.map((row) => (
        <TrackRow key={row.label} {...row} />
      ))}
    </div>
  );
}
