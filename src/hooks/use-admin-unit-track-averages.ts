import { useCallback, useEffect, useState } from "react";
import { fetchLessons } from "@/lib/lessonApi";
import {
  aggregateUnitTrackAverages,
  type UnitTrackAverages,
} from "@/lib/admin-unit-tracks";
import type { AdminReportStudentSummary } from "@/models/admin.model";
import type { UnitProgress } from "@/models/progress.model";
import { progressService } from "@/services/progress.service";

const FETCH_CONCURRENCY = 8;

async function mapWithConcurrency<T, R>(
  items: T[],
  limit: number,
  fn: (item: T) => Promise<R>,
): Promise<R[]> {
  const results: R[] = [];
  for (let i = 0; i < items.length; i += limit) {
    const chunk = items.slice(i, i + limit);
    const chunkResults = await Promise.all(chunk.map(fn));
    results.push(...chunkResults);
  }
  return results;
}

export function useAdminUnitTrackAverages(
  students: AdminReportStudentSummary[],
  enabled: boolean,
) {
  const [unitTrackAverages, setUnitTrackAverages] = useState<UnitTrackAverages[]>(
    [],
  );
  const [isLoadingTracks, setIsLoadingTracks] = useState(false);
  const [tracksError, setTracksError] = useState<string | null>(null);

  const loadTracks = useCallback(async () => {
    if (!enabled || students.length === 0) {
      setUnitTrackAverages([]);
      return;
    }

    setIsLoadingTracks(true);
    setTracksError(null);
    try {
      const lessons = await fetchLessons();
      const studentIds = students.map((s) => s.userId);

      const rows = await mapWithConcurrency(studentIds, FETCH_CONCURRENCY, async (userId) => {
        const data = await progressService.getProgress({
          userId,
          view: "units",
        });
        return { userId, units: data.units ?? [] };
      });

      const progressByStudent = new Map<number, UnitProgress[]>();
      for (const row of rows) {
        progressByStudent.set(row.userId, row.units);
      }

      setUnitTrackAverages(
        aggregateUnitTrackAverages(
          lessons.map((l) => ({ id: l.id, title: l.title })),
          progressByStudent,
          studentIds,
        ),
      );
    } catch (err) {
      const message =
        (err as { message?: string }).message ||
        "Không thể tải tiến độ theo chương.";
      setTracksError(message);
      setUnitTrackAverages([]);
    } finally {
      setIsLoadingTracks(false);
    }
  }, [enabled, students]);

  useEffect(() => {
    queueMicrotask(() => {
      void loadTracks();
    });
  }, [loadTracks]);

  return { unitTrackAverages, isLoadingTracks, tracksError, reloadTracks: loadTracks };
}
