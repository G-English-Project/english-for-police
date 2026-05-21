export interface GeneralAttemptStudentSummary {
  userId: number;
  fullName: string;
  email: string;
  generalAttemptCount: number;
  chapterCount: number;
}

export interface GeneralAttemptItem {
  attemptId: number;
  attemptNumber: number;
  score: number;
  finalScore: number;
  correctCount: number;
  totalQuestions: number;
  submittedAt: string;
}

export interface ChapterGeneralAttempts {
  unitNumber: number;
  unitTitle: string;
  attempts: GeneralAttemptItem[];
}

export interface GeneralAttemptStudentDetail {
  userId: number;
  fullName: string;
  email: string;
  chapters: ChapterGeneralAttempts[];
}

export interface ApiResponse<T> {
  code: string;
  message: string;
  data: T;
}
