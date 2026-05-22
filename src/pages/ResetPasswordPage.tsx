import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  Shield,
  Lock,
  ArrowRight,
  Loader2,
  Eye,
  EyeOff,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { usePasswordReset } from "@/hooks/use-password-reset";
import { requestOpenLoginDialog } from "@/lib/auth-ui-events";

export function ResetPasswordPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get("token") ?? "";
  const { isLoading, validateResetToken, resetPassword } = usePasswordReset();

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [tokenValid, setTokenValid] = useState<boolean | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    if (!token) {
      setTokenValid(false);
      return;
    }

    let cancelled = false;
    validateResetToken(token)
      .then((valid) => {
        if (!cancelled) setTokenValid(valid);
      })
      .catch(() => {
        if (!cancelled) setTokenValid(false);
      });

    return () => {
      cancelled = true;
    };
  }, [token, validateResetToken]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (newPassword.length < 8) {
      setFormError("Mật khẩu phải có ít nhất 8 ký tự.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setFormError("Mật khẩu xác nhận không khớp.");
      return;
    }

    try {
      await resetPassword(token, newPassword);
      requestOpenLoginDialog();
      navigate("/", { replace: true });
    } catch {
      // Toast handled in hook.
    }
  };

  if (tokenValid === null) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!tokenValid) {
    return (
      <div className="mx-auto max-w-md p-6">
        <div className="glass police-shadow rounded-lg border border-destructive/20 bg-white/60 p-8 text-center space-y-4">
          <AlertCircle className="mx-auto h-10 w-10 text-destructive" />
          <h1 className="text-xl font-heading font-bold">
            Liên kết không hợp lệ
          </h1>
          <p className="text-sm text-muted-foreground">
            Liên kết đặt lại mật khẩu không hợp lệ hoặc đã hết hạn. Vui lòng yêu
            cầu gửi lại email từ trang đăng nhập.
          </p>
          <Button
            type="button"
            className="primary-gradient text-white"
            onClick={() => {
              requestOpenLoginDialog();
              navigate("/", { replace: true });
            }}
          >
            Về trang chủ
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-md p-4 sm:p-6">
      <div className="glass police-shadow overflow-hidden rounded-lg border-none">
        <form onSubmit={handleSubmit}>
          <div className="primary-gradient relative p-8 text-white">
            <div className="absolute right-0 top-0 p-4 opacity-10">
              <Shield className="h-24 w-24" />
            </div>
            <div className="relative z-10 space-y-1 text-left">
              <h1 className="font-heading text-3xl font-black tracking-tight text-white">
                Đặt lại mật khẩu
              </h1>
              <p className="text-sm font-medium text-white/70">
                Reset password — Nhập mật khẩu mới cho tài khoản của bạn.
              </p>
            </div>
          </div>

          <div className="space-y-6 bg-white/40 p-8">
            <div className="space-y-2 group">
              <Label
                htmlFor="newPassword"
                className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground"
              >
                Mật khẩu mới
              </Label>
              <div className="relative tactical-border">
                <Lock className="absolute left-0 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="newPassword"
                  type={showPassword ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Tối thiểu 8 ký tự"
                  required
                  minLength={8}
                  className="h-11 border-none bg-transparent pl-7 pr-8 focus-visible:ring-0"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-0 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary"
                  aria-label={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
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
                htmlFor="confirmPassword"
                className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground"
              >
                Xác nhận mật khẩu
              </Label>
              <div className="tactical-border">
                <Input
                  id="confirmPassword"
                  type={showPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Nhập lại mật khẩu"
                  required
                  minLength={8}
                  className="h-11 border-none bg-transparent px-0 focus-visible:ring-0"
                />
              </div>
            </div>

            {formError && (
              <p className="text-sm font-medium text-destructive">{formError}</p>
            )}

            <Button
              type="submit"
              disabled={isLoading}
              className="primary-gradient h-12 w-full rounded font-bold uppercase tracking-widest text-white shadow-lg shadow-primary/20"
            >
              <span className="flex items-center justify-center gap-2">
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" /> Đang xử lý...
                  </>
                ) : (
                  <>
                    Đặt lại mật khẩu{" "}
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </span>
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
