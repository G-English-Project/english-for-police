import type { UnitProgress } from "@/models/progress.model";

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
  return {
    attempted: unit.toolsAttempted ?? 0,
    total: unit.toolsTotal,
    percent: unit.toolsPercent ?? 0,
  };
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
