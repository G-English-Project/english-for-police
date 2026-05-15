import { API_ROUTES } from "@/api/routes";
import { api } from "@/utils/api-client";
import type { ProgressResponse } from "@/models/progress.model";
import type {
  EvaluationQueryParams,
  EvaluationResponse,
  ImprovementDetailResponse,
  ImprovementQueryParams,
} from "@/models/evaluation.model";

function buildQuery(params: EvaluationQueryParams & { unitNumber?: number }) {
  const search = new URLSearchParams();
  if (params.from) search.set("from", params.from);
  if (params.to) search.set("to", params.to);
  if (params.unitNumber !== undefined) {
    search.set("unitNumber", String(params.unitNumber));
  }
  const qs = search.toString();
  return qs ? `?${qs}` : "";
}

export const evaluationService = {
  getStudentEvaluation: async (
    userId: number,
    params: EvaluationQueryParams = {},
  ): Promise<EvaluationResponse> => {
    const endpoint = `${API_ROUTES.EVALUATION.STUDENT(userId)}${buildQuery(params)}`;
    const response =
      await api.get<ProgressResponse<EvaluationResponse>>(endpoint);
    return response.data;
  },

  getStudentImprovement: async (
    userId: number,
    params: ImprovementQueryParams = {},
  ): Promise<ImprovementDetailResponse> => {
    const endpoint = `${API_ROUTES.EVALUATION.IMPROVEMENT(userId)}${buildQuery(params)}`;
    const response =
      await api.get<ProgressResponse<ImprovementDetailResponse>>(endpoint);
    return response.data;
  },
};
