import React from "react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { GrammarStructure, Unit } from "@/types";
import { type LessonEditorScope } from "@/pages/admin/LessonEditorUtils";
import { Card, CardContent } from "@/components/ui/card";
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
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h3 className="text-xl font-black text-foreground tracking-tight uppercase">
          {scopedTitle ??
            (mode === "create"
              ? "Tạo chương mới"
              : `Cấu trúc chương ${draft.id}`)}
        </h3>
        <div className="flex flex-wrap gap-2 justify-end">
          <Button
            type="button"
            variant="ghost"
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
            className="px-6"
          >
            {saving ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                Đang lưu…
              </>
            ) : (
              "Lưu thay đổi"
            )}
          </Button>
        </div>
      </div>

      {showMeta ? (
        <Card className="shadow-none border-border/40 bg-muted/10">
          <CardContent className="pt-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label
                  htmlFor={`${idPrefix}-unit-id`}
                  className="text-xs font-bold uppercase text-muted-foreground/80"
                >
                  Mã chương (Số thứ tự)
                </Label>
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
                  className="bg-background"
                />
              </div>
              <div className="space-y-2">
                <Label
                  htmlFor={`${idPrefix}-video`}
                  className="text-xs font-bold uppercase text-muted-foreground/80"
                >
                  Video URL (YouTube)
                </Label>
                <Input
                  id={`${idPrefix}-video`}
                  placeholder="https://..."
                  value={draft.videoUrl ?? ""}
                  onChange={(e) =>
                    setDraft((d) => ({ ...d, videoUrl: e.target.value }))
                  }
                  className="bg-background"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label
                htmlFor={`${idPrefix}-title`}
                className="text-xs font-bold uppercase text-muted-foreground/80"
              >
                Tiêu đề chương
              </Label>
              <Input
                id={`${idPrefix}-title`}
                placeholder="Nhập tiêu đề học phần..."
                value={draft.title}
                onChange={(e) =>
                  setDraft((d) => ({ ...d, title: e.target.value }))
                }
                className="bg-background font-medium"
              />
            </div>
            <div className="space-y-2">
              <Label
                htmlFor={`${idPrefix}-desc`}
                className="text-xs font-bold uppercase text-muted-foreground/80"
              >
                Mô tả tóm tắt
              </Label>
              <Textarea
                id={`${idPrefix}-desc`}
                rows={3}
                placeholder="Nội dung chính của chương này..."
                value={draft.description}
                onChange={(e) =>
                  setDraft((d) => ({ ...d, description: e.target.value }))
                }
                className="bg-background resize-none"
              />
            </div>
          </CardContent>
        </Card>
      ) : null}

      {showVocab ||
      showPhrases ||
      showMemoryTemplatesGrammar ||
      showPractice ? (
        <div className="w-full space-y-6">
          {showVocab && (
            <VocabSection
              draft={draft}
              setDraft={setDraft}
            />
          )}

          {showPhrases && (
            <PhrasesSection
              draft={draft}
              setDraft={setDraft}
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
            />
          )}
        </div>
      ) : null}
    </div>
  );
}
