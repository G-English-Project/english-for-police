import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import type { GeneralAttemptItem } from "@/models/general-attempts.model";

interface AttemptsTrendChartProps {
  attempts: GeneralAttemptItem[];
}

export const AttemptsTrendChart: React.FC<AttemptsTrendChartProps> = ({
  attempts,
}) => {
  const chartData = attempts.map((attempt) => ({
    name: `Attempt ${attempt.attemptNumber}`,
    score: attempt.finalScore,
    correct: attempt.correctCount,
    total: attempt.totalQuestions,
  }));

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line
          type="monotone"
          dataKey="score"
          stroke="#2563eb"
          name="Score"
          strokeWidth={2}
        />
        <Line
          type="monotone"
          dataKey="correct"
          stroke="#10b981"
          name="Correct Answers"
          strokeWidth={2}
        />
      </LineChart>
    </ResponsiveContainer>
  );
};
