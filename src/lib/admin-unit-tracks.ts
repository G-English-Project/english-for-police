import type { UnitProgress } from "@/models/progress.model";

export interface UnitTrackPercents {
  flash: number;
  tools: number;
  practice: number;
}

export interface UnitTrackAverages {
  unitNumber: number;
  title: string;
  label: string;
  flashAvg: number;
  toolsAvg: number;
  practiceAvg: number;
}

export function trackPercentsFromUnit(
  unit: UnitProgress | undefined,
): UnitTrackPercents {
  const flash =
    unit?.flashcardsTotal && unit.flashcardsTotal > 0
      ? Math.round(
          ((unit.flashcardsViewed ?? 0) / unit.flashcardsTotal) * 100,
        )
      : 0;
  return {
    flash,
    tools: unit?.toolsPercent ?? 0,
    practice: unit?.practiceSubLessonsPercent ?? 0,
  };
}

export function aggregateUnitTrackAverages(
  lessons: { id: number; title: string }[],
  progressByStudent: Map<number, UnitProgress[]>,
  studentIds: number[],
): UnitTrackAverages[] {
  const n = Math.max(1, studentIds.length);

  return lessons.map((lesson) => {
    let flashSum = 0;
    let toolsSum = 0;
    let practiceSum = 0;

    for (const studentId of studentIds) {
      const units = progressByStudent.get(studentId) ?? [];
      const unit = units.find((u) => u.unitNumber === lesson.id);
      const t = trackPercentsFromUnit(unit);
      flashSum += t.flash;
      toolsSum += t.tools;
      practiceSum += t.practice;
    }

    return {
      unitNumber: lesson.id,
      title: lesson.title,
      label: `C${lesson.id}`,
      flashAvg: Math.round(flashSum / n),
      toolsAvg: Math.round(toolsSum / n),
      practiceAvg: Math.round(practiceSum / n),
    };
  });
}
