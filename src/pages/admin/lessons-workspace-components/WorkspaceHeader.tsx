import { ExternalLink, Loader2, Save } from "lucide-react";
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
    <div className="flex flex-wrap gap-2 shrink-0">
      <Button variant="outline" size="sm" asChild className="gap-2">
        <a
          href={`/lesson/${draft.id}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          <ExternalLink className="h-4 w-4" />
          Xem thực tế
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
        Lưu thay đổi
      </Button>
    </div>
  );
}
