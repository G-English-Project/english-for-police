import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import type { Unit, Vocabulary } from "@/types";
import { cn } from "@/lib/utils";
import { VOCAB_TYPES, defaultVocabulary } from "@/pages/admin/LessonEditorUtils";

const selectClass =
  "flex h-11 w-full rounded-md border border-input bg-background px-3 py-2 text-sm md:text-base ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2";

export function VocabSection({
  draft,
  setDraft,
  isScopedEditor,
}: {
  draft: Unit;
  setDraft: React.Dispatch<React.SetStateAction<Unit>>;
  isScopedEditor: boolean;
}) {
  return (
    <AccordionItem value="vocab" className="border-b border-border/80 px-1">
      <AccordionTrigger
        className={cn(
          "py-4 text-base font-semibold hover:no-underline",
          isScopedEditor && "pointer-events-none cursor-default [&>svg]:hidden",
        )}
      >
        Từ vựng ({draft.vocabulary.length})
      </AccordionTrigger>
      <AccordionContent className="space-y-4 px-1 pb-5 pt-1">
        {draft.vocabulary.map((row, idx) => (
          <div
            key={idx}
            className="grid grid-cols-1 md:grid-cols-6 gap-2 border-b border-border/50 pb-3 last:border-0"
          >
            <Input
              placeholder="Từ"
              value={row.word}
              onChange={(e) => {
                const v = [...draft.vocabulary];
                v[idx] = { ...v[idx], word: e.target.value };
                setDraft((d) => ({ ...d, vocabulary: v }));
              }}
            />
            <Input
              placeholder="Phiên âm"
              value={row.phonetic}
              onChange={(e) => {
                const v = [...draft.vocabulary];
                v[idx] = { ...v[idx], phonetic: e.target.value };
                setDraft((d) => ({ ...d, vocabulary: v }));
              }}
            />
            <Input
              placeholder="Nghĩa"
              className="md:col-span-2"
              value={row.meaning}
              onChange={(e) => {
                const v = [...draft.vocabulary];
                v[idx] = { ...v[idx], meaning: e.target.value };
                setDraft((d) => ({ ...d, vocabulary: v }));
              }}
            />
            <select
              className={selectClass}
              value={row.type}
              onChange={(e) => {
                const v = [...draft.vocabulary];
                v[idx] = {
                  ...v[idx],
                  type: e.target.value as Vocabulary["type"],
                };
                setDraft((d) => ({ ...d, vocabulary: v }));
              }}
            >
              {VOCAB_TYPES.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
            <div className="flex gap-2 md:col-span-6">
              <Input
                placeholder="Ví dụ"
                className="flex-1"
                value={row.example}
                onChange={(e) => {
                  const v = [...draft.vocabulary];
                  v[idx] = { ...v[idx], example: e.target.value };
                  setDraft((d) => ({ ...d, vocabulary: v }));
                }}
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => {
                  const v = draft.vocabulary.filter((_, i) => i !== idx);
                  setDraft((d) => ({ ...d, vocabulary: v }));
                }}
              >
                Xóa
              </Button>
            </div>
          </div>
        ))}
        <Button
          type="button"
          variant="secondary"
          size="sm"
          onClick={() =>
            setDraft((d) => ({
              ...d,
              vocabulary: [...d.vocabulary, defaultVocabulary()],
            }))
          }
        >
          + Thêm từ
        </Button>
      </AccordionContent>
    </AccordionItem>
  );
}
