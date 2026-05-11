import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
    <div className="space-y-4">
      <div className="flex items-center gap-2 px-1">
        <div className="h-2 w-2 rounded-full bg-primary" />
        <h4 className="text-sm font-bold uppercase tracking-wider text-foreground/70">
          Danh sách từ vựng ({draft.vocabulary.length})
        </h4>
      </div>

      <Card className="border border-border/60 bg-card/30 shadow-none overflow-hidden">
        <CardContent className="space-y-6 p-4">
          <div className="space-y-6">
            {draft.vocabulary.map((row, idx) => (
              <div
                key={idx}
                className="group relative flex flex-col gap-4 p-5 rounded-xl border border-border/40 bg-background/60 transition-all hover:border-primary/30 hover:shadow-sm"
              >
                {/* Item Number Badge */}
                <div className="absolute -left-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground shadow-sm">
                  {idx + 1}
                </div>

                {/* First Row: Word, Phonetic, Type */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                  <div className="md:col-span-4 space-y-1.5">
                    <Label className="text-[10px] font-bold uppercase text-muted-foreground ml-1">
                      Từ vựng
                    </Label>
                    <Input
                      placeholder="VD: Police"
                      value={row.word}
                      onChange={(e) => {
                        const v = [...draft.vocabulary];
                        v[idx] = { ...v[idx], word: e.target.value };
                        setDraft((d) => ({ ...d, vocabulary: v }));
                      }}
                      className="h-9 text-sm font-bold border-border/40 focus:border-primary/40 focus:ring-primary/10"
                    />
                  </div>
                  <div className="md:col-span-4 space-y-1.5">
                    <Label className="text-[10px] font-bold uppercase text-muted-foreground ml-1">
                      Phiên âm
                    </Label>
                    <Input
                      placeholder="VD: /pəˈliːs/"
                      value={row.phonetic}
                      onChange={(e) => {
                        const v = [...draft.vocabulary];
                        v[idx] = { ...v[idx], phonetic: e.target.value };
                        setDraft((d) => ({ ...d, vocabulary: v }));
                      }}
                      className="h-9 text-sm font-mono border-border/40"
                    />
                  </div>
                  <div className="md:col-span-3 space-y-1.5">
                    <Label className="text-[10px] font-bold uppercase text-muted-foreground ml-1">
                      Loại từ
                    </Label>
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
                      <SelectTrigger className="h-9 text-[11px] uppercase tracking-wider font-bold border-border/40 bg-muted/20">
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
                  <div className="md:col-span-1 flex justify-end items-end pb-0.5">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-muted-foreground/50 hover:text-destructive hover:bg-destructive/10 transition-colors"
                      onClick={() => {
                        const v = draft.vocabulary.filter((_, i) => i !== idx);
                        setDraft((d) => ({ ...d, vocabulary: v }));
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {/* Second Row: Meaning */}
                <div className="space-y-1.5">
                  <Label className="text-[10px] font-bold uppercase text-muted-foreground ml-1">
                    Nghĩa của từ
                  </Label>
                  <Input
                    placeholder="VD: Cảnh sát, công an"
                    value={row.meaning}
                    onChange={(e) => {
                      const v = [...draft.vocabulary];
                      v[idx] = { ...v[idx], meaning: e.target.value };
                      setDraft((d) => ({ ...d, vocabulary: v }));
                    }}
                    className="h-9 text-sm font-medium border-border/40"
                  />
                </div>

                {/* Third Row: Example */}
                <div className="space-y-1.5">
                  <Label className="text-[10px] font-bold uppercase text-muted-foreground ml-1">
                    Ví dụ minh họa
                  </Label>
                  <Input
                    placeholder="Nhập câu ví dụ sử dụng từ này..."
                    value={row.example}
                    onChange={(e) => {
                      const v = [...draft.vocabulary];
                      v[idx] = { ...v[idx], example: e.target.value };
                      setDraft((d) => ({ ...d, vocabulary: v }));
                    }}
                    className="h-9 text-xs italic bg-muted/10 border-dashed border-border/60"
                  />
                </div>
              </div>
            ))}
          </div>

          <Button
            type="button"
            variant="outline"
            size="sm"
            className="w-full h-10 border-dashed border-2 hover:border-primary/50 hover:bg-primary/5 transition-all text-xs font-bold uppercase tracking-widest text-muted-foreground hover:text-primary mt-2"
            onClick={() =>
              setDraft((d) => ({
                ...d,
                vocabulary: [...d.vocabulary, defaultVocabulary()],
              }))
            }
          >
            <Plus className="h-4 w-4 mr-2" />
            Thêm từ vựng mới
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
