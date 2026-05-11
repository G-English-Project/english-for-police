import React, { useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { Unit, LessonTestLane, Question } from "@/types";
import { SECTION_META } from "@/components/practice/utils/testUtils";
import {
  LANES_ORDER,
  defaultQuestionForLane,
} from "@/pages/admin/LessonEditorUtils";
import { QuestionEditor } from "../QuestionEditor";
import { Badge } from "@/components/ui/badge";
import { Plus } from "lucide-react";

export function PracticeSection({
  draft,
  setDraft,
}: {
  draft: Unit;
  setDraft: React.Dispatch<React.SetStateAction<Unit>>;
}) {
  const practiceIndicesByLane = useMemo(() => {
    const map: Record<LessonTestLane, number[]> = {
      VOCAB_MCQ: [],
      MATCHING: [],
      PHRASE_SCENARIO: [],
      FILL_ARRANGE: [],
    };
    draft.practice.forEach((q, idx) => {
      const lane = (q as Question).testLane;
      if (lane && map[lane]) {
        map[lane].push(idx);
      }
    });
    return map;
  }, [draft.practice]);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 px-1">
        <div className="h-2 w-2 rounded-full bg-primary" />
        <h4 className="text-sm font-bold uppercase tracking-wider text-foreground/70">
          Cấu trúc bài kiểm tra ({draft.practice.length} câu hỏi)
        </h4>
      </div>

      <Card className="border border-border/60 bg-card/30 shadow-none overflow-hidden">
        <CardContent className="space-y-8 p-4">
          {LANES_ORDER.map((lane) => {
            const laneIndices = practiceIndicesByLane[lane];
            const meta = SECTION_META[lane];
            return (
              <div
                key={lane}
                className="rounded-2xl border border-border/50 bg-background/50 overflow-hidden shadow-sm transition-all hover:border-primary/20"
              >
                <div className="bg-muted/30 px-5 py-4 border-b border-border/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <h4 className="text-sm font-black uppercase tracking-wider text-foreground/80 flex items-center gap-3">
                      {meta.title}
                      <Badge
                        variant="secondary"
                        className="font-mono text-[10px] px-2 py-0 h-5 bg-primary/10 text-primary border-primary/20"
                      >
                        {laneIndices.length} câu
                      </Badge>
                    </h4>
                    <p className="text-[11px] text-muted-foreground leading-relaxed max-w-xl">
                      {meta.description}
                    </p>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="h-9 px-4 text-[11px] font-black uppercase tracking-widest bg-background border-primary/20 hover:border-primary/40 hover:bg-primary hover:text-primary-foreground transition-all shadow-sm shrink-0"
                    onClick={() =>
                      setDraft((d) => ({
                        ...d,
                        practice: [
                          ...d.practice,
                          defaultQuestionForLane(d.id || 1, lane),
                        ],
                      }))
                    }
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Thêm câu hỏi
                  </Button>
                </div>
                <div className="p-5 space-y-6">
                  {laneIndices.length === 0 ? (
                    <div className="py-10 text-center flex flex-col items-center gap-2">
                      <div className="h-10 w-10 rounded-full bg-muted/20 flex items-center justify-center">
                        <Plus className="h-5 w-5 text-muted-foreground/30" />
                      </div>
                      <p className="text-[11px] text-muted-foreground/50 uppercase tracking-widest font-bold italic">
                        Phần này hiện đang trống
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {laneIndices.map((idx, internalIdx) => (
                        <div key={draft.practice[idx].id} className="relative">
                          {/* Sub-numbering within lane */}
                          <div className="absolute -left-2 -top-2 z-10 flex h-5 w-5 items-center justify-center rounded-full bg-muted-foreground text-[9px] font-bold text-background shadow-sm border border-background">
                            {internalIdx + 1}
                          </div>
                          <QuestionEditor
                            q={draft.practice[idx] as Question}
                            onUpdate={(updated) => {
                              const newList = [...draft.practice];
                              newList[idx] = updated;
                              setDraft((d) => ({ ...d, practice: newList }));
                            }}
                            onDelete={() => {
                              const newList = draft.practice.filter(
                                (_, i) => i !== idx,
                              );
                              setDraft((d) => ({ ...d, practice: newList }));
                            }}
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>
    </div>
  );
}
