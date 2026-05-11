import { Link } from "react-router-dom";
import {
  ArrowLeft,
  ChevronRight,
  ExternalLink,
  Loader2,
  Save,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Unit } from "@/types";

export function WorkspaceHeader({
  draft,
  saving,
  persist,
}: {
  draft: Unit;
  saving: boolean;
  persist: () => void;
}) {
  return (
    <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
      <div className="space-y-2 min-w-0">
        <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
          <Link
            to="/admin/lessons"
            className="inline-flex items-center gap-1 hover:text-primary transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Danh sách chương
          </Link>
          <ChevronRight className="h-4 w-4 opacity-50" />
          <span className="font-mono text-primary font-semibold">
            Chương {draft.id}
          </span>
        </div>
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground leading-tight">
          {draft.title || `Chương ${draft.id}`}
        </h1>
        <p className="text-muted-foreground text-sm md:text-base max-w-3xl leading-relaxed">
          {draft.description || "Chưa có mô tả."}
        </p>
      </div>
      <div className="flex flex-wrap gap-2 shrink-0">
        <Button variant="outline" size="sm" asChild className="gap-2">
          <a
            href={`/lesson/${draft.id}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <ExternalLink className="h-4 w-4" />
            Xem như học viên
          </a>
        </Button>
        <Button
          size="sm"
          className="gap-2"
          disabled={saving}
          onClick={() => void persist()}
        >
          {saving ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Save className="h-4 w-4" />
          )}
          Lưu chương
        </Button>
      </div>
    </div>
  );
}
