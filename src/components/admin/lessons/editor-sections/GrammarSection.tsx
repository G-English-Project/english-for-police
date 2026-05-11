import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import type { Unit, GrammarStructure } from "@/types";
import { lessonService } from "@/services/lesson.service";
import { useSonner } from "@/hooks/use-sonner";

export function GrammarSection({
  draft,
  mode,
  grammarStructures,
  setGrammarStructures,
}: {
  draft: Unit;
  mode: "create" | "edit";
  grammarStructures: GrammarStructure[];
  setGrammarStructures: React.Dispatch<React.SetStateAction<GrammarStructure[]>>;
}) {
  const { notifyError, notifySuccess } = useSonner();
  const [newStructure, setNewStructure] = useState({
    title: "",
    summary: "",
    exampleEn: "",
    exampleVi: "",
  });

  return (
    <AccordionItem value="grammar" className="px-1 border-b-0">
      <AccordionTrigger className="py-4 text-base font-semibold hover:no-underline">
        Cấu trúc ngữ pháp ({grammarStructures.length})
      </AccordionTrigger>
      <AccordionContent className="space-y-4 px-1 pb-5 pt-1 text-sm">
        {mode === "create" ? (
          <p className="text-muted-foreground">
            Lưu chương mới trước, rồi mở &quot;Sửa&quot; để thêm ngữ pháp.
          </p>
        ) : (
          <>
            {grammarStructures.map((row) => (
              <div
                key={row.id}
                className="border border-border rounded-lg p-3 space-y-2 bg-muted/20"
              >
                <Input
                  placeholder="Tiêu đề"
                  className="font-semibold"
                  value={row.title}
                  onChange={(e) => {
                    const v = e.target.value;
                    setGrammarStructures((prev) =>
                      prev.map((r) =>
                        r.id === row.id ? { ...r, title: v } : r,
                      ),
                    );
                  }}
                />
                <Textarea
                  rows={2}
                  placeholder="Tóm tắt lý thuyết"
                  value={row.summary}
                  onChange={(e) => {
                    const v = e.target.value;
                    setGrammarStructures((prev) =>
                      prev.map((r) =>
                        r.id === row.id ? { ...r, summary: v } : r,
                      ),
                    );
                  }}
                />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  <Input
                    placeholder="Ví dụ EN"
                    value={row.exampleEn ?? ""}
                    onChange={(e) => {
                      const v = e.target.value;
                      setGrammarStructures((prev) =>
                        prev.map((r) =>
                          r.id === row.id ? { ...r, exampleEn: v } : r,
                        ),
                      );
                    }}
                  />
                  <Input
                    placeholder="Ví dụ VI"
                    value={row.exampleVi ?? ""}
                    onChange={(e) => {
                      const v = e.target.value;
                      setGrammarStructures((prev) =>
                        prev.map((r) =>
                          r.id === row.id ? { ...r, exampleVi: v } : r,
                        ),
                      );
                    }}
                  />
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button
                    type="button"
                    size="sm"
                    variant="secondary"
                    onClick={() => {
                      void (async () => {
                        try {
                          await lessonService.updateGrammarStructure(
                            draft.id,
                            row.id,
                            {
                              title: row.title.trim(),
                              summary: row.summary.trim(),
                              exampleEn: row.exampleEn?.trim() || "",
                              exampleVi: row.exampleVi?.trim() || "",
                              sortOrder: row.sortOrder,
                            },
                          );
                          notifySuccess("Đã lưu ngữ pháp", `#${row.id}`);
                        } catch (e) {
                          notifyError(
                            "Không lưu được ngữ pháp",
                            String((e as Error).message ?? e),
                          );
                        }
                      })();
                    }}
                  >
                    Lưu dòng
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    variant="ghost"
                    className="text-destructive"
                    onClick={() => {
                      void (async () => {
                        try {
                          await lessonService.deleteGrammarStructure(
                            draft.id,
                            row.id,
                          );
                          setGrammarStructures((prev) =>
                            prev.filter((r) => r.id !== row.id),
                          );
                          notifySuccess("Đã xóa ngữ pháp", `#${row.id}`);
                        } catch (e) {
                          notifyError(
                            "Không xóa được",
                            String((e as Error).message ?? e),
                          );
                        }
                      })();
                    }}
                  >
                    Xóa
                  </Button>
                </div>
              </div>
            ))}
            <div className="border border-dashed rounded-lg p-3 space-y-2">
              <p className="text-xs font-medium text-muted-foreground">
                Thêm ngữ pháp mới
              </p>
              <Input
                placeholder="Tiêu đề"
                value={newStructure.title}
                onChange={(e) =>
                  setNewStructure((s) => ({
                    ...s,
                    title: e.target.value,
                  }))
                }
              />
              <Textarea
                rows={2}
                placeholder="Tóm tắt lý thuyết"
                value={newStructure.summary}
                onChange={(e) =>
                  setNewStructure((s) => ({
                    ...s,
                    summary: e.target.value,
                  }))
                }
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                <Input
                  placeholder="Ví dụ EN"
                  value={newStructure.exampleEn}
                  onChange={(e) =>
                    setNewStructure((s) => ({
                      ...s,
                      exampleEn: e.target.value,
                    }))
                  }
                />
                <Input
                  placeholder="Ví dụ VI"
                  value={newStructure.exampleVi}
                  onChange={(e) =>
                    setNewStructure((s) => ({
                      ...s,
                      exampleVi: e.target.value,
                    }))
                  }
                />
              </div>
              <Button
                type="button"
                size="sm"
                variant="secondary"
                onClick={() => {
                  void (async () => {
                    try {
                      if (!newStructure.title || !newStructure.summary) {
                        notifyError("Vui lòng nhập tiêu đề/tóm tắt", "");
                        return;
                      }
                      const res = await lessonService.createGrammarStructure(
                        draft.id,
                        {
                          title: newStructure.title.trim(),
                          summary: newStructure.summary.trim(),
                          exampleEn: newStructure.exampleEn.trim(),
                          exampleVi: newStructure.exampleVi.trim(),
                          sortOrder: 0,
                        },
                      );
                      setGrammarStructures((prev) => [...prev, res]);
                      setNewStructure({
                        title: "",
                        summary: "",
                        exampleEn: "",
                        exampleVi: "",
                      });
                      notifySuccess("Đã thêm ngữ pháp mới", "");
                    } catch (e) {
                      notifyError(
                        "Không thêm được",
                        String((e as Error).message ?? e),
                      );
                    }
                  })();
                }}
              >
                + Thêm ngay
              </Button>
            </div>
          </>
        )}
      </AccordionContent>
    </AccordionItem>
  );
}
