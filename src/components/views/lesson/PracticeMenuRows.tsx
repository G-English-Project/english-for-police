import type { ReactNode } from "react";
import { ChevronRight, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

type MenuVariant = "sidebar" | "dialog";

interface PracticeMenuRowsProps {
  variant?: MenuVariant;
  showUnavailable?: boolean;
  unavailableHint?: string;
}

interface RowProps extends PracticeMenuRowsProps {
  label: string;
  depth?: number;
  isExpandable?: boolean;
  isOpen?: boolean;
  onToggle?: () => void;
  isAvailable?: boolean;
  onSelect?: () => void;
}

function indentClass(depth: number, variant: MenuVariant) {
  if (depth <= 0) return "";
  return variant === "dialog"
    ? "ml-3 border-l-2 border-muted pl-2"
    : "ml-2 border-l-2 border-muted/80 pl-2";
}

export function PracticeMenuRow({
  label,
  depth = 0,
  variant = "sidebar",
  isExpandable = false,
  isOpen = false,
  onToggle,
  isAvailable = true,
  onSelect,
  showUnavailable = false,
  unavailableHint,
}: RowProps) {
  const isDialog = variant === "dialog";
  const disabled = showUnavailable && !isAvailable;
  const canClick = isExpandable ? onToggle : isAvailable ? onSelect : undefined;

  const row = (
    <Button
      type="button"
      variant="ghost"
      disabled={disabled && !isExpandable}
      className={cn(
        "w-full justify-between transition-all",
        isDialog ? "h-11 rounded-lg px-4 text-sm" : "h-8 px-2 text-[11px]",
        depth === 0
          ? "font-semibold text-primary hover:text-primary"
          : depth === 1 && label.includes("—")
            ? "font-semibold text-primary hover:text-primary"
            : "font-medium text-muted-foreground hover:text-primary",
        disabled &&
          !isExpandable &&
          "cursor-not-allowed text-muted-foreground/30 line-through",
      )}
      onClick={canClick}
    >
      <span className="truncate text-left">• {label}</span>
      {isExpandable ? (
        <ChevronRight
          className={cn(
            "shrink-0 transition-transform",
            isDialog ? "h-4 w-4 text-muted-foreground" : "h-3.5 w-3.5",
            isOpen && "rotate-90",
          )}
        />
      ) : disabled ? (
        <HelpCircle className="h-3 w-3 shrink-0 opacity-40" />
      ) : (
        <ChevronRight
          className={cn(
            "shrink-0 opacity-60",
            isDialog ? "h-3.5 w-3.5" : "h-3 w-3",
          )}
        />
      )}
    </Button>
  );

  if (disabled && !isExpandable && unavailableHint) {
    return (
      <Tooltip delayDuration={300}>
        <TooltipTrigger asChild>
          <div className="w-full">{row}</div>
        </TooltipTrigger>
        <TooltipContent side="right" className="max-w-[200px]">
          <p className="text-[10px] font-medium">{unavailableHint}</p>
        </TooltipContent>
      </Tooltip>
    );
  }

  return <div className="w-full">{row}</div>;
}

export function PracticeMenuGroup({
  children,
  depth = 0,
  variant = "sidebar",
}: {
  children: ReactNode;
  depth?: number;
  variant?: MenuVariant;
}) {
  if (depth <= 0) {
    return <div className="space-y-0.5">{children}</div>;
  }
  return (
    <div className={cn("space-y-0.5", indentClass(depth, variant))}>
      {children}
    </div>
  );
}
