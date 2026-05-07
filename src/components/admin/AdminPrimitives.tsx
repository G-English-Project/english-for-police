import type { ReactNode } from "react";

export function AdminHero({
  eyebrow,
  title,
  description,
  right,
}: {
  eyebrow: string;
  title: string;
  description?: string;
  right?: ReactNode;
}) {
  return (
    <div className="rounded-lg border border-border bg-card p-6 md:p-8 police-shadow">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div className="space-y-3">
          <p className="text-[10px] uppercase tracking-[0.3em] font-black text-muted-foreground">
            {eyebrow}
          </p>
          <h1 className="text-3xl md:text-4xl font-black tracking-tight text-primary font-heading uppercase">
            {title}
          </h1>
          {description ? (
            <p className="text-sm text-muted-foreground max-w-xl">{description}</p>
          ) : null}
        </div>
        {right}
      </div>
    </div>
  );
}

export function AdminKpiCard({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon: ReactNode;
}) {
  return (
    <div className="rounded-lg border border-border bg-background px-4 py-3 min-w-32">
      <div className="flex items-center justify-between">
        <p className="text-[10px] uppercase tracking-widest font-black text-muted-foreground">
          {label}
        </p>
        {icon}
      </div>
      <p className="mt-2 text-2xl leading-none font-black text-primary tabular-nums">
        {value}
      </p>
    </div>
  );
}

export function AdminInsightRow({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center justify-between rounded-md border border-border/60 px-3 py-2.5">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-bold text-foreground">{value}</span>
    </div>
  );
}

export function AdminMetricCard({
  label,
  value,
  icon,
  unit,
}: {
  label: string;
  value: string;
  icon: ReactNode;
  unit: string;
}) {
  return (
    <div className="bg-card border border-border px-6 py-6 rounded-lg space-y-5 police-shadow relative overflow-hidden group">
      <div className="absolute right-0 top-0 w-16 h-16 bg-primary/5 rounded-bl-full translate-x-4 -translate-y-4 transition-all group-hover:translate-x-2 group-hover:-translate-y-2" />
      <div className="flex items-center justify-between relative z-10">
        <p className="text-[10px] uppercase tracking-[0.3em] font-black text-muted-foreground">
          {label}
        </p>
        <div className="p-2.5 bg-muted rounded-lg group-hover:bg-primary/5 transition-colors">
          {icon}
        </div>
      </div>
      <div className="flex items-baseline gap-2 relative z-10">
        <p className="text-4xl md:text-5xl font-black text-foreground tracking-tighter">
          {value}
        </p>
        <p className="text-[10px] font-black text-primary uppercase tracking-widest opacity-60">
          {unit}
        </p>
      </div>
    </div>
  );
}
