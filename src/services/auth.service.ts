import { API_ROUTES } from "@/api/routes";
import { api } from "@/utils/api-client";
import { clearAuthSession, setAuthSession } from "@/utils/auth-session";
import type {
  BaseApiResponse,
  ForgotPasswordRequest,
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RegisterResponse,
  ResetPasswordRequest,
} from "@/models/auth.model";

export const authService = {
  login: async (credentials: LoginRequest): Promise<LoginResponse> => {
    const response = await api.post<LoginResponse>(
      API_ROUTES.AUTH.LOGIN,
      credentials,
    );

    if (response.token && response.user) {
      setAuthSession(response.token, response.user);
    }
    return response;
  },

  register: async (userData: RegisterRequest): Promise<RegisterResponse> => {
    return api.post<RegisterResponse>(API_ROUTES.AUTH.REGISTER, userData);
  },

  logout: () => {
    clearAuthSession();
  },

  forgotPassword: async (
    payload: ForgotPasswordRequest,
  ): Promise<BaseApiResponse> => {
    return api.post<BaseApiResponse>(
      API_ROUTES.AUTH.FORGOT_PASSWORD,
      payload,
    );
  },

  validateResetToken: async (token: string): Promise<BaseApiResponse<boolean>> => {
    const query = new URLSearchParams({ token }).toString();
    return api.get<BaseApiResponse<boolean>>(
      `${API_ROUTES.AUTH.VALIDATE_RESET_TOKEN}?${query}`,
    );
  },

  resetPassword: async (
    payload: ResetPasswordRequest,
  ): Promise<BaseApiResponse> => {
    return api.post<BaseApiResponse>(
      API_ROUTES.AUTH.RESET_PASSWORD,
      payload,
    );
  },
};
