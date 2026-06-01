import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Loader2 } from "lucide-react";
import type { GeneralAttemptStudentDetail } from "@/models/general-attempts.model";
import { AttemptsStatsSummary } from "../charts/AttemptsStatsSummary";
import { AttemptsDetailTable } from "../charts/AttemptsDetailTable";

interface StudentGeneralAttemptsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  data: GeneralAttemptStudentDetail | null;
  isLoading: boolean;
  error: Error | null;
}

export const StudentGeneralAttemptsDialog: React.FC<
  StudentGeneralAttemptsDialogProps
> = ({ open, onOpenChange, data, isLoading, error }) => {
  if (!data && !isLoading && !error) {
    return null;
  }

  const allAttempts = data?.chapters.flatMap((c) => c.attempts) ?? [];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-full max-w-xl sm:max-w-2xl md:max-w-6xl max-h-[90vh] overflow-y-auto p-4 sm:p-6">
        <DialogHeader>
          <DialogTitle className="text-xl">
            {isLoading ? (
              <span className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                Đang tải dữ liệu lần làm...
              </span>
            ) : error ? (
              <span className="text-red-600">Lỗi khi tải dữ liệu</span>
            ) : (
              `${data?.fullName} - Lần làm bài kiểm tra chung`
            )}
          </DialogTitle>
        </DialogHeader>

        {isLoading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : error ? (
          <div className="text-center py-8 text-red-600">
            <p className="font-semibold">{error.message}</p>
          </div>
        ) : data ? (
          <div className="space-y-6 sm:space-y-8">
            {/* Overview Section */}
            <section>
              <h2 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">Tổng quan</h2>
              <AttemptsStatsSummary data={data} />
              {allAttempts.length === 0 && (
                <div className="text-center py-4 text-muted-foreground">
                  Chưa có lần làm nào
                </div>
              )}
            </section>

            {/* Details Section */}
            {allAttempts.length > 0 && (
              <section>
                <h2 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">Chi tiết lần làm</h2>
                <AttemptsDetailTable data={data} />
              </section>
            )}
          </div>
        ) : null}
      </DialogContent>
    </Dialog>
  );
};

