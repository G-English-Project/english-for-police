import type {
  AttemptScorePointResponse,
  TrendDirection,
  UnitImprovementResponse,
} from "@/models/evaluation.model";
import { effectiveScore } from "@/models/evaluation.model";

export interface ScoreAttemptInput {
  unitNumber: number;
  unitTitle?: string | null;
  attemptId: number;
  score: number;
  finalScore: number | null;
  submittedAt: string;
}

const TREND_THRESHOLD = 0.5;

export function roundScore(value: number): number {
  return Math.round(value * 100) / 100;
}

export function computeTrendDirection(
  attemptCount: number,
  deltaScore: number | null,
): TrendDirection {
  if (attemptCount < 2 || deltaScore === null) return "INSUFFICIENT_DATA";
  if (deltaScore >= TREND_THRESHOLD) return "UP";
  if (deltaScore <= -TREND_THRESHOLD) return "DOWN";
  return "FLAT";
}

export function computeUnitImprovement(
  unitNumber: number,
  unitTitle: string | null,
  attempts: ScoreAttemptInput[],
): UnitImprovementResponse {
  if (attempts.length === 0) {
    return {
      unitNumber,
      unitTitle,
      attemptCount: 0,
      firstScore: null,
      lastScore: null,
      bestScore: null,
      deltaScore: null,
      trendDirection: "INSUFFICIENT_DATA",
    };
  }

  const sorted = [...attempts].sort(
    (a, b) =>
      new Date(a.submittedAt).getTime() - new Date(b.submittedAt).getTime(),
  );
  const effectiveScores = sorted.map((a) =>
    effectiveScore({ score: a.score, finalScore: a.finalScore }),
  );
  const firstScore = effectiveScores[0];
  const lastScore = effectiveScores[effectiveScores.length - 1];
  const bestScore = Math.max(...effectiveScores);
  const deltaScore = roundScore(lastScore - firstScore);

  return {
    unitNumber,
    unitTitle,
    attemptCount: sorted.length,
    firstScore: roundScore(firstScore),
    lastScore: roundScore(lastScore),
    bestScore: roundScore(bestScore),
    deltaScore,
    trendDirection: computeTrendDirection(sorted.length, deltaScore),
  };
}

export function computeOverallDeltaPercent(
  units: UnitImprovementResponse[],
): number | null {
  const deltas = units
    .map((u) => u.deltaScore)
    .filter((d): d is number => d !== null);
  if (deltas.length === 0) return null;
  const sum = deltas.reduce((acc, d) => acc + d, 0);
  return roundScore(sum / deltas.length);
}

export function groupAttemptsByUnit(
  attempts: ScoreAttemptInput[],
): Map<number, ScoreAttemptInput[]> {
  const map = new Map<number, ScoreAttemptInput[]>();
  for (const attempt of attempts) {
    const list = map.get(attempt.unitNumber) ?? [];
    list.push(attempt);
    map.set(attempt.unitNumber, list);
  }
  return map;
}

export function buildImprovementUnits(
  attempts: ScoreAttemptInput[],
  unitTitles: Map<number, string | null>,
): UnitImprovementResponse[] {
  const grouped = groupAttemptsByUnit(attempts);
  return [...grouped.entries()]
    .sort(([a], [b]) => a - b)
    .map(([unitNumber, unitAttempts]) =>
      computeUnitImprovement(
        unitNumber,
        unitTitles.get(unitNumber) ?? null,
        unitAttempts,
      ),
    );
}

export function toAttemptScorePoints(
  attempts: ScoreAttemptInput[],
): AttemptScorePointResponse[] {
  return [...attempts]
    .sort(
      (a, b) =>
        new Date(a.submittedAt).getTime() - new Date(b.submittedAt).getTime(),
    )
    .map((a) => ({
      attemptId: a.attemptId,
      score: a.score,
      finalScore: a.finalScore,
      submittedAt: a.submittedAt,
    }));
}
