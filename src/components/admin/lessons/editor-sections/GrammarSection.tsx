import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import type { Unit, GrammarStructure } from "@/types";
import { lessonService } from "@/services/lesson.service";
import { useSonner } from "@/hooks/use-sonner";
import { Trash2, Save, Plus, AlertCircle } from "lucide-react";
import { Label } from "@/components/ui/label";

export function GrammarSection({
  draft,
  mode,
  grammarStructures,
  setGrammarStructures,
}: {
  draft: Unit;
  mode: "create" | "edit";
  grammarStructures: GrammarStructure[];
  setGrammarStructures: React.Dispatch<
    React.SetStateAction<GrammarStructure[]>
  >;
}) {
  const { notifyError, notifySuccess } = useSonner();
  const [newStructure, setNewStructure] = useState({
    title: "",
    summary: "",
    exampleEn: "",
    exampleVi: "",
  });

  return (
    <Card className="border border-border/60 bg-card/30 shadow-none overflow-hidden">
      <CardContent className="space-y-4 p-4">
        {mode === "create" ? (
          <div className="flex items-center gap-2 p-4 rounded-md bg-muted/30 border border-dashed text-muted-foreground text-xs italic justify-center">
            <AlertCircle className="h-4 w-4" />
            Lưu chương mới trước, sau đó dùng chức năng &quot;Sửa&quot; để thêm
            ngữ pháp.
          </div>
        ) : (
          <div className="space-y-6">
            <div className="space-y-4">
              {grammarStructures.map((row) => (
                <div
                  key={row.id}
                  className="group relative p-4 rounded-md border border-border/40 bg-background/50 transition-colors hover:border-primary/20 space-y-4"
                >
                  <div className="space-y-1.5">
                    <Label className="text-[10px] font-bold uppercase text-muted-foreground/60 ml-1">
                      Tiêu đề cấu trúc
                    </Label>
                    <Input
                      placeholder="Ví dụ: Past Simple, Modal Verbs..."
                      value={row.title}
                      onChange={(e) => {
                        const v = e.target.value;
                        setGrammarStructures((prev) =>
                          prev.map((r) =>
                            r.id === row.id ? { ...r, title: v } : r,
                          ),
                        );
                      }}
                      className="h-9 text-sm font-bold"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-[10px] font-bold uppercase text-muted-foreground/60 ml-1">
                      Lý thuyết tóm tắt
                    </Label>
                    <Textarea
                      rows={3}
                      placeholder="Giải thích ngắn gọn cách dùng..."
                      value={row.summary}
                      onChange={(e) => {
                        const v = e.target.value;
                        setGrammarStructures((prev) =>
                          prev.map((r) =>
                            r.id === row.id ? { ...r, summary: v } : r,
                          ),
                        );
                      }}
                      className="text-xs leading-relaxed"
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label className="text-[10px] font-bold uppercase text-muted-foreground/60 ml-1">
                        Ví dụ (Tiếng Anh)
                      </Label>
                      <Input
                        placeholder="English example..."
                        value={row.exampleEn ?? ""}
                        onChange={(e) => {
                          const v = e.target.value;
                          setGrammarStructures((prev) =>
                            prev.map((r) =>
                              r.id === row.id ? { ...r, exampleEn: v } : r,
                            ),
                          );
                        }}
                        className="h-8 text-xs italic"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-[10px] font-bold uppercase text-muted-foreground/60 ml-1">
                        Bản dịch (Tiếng Việt)
                      </Label>
                      <Input
                        placeholder="Bản dịch tiếng Việt..."
                        value={row.exampleVi ?? ""}
                        onChange={(e) => {
                          const v = e.target.value;
                          setGrammarStructures((prev) =>
                            prev.map((r) =>
                              r.id === row.id ? { ...r, exampleVi: v } : r,
                            ),
                          );
                        }}
                        className="h-8 text-xs"
                      />
                    </div>
                  </div>
                  <div className="flex justify-between items-center pt-2 border-t border-border/40">
                    <span className="text-[10px] text-muted-foreground/50 font-mono italic">
                      ID: #{row.id}
                    </span>
                    <div className="flex gap-2">
                      <Button
                        type="button"
                        size="sm"
                        variant="ghost"
                        className="h-8 text-xs text-muted-foreground hover:text-destructive hover:bg-destructive/10"
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
                        <Trash2 className="h-3.5 w-3.5 mr-1.5" />
                        Xóa
                      </Button>
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        className="h-8 text-xs"
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
                        <Save className="h-3.5 w-3.5 mr-1.5 text-primary" />
                        Cập nhật
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-4 rounded-md border-2 border-dashed border-border/60 bg-muted/5 space-y-4">
              <div className="flex items-center gap-2 mb-2">
                <Plus className="h-4 w-4 text-primary" />
                <span className="text-xs font-black uppercase tracking-widest text-primary/80">
                  Thêm cấu trúc ngữ pháp mới
                </span>
              </div>

              <div className="space-y-3">
                <Input
                  placeholder="Tiêu đề ngữ pháp..."
                  value={newStructure.title}
                  onChange={(e) =>
                    setNewStructure((s) => ({
                      ...s,
                      title: e.target.value,
                    }))
                  }
                  className="h-9 text-sm"
                />
                <Textarea
                  rows={2}
                  placeholder="Lý thuyết hoặc tóm tắt nội dung..."
                  value={newStructure.summary}
                  onChange={(e) =>
                    setNewStructure((s) => ({
                      ...s,
                      summary: e.target.value,
                    }))
                  }
                  className="text-xs"
                />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <Input
                    placeholder="Ví dụ EN..."
                    value={newStructure.exampleEn}
                    onChange={(e) =>
                      setNewStructure((s) => ({
                        ...s,
                        exampleEn: e.target.value,
                      }))
                    }
                    className="h-8 text-xs"
                  />
                  <Input
                    placeholder="Dịch VI..."
                    value={newStructure.exampleVi}
                    onChange={(e) =>
                      setNewStructure((s) => ({
                        ...s,
                        exampleVi: e.target.value,
                      }))
                    }
                    className="h-8 text-xs"
                  />
                </div>
                <Button
                  type="button"
                  size="sm"
                  className="w-full h-9 uppercase tracking-widest text-[10px] font-black"
                  onClick={() => {
                    void (async () => {
                      try {
                        if (!newStructure.title || !newStructure.summary) {
                          notifyError("Vui lòng nhập tiêu đề & tóm tắt", "");
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
                        notifySuccess("Đã thêm thành công", "");
                      } catch (e) {
                        notifyError(
                          "Không thêm được",
                          String((e as Error).message ?? e),
                        );
                      }
                    })();
                  }}
                >
                  Xác nhận thêm mới
                </Button>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
