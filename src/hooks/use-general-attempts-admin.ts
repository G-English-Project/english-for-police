import { useCallback, useState } from "react";
import { generalAttemptsService } from "@/services/general-attempts.service";
import { useSonner } from "@/hooks/use-sonner";
import type {
  GeneralAttemptStudentDetail,
  GeneralAttemptStudentSummary,
} from "@/models/general-attempts.model";

export function useGeneralAttemptsAdmin() {
  const { notifyError } = useSonner();
  const [isLoading, setIsLoading] = useState(false);
  const [students, setStudents] = useState<GeneralAttemptStudentSummary[]>([]);
  const [detail, setDetail] = useState<GeneralAttemptStudentDetail | null>(null);
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);

  const loadStudents = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await generalAttemptsService.listStudents();
      setStudents(data);
      return data;
    } catch (err) {
      const message =
        (err as { message?: string }).message ||
        "Không thể tải danh sách học viên.";
      notifyError("Tải dữ liệu thất bại", message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [notifyError]);

  const loadStudentDetail = useCallback(
    async (userId: number) => {
      setIsLoading(true);
      setSelectedUserId(userId);
      try {
        const data = await generalAttemptsService.getStudentDetail(userId);
        setDetail(data);
        return data;
      } catch (err) {
        const message =
          (err as { message?: string }).message ||
          "Không thể tải lịch sử kiểm tra.";
        notifyError("Tải chi tiết thất bại", message);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [notifyError],
  );

  const clearDetail = useCallback(() => {
    setSelectedUserId(null);
    setDetail(null);
  }, []);

  return {
    isLoading,
    students,
    detail,
    selectedUserId,
    loadStudents,
    loadStudentDetail,
    clearDetail,
  };
}
