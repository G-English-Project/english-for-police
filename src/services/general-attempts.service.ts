import { API_ROUTES } from "@/api/routes";
import { api } from "@/utils/api-client";
import type {
  ApiResponse,
  GeneralAttemptStudentDetail,
  GeneralAttemptStudentSummary,
} from "@/models/general-attempts.model";

export const generalAttemptsService = {
  listStudents: async (): Promise<GeneralAttemptStudentSummary[]> => {
    const response = await api.get<
      ApiResponse<GeneralAttemptStudentSummary[]>
    >(API_ROUTES.ADMIN.GENERAL_ATTEMPT_STUDENTS);
    return response.data;
  },

  getStudentDetail: async (
    userId: number,
  ): Promise<GeneralAttemptStudentDetail> => {
    const response = await api.get<ApiResponse<GeneralAttemptStudentDetail>>(
      API_ROUTES.ADMIN.GENERAL_ATTEMPT_STUDENT(userId),
    );
    return response.data;
  },
};
