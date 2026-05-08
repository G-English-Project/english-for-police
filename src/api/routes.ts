import { API_BASE_URL } from "@/config/api";

export { API_BASE_URL };

export const API_ROUTES = {
  AUTH: {
    LOGIN: "/api/v1/auth/login",
    REGISTER: "/api/v1/auth/register",
  },
  PROGRESS: {
    SUBMIT_ATTEMPT: "/api/v1/progress/attempts",
    GET_PROGRESS: "/api/v1/progress",
  },
  REPORTS: {
    DASHBOARD_OVERVIEW: "/api/v1/reports/dashboard/overview",
    STUDENTS: "/api/v1/reports/dashboard/students",
    STUDENT_DETAIL: "/api/v1/reports/dashboard/students", // + /{userId}
    COMPARE: "/api/v1/reports/dashboard/compare",
  },
  REPORTS: {
    DASHBOARD_STUDENTS: "/api/v1/reports/dashboard/students",
    DASHBOARD_STUDENT_BY_ID: (userId: number) =>
      `/api/v1/reports/dashboard/students/${userId}`,
    DASHBOARD_OVERVIEW: "/api/v1/reports/dashboard/overview",
    DASHBOARD_COMPARE: "/api/v1/reports/dashboard/compare",
  },
} as const;
