import { Link } from "react-router-dom";
import { Search } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { PaginationControls } from "@/components/common/PaginationControls";
import type { AdminReportStudentSummary } from "@/models/admin.model";

interface DashboardStudentTableProps {
  students: AdminReportStudentSummary[];
  filteredStudents: AdminReportStudentSummary[];
  paginatedStudents: AdminReportStudentSummary[];
  searchQuery: string;
  onSearchQueryChange: (value: string) => void;
  currentPage: number;
  totalPages: number;
  onPrevPage: () => void;
  onNextPage: () => void;
  onOpenStudent: (userId: number) => void;
}

export function DashboardStudentTable({
  students,
  filteredStudents,
  paginatedStudents,
  searchQuery,
  onSearchQueryChange,
  currentPage,
  totalPages,
  onPrevPage,
  onNextPage,
  onOpenStudent,
}: DashboardStudentTableProps) {
  return (
    <Card className="border border-slate-200 bg-white shadow-sm">
      <CardHeader className="border-b border-slate-100 bg-slate-50 px-6 py-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <CardTitle className="text-lg font-bold text-slate-900">
            Danh sách học viên
          </CardTitle>
          <Badge className="bg-slate-100 font-medium text-slate-700">
            {filteredStudents.length}/{students.length} học viên
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4 p-6">
        <div className="relative max-w-md">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <Input
            value={searchQuery}
            onChange={(e) => onSearchQueryChange(e.target.value)}
            placeholder="Tìm theo tên hoặc email..."
            className="border-slate-300 pl-9 focus-visible:ring-slate-400"
          />
        </div>

        {paginatedStudents.length > 0 ? (
          <>
            <div className="overflow-x-auto rounded-md border border-slate-200">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50">
                    <th className="px-4 py-3 text-left font-semibold text-slate-900">
                      Học viên
                    </th>
                    <th className="px-4 py-3 text-left font-semibold text-slate-900">
                      Email
                    </th>
                    <th className="px-4 py-3 text-center font-semibold text-slate-900">
                      Tiến độ
                    </th>
                    <th className="px-4 py-3 text-center font-semibold text-slate-900">
                      Điểm
                    </th>
                    <th className="px-4 py-3 text-center font-semibold text-slate-900">
                      Hoạt động
                    </th>
                    <th className="px-4 py-3 text-center font-semibold text-slate-900">
                      Thao tác
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedStudents.map((student) => (
                    <tr
                      key={student.userId}
                      className="border-b border-slate-100 last:border-b-0"
                    >
                      <td className="px-4 py-3 font-medium text-slate-900">
                        {student.fullName}
                      </td>
                      <td className="px-4 py-3 text-slate-600">{student.email}</td>
                      <td className="px-4 py-3 text-center font-semibold tabular-nums text-slate-700">
                        {Math.round(student.overallProgressPercent)}%
                      </td>
                      <td className="px-4 py-3 text-center font-semibold tabular-nums text-slate-700">
                        {(student.overallScorePercent / 10).toFixed(1)}/10
                      </td>
                      <td className="px-4 py-3 text-center text-xs text-slate-500">
                        {student.lastActiveLabel || "—"}
                      </td>
                      <td className="whitespace-nowrap px-4 py-3 text-center">
                        <div className="inline-flex items-center justify-center gap-1.5">
                          <Button
                            type="button"
                            size="sm"
                            variant="outline"
                            className="h-8 px-3 text-[10px] font-bold"
                            onClick={() => onOpenStudent(student.userId)}
                          >
                            Chi tiết
                          </Button>
                          <Button
                            size="sm"
                            variant="default"
                            className="h-8 px-3 text-[10px] font-bold"
                            asChild
                          >
                            <Link
                              to={`/admin/students/${student.userId}/evaluation`}
                            >
                              Đánh giá
                            </Link>
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <PaginationControls
              currentPage={currentPage}
              totalPages={totalPages}
              currentItemsCount={paginatedStudents.length}
              onPrevPage={onPrevPage}
              onNextPage={onNextPage}
            />
          </>
        ) : (
          <p className="text-sm text-slate-500">
            {students.length === 0
              ? "Chưa có học viên từ API."
              : "Không tìm thấy học viên phù hợp."}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
