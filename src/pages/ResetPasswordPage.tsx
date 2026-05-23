import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { KeyRound, Loader2, CheckCircle, XCircle, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { authService } from "@/services/auth.service";
import type { ApiError } from "@/models/auth.model";

type Status = "validating" | "ready" | "invalid" | "submitting" | "success" | "error";

export default function ResetPasswordPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get("token") ?? "";

  const [status, setStatus] = useState<Status>("validating");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!token) {
      setStatus("invalid");
      return;
    }
    authService
      .validateResetToken(token)
      .then(() => setStatus("ready"))
      .catch(() => setStatus("invalid"));
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setErrorMessage("Mật khẩu xác nhận không khớp.");
      return;
    }
    if (newPassword.length < 8) {
      setErrorMessage("Mật khẩu phải có ít nhất 8 ký tự.");
      return;
    }

    setStatus("submitting");
    setErrorMessage(null);
    try {
      await authService.resetPassword({ token, newPassword });
      setStatus("success");
    } catch (err) {
      const apiErr = err as ApiError;
      setErrorMessage(apiErr.message ?? "Đã có lỗi xảy ra. Vui lòng thử lại.");
      setStatus("error");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden">
        {/* Header */}
        <div className="primary-gradient p-8 text-white relative">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <KeyRound className="h-24 w-24" />
          </div>
          <div className="relative z-10">
            <h1 className="text-3xl font-heading font-black tracking-tight">
              Đặt lại mật khẩu
            </h1>
            <p className="text-sm text-white/70 font-medium mt-1">
              {status === "validating"
                ? "Đang xác thực liên kết..."
                : status === "invalid"
                  ? "Liên kết không hợp lệ hoặc đã hết hạn."
                  : status === "success"
                    ? "Mật khẩu đã được cập nhật thành công."
                    : "Nhập mật khẩu mới cho tài khoản của bạn."}
            </p>
          </div>
        </div>

        <div className="p-8 space-y-6 bg-white/40">
          {/* Validating */}
          {status === "validating" && (
            <div className="flex flex-col items-center justify-center py-8 gap-3 text-muted-foreground">
              <Loader2 className="h-10 w-10 animate-spin text-primary" />
              <p className="text-sm font-medium">Đang xác thực liên kết...</p>
            </div>
          )}

          {/* Invalid token */}
          {status === "invalid" && (
            <div className="flex flex-col items-center justify-center py-6 gap-4 text-center">
              <div className="h-16 w-16 rounded-full bg-destructive/10 flex items-center justify-center">
                <XCircle className="h-10 w-10 text-destructive" />
              </div>
              <div className="space-y-1">
                <p className="font-semibold text-slate-800">
                  Liên kết không hợp lệ
                </p>
                <p className="text-xs text-muted-foreground max-w-xs mx-auto leading-relaxed">
                  Liên kết đặt lại mật khẩu đã hết hạn hoặc đã được sử dụng.
                  Vui lòng yêu cầu một liên kết mới.
                </p>
              </div>
              <Button
                onClick={() => navigate("/")}
                className="w-full h-12 primary-gradient text-white font-bold uppercase tracking-widest rounded shadow-lg"
              >
                Quay lại trang chủ
              </Button>
            </div>
          )}

          {/* Success */}
          {status === "success" && (
            <div className="flex flex-col items-center justify-center py-6 gap-4 text-center">
              <div className="h-16 w-16 rounded-full bg-emerald-500/10 flex items-center justify-center">
                <CheckCircle className="h-10 w-10 text-emerald-500" />
              </div>
              <div className="space-y-1">
                <p className="font-semibold text-slate-800">
                  Đặt lại mật khẩu thành công!
                </p>
                <p className="text-xs text-muted-foreground max-w-xs mx-auto leading-relaxed">
                  Bạn có thể đăng nhập bằng mật khẩu mới của mình.
                </p>
              </div>
              <Button
                onClick={() => navigate("/")}
                className="w-full h-12 primary-gradient text-white font-bold uppercase tracking-widest rounded shadow-lg"
              >
                Đăng nhập ngay
              </Button>
            </div>
          )}

          {/* Form */}
          {(status === "ready" || status === "submitting" || status === "error") && (
            <form onSubmit={handleSubmit} className="space-y-5">
              {errorMessage && (
                <div className="p-3.5 rounded bg-destructive/10 border border-destructive/20 text-xs font-semibold text-destructive">
                  {errorMessage}
                </div>
              )}

              <div className="space-y-2 group">
                <Label
                  htmlFor="new-password"
                  className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground group-focus-within:text-primary transition-colors"
                >
                  Mật khẩu mới
                </Label>
                <div className="relative tactical-border">
                  <KeyRound className="absolute left-0 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="new-password"
                    type={showPassword ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Ít nhất 8 ký tự"
                    required
                    disabled={status === "submitting"}
                    className="border-none bg-transparent h-11 pl-7 pr-8 focus-visible:ring-0 placeholder:text-muted-foreground/30 font-medium"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-0 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary transition-colors"
                    tabIndex={-1}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              <div className="space-y-2 group">
                <Label
                  htmlFor="confirm-password"
                  className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground group-focus-within:text-primary transition-colors"
                >
                  Xác nhận mật khẩu
                </Label>
                <div className="relative tactical-border">
                  <KeyRound className="absolute left-0 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="confirm-password"
                    type={showPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Nhập lại mật khẩu mới"
                    required
                    disabled={status === "submitting"}
                    className="border-none bg-transparent h-11 pl-7 pr-0 focus-visible:ring-0 placeholder:text-muted-foreground/30 font-medium"
                  />
                </div>
              </div>

              <Button
                type="submit"
                disabled={status === "submitting" || !newPassword || !confirmPassword}
                className="w-full h-12 primary-gradient text-white font-bold uppercase tracking-widest rounded shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all"
              >
                {status === "submitting" ? (
                  <span className="flex items-center justify-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" /> Đang xử lý...
                  </span>
                ) : (
                  "Đặt lại mật khẩu"
                )}
              </Button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
