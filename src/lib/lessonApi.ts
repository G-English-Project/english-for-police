import { API_ROUTES } from "@/api/routes";
import type { Unit } from "@/types";
import { lessonService } from "@/services/lesson.service";
import { api } from "@/utils/api-client";

export async function fetchLessons(): Promise<Unit[]> {
  return lessonService.getLessons();
}

export async function fetchLessonById(unitNumber: number): Promise<Unit> {
  return lessonService.getLessonByUnitNumber(unitNumber);
}

export async function importLessons(lessons: Unit[]): Promise<void> {
  const postImport = async (payload: unknown) => {
    await api.post(API_ROUTES.LESSONS.IMPORT, payload);
  };

  try {
    await postImport(lessons);
    return;
  } catch {
    try {
      await postImport({ lessons });
      return;
    } catch {
      for (const lesson of lessons) {
        try {
          await postImport([lesson]);
        } catch {
          await postImport({ lessons: [lesson] });
        }
      }
      return;
    }
  }
}
