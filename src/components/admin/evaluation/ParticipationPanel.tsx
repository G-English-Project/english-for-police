import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { ParticipationResponse } from "@/models/evaluation.model";
import { EvaluationEmptyState } from "./EvaluationEmptyState";

interface ParticipationPanelProps {
  participation: ParticipationResponse;
}

type ParticipationMetricKey = Exclude<
  keyof ParticipationResponse,
  "period"
>;

const METRICS: {
  key: ParticipationMetricKey;
  label: string;
  hint: string;
}[] = [
  { key: "activeDays", label: "Ngày hoạt động", hint: "Số ngày có log trong kỳ" },
  {
    key: "activityEventSum",
    label: "Tổng sự kiện",
    hint: "Tổng ActivityLog.count trong kỳ",
  },
  {
    key: "unitsCompleted",
    label: "Chương hoàn thành",
    hint: "Hoàn thành trong kỳ",
  },
  {
    key: "unitsInProgress",
    label: "Đang học",
    hint: "Chương IN_PROGRESS hiện tại",
  },
  {
    key: "totalAttempts",
    label: "Lần nộp bài",
    hint: "StudentAttempt trong kỳ",
  },
  {
    key: "retryCount",
    label: "Làm lại",
    hint: "Lần nộp thừa sau lần đầu mỗi chương",
  },
];

function isParticipationEmpty(p: ParticipationResponse): boolean {
  return (
    p.totalAttempts === 0 &&
    p.activeDays === 0 &&
    p.activityEventSum === 0
  );
}

export function ParticipationPanel({ participation }: ParticipationPanelProps) {
  const empty = isParticipationEmpty(participation);

  return (
    <Card className="min-w-0 border border-slate-200 bg-white shadow-sm">
      <CardHeader className="border-b border-slate-100 bg-slate-50 px-5 py-4">
        <CardTitle className="text-base font-bold text-slate-900">
          Tham gia
        </CardTitle>
        <p className="text-xs text-slate-500">
          Kỳ {participation.period.from} → {participation.period.to}
        </p>
      </CardHeader>
      <CardContent className="p-5">
        {empty ? (
          <EvaluationEmptyState variant="participation" />
        ) : (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {METRICS.map(({ key, label, hint }) => {
              const value = participation[key];
              return (
                <div
                  key={key}
                  className="rounded-lg border border-slate-100 bg-slate-50/80 p-3"
                  title={hint}
                >
                  <p className="text-[10px] font-bold uppercase tracking-wide text-slate-500">
                    {label}
                  </p>
                  <p className="mt-1 text-2xl font-black text-slate-900">
                    {value}
                  </p>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
