import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { AdminReportStudentSummary } from "@/models/admin.model";

interface DashboardHighlightsProps {
  topStudents: AdminReportStudentSummary[];
  atRiskStudents: AdminReportStudentSummary[];
  onSelectStudent: (userId: number) => void;
}

function StudentHighlightList({
  title,
  students,
  emptyText,
  variant,
  onSelectStudent,
}: {
  title: string;
  students: AdminReportStudentSummary[];
  emptyText: string;
  variant: "top" | "risk";
  onSelectStudent: (userId: number) => void;
}) {
  return (
    <Card className="border border-slate-200 bg-white shadow-sm">
      <CardHeader className="border-b border-slate-100 bg-slate-50 px-5 py-4">
        <CardTitle className="text-sm font-bold text-slate-900">{title}</CardTitle>
      </CardHeader>
      <CardContent className="divide-y divide-slate-100 p-0">
        {students.length === 0 ? (
          <p className="px-5 py-6 text-center text-sm text-slate-500">{emptyText}</p>
        ) : (
          students.map((s) => (
            <button
              key={s.userId}
              type="button"
              className="flex w-full items-center justify-between gap-3 px-5 py-3 text-left transition-colors hover:bg-slate-50"
              onClick={() => onSelectStudent(s.userId)}
            >
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-slate-900">
                  {s.fullName}
                </p>
                <p className="truncate text-xs text-slate-500">{s.email}</p>
              </div>
              <div className="shrink-0 text-right">
                <p
                  className={`text-xs font-bold tabular-nums ${
                    variant === "risk" ? "text-amber-600" : "text-emerald-600"
                  }`}
                >
                  {Math.round(s.overallProgressPercent)}% ·{" "}
                  {(s.overallScorePercent / 10).toFixed(1)}/10
                </p>
                <p className="text-[10px] text-slate-400">{s.lastActiveLabel}</p>
              </div>
            </button>
          ))
        )}
      </CardContent>
    </Card>
  );
}

export function DashboardHighlights({
  topStudents,
  atRiskStudents,
  onSelectStudent,
}: DashboardHighlightsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <StudentHighlightList
        title="Học viên nổi bật"
        students={topStudents}
        emptyText="Chưa có dữ liệu top học viên."
        variant="top"
        onSelectStudent={onSelectStudent}
      />
      <StudentHighlightList
        title="Cần chú ý"
        students={atRiskStudents}
        emptyText="Không có học viên at-risk trong kỳ."
        variant="risk"
        onSelectStudent={onSelectStudent}
      />
    </div>
  );
}
