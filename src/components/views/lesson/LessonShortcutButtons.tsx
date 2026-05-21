import React, { useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import { Check, ChevronRight, Lock, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { requestOpenLoginDialog } from "@/lib/auth-ui-events";
import {
  getPhraseSubNavItems,
  type VocabDrillMode,
} from "@/components/practice/utils/testUtils";
import { PracticeSidebarMenu } from "@/components/views/lesson/PracticeSidebarMenu";
import { LessonTrackProgressRow } from "@/components/views/lesson/LessonTrackProgressRow";
import type { LessonTestLane, Question, Unit } from "@/types";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useAuth } from "@/hooks/use-auth";
import { useProgress } from "@/hooks/use-progress";
import {
  isFlashcardTrackComplete,
  isGeneralTestAttempted,
  isVocabDrillComplete,
  unitFlashcardCounts,
  unitPracticeSubLessonCounts,
  unitToolsCounts,
} from "@/lib/unit-progress";

const VOCAB_TOOL_ITEMS: {
  id: VocabDrillMode;
  label: string;
  lane: LessonTestLane;
}[] = [
  { id: "en-vi", label: "Anh → Việt", lane: "VOCAB_MCQ" },
  { id: "vi-en", label: "Việt → Anh", lane: "VOCAB_MCQ" },
  { id: "matching", label: "Ghép cặp", lane: "MATCHING" },
];

interface LessonShortcutButtonsProps {
  readonly unit: Unit;
  readonly practiceQuestions: Question[];
  readonly testsLocked: boolean;
  readonly availableLanes: Set<LessonTestLane>;
  readonly onStartFlashcards: () => void;
  readonly onStartGeneralTest: (
    mode?: "type" | "bank",
    sectionTitle?: string,
    subLessonId?: string,
  ) => void;
  readonly onStartVocabDrill: (drill: VocabDrillMode) => void;
}

export const LessonShortcutButtons: React.FC<LessonShortcutButtonsProps> = ({
  unit,
  practiceQuestions,
  testsLocked,
  availableLanes,
  onStartFlashcards,
  onStartGeneralTest,
  onStartVocabDrill,
}) => {
  const { isAuthenticated } = useAuth();
  const { unitsProgress, fetchUnitsProgress } = useProgress();
  const location = useLocation();
  const [isTypeExpanded, setIsTypeExpanded] = useState(false);
  const [isToolsExpanded, setIsToolsExpanded] = useState(false);
  const subNavItems = useMemo(() => getPhraseSubNavItems(unit), [unit]);

  useEffect(() => {
    if (!isAuthenticated) return;
    void fetchUnitsProgress();
  }, [isAuthenticated, fetchUnitsProgress, unit.id, location.pathname]);

  useEffect(() => {
    if (!isAuthenticated) return;
    const onVisible = () => {
      if (document.visibilityState === "visible") {
        void fetchUnitsProgress();
      }
    };
    document.addEventListener("visibilitychange", onVisible);
    return () => document.removeEventListener("visibilitychange", onVisible);
  }, [isAuthenticated, fetchUnitsProgress]);

  const unitProgress = useMemo(
    () => unitsProgress.find((u) => u.unitNumber === unit.id),
    [unitsProgress, unit.id],
  );

  const flashCounts = unitFlashcardCounts(unitProgress);
  const toolsCounts = unitToolsCounts(unitProgress);
  const practiceCounts = unitPracticeSubLessonCounts(unitProgress);

  const flashPercent =
    flashCounts && flashCounts.total > 0
      ? Math.round((flashCounts.viewed / flashCounts.total) * 100)
      : 0;

  return (
    <TooltipProvider>
      <div className="mt-4 space-y-2">
        <div className="overflow-hidden rounded-md border border-border bg-card/50">
          <Button
            variant="ghost"
            className="h-auto min-h-10 w-full flex-col items-stretch gap-0 rounded-none px-3 py-2 font-bold hover:bg-muted/40"
            onClick={onStartFlashcards}
          >
            <div className="flex w-full items-center justify-between">
              <span className="flex items-center gap-1.5">
                {isFlashcardTrackComplete(unitProgress) ? (
                  <Check
                    className="h-4 w-4 shrink-0 text-emerald-600"
                    aria-hidden
                  />
                ) : null}
                Flashcard
              </span>
              <ChevronRight className="h-4 w-4 shrink-0" />
            </div>
            {flashCounts && flashCounts.total > 0 ? (
              <div className="mt-2 w-full">
                <LessonTrackProgressRow
                  attempted={flashCounts.viewed}
                  total={flashCounts.total}
                  percent={flashPercent}
                  detailLabel="Đã xem"
                />
              </div>
            ) : null}
          </Button>
        </div>

        <div className="space-y-2 overflow-hidden rounded-md border border-border bg-card/50">
          <Button
            variant="ghost"
            className="h-auto min-h-10 w-full flex-col items-stretch gap-0 rounded-none px-3 py-2 font-bold hover:bg-muted/40"
            onClick={() => setIsToolsExpanded(!isToolsExpanded)}
          >
            <div className="flex w-full items-center justify-between">
              <span>Công cụ</span>
              <ChevronRight
                className={cn(
                  "h-4 w-4 shrink-0 transition-transform",
                  isToolsExpanded && "rotate-180",
                )}
              />
            </div>
            {toolsCounts && toolsCounts.total > 0 ? (
              <div className="mt-2 w-full">
                <LessonTrackProgressRow
                  attempted={toolsCounts.attempted}
                  total={toolsCounts.total}
                  percent={toolsCounts.percent}
                  detailLabel="Đã luyện"
                />
              </div>
            ) : null}
          </Button>

          {isToolsExpanded ? (
            <div className="mb-2 ml-2 animate-in space-y-1 border-l-2 border-muted pl-3 pr-1 fade-in">
              {VOCAB_TOOL_ITEMS.map(({ id, label, lane }) => {
                const isAvailable = availableLanes.has(lane);
                const completed = isVocabDrillComplete(unitProgress, id);
                return (
                  <Tooltip key={id} delayDuration={300}>
                    <TooltipTrigger asChild>
                      <div className="w-full">
                        <Button
                          variant="ghost"
                          disabled={!isAvailable}
                          className={cn(
                            "h-8 w-full justify-between px-2 text-[11px] font-medium transition-all",
                            isAvailable
                              ? "text-muted-foreground hover:text-primary"
                              : "cursor-not-allowed text-muted-foreground/30 line-through",
                          )}
                          onClick={() => isAvailable && onStartVocabDrill(id)}
                        >
                          <span className="flex min-w-0 items-center gap-1.5 truncate">
                            {completed ? (
                              <Check
                                className="h-3.5 w-3.5 shrink-0 text-emerald-600"
                                aria-hidden
                              />
                            ) : (
                              <span
                                className="shrink-0 text-muted-foreground/50"
                                aria-hidden
                              >
                                •
                              </span>
                            )}
                            {label}
                          </span>
                          {!isAvailable && (
                            <HelpCircle className="h-3 w-3 shrink-0 opacity-40" />
                          )}
                        </Button>
                      </div>
                    </TooltipTrigger>
                    {!isAvailable && (
                      <TooltipContent side="right" className="max-w-[200px]">
                        <p className="text-[10px] font-medium">
                          Phần luyện tập này hiện chưa có nội dung cho chương
                          này.
                        </p>
                      </TooltipContent>
                    )}
                  </Tooltip>
                );
              })}
            </div>
          ) : null}
        </div>

        <div className="relative rounded-md">
          {testsLocked ? (
            <div
              className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-2 rounded-md border border-dashed border-primary/25 bg-background/85 px-3 py-5 text-center backdrop-blur-[2px] shadow-sm"
              aria-live="polite"
            >
              <Lock className="h-7 w-7 text-primary/70" aria-hidden />
              <p className="text-xs font-semibold leading-snug text-foreground">
                Đăng nhập để làm bài kiểm tra và luyện tập có chấm điểm
              </p>
              <Button
                type="button"
                size="sm"
                className="mt-1"
                onClick={() => requestOpenLoginDialog()}
              >
                Đăng nhập
              </Button>
            </div>
          ) : null}
          <div
            className={cn(
              "space-y-2 rounded-md transition-opacity",
              testsLocked && "pointer-events-none select-none opacity-[0.22]",
            )}
          >
            <div className="space-y-2 overflow-hidden rounded-md border border-border bg-card/50">
              <Button
                variant="ghost"
                className="h-auto min-h-10 w-full flex-col items-stretch gap-0 rounded-none px-3 py-2 font-bold hover:bg-muted/40"
                onClick={() => setIsTypeExpanded(!isTypeExpanded)}
              >
                <div className="flex w-full items-center justify-between">
                  <span>Luyện tập</span>
                  <ChevronRight
                    className={cn(
                      "h-4 w-4 shrink-0 transition-transform",
                      isTypeExpanded && "rotate-180",
                    )}
                  />
                </div>
                {practiceCounts && practiceCounts.total > 0 ? (
                  <div className="mt-2 w-full">
                    <LessonTrackProgressRow
                      attempted={practiceCounts.attempted}
                      total={practiceCounts.total}
                      percent={practiceCounts.percent}
                      detailLabel="Đã làm"
                    />
                  </div>
                ) : null}
              </Button>

              {isTypeExpanded ? (
                <div className="mb-2 ml-2 animate-in border-l-2 border-muted pl-3 pr-1 fade-in">
                  <PracticeSidebarMenu
                    subNavItems={subNavItems}
                    practiceQuestions={practiceQuestions}
                    availableLanes={availableLanes}
                    unitProgress={unitProgress}
                    showUnavailable
                    unavailableHint={(subId) =>
                      subId
                        ? `Phần ${subId} chưa có bài tập dạng này.`
                        : "Phần luyện tập này hiện chưa có nội dung cho chương này."
                    }
                    onSelectType={(typeLabel, subId) =>
                      onStartGeneralTest("type", typeLabel, subId)
                    }
                  />
                </div>
              ) : null}
            </div>

            <Button
              variant="outline"
              className="h-10 w-full justify-between font-bold"
              onClick={() => onStartGeneralTest("bank")}
            >
              <span className="flex items-center gap-1.5">
                {isGeneralTestAttempted(unitProgress) ? (
                  <Check
                    className="h-4 w-4 shrink-0 text-emerald-600"
                    aria-hidden
                  />
                ) : null}
                Kiểm tra tổng quát
              </span>
              <ChevronRight className="h-4 w-4 shrink-0" />
            </Button>
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
};

export default LessonShortcutButtons;
