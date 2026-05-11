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
import { Badge } from "@/components/ui/badge";

export function WorkspacePracticeLanes({
  practiceByLane,
}: {
  practiceByLane: Record<LessonTestLane, Question[]>;
}) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 px-1">
        <div className="h-4 w-1 rounded-full bg-primary" />
        <h2 className="text-sm font-bold uppercase tracking-wider text-muted-foreground/80">
          Phân bổ theo dạng luyện tập
        </h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {LANES_ORDER.map((lane) => {
          const meta = SECTION_META[lane];
          const items = practiceByLane[lane];
          return (
            <Card
              key={lane}
              className="border-border/60 shadow-sm overflow-hidden"
            >
              <CardHeader className="bg-muted/30 pb-3 border-b border-border/40">
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-1">
                    <CardTitle className="text-sm font-bold tracking-tight">
                      {meta.title}
                    </CardTitle>
                    <CardDescription className="text-[10px] leading-snug uppercase tracking-tight">
                      {meta.description}
                    </CardDescription>
                  </div>
                  <Badge
                    variant="secondary"
                    className="font-mono text-[10px] px-1.5 py-0 rounded-sm shrink-0"
                  >
                    {items.length}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="p-0 max-h-64 overflow-y-auto">
                {items.length === 0 ? (
                  <div className="p-4 text-center">
                    <p className="text-[10px] text-muted-foreground uppercase tracking-widest italic">
                      Trống
                    </p>
                  </div>
                ) : (
                  <div className="divide-y divide-border/40">
                    {items.map((q) => (
                      <div
                        key={q.id}
                        className="p-3 bg-background hover:bg-muted/20 transition-colors"
                      >
                        <div className="flex items-center gap-1.5 mb-1">
                          <span className="text-[9px] font-bold text-primary/70 uppercase px-1 border border-primary/20 rounded-sm">
                            {q.type}
                          </span>
                          {q.testLane && (
                            <span className="text-[9px] font-bold text-muted-foreground/60 uppercase">
                              {q.testLane}
                            </span>
                          )}
                        </div>
                        <p className="text-xs line-clamp-2 text-foreground/80 leading-relaxed">
                          {q.prompt || "(Không có nội dung câu hỏi)"}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
