import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  ChevronRight,
  ClipboardList,
  Loader2,
  RefreshCw,
  Search,
} from "lucide-react";
import { AdminPageLayout } from "@/components/admin/AdminPageLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useDebouncedValue } from "@/hooks/app/use-debounced-value";
import { useGeneralAttemptsAdmin } from "@/hooks/use-general-attempts-admin";

function formatScore(value: number): string {
  const n = Number(value);
  if (!Number.isFinite(n)) return "—";
  return `${Math.round(n)}%`;
}

function formatDateTime(iso: string): string {
  return new Date(iso).toLocaleString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function GeneralAttemptsPage() {
  const {
    isLoading,
    students,
    detail,
    selectedUserId,
    loadStudents,
    loadStudentDetail,
    clearDetail,
  } = useGeneralAttemptsAdmin();

  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearch = useDebouncedValue(searchQuery, 300);

  useEffect(() => {
    void loadStudents();
  }, [loadStudents]);

  const filteredStudents = useMemo(() => {
    const q = debouncedSearch.trim().toLowerCase();
    if (!q) return students;
    return students.filter(
      (s) =>
        s.fullName.toLowerCase().includes(q) ||
        s.email.toLowerCase().includes(q),
    );
  }, [students, debouncedSearch]);

  return (
    <AdminPageLayout
      title="Từng làm — Kiểm tra tổng quát"
      description="Danh sách học viên đã nộp bài kiểm tra tổng quát. Chọn học viên để xem theo từng chương và từng lần làm bài."
      actions={
        <div className="flex gap-2">
          <Button variant="outline" size="sm" asChild>
            <Link to="/admin/units">
              <ArrowLeft className="mr-1 h-4 w-4" />
              Bảng điều khiển
            </Link>
          </Button>
          <Button
            variant="outline"
            size="sm"
            disabled={isLoading}
            onClick={() => {
              if (selectedUserId != null) {
                void loadStudentDetail(selectedUserId);
              } else {
                void loadStudents();
              }
            }}
          >
            <RefreshCw
              className={`mr-1 h-4 w-4 ${isLoading ? "animate-spin" : ""}`}
            />
            Làm mới
          </Button>
        </div>
      }
    >
      <div className="grid gap-6 lg:grid-cols-2">
        <section className="rounded-lg border border-border bg-card p-4 shadow-sm">
          <div className="mb-4 flex items-center gap-2">
            <ClipboardList className="h-5 w-5 text-primary" />
            <h2 className="text-sm font-bold uppercase tracking-wide text-foreground">
              Học viên
            </h2>
            <Badge variant="secondary" className="ml-auto text-[10px]">
              {filteredStudents.length}
            </Badge>
          </div>

          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Tìm theo tên hoặc email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>

          {isLoading && students.length === 0 ? (
            <div className="flex h-32 items-center justify-center text-muted-foreground">
              <Loader2 className="h-6 w-6 animate-spin" />
            </div>
          ) : filteredStudents.length === 0 ? (
            <p className="py-8 text-center text-sm text-muted-foreground">
              Chưa có học viên nào nộp kiểm tra tổng quát (testType GENERAL).
            </p>
          ) : (
            <ul className="max-h-[min(70vh,520px)] space-y-1 overflow-y-auto">
              {filteredStudents.map((student) => {
                const isActive = selectedUserId === student.userId;
                return (
                  <li key={student.userId}>
                    <button
                      type="button"
                      className={`flex w-full items-center justify-between gap-2 rounded-md border px-3 py-2.5 text-left text-sm transition-colors ${
                        isActive
                          ? "border-primary/40 bg-primary/5"
                          : "border-transparent hover:border-border hover:bg-muted/50"
                      }`}
                      onClick={() => void loadStudentDetail(student.userId)}
                    >
                      <div className="min-w-0 flex-1">
                        <p className="truncate font-semibold text-foreground">
                          {student.fullName}
                        </p>
                        <p className="truncate text-[11px] text-muted-foreground">
                          {student.email}
                        </p>
                      </div>
                      <div className="flex shrink-0 items-center gap-2">
                        <Badge variant="outline" className="text-[10px]">
                          {student.generalAttemptCount} lần
                        </Badge>
                        <Badge variant="outline" className="text-[10px]">
                          {student.chapterCount} chương
                        </Badge>
                        <ChevronRight className="h-4 w-4 text-muted-foreground" />
                      </div>
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </section>

        <section className="rounded-lg border border-border bg-card p-4 shadow-sm">
          {!detail ? (
            <div className="flex h-full min-h-[280px] flex-col items-center justify-center gap-2 text-center text-muted-foreground">
              <ClipboardList className="h-10 w-10 opacity-30" />
              <p className="text-sm font-medium">
                Chọn một học viên để xem lịch sử theo chương
              </p>
            </div>
          ) : (
            <>
              <div className="mb-4 flex items-start justify-between gap-2 border-b border-border pb-3">
                <div>
                  <h2 className="text-base font-bold text-foreground">
                    {detail.fullName}
                  </h2>
                  <p className="text-xs text-muted-foreground">{detail.email}</p>
                </div>
                <Button variant="ghost" size="sm" onClick={clearDetail}>
                  Đóng
                </Button>
              </div>

              {isLoading ? (
                <div className="flex h-40 items-center justify-center">
                  <Loader2 className="h-6 w-6 animate-spin text-primary" />
                </div>
              ) : detail.chapters.length === 0 ? (
                <p className="py-8 text-center text-sm text-muted-foreground">
                  Học viên chưa có bài kiểm tra tổng quát được lưu.
                </p>
              ) : (
                <Accordion type="multiple" className="w-full">
                  {detail.chapters.map((chapter) => (
                    <AccordionItem
                      key={chapter.unitNumber}
                      value={`unit-${chapter.unitNumber}`}
                    >
                      <AccordionTrigger className="text-sm font-semibold hover:no-underline">
                        <span>
                          Chương {chapter.unitNumber}
                          {chapter.unitTitle ? ` — ${chapter.unitTitle}` : ""}
                        </span>
                        <Badge
                          variant="secondary"
                          className="ml-2 text-[10px] font-normal"
                        >
                          {chapter.attempts.length} lần
                        </Badge>
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="overflow-hidden rounded-md border border-border">
                          <table className="w-full text-xs">
                            <thead>
                              <tr className="border-b border-border bg-muted/50">
                                <th className="px-3 py-2 text-left font-semibold">
                                  Lần
                                </th>
                                <th className="px-3 py-2 text-center font-semibold">
                                  Điểm
                                </th>
                                <th className="px-3 py-2 text-center font-semibold">
                                  Đúng / Tổng
                                </th>
                                <th className="px-3 py-2 text-right font-semibold">
                                  Thời gian
                                </th>
                              </tr>
                            </thead>
                            <tbody>
                              {chapter.attempts.map((attempt) => (
                                <tr
                                  key={attempt.attemptId}
                                  className="border-b border-border/60 last:border-b-0"
                                >
                                  <td className="px-3 py-2 font-medium">
                                    Lần {attempt.attemptNumber}
                                  </td>
                                  <td className="px-3 py-2 text-center font-bold tabular-nums text-primary">
                                    {formatScore(attempt.finalScore ?? attempt.score)}
                                  </td>
                                  <td className="px-3 py-2 text-center tabular-nums text-muted-foreground">
                                    {attempt.correctCount}/{attempt.totalQuestions}
                                  </td>
                                  <td className="px-3 py-2 text-right text-muted-foreground">
                                    {formatDateTime(attempt.submittedAt)}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              )}
            </>
          )}
        </section>
      </div>
    </AdminPageLayout>
  );
}
