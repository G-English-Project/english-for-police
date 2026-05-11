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
    <Card className="border border-border/60 bg-card/30 shadow-none overflow-hidden">
      <CardContent className="space-y-6 p-4">
        {LANES_ORDER.map((lane) => {
          const laneIndices = practiceIndicesByLane[lane];
          const meta = SECTION_META[lane];
          return (
            <div
              key={lane}
              className="rounded-lg border border-border/50 bg-background/50 overflow-hidden shadow-sm"
            >
              <div className="bg-muted/30 px-4 py-3 border-b border-border/40 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="space-y-0.5">
                  <h4 className="text-xs font-black uppercase tracking-wider text-foreground/80 flex items-center gap-2">
                    {meta.title}
                    <Badge
                      variant="outline"
                      className="font-mono text-[9px] px-1 py-0 h-4 bg-background"
                    >
                      {laneIndices.length}
                    </Badge>
                  </h4>
                  <p className="text-[10px] text-muted-foreground leading-snug">
                    {meta.description}
                  </p>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="h-7 text-[10px] font-bold uppercase tracking-widest bg-background hover:bg-primary hover:text-primary-foreground transition-all"
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
                  <Plus className="h-3 w-3 mr-1.5" />
                  Thêm câu hỏi
                </Button>
              </div>
              <div className="p-4 space-y-4">
                {laneIndices.length === 0 ? (
                  <div className="py-6 text-center">
                    <p className="text-[10px] text-muted-foreground/60 uppercase tracking-widest italic">
                      Chưa có câu hỏi cho phần này
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {laneIndices.map((idx) => (
                      <QuestionEditor
                        key={draft.practice[idx].id}
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
                    ))}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
