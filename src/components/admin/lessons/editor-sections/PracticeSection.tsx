import React, { useMemo } from "react";
import { Button } from "@/components/ui/button";
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { cn } from "@/lib/utils";
import type { Unit, LessonTestLane, Question } from "@/types";
import { SECTION_META } from "@/components/practice/utils/testUtils";
import { LANES_ORDER, defaultQuestionForLane } from "@/pages/admin/LessonEditorUtils";
import { QuestionEditor } from "../QuestionEditor";

export function PracticeSection({
  draft,
  setDraft,
  isScopedEditor,
}: {
  draft: Unit;
  setDraft: React.Dispatch<React.SetStateAction<Unit>>;
  isScopedEditor: boolean;
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
    <AccordionItem value="practice" className="px-1 border-b-0">
      <AccordionTrigger
        className={cn(
          "py-4 text-base font-semibold hover:no-underline",
          isScopedEditor && "pointer-events-none cursor-default [&>svg]:hidden",
        )}
      >
        Bài kiểm tra & câu hỏi ({draft.practice.length})
      </AccordionTrigger>
      <AccordionContent className="space-y-6 px-1 pb-5 pt-1">
        {LANES_ORDER.map((lane) => {
          const laneIndices = practiceIndicesByLane[lane];
          const meta = SECTION_META[lane];
          return (
            <div
              key={lane}
              className="rounded-xl border border-border bg-muted/20 p-4 space-y-4"
            >
              <div className="space-y-1 border-b border-border/60 pb-3">
                <p className="text-sm font-bold text-primary">
                  {meta.title}
                </p>
                <p className="text-xs text-muted-foreground leading-snug">
                  {meta.description}
                </p>
                <p className="text-[11px] font-mono text-muted-foreground">
                  {laneIndices.length} câu · lane{" "}
                  <span className="text-foreground">{lane}</span>
                </p>
              </div>
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
              <Button
                type="button"
                variant="secondary"
                size="sm"
                className="w-full sm:w-auto"
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
                + Thêm câu — {meta.title}
              </Button>
            </div>
          );
        })}
      </AccordionContent>
    </AccordionItem>
  );
}
