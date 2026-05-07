import type { User } from "./user.model";

export interface StudentProgressSummary {
  userId: number;
  fullName: string;
  rank: string;
  email: string;
  completionPercentage: number;
  lastActive: string;
  role: string;
}

export interface UnitProgress {
  unitId: number;
  title: string;
  progress: number; // 0-100
  status: "locked" | "in-progress" | "completed";
  hasBadge: boolean;
}

export interface TestScore {
  testId: string;
  title: string;
  score: number;
  total: number;
  percentage: number;
  date: string;
}

export interface StudentDossier extends User {
  rank: string;
  proficiencyScore: number;
  totalStudyTime: number; // in hours
  accuracyRate: number; // 0-100
  unitProgress: UnitProgress[];
  testHistory: TestScore[];
}
