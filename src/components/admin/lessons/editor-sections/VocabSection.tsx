import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import type { Unit, Vocabulary } from "@/types";
import {
  VOCAB_TYPES,
  defaultVocabulary,
} from "@/pages/admin/LessonEditorUtils";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Trash2, Plus } from "lucide-react";

export function VocabSection({
  draft,
  setDraft,
}: {
  draft: Unit;
  setDraft: React.Dispatch<React.SetStateAction<Unit>>;
}) {
  return (
    <Card className="border border-border/60 bg-card/30 shadow-none overflow-hidden">
      <CardContent className="space-y-4 p-4">
        <div className="space-y-4">
          {draft.vocabulary.map((row, idx) => (
            <div
              key={idx}
              className="group relative grid grid-cols-1 md:grid-cols-12 gap-3 p-4 rounded-md border border-border/40 bg-background/50 transition-colors hover:border-primary/20"
            >
              <div className="md:col-span-3 space-y-1.5">
                <Input
                  placeholder="Từ mới"
                  value={row.word}
                  onChange={(e) => {
                    const v = [...draft.vocabulary];
                    v[idx] = { ...v[idx], word: e.target.value };
                    setDraft((d) => ({ ...d, vocabulary: v }));
                  }}
                  className="h-8 text-sm"
                />
              </div>
              <div className="md:col-span-3 space-y-1.5">
                <Input
                  placeholder="Phiên âm (/.../)"
                  value={row.phonetic}
                  onChange={(e) => {
                    const v = [...draft.vocabulary];
                    v[idx] = { ...v[idx], phonetic: e.target.value };
                    setDraft((d) => ({ ...d, vocabulary: v }));
                  }}
                  className="h-8 text-sm"
                />
              </div>
              <div className="md:col-span-4 space-y-1.5">
                <Input
                  placeholder="Nghĩa của từ"
                  value={row.meaning}
                  onChange={(e) => {
                    const v = [...draft.vocabulary];
                    v[idx] = { ...v[idx], meaning: e.target.value };
                    setDraft((d) => ({ ...d, vocabulary: v }));
                  }}
                  className="h-8 text-sm font-medium"
                />
              </div>
              <div className="md:col-span-2">
                <Select
                  value={row.type}
                  onValueChange={(val) => {
                    const v = [...draft.vocabulary];
                    v[idx] = {
                      ...v[idx],
                      type: val as Vocabulary["type"],
                    };
                    setDraft((d) => ({ ...d, vocabulary: v }));
                  }}
                >
                  <SelectTrigger className="h-8 text-[11px] uppercase tracking-wider font-bold">
                    <SelectValue placeholder="Loại từ" />
                  </SelectTrigger>
                  <SelectContent position="popper">
                    {VOCAB_TYPES.map((t) => (
                      <SelectItem
                        key={t}
                        value={t}
                        className="text-xs uppercase tracking-wider"
                      >
                        {t}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="md:col-span-11">
                <Input
                  placeholder="Ví dụ minh họa cho từ..."
                  value={row.example}
                  onChange={(e) => {
                    const v = [...draft.vocabulary];
                    v[idx] = { ...v[idx], example: e.target.value };
                    setDraft((d) => ({ ...d, vocabulary: v }));
                  }}
                  className="h-8 text-xs italic"
                />
              </div>
              <div className="md:col-span-1 flex justify-end items-center">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                  onClick={() => {
                    const v = draft.vocabulary.filter((_, i) => i !== idx);
                    setDraft((d) => ({ ...d, vocabulary: v }));
                  }}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="w-full h-9 border-dashed border-2 hover:border-primary/50 hover:bg-primary/5 transition-all text-xs font-bold uppercase tracking-widest text-muted-foreground hover:text-primary"
          onClick={() =>
            setDraft((d) => ({
              ...d,
              vocabulary: [...d.vocabulary, defaultVocabulary()],
            }))
          }
        >
          <Plus className="h-3 w-3 mr-2" />
          Thêm từ vựng mới
        </Button>
      </CardContent>
    </Card>
  );
}
