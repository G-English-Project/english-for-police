import React, { useMemo } from "react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Accordion } from "@/components/ui/accordion";
import type { GrammarStructure, Unit } from "@/types";
import { type LessonEditorScope } from "@/pages/admin/LessonEditorUtils";
import { VocabSection } from "./editor-sections/VocabSection";
import { PhrasesSection } from "./editor-sections/PhrasesSection";
import { GrammarSection } from "./editor-sections/GrammarSection";
import { PracticeSection } from "./editor-sections/PracticeSection";

type EditorMode = "create" | "edit";

export function LessonEditorForm({
  mode,
  draft,
  setDraft,
  idPrefix,
  saving,
  onCancel,
  onSave,
  grammarStructures,
  setGrammarStructures,
  scope = "full",
}: {
  mode: EditorMode;
  draft: Unit;
  setDraft: React.Dispatch<React.SetStateAction<Unit>>;
  idPrefix: string;
  saving: boolean;
  onCancel: () => void;
  onSave: () => void;
  grammarStructures: GrammarStructure[];
  setGrammarStructures: React.Dispatch<
    React.SetStateAction<GrammarStructure[]>
  >;
  scope?: LessonEditorScope;
}) {
  const eff = scope;
  const showMeta = eff === "full" || eff === "meta";
  const showVocab = eff === "full" || eff === "vocabulary";
  const showPhrases = eff === "full" || eff === "phrases";
  const showPractice = eff === "full" || eff === "practice";
  const showMemoryTemplatesGrammar = eff === "full";
  const isScopedEditor = eff !== "full";

  const lockedOpenSections = useMemo(() => {
    if (!isScopedEditor) return undefined;
    const sections: string[] = [];
    if (showVocab) sections.push("vocab");
    if (showPhrases) sections.push("phrases");
    if (showPractice) sections.push("practice");
    return sections;
  }, [isScopedEditor, showPhrases, showPractice, showVocab]);

  const scopedTitle =
    eff === "meta"
      ? "Thông tin chương"
      : eff === "vocabulary"
        ? "Từ vựng"
        : eff === "phrases"
          ? "Mẫu câu"
          : eff === "practice"
            ? "Bài kiểm tra & câu hỏi luyện tập"
            : null;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 rounded-xl border border-border/80 bg-card px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-5">
        <h3 className="text-lg font-bold text-primary tracking-tight">
          {scopedTitle ??
            (mode === "create" ? "Thêm chương mới" : `Sửa chương ${draft.id}`)}
        </h3>
        <div className="flex flex-wrap gap-2 justify-end">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onCancel}
            disabled={saving}
          >
            Hủy
          </Button>
          <Button
            type="button"
            size="sm"
            onClick={() => void onSave()}
            disabled={saving}
          >
            {saving ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                Đang lưu…
              </>
            ) : (
              "Lưu"
            )}
          </Button>
        </div>
      </div>

      {showMeta ? (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor={`${idPrefix}-unit-id`}>Mã chương (số)</Label>
              <Input
                id={`${idPrefix}-unit-id`}
                type="number"
                disabled={mode === "edit"}
                value={draft.id}
                onChange={(e) =>
                  setDraft((d) => ({
                    ...d,
                    id: Number(e.target.value) || 0,
                  }))
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor={`${idPrefix}-video`}>Video URL</Label>
              <Input
                id={`${idPrefix}-video`}
                value={draft.videoUrl ?? ""}
                onChange={(e) =>
                  setDraft((d) => ({ ...d, videoUrl: e.target.value }))
                }
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor={`${idPrefix}-title`}>Tiêu đề</Label>
            <Input
              id={`${idPrefix}-title`}
              value={draft.title}
              onChange={(e) =>
                setDraft((d) => ({ ...d, title: e.target.value }))
              }
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor={`${idPrefix}-desc`}>Mô tả</Label>
            <Textarea
              id={`${idPrefix}-desc`}
              rows={3}
              value={draft.description}
              onChange={(e) =>
                setDraft((d) => ({ ...d, description: e.target.value }))
              }
            />
          </div>
        </div>
      ) : null}

      {showVocab ||
      showPhrases ||
      showMemoryTemplatesGrammar ||
      showPractice ? (
        <Accordion
          type="multiple"
          value={lockedOpenSections}
          className="w-full rounded-xl border border-border/80 bg-background px-2 md:px-3"
        >
          {showVocab && (
            <VocabSection
              draft={draft}
              setDraft={setDraft}
              isScopedEditor={isScopedEditor}
            />
          )}

          {showPhrases && (
            <PhrasesSection
              draft={draft}
              setDraft={setDraft}
              isScopedEditor={isScopedEditor}
            />
          )}

          {showMemoryTemplatesGrammar && (
            <>
              <GrammarSection
                draft={draft}
                mode={mode}
                grammarStructures={grammarStructures}
                setGrammarStructures={setGrammarStructures}
              />
            </>
          )}

          {showPractice && (
            <PracticeSection
              draft={draft}
              setDraft={setDraft}
              isScopedEditor={isScopedEditor}
            />
          )}
        </Accordion>
      ) : null}
    </div>
  );
}
