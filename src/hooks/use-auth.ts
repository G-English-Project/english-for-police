import { useEffect, useState } from "react";
import { authService } from "@/services/auth.service";
import type { LoginRequest, RegisterRequest } from "@/models/auth.model";
import type { User } from "@/models/user.model";
import { useSonner } from "@/hooks/use-sonner";
import {
  AUTH_SESSION_CHANGED_EVENT,
  clearAuthSession,
  getAuthToken,
  getStoredAuthUser,
  handleUnauthorizedSession,
  isJwtExpired,
  setAuthSession,
} from "@/utils/auth-session";

const AUTH_CHANGED_EVENT = AUTH_SESSION_CHANGED_EVENT;

export function useAuth() {
  const { notifySuccess, notifyAuthError, notifyError, notifyInfo } =
    useSonner();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(() => {
    const token = getAuthToken();
    if (token && isJwtExpired(token)) {
      clearAuthSession();
      return null;
    }
    return getStoredAuthUser();
  });

  useEffect(() => {
    const syncAuth = () => setUser(getStoredAuthUser());
    window.addEventListener("storage", syncAuth);
    window.addEventListener(AUTH_CHANGED_EVENT, syncAuth);
    return () => {
      window.removeEventListener("storage", syncAuth);
      window.removeEventListener(AUTH_CHANGED_EVENT, syncAuth);
    };
  }, []);

  // Edge case: token expires in the tiny window between the state initializer
  // and effects running. The initializer already handles already-expired tokens;
  // API responses (401/403) handle the mid-session case.
  useEffect(() => {
    const token = getAuthToken();
    if (token && isJwtExpired(token)) {
      handleUnauthorizedSession({ reason: "expired" });
    }
  }, []);

  useEffect(() => {
    const onFocus = () => {
      const token = getAuthToken();
      if (token && isJwtExpired(token)) {
        handleUnauthorizedSession({ reason: "expired" });
        setUser(null);
      }
    };
    window.addEventListener("focus", onFocus);
    return () => window.removeEventListener("focus", onFocus);
  }, []);

  useEffect(() => {
    const interval = window.setInterval(() => {
      const token = getAuthToken();
      if (token && isJwtExpired(token)) {
        handleUnauthorizedSession({ reason: "expired" });
      }
    }, 60_000);
    return () => window.clearInterval(interval);
  }, []);

  const login = async (data: LoginRequest) => {
    const processedData = { ...data, email: data.email.toLowerCase() };
    setIsLoading(true);
    setError(null);
    try {
      const response = await authService.login(processedData);
      setUser(response.user);
      if (response.token) {
        setAuthSession(response.token, response.user);
      }
      window.dispatchEvent(new Event(AUTH_CHANGED_EVENT));
      notifySuccess(
        "Đăng nhập thành công",
        "Chào mừng bạn quay trở lại hệ thống.",
      );
      return response;
    } catch (err) {
      const apiError = err as { message?: string };
      const message =
        apiError.message ||
        "Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin.";
      setError(message);
      notifyAuthError(err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (data: RegisterRequest) => {
    const processedData = { ...data, email: data.email.toLowerCase() };
    setIsLoading(true);
    setError(null);
    try {
      const response = await authService.register(processedData);
      notifySuccess(
        "Đăng ký thành công",
        "Tài khoản đã được tạo. Vui lòng đăng nhập để tiếp tục.",
      );
      return response;
    } catch (err) {
      const apiError = err as { message?: string };
      const message =
        apiError.message || "Đăng ký thất bại. Vui lòng thử lại sau.";
      setError(message);
      notifyError("Đăng ký thất bại", message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    authService.logout();
    setUser(null);
    window.dispatchEvent(new Event(AUTH_CHANGED_EVENT));
    notifyInfo("Đăng xuất thành công");
  };

  return {
    user,
    isLoading,
    error,
    login,
    register,
    logout,
    isAuthenticated: !!user,
    setError,
  };
}
