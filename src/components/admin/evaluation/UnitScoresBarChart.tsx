import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { UnitImprovementResponse } from "@/models/evaluation.model";

interface UnitScoresBarChartProps {
  units: UnitImprovementResponse[];
}

export function UnitScoresBarChart({ units }: UnitScoresBarChartProps) {
  if (units.length === 0) return null;

  const data = units.map((u) => ({
    name: `Ch.${u.unitNumber}`,
    first: u.firstScore ?? 0,
    last: u.lastScore ?? 0,
    best: u.bestScore ?? 0,
  }));

  return (
    <div className="h-56 w-full min-w-0">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          <XAxis dataKey="name" tick={{ fontSize: 11 }} />
          <YAxis domain={[0, 100]} tick={{ fontSize: 11 }} />
          <Tooltip />
          <Legend wrapperStyle={{ fontSize: 11 }} />
          <Bar dataKey="first" name="Lần đầu" fill="#94a3b8" radius={[4, 4, 0, 0]} />
          <Bar dataKey="last" name="Lần cuối" fill="#1e3a6e" radius={[4, 4, 0, 0]} />
          <Bar dataKey="best" name="Cao nhất" fill="#ca8a04" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
