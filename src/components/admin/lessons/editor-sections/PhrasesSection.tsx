import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import type { Unit } from "@/types";
import { defaultPhrase } from "@/pages/admin/LessonEditorUtils";

import { Trash2, Plus } from "lucide-react";

export function PhrasesSection({
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
          {draft.phrases.map((row, idx) => (
            <div
              key={idx}
              className="group relative grid grid-cols-1 md:grid-cols-12 gap-3 p-4 rounded-md border border-border/40 bg-background/50 transition-colors hover:border-primary/20"
            >
              <div className="md:col-span-5 space-y-1">
                <Label className="text-[10px] font-bold uppercase text-muted-foreground/60 ml-1">
                  Tiếng Anh
                </Label>
                <Input
                  placeholder="Mẫu câu tiếng Anh..."
                  value={row.text}
                  onChange={(e) => {
                    const p = [...draft.phrases];
                    p[idx] = { ...p[idx], text: e.target.value };
                    setDraft((d) => ({ ...d, phrases: p }));
                  }}
                  className="h-8 text-sm font-medium"
                />
              </div>
              <div className="md:col-span-6 space-y-1">
                <Label className="text-[10px] font-bold uppercase text-muted-foreground/60 ml-1">
                  Bản dịch
                </Label>
                <Input
                  placeholder="Nghĩa tiếng Việt..."
                  value={row.translation}
                  onChange={(e) => {
                    const p = [...draft.phrases];
                    p[idx] = { ...p[idx], translation: e.target.value };
                    setDraft((d) => ({ ...d, phrases: p }));
                  }}
                  className="h-8 text-sm"
                />
              </div>
              <div className="md:col-span-11 space-y-1">
                <Label className="text-[10px] font-bold uppercase text-muted-foreground/60 ml-1">
                  Ngữ cảnh sử dụng
                </Label>
                <Input
                  placeholder="Ví dụ: Dùng khi chào hỏi, dùng trong báo cáo..."
                  value={row.context}
                  onChange={(e) => {
                    const p = [...draft.phrases];
                    p[idx] = { ...p[idx], context: e.target.value };
                    setDraft((d) => ({ ...d, phrases: p }));
                  }}
                  className="h-8 text-xs italic"
                />
              </div>
              <div className="md:col-span-1 flex justify-end items-end pb-0.5">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                  onClick={() => {
                    const p = draft.phrases.filter((_, i) => i !== idx);
                    setDraft((d) => ({ ...d, phrases: p }));
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
              phrases: [...d.phrases, defaultPhrase()],
            }))
          }
        >
          <Plus className="h-3 w-3 mr-2" />
          Thêm mẫu câu mới
        </Button>
      </CardContent>
    </Card>
  );
}
