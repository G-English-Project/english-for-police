import { useCallback, useState } from "react";
import { authService } from "@/services/auth.service";
import { useSonner } from "@/hooks/use-sonner";

export function usePasswordReset() {
  const { notifySuccess, notifyError } = useSonner();
  const [isLoading, setIsLoading] = useState(false);

  const requestForgotPassword = useCallback(async (email: string) => {
    const normalizedEmail = email.trim().toLowerCase();
    setIsLoading(true);
    try {
      const response = await authService.forgotPassword({
        email: normalizedEmail,
      });
      notifySuccess(
        "Đã gửi yêu cầu",
        response.message ||
          "Nếu email tồn tại trong hệ thống, bạn sẽ nhận được hướng dẫn đặt lại mật khẩu qua email.",
      );
      return response;
    } catch (err) {
      const apiError = err as { message?: string };
      const message =
        apiError.message ||
        "Không thể gửi yêu cầu. Vui lòng thử lại sau.";
      notifyError("Gửi yêu cầu thất bại", message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [notifySuccess, notifyError]);

  const validateResetToken = useCallback(async (token: string) => {
    const response = await authService.validateResetToken(token);
    return response.data === true;
  }, []);

  const resetPassword = useCallback(async (token: string, newPassword: string) => {
    setIsLoading(true);
    try {
      const response = await authService.resetPassword({ token, newPassword });
      notifySuccess(
        "Đặt lại mật khẩu thành công",
        response.message ||
          "Vui lòng đăng nhập bằng mật khẩu mới.",
      );
      return response;
    } catch (err) {
      const apiError = err as { message?: string };
      const message =
        apiError.message ||
        "Không thể đặt lại mật khẩu. Vui lòng thử lại.";
      notifyError("Đặt lại mật khẩu thất bại", message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [notifySuccess, notifyError]);

  return {
    isLoading,
    requestForgotPassword,
    validateResetToken,
    resetPassword,
  };
}
