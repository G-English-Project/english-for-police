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

interface AttemptsDetailTableProps {
  data: GeneralAttemptStudentDetail;
}

export const AttemptsDetailTable: React.FC<AttemptsDetailTableProps> = ({
  data,
}) => {
  return (
    <div className="space-y-6">
      {data.chapters.map((chapter) => (
        <div key={chapter.unitNumber} className="space-y-2">
          <h4 className="font-semibold text-sm">
            {chapter.unitTitle} (Unit {chapter.unitNumber})
          </h4>
          {chapter.attempts.length === 0 ? (
            <p className="text-xs text-muted-foreground">No attempts yet</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-xs">Attempt #</TableHead>
                  <TableHead className="text-xs">Score</TableHead>
                  <TableHead className="text-xs">Correct</TableHead>
                  <TableHead className="text-xs">Total Q</TableHead>
                  <TableHead className="text-xs">Submitted</TableHead>
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
                    <TableCell>
                      {format(new Date(attempt.submittedAt), "MMM dd, HH:mm")}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>
      ))}
    </div>
  );
};
