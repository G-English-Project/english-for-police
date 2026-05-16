export type TrendDirection =
  | "UP"
  | "DOWN"
  | "FLAT"
  | "INSUFFICIENT_DATA";

export interface EvaluationPeriodResponse {
  from: string;
  to: string;
}

export interface ParticipationResponse {
  activeDays: number;
  activityEventSum: number;
  unitsCompleted: number;
  unitsInProgress: number;
  totalAttempts: number;
  retryCount: number;
  period: EvaluationPeriodResponse;
}

export interface UnitImprovementResponse {
  unitNumber: number;
  unitTitle: string | null;
  attemptCount: number;
  firstScore: number | null;
  lastScore: number | null;
  bestScore: number | null;
  deltaScore: number | null;
  trendDirection: TrendDirection;
}

export interface ImprovementBlockResponse {
  overallDeltaPercent: number | null;
  units: UnitImprovementResponse[];
}

export interface EvaluationResponse {
  userId: number;
  fullName: string;
  period: EvaluationPeriodResponse;
  participation: ParticipationResponse;
  improvement: ImprovementBlockResponse;
  explain: string[];
}

export interface AttemptScorePointResponse {
  attemptId: number;
  score: number;
  finalScore: number | null;
  submittedAt: string;
}

export interface UnitImprovementDetailResponse {
  summary: UnitImprovementResponse;
  attemptScores: AttemptScorePointResponse[];
}

export interface ImprovementDetailResponse {
  userId: number;
  fullName: string;
  period: EvaluationPeriodResponse;
  units: UnitImprovementDetailResponse[];
  explain: string[];
}

export interface EvaluationQueryParams {
  from?: string;
  to?: string;
}

export interface ImprovementQueryParams extends EvaluationQueryParams {
  unitNumber?: number;
}

export type EvaluationDataSource = "evaluation-api" | "legacy-adapter";

export interface EvaluationFetchMeta {
  source: EvaluationDataSource;
}

export function effectiveScore(point: {
  score: number;
  finalScore: number | null;
}): number {
  return point.finalScore ?? point.score;
}
