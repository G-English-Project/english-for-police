import { BookMarked, Layers, PencilLine } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { Unit } from "@/types";
import type { LessonEditorScope } from "@/pages/admin/LessonEditorUtils";

export function WorkspaceOverview({
  draft,
  setView,
}: {
  draft: Unit;
  setView: (v: LessonEditorScope | "overview") => void;
}) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 md:gap-5">
      <button
        type="button"
        onClick={() => setView("vocabulary")}
        className="rounded-lg text-left transition hover:opacity-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
      >
        <Card className="police-shadow border-border/80 h-full hover:border-primary/40">
          <CardHeader className="pb-3">
            <CardDescription className="flex items-center gap-2 text-xs font-medium uppercase tracking-wide">
              <BookMarked className="h-4 w-4 text-primary" />
              Từ vựng
            </CardDescription>
            <CardTitle className="text-4xl tabular-nums">
              {draft.vocabulary.length}
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground leading-relaxed">
            <span className="text-primary font-semibold">Soạn →</span> chỉnh sửa
            danh sách từ trong chương.
          </CardContent>
        </Card>
      </button>
      <button
        type="button"
        onClick={() => setView("phrases")}
        className="rounded-lg text-left transition hover:opacity-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
      >
        <Card className="police-shadow border-border/80 h-full hover:border-primary/40">
          <CardHeader className="pb-3">
            <CardDescription className="flex items-center gap-2 text-xs font-medium uppercase tracking-wide">
              <Layers className="h-4 w-4 text-primary" />
              Mẫu câu
            </CardDescription>
            <CardTitle className="text-4xl tabular-nums">
              {draft.phrases.length}
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground leading-relaxed">
            <span className="text-primary font-semibold">Soạn →</span> câu mẫu
            và bản dịch.
          </CardContent>
        </Card>
      </button>
      <button
        type="button"
        onClick={() => setView("practice")}
        className="rounded-lg text-left transition hover:opacity-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
      >
        <Card className="police-shadow border-border/80 h-full hover:border-primary/40">
          <CardHeader className="pb-3">
            <CardDescription className="flex items-center gap-2 text-xs font-medium uppercase tracking-wide">
              <PencilLine className="h-4 w-4 text-primary" />
              Bài kiểm tra (DB)
            </CardDescription>
            <CardTitle className="text-4xl tabular-nums">
              {draft.practice.length}
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground leading-relaxed">
            <span className="text-primary font-semibold">Soạn →</span> câu luyện
            theo từng dạng.
          </CardContent>
        </Card>
      </button>
    </div>
  );
}
