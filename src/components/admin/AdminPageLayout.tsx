import type { ReactNode } from "react";

interface AdminPageLayoutProps {
  title: string;
  description?: string;
  actions?: ReactNode;
  children: ReactNode;
}

export function AdminPageLayout({
  title,
  description,
  actions,
  children,
}: AdminPageLayoutProps) {
  return (
    <div className="min-h-screen bg-background text-foreground p-4 md:p-8 space-y-6 animate-fade-in">
      <div className="rounded-lg border border-border bg-card p-6 md:p-8 shadow-sm">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="space-y-1">
            <p className="text-[10px] uppercase tracking-[0.2em] font-bold text-muted-foreground/80">
              Admin Dashboard
            </p>
            <h1 className="text-xl md:text-2xl font-black tracking-tight text-foreground uppercase">
              {title}
            </h1>
            {description ? (
              <p className="text-xs md:text-sm text-muted-foreground leading-relaxed max-w-2xl">
                {description}
              </p>
            ) : null}
          </div>
          {actions ? <div className="flex shrink-0 items-center gap-2">{actions}</div> : null}
        </div>
      </div>

      <div className="space-y-6">
        {children}
      </div>
    </div>
  );
}
