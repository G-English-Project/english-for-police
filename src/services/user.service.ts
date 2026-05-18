import { API_ROUTES } from "@/api/routes";
import { api } from "@/utils/api-client";

export interface UserListItem {
  userId: number;
  shownId: string;
  email: string;
  fullName: string;
  role: string;
  createdAt?: string;
}

export interface UserDetail {
  userId: number;
  shownId: string;
  email: string;
  fullName: string;
  role: string;
  createdAt: string;
  currentStreak: number;
}

export interface UserContributionItem {
  date: string;
  count: number;
}

interface UserListResponse {
  code: string;
  message: string;
  data: {
    items: UserListItem[];
    page: number;
    size: number;
    totalElements: number;
    totalPages: number;
  };
}

interface ApiResponse<T> {
  code: string;
  message: string;
  data: T;
}

export const userService = {
  getUsers: async (params?: {
    page?: number;
    size?: number;
    searchName?: string;
  }) => {
    const query = new URLSearchParams();
    query.set("page", String(params?.page ?? 0));
    query.set("size", String(params?.size ?? 50));
    if (params?.searchName && params.searchName.trim()) {
      query.set("searchName", params.searchName.trim());
    }
    const endpoint = `${API_ROUTES.USER.LIST}?${query.toString()}`;
    const response = await api.get<UserListResponse>(endpoint);
    return response.data;
  },

  getUserById: async (userId: number): Promise<UserDetail> => {
    const response = await api.get<ApiResponse<UserDetail>>(
      API_ROUTES.USER.DETAIL(userId),
    );
    return response.data;
  },

  getUserContributions: async (
    userId: number,
    filters?: { year?: number; startDate?: string; endDate?: string },
  ): Promise<UserContributionItem[]> => {
    const params = new URLSearchParams();
    if (filters?.year !== undefined) params.set("year", String(filters.year));
    if (filters?.startDate) params.set("startDate", filters.startDate);
    if (filters?.endDate) params.set("endDate", filters.endDate);

    const baseEndpoint = API_ROUTES.USER.CONTRIBUTIONS(userId);
    const endpoint = params.size
      ? `${baseEndpoint}?${params.toString()}`
      : baseEndpoint;
    const response =
      await api.get<ApiResponse<UserContributionItem[]>>(endpoint);
    return response.data;
  },
};
