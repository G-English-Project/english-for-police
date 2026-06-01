import React from "react";
import type { GeneralAttemptStudentDetail } from "@/models/general-attempts.model";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface AttemptsStatsSummaryProps {
  data: GeneralAttemptStudentDetail;
}

export const AttemptsStatsSummary: React.FC<AttemptsStatsSummaryProps> = ({
  data,
}) => {
  const totalAttempts = data.chapters.reduce(
    (sum, chapter) => sum + chapter.attempts.length,
    0,
  );

  const allScores = data.chapters.flatMap((chapter) =>
    chapter.attempts.map((a) => a.finalScore),
  );

  const averageScore =
    allScores.length > 0
      ? Math.round(allScores.reduce((sum, score) => sum + score, 0) / allScores.length)
      : 0;

  const bestScore = allScores.length > 0 ? Math.max(...allScores) : 0;

  const totalCorrect = data.chapters.reduce(
    (sum, chapter) =>
      sum +
      chapter.attempts.reduce((chapterSum, a) => chapterSum + a.correctCount, 0),
    0,
  );

  const totalQuestions = data.chapters.reduce(
    (sum, chapter) =>
      sum +
      chapter.attempts.reduce((chapterSum, a) => chapterSum + a.totalQuestions, 0),
    0,
  );

  return (
    <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-xs font-medium text-muted-foreground">
            Total Attempts
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold">{totalAttempts}</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-xs font-medium text-muted-foreground">
            Average Score
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold">{averageScore}%</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-xs font-medium text-muted-foreground">
            Best Score
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold">{bestScore}%</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-xs font-medium text-muted-foreground">
            Correct Answers
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold">
            {totalCorrect}/{totalQuestions}
          </p>
        </CardContent>
      </Card>
    </div>
  );
};
