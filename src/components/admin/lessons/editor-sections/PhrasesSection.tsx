import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import type { Unit } from "@/types";
import { cn } from "@/lib/utils";
import { defaultPhrase } from "@/pages/admin/LessonEditorUtils";

export function PhrasesSection({
  draft,
  setDraft,
  isScopedEditor,
}: {
  draft: Unit;
  setDraft: React.Dispatch<React.SetStateAction<Unit>>;
  isScopedEditor: boolean;
}) {
  return (
    <AccordionItem value="phrases" className="border-b border-border/80 px-1">
      <AccordionTrigger
        className={cn(
          "py-4 text-base font-semibold hover:no-underline",
          isScopedEditor && "pointer-events-none cursor-default [&>svg]:hidden",
        )}
      >
        Mẫu câu ({draft.phrases.length})
      </AccordionTrigger>
      <AccordionContent className="space-y-4 px-1 pb-5 pt-1">
        {draft.phrases.map((row, idx) => (
          <div
            key={idx}
            className="grid grid-cols-1 md:grid-cols-3 gap-2 border-b border-border/50 pb-3 last:border-0"
          >
            <Input
              placeholder="Câu"
              value={row.text}
              onChange={(e) => {
                const p = [...draft.phrases];
                p[idx] = { ...p[idx], text: e.target.value };
                setDraft((d) => ({ ...d, phrases: p }));
              }}
            />
            <Input
              placeholder="Dịch"
              value={row.translation}
              onChange={(e) => {
                const p = [...draft.phrases];
                p[idx] = { ...p[idx], translation: e.target.value };
                setDraft((d) => ({ ...d, phrases: p }));
              }}
            />
            <div className="flex gap-2 md:col-span-3">
              <Input
                placeholder="Ngữ cảnh"
                className="flex-1"
                value={row.context}
                onChange={(e) => {
                  const p = [...draft.phrases];
                  p[idx] = { ...p[idx], context: e.target.value };
                  setDraft((d) => ({ ...d, phrases: p }));
                }}
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => {
                  const p = draft.phrases.filter((_, i) => i !== idx);
                  setDraft((d) => ({ ...d, phrases: p }));
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
              phrases: [...d.phrases, defaultPhrase()],
            }))
          }
        >
          + Thêm mẫu câu
        </Button>
      </AccordionContent>
    </AccordionItem>
  );
}
