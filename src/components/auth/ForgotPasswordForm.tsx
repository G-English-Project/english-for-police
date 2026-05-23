import React, { useState } from "react";
import {
  Mail,
  ArrowRight,
  Loader2,
  ArrowLeft,
  CheckCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { authService } from "@/services/auth.service";
import type { ApiError } from "@/models/auth.model";

interface ForgotPasswordFormProps {
  onBackToLogin: () => void;
}

export function ForgotPasswordForm({ onBackToLogin }: ForgotPasswordFormProps) {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsLoading(true);
    setError(null);

    try {
      await authService.forgotPassword({ email });
      setIsSubmitted(true);
    } catch (err) {
      const apiErr = err as ApiError;
      setError(apiErr.message ?? "Đã có lỗi xảy ra. Vui lòng thử lại.");
    } finally {
      setIsLoading(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="animate-fade-in">
        <DialogHeader className="primary-gradient p-8 text-white relative">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <CheckCircle className="h-24 w-24" />
          </div>
          <div className="space-y-1 relative z-10 text-left">
            <DialogTitle className="text-3xl font-heading font-black tracking-tight text-white">
              Đã gửi yêu cầu
            </DialogTitle>
            <p className="text-sm text-white/70 font-medium">
              Vui lòng kiểm tra hộp thư để nhận hướng dẫn.
            </p>
          </div>
        </DialogHeader>

        <div className="p-8 space-y-6 bg-white/40 text-center">
          <div className="flex flex-col items-center justify-center space-y-3 py-4">
            <div className="h-16 w-16 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-500 shadow-md">
              <CheckCircle className="h-10 w-10" />
            </div>
            <div className="space-y-1">
              <p className="text-sm font-semibold text-primary">
                Liên kết đã được gửi tới:
              </p>
              <p className="text-sm font-bold text-slate-800 break-all">
                {email}
              </p>
            </div>
            <p className="text-xs text-muted-foreground max-w-xs mx-auto leading-relaxed">
              Chúng tôi đã gửi một liên kết xác thực đặt lại mật khẩu. Hãy kiểm
              tra cả hộp thư đến và thư mục thư rác (spam) của bạn.
            </p>
          </div>

          <Button
            type="button"
            onClick={onBackToLogin}
            className="w-full h-12 primary-gradient text-white font-bold uppercase tracking-widest rounded shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all"
          >
            Quay lại đăng nhập
          </Button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="animate-fade-in">
      <DialogHeader className="primary-gradient p-8 text-white relative">
        <div className="absolute top-0 right-0 p-4 opacity-10">
          <Mail className="h-24 w-24" />
        </div>
        <div className="space-y-1 relative z-10 text-left">
          <DialogTitle className="text-3xl font-heading font-black tracking-tight text-white">
            Quên mật khẩu
          </DialogTitle>
          <p className="text-sm text-white/70 font-medium">
            Nhập email đã đăng ký để nhận liên kết khôi phục tài khoản.
          </p>
        </div>
      </DialogHeader>

      <div className="p-8 space-y-6 bg-white/40">
        {error && (
          <div className="p-3.5 rounded bg-destructive/10 border border-destructive/20 text-xs font-semibold text-destructive animate-fade-in">
            {error}
          </div>
        )}

        <div className="space-y-2 group">
          <Label
            htmlFor="reset-email"
            className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground group-focus-within:text-primary transition-colors"
          >
            Email đăng ký
          </Label>
          <div className="relative tactical-border">
            <Mail className="absolute left-0 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              id="reset-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@police.gov.vn"
              required
              disabled={isLoading}
              className="border-none bg-transparent h-11 pl-7 pr-0 focus-visible:ring-0 placeholder:text-muted-foreground/30 font-medium"
            />
          </div>
        </div>

        <Button
          type="submit"
          disabled={isLoading || !email}
          className="w-full h-12 primary-gradient text-white font-bold uppercase tracking-widest rounded shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all group overflow-hidden relative"
        >
          <span className="relative z-10 flex items-center justify-center gap-2">
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" /> Đang gửi yêu cầu...
              </>
            ) : (
              <>
                Khôi phục mật khẩu{" "}
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </span>
        </Button>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-muted-foreground/10" />
          </div>
          <div className="relative flex justify-center text-[10px] font-bold uppercase tracking-widest">
            <span className="bg-white/40 px-3 text-muted-foreground/60">
              Hoặc
            </span>
          </div>
        </div>

        <div className="text-center pt-2">
          <button
            type="button"
            onClick={onBackToLogin}
            className="inline-flex items-center gap-2 text-xs font-bold text-primary hover:underline underline-offset-4"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> Quay lại đăng nhập
          </button>
        </div>
      </div>
    </form>
  );
}
