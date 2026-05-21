import type { UnitProgress } from "@/models/progress.model";
import type { LessonTestLane } from "@/types";
import { PRACTICE_MENU_LABEL_TO_LANE } from "@/components/practice/utils/testUtils";

export function unitProgressPercent(
  unit: UnitProgress | undefined,
): number {
  if (!unit) return 0;
  if (typeof unit.progressPercent === "number") {
    return unit.progressPercent;
  }
  return unit.status === "completed" ? 100 : 0;
}

export function isUnitCompleted(unit: UnitProgress | undefined): boolean {
  return unit?.status === "completed" || unitProgressPercent(unit) === 100;
}

export function unitProgressByNumber(
  units: UnitProgress[] | undefined,
): Map<number, UnitProgress> {
  return new Map((units ?? []).map((u) => [u.unitNumber, u]));
}

export function unitFlashcardCounts(
  unit: UnitProgress | undefined,
): { viewed: number; total: number } | null {
  if (!unit || typeof unit.flashcardsTotal !== "number") {
    return null;
  }
  return {
    viewed: unit.flashcardsViewed ?? 0,
    total: unit.flashcardsTotal,
  };
}

export function unitToolsCounts(
  unit: UnitProgress | undefined,
): { attempted: number; total: number; percent: number } | null {
  if (!unit || typeof unit.toolsTotal !== "number") {
    return null;
  }
  const total = unit.toolsTotal;
  const fromApi = unit.toolsAttempted ?? 0;
  const fromDrills = unit.completedVocabDrills?.length ?? 0;
  const attempted = Math.min(total, Math.max(fromApi, fromDrills));
  const percent =
    total > 0
      ? Math.min(100, Math.round((attempted / total) * 100))
      : (unit.toolsPercent ?? 0);
  return { attempted, total, percent };
}

export function unitPracticeSubLessonCounts(
  unit: UnitProgress | undefined,
): { attempted: number; total: number; percent: number } | null {
  if (!unit || typeof unit.practiceSubLessonsTotal !== "number") {
    return null;
  }
  return {
    attempted: unit.practiceSubLessonsAttempted ?? 0,
    total: unit.practiceSubLessonsTotal,
    percent: unit.practiceSubLessonsPercent ?? 0,
  };
}

/** Flashcard + công cụ + luyện tập (counts from API unit progress). */
export function unitCombinedProgressCounts(
  unit: UnitProgress | undefined,
): { done: number; total: number } | null {
  if (!unit) return null;

  const flash = unitFlashcardCounts(unit);
  const tools = unitToolsCounts(unit);
  const practice = unitPracticeSubLessonCounts(unit);

  let done = 0;
  let total = 0;
  if (flash && flash.total > 0) {
    done += flash.viewed;
    total += flash.total;
  }
  if (tools && tools.total > 0) {
    done += tools.attempted;
    total += tools.total;
  }
  if (practice && practice.total > 0) {
    done += practice.attempted;
    total += practice.total;
  }

  if (total <= 0) return null;
  return { done: Math.min(done, total), total };
}

/** Combined % for roadmap / chapter cards (not flashcard-only). */
export function unitCombinedProgressPercent(
  unit: UnitProgress | undefined,
): number {
  const counts = unitCombinedProgressCounts(unit);
  if (!counts) return unitProgressPercent(unit);
  return Math.min(100, Math.round((counts.done / counts.total) * 100));
}

export function isUnitCombinedCompleted(
  unit: UnitProgress | undefined,
): boolean {
  const counts = unitCombinedProgressCounts(unit);
  if (!counts || counts.total <= 0) return false;
  return counts.done >= counts.total;
}

export function isFlashcardTrackComplete(
  unit: UnitProgress | undefined,
): boolean {
  const flash = unitFlashcardCounts(unit);
  return flash != null && flash.total > 0 && flash.viewed >= flash.total;
}

export function isToolsTrackComplete(
  unit: UnitProgress | undefined,
): boolean {
  const tools = unitToolsCounts(unit);
  return tools != null && tools.total > 0 && tools.attempted >= tools.total;
}

export function isPracticeTrackComplete(
  unit: UnitProgress | undefined,
): boolean {
  const practice = unitPracticeSubLessonCounts(unit);
  return (
    practice != null &&
    practice.total > 0 &&
    practice.attempted >= practice.total
  );
}

export function isVocabDrillComplete(
  unit: UnitProgress | undefined,
  drill: "en-vi" | "vi-en" | "matching",
): boolean {
  return unit?.completedVocabDrills?.includes(drill) ?? false;
}

export function isPracticeLaneComplete(
  unit: UnitProgress | undefined,
  lane: LessonTestLane,
  subLessonId?: string,
): boolean {
  if (!unit) return false;
  if (subLessonId?.trim()) {
    const lanes = unit.completedPhraseLanesBySubLesson?.[subLessonId.trim()];
    return lanes?.includes(lane) ?? false;
  }
  return unit.completedChapterPracticeLanes?.includes(lane) ?? false;
}

export function isPracticeTypeLabelComplete(
  unit: UnitProgress | undefined,
  typeLabel: string,
  subLessonId?: string,
): boolean {
  const lane = PRACTICE_MENU_LABEL_TO_LANE[typeLabel];
  if (!lane) return false;
  return isPracticeLaneComplete(unit, lane, subLessonId);
}

/** Mọi dạng trong danh sách (đã lọc theo nội dung có sẵn) đều đã làm. */
export function arePracticeTypeLabelsComplete(
  unit: UnitProgress | undefined,
  typeLabels: readonly string[],
  subLessonId?: string,
): boolean {
  if (typeLabels.length === 0) return false;
  return typeLabels.every((label) =>
    isPracticeTypeLabelComplete(unit, label, subLessonId),
  );
}

export function isGeneralTestAttempted(
  unit: UnitProgress | undefined,
): boolean {
  return unit?.generalTestAttempted === true;
}
