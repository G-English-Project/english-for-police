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
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      {[
        {
          key: "vocabulary",
          label: "Từ vựng",
          icon: BookMarked,
          count: draft.vocabulary.length,
          desc: "Chỉnh sửa danh sách từ, nghĩa và phát âm.",
        },
        {
          key: "phrases",
          label: "Mẫu câu",
          icon: Layers,
          count: draft.phrases.length,
          desc: "Quản lý các mẫu câu giao tiếp và dịch thuật.",
        },
        {
          key: "practice",
          label: "Luyện tập",
          icon: PencilLine,
          count: draft.practice.length,
          desc: "Soạn câu hỏi trắc nghiệm và các dạng bài tập.",
        },
      ].map((item) => (
        <button
          key={item.key}
          type="button"
          onClick={() => setView(item.key as LessonEditorScope)}
          className="group rounded-lg text-left transition-all hover:scale-[1.02] active:scale-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        >
          <Card className="shadow-sm border-border/60 h-full group-hover:border-primary/50 group-hover:shadow-md transition-all">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardDescription className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-muted-foreground/70">
                  <item.icon className="h-3.5 w-3.5 text-primary/80" />
                  {item.label}
                </CardDescription>
                <div className="h-1.5 w-1.5 rounded-full bg-primary/20 group-hover:bg-primary transition-colors" />
              </div>
              <CardTitle className="text-3xl font-black tracking-tight pt-1">
                {item.count}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {item.desc}
              </p>
              <div className="pt-4 flex items-center gap-1.5 text-[10px] font-bold text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                CHỈNH SỬA <span className="text-xs">→</span>
              </div>
            </CardContent>
          </Card>
        </button>
      ))}
    </div>
  );
}
