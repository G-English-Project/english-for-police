import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { GeneralAttemptStudentDetail } from "@/models/general-attempts.model";
import { format } from "date-fns";
import { vi } from "date-fns/locale";

interface AttemptsDetailTableProps {
  data: GeneralAttemptStudentDetail;
}

export const AttemptsDetailTable: React.FC<AttemptsDetailTableProps> = ({
  data,
}) => {
  return (
    <div className="space-y-4 sm:space-y-6">
      {data.chapters.map((chapter) => (
        <div key={chapter.unitNumber} className="space-y-2">
          <h4 className="font-semibold text-xs sm:text-sm">
            {chapter.unitTitle} (Unit {chapter.unitNumber})
          </h4>
          {chapter.attempts.length === 0 ? (
            <p className="text-xs text-muted-foreground">Chưa có lần làm nào</p>
          ) : (
            <div className="overflow-x-auto rounded-md">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-xs">Lần</TableHead>
                    <TableHead className="text-xs">Điểm</TableHead>
                    <TableHead className="text-xs">Đúng</TableHead>
                    <TableHead className="text-xs">Tổng</TableHead>
                    <TableHead className="text-xs text-right">Nộp lúc</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {chapter.attempts.map((attempt) => (
                    <TableRow key={attempt.attemptId} className="text-xs">
                      <TableCell>{attempt.attemptNumber}</TableCell>
                      <TableCell className="font-semibold">
                        {attempt.finalScore}%
                      </TableCell>
                      <TableCell>{attempt.correctCount}</TableCell>
                      <TableCell>{attempt.totalQuestions}</TableCell>
                      <TableCell className="text-right whitespace-nowrap">
                        {format(new Date(attempt.submittedAt), "dd MMM, HH:mm", { locale: vi })}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};
