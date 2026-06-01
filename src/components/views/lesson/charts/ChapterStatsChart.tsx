import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import type { ChapterGeneralAttempts } from "@/models/general-attempts.model";

interface ChapterStatsChartProps {
  chapters: ChapterGeneralAttempts[];
}

export const ChapterStatsChart: React.FC<ChapterStatsChartProps> = ({
  chapters,
}) => {
  const chartData = chapters.map((chapter) => ({
    name: `Unit ${chapter.unitNumber}`,
    attempts: chapter.attempts.length,
    bestScore: Math.max(...chapter.attempts.map((a) => a.finalScore), 0),
    avgScore:
      chapter.attempts.length > 0
        ? Math.round(
            chapter.attempts.reduce((sum, a) => sum + a.finalScore, 0) /
              chapter.attempts.length,
          )
        : 0,
  }));

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="bestScore" fill="#10b981" name="Best Score" />
        <Bar dataKey="avgScore" fill="#f59e0b" name="Average Score" />
        <Bar dataKey="attempts" fill="#3b82f6" name="Attempt Count" />
      </BarChart>
    </ResponsiveContainer>
  );
};
