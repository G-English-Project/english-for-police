import { useCallback, useEffect, useState } from "react";
import { generalAttemptsService } from "@/services/general-attempts.service";
import type { GeneralAttemptStudentDetail } from "@/models/general-attempts.model";
import { useSonner } from "@/hooks/use-sonner";

interface UseStudentGeneralAttemptsReturn {
  data: GeneralAttemptStudentDetail | null;
  isLoading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

export function useStudentGeneralAttempts(
  userId: number | null,
): UseStudentGeneralAttemptsReturn {
  const [data, setData] = useState<GeneralAttemptStudentDetail | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const { notifyError } = useSonner();

  const fetchData = useCallback(async () => {
    if (!userId) return;

    setIsLoading(true);
    setError(null);
    try {
      const result = await generalAttemptsService.getStudentDetail(userId);
      setData(result);
    } catch (err) {
      const errorMsg =
        err instanceof Error ? err.message : "Failed to fetch student attempts";
      setError(new Error(errorMsg));
      notifyError(errorMsg);
    } finally {
      setIsLoading(false);
    }
  }, [notifyError, userId]);

  useEffect(() => {
    if (!userId) return;

    const loadStudentAttempts = async () => {
      await fetchData();
    };

    void loadStudentAttempts();
  }, [userId, fetchData]);

  const refetch = async () => {
    await fetchData();
  };

  return { data, isLoading, error, refetch };
}
