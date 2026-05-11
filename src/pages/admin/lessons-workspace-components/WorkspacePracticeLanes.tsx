import { ClipboardList } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { SECTION_META } from "@/components/practice/utils/testUtils";
import type { Question, LessonTestLane } from "@/types";
import { LANES_ORDER } from "@/pages/admin/LessonEditorUtils";

export function WorkspacePracticeLanes({
  practiceByLane,
}: {
  practiceByLane: Record<LessonTestLane, Question[]>;
}) {
  return (
    <div>
      <h2 className="text-lg font-bold mb-3 flex items-center gap-2">
        <ClipboardList className="h-5 w-5 text-primary" />
        Phân bổ theo dạng luyện tập (UI học viên)
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {LANES_ORDER.map((lane) => {
          const meta = SECTION_META[lane];
          const items = practiceByLane[lane];
          return (
            <Card
              key={lane}
              className="border-border/90 overflow-hidden police-shadow"
            >
              <CardHeader className="bg-muted/40 pb-3">
                <CardTitle className="text-base flex items-center justify-between gap-2">
                  <span>{meta.title}</span>
                  <span className="text-sm font-mono font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-md">
                    {items.length}
                  </span>
                </CardTitle>
                <CardDescription className="text-xs leading-snug">
                  {meta.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-4 space-y-2 max-h-55 overflow-y-auto">
                {items.length === 0 ? (
                  <p className="text-sm text-muted-foreground italic">
                    Chưa có câu trong nhóm này.
                  </p>
                ) : (
                  <ul className="space-y-2 text-sm">
                    {items.map((q) => (
                      <li
                        key={q.id}
                        className="rounded-md border border-border/60 bg-background px-3 py-2"
                      >
                        <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">
                          {q.type}
                          {q.testLane ? ` · ${q.testLane}` : ""}
                        </span>
                        <p className="mt-1 line-clamp-2 text-foreground/90">
                          {q.prompt || "(Không có đề)"}
                        </p>
                      </li>
                    ))}
                  </ul>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
