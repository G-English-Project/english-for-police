import { useMemo, useState, useCallback } from "react";
import {
  PRACTICE_MENU_LABEL_TO_LANE,
  practiceTypesForSubLesson,
} from "@/components/practice/utils/testUtils";
import type { UnitProgress } from "@/models/progress.model";
import {
  arePracticeTypeLabelsComplete,
  isPracticeTypeLabelComplete,
} from "@/lib/unit-progress";
import type { LessonTestLane, Question } from "@/types";
import {
  formatPracticeSubLessonLabel,
  PHRASE_PRACTICE_TYPE_LABELS,
  VOCAB_PRACTICE_TYPE_LABELS,
} from "./practice-menu-groups";
import { PracticeMenuGroup, PracticeMenuRow } from "./PracticeMenuRows";

export interface PracticeSubNavItem {
  id: string;
  title: string;
  label?: string;
}

interface PracticeSidebarMenuProps {
  subNavItems: PracticeSubNavItem[];
  practiceQuestions: Question[];
  availableLanes: Set<LessonTestLane>;
  unitProgress?: UnitProgress;
  showUnavailable?: boolean;
  emptyMessage?: string;
  unavailableHint?: (subLessonId?: string) => string;
  onSelectType: (typeLabel: string, subLessonId?: string) => void;
}

export function PracticeSidebarMenu({
  subNavItems,
  practiceQuestions,
  availableLanes,
  unitProgress,
  showUnavailable = true,
  emptyMessage = "Chưa có bài tập cho chương này.",
  unavailableHint,
  onSelectType,
}: PracticeSidebarMenuProps) {
  const [vocabOpen, setVocabOpen] = useState(false);
  const [phraseOpen, setPhraseOpen] = useState(false);
  const [openPhraseSubId, setOpenPhraseSubId] = useState<string | null>(null);

  const vocabAvailable = new Set(
    VOCAB_PRACTICE_TYPE_LABELS.filter((label) =>
      availableLanes.has(PRACTICE_MENU_LABEL_TO_LANE[label]),
    ),
  );

  const labelsForSub = useCallback(
    (subId: string) =>
      new Set(
        practiceTypesForSubLesson(practiceQuestions, subId)
          .map((t) => t.label)
          .filter((label) =>
            (PHRASE_PRACTICE_TYPE_LABELS as readonly string[]).includes(label),
          ),
      ),
    [practiceQuestions],
  );

  const hasVocab =
    showUnavailable ||
    VOCAB_PRACTICE_TYPE_LABELS.some((l) => vocabAvailable.has(l));

  const vocabLabelsToTrack = VOCAB_PRACTICE_TYPE_LABELS.filter((l) =>
    vocabAvailable.has(l),
  );
  const vocabGroupComplete = arePracticeTypeLabelsComplete(
    unitProgress,
    vocabLabelsToTrack,
  );

  const phraseSubs = useMemo(
    () => (subNavItems.length > 0 ? subNavItems : []),
    [subNavItems],
  );
  const hasPhraseSection =
    phraseSubs.length > 0
      ? phraseSubs.some(
          (item) =>
            showUnavailable ||
            PHRASE_PRACTICE_TYPE_LABELS.some((l) =>
              labelsForSub(item.id).has(l),
            ),
        )
      : showUnavailable ||
        PHRASE_PRACTICE_TYPE_LABELS.some((l) =>
          availableLanes.has(PRACTICE_MENU_LABEL_TO_LANE[l]),
        );

  const phraseGroupComplete = useMemo(() => {
    const phrasePartsToTrack: { labels: string[]; subId?: string }[] = [];
    if (phraseSubs.length > 0) {
      for (const item of phraseSubs) {
        const subLabels = labelsForSub(item.id);
        const labels = PHRASE_PRACTICE_TYPE_LABELS.filter((l) =>
          subLabels.has(l),
        );
        if (labels.length > 0) {
          phrasePartsToTrack.push({ labels, subId: item.id });
        }
      }
    } else {
      const labels = PHRASE_PRACTICE_TYPE_LABELS.filter((l) =>
        availableLanes.has(PRACTICE_MENU_LABEL_TO_LANE[l]),
      );
      if (labels.length > 0) {
        phrasePartsToTrack.push({ labels });
      }
    }
    return (
      phrasePartsToTrack.length > 0 &&
      phrasePartsToTrack.every((part) =>
        arePracticeTypeLabelsComplete(unitProgress, part.labels, part.subId),
      )
    );
  }, [phraseSubs, labelsForSub, availableLanes, unitProgress]);

  if (!hasVocab && !hasPhraseSection) {
    return (
      <p className="px-2 py-1.5 text-[10px] italic text-muted-foreground">
        {emptyMessage}
      </p>
    );
  }

  const hint =
    unavailableHint?.() ?? "Phần luyện tập này hiện chưa có nội dung.";

  return (
    <PracticeMenuGroup>
      {hasVocab ? (
        <div className="space-y-0.5">
          <PracticeMenuRow
            label="Từ vựng"
            isExpandable
            isOpen={vocabOpen}
            onToggle={() => setVocabOpen((v) => !v)}
            completed={vocabGroupComplete}
            showUnavailable={showUnavailable}
          />
          {vocabOpen ? (
            <PracticeMenuGroup depth={1}>
              {VOCAB_PRACTICE_TYPE_LABELS.map((typeLabel) => (
                <PracticeMenuRow
                  key={typeLabel}
                  label={typeLabel}
                  depth={1}
                  isAvailable={vocabAvailable.has(typeLabel)}
                  completed={isPracticeTypeLabelComplete(
                    unitProgress,
                    typeLabel,
                  )}
                  showUnavailable={showUnavailable}
                  unavailableHint={hint}
                  onSelect={() => onSelectType(typeLabel)}
                />
              ))}
            </PracticeMenuGroup>
          ) : null}
        </div>
      ) : null}

      {hasPhraseSection ? (
        <div className="space-y-0.5">
          <PracticeMenuRow
            label="Mẫu câu"
            isExpandable
            isOpen={phraseOpen}
            onToggle={() => {
              setPhraseOpen((v) => !v);
              if (phraseOpen) setOpenPhraseSubId(null);
            }}
            completed={phraseGroupComplete}
            showUnavailable={showUnavailable}
          />
          {phraseOpen ? (
            <PracticeMenuGroup depth={1}>
              {phraseSubs.length > 0
                ? phraseSubs.map((item) => {
                    const subLabels = labelsForSub(item.id);
                    const subOpen = openPhraseSubId === item.id;
                    const subHasContent =
                      showUnavailable ||
                      PHRASE_PRACTICE_TYPE_LABELS.some((l) => subLabels.has(l));

                    if (!subHasContent) return null;

                    const subLabelsToTrack = PHRASE_PRACTICE_TYPE_LABELS.filter(
                      (l) => subLabels.has(l),
                    );
                    const subGroupComplete = arePracticeTypeLabelsComplete(
                      unitProgress,
                      subLabelsToTrack,
                      item.id,
                    );

                    return (
                      <div key={item.id} className="space-y-0.5">
                        <PracticeMenuRow
                          label={
                            item.label ??
                            formatPracticeSubLessonLabel(item.id, item.title)
                          }
                          depth={1}
                          isExpandable
                          isOpen={subOpen}
                          onToggle={() =>
                            setOpenPhraseSubId((prev) =>
                              prev === item.id ? null : item.id,
                            )
                          }
                          completed={subGroupComplete}
                          showUnavailable={showUnavailable}
                        />
                        {subOpen ? (
                          <PracticeMenuGroup depth={2}>
                            {PHRASE_PRACTICE_TYPE_LABELS.map((typeLabel) => (
                              <PracticeMenuRow
                                key={`${item.id}-${typeLabel}`}
                                label={typeLabel}
                                depth={2}
                                isAvailable={subLabels.has(typeLabel)}
                                completed={isPracticeTypeLabelComplete(
                                  unitProgress,
                                  typeLabel,
                                  item.id,
                                )}
                                showUnavailable={showUnavailable}
                                unavailableHint={
                                  unavailableHint?.(item.id) ??
                                  `Phần ${item.id} chưa có bài tập dạng này.`
                                }
                                onSelect={() =>
                                  onSelectType(typeLabel, item.id)
                                }
                              />
                            ))}
                          </PracticeMenuGroup>
                        ) : null}
                      </div>
                    );
                  })
                : PHRASE_PRACTICE_TYPE_LABELS.map((typeLabel) => {
                    const lane = PRACTICE_MENU_LABEL_TO_LANE[typeLabel];
                    const isAvailable = availableLanes.has(lane);
                    return (
                      <PracticeMenuRow
                        key={typeLabel}
                        label={typeLabel}
                        depth={1}
                        isAvailable={isAvailable}
                        completed={isPracticeTypeLabelComplete(
                          unitProgress,
                          typeLabel,
                        )}
                        showUnavailable={showUnavailable}
                        unavailableHint={hint}
                        onSelect={() => onSelectType(typeLabel)}
                      />
                    );
                  })}
            </PracticeMenuGroup>
          ) : null}
        </div>
      ) : null}
    </PracticeMenuGroup>
  );
}
