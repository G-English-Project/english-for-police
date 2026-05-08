import { API_ROUTES } from "@/api/routes";
import type { Unit } from "@/types";
import { api } from "@/utils/api-client";

interface ApiResponse<T> {
  code: string;
  data: T;
  message: string;
}

export const lessonService = {
  getLessons: async (): Promise<Unit[]> => {
    const response = await api.get<ApiResponse<Unit[]>>(API_ROUTES.LESSONS.LIST);
    return response.data;
  },

  getLessonByUnitNumber: async (unitNumber: number): Promise<Unit> => {
    const response = await api.get<ApiResponse<Unit>>(
      API_ROUTES.LESSONS.DETAIL(unitNumber),
    );
    return response.data;
  },

  importLessons: async (lessons: Unit[]): Promise<string> => {
    const response = await api.post<ApiResponse<string>>(
      API_ROUTES.LESSONS.IMPORT,
      lessons,
    );
    return response.data;
  },
};
