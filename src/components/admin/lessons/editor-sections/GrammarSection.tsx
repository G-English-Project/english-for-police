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
    <div className="space-y-4">
      <div className="flex items-center gap-2 px-1">
        <div className="h-2 w-2 rounded-full bg-primary" />
        <h4 className="text-sm font-bold uppercase tracking-wider text-foreground/70">
          Cấu trúc ngữ pháp ({grammarStructures.length})
        </h4>
      </div>

      <Card className="border border-border/60 bg-card/30 shadow-none overflow-hidden">
        <CardContent className="space-y-6 p-4 max-h-[800px] overflow-y-auto custom-scrollbar">
          {mode === "create" ? (
            <div className="flex flex-col items-center gap-3 p-8 rounded-xl bg-muted/20 border border-dashed text-muted-foreground/60 text-center">
              <AlertCircle className="h-8 w-8 opacity-20" />
              <p className="text-sm font-medium leading-relaxed max-w-[280px]">
                Lưu chương mới trước, sau đó dùng chức năng &quot;Sửa&quot; để
                thiết lập cấu trúc ngữ pháp.
              </p>
            </div>
          ) : (
            <div className="space-y-8">
              <div className="space-y-8">
                {grammarStructures.map((row, idx) => (
                  <div
                    key={row.id}
                    className="group relative flex flex-col gap-5 p-6 rounded-2xl border border-border/40 bg-background/60 transition-all hover:border-primary/30 hover:shadow-sm"
                  >
                    {/* Item Number Badge */}
                    <div className="absolute -left-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground shadow-sm">
                      {idx + 1}
                    </div>

                    <div className="space-y-5">
                      <div className="space-y-1.5">
                        <Label className="text-[10px] font-bold uppercase text-muted-foreground ml-1">
                          Tiêu đề cấu trúc
                        </Label>
                        <Input
                          placeholder="VD: Thì quá khứ đơn, Động từ khuyết thiếu..."
                          value={row.title}
                          onChange={(e) => {
                            const v = e.target.value;
                            setGrammarStructures((prev) =>
                              prev.map((r) =>
                                r.id === row.id ? { ...r, title: v } : r,
                              ),
                            );
                          }}
                          className="h-10 text-sm font-bold border-border/40 focus:border-primary/40 focus:ring-primary/10"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <Label className="text-[10px] font-bold uppercase text-muted-foreground ml-1">
                          Lý thuyết & Cách dùng
                        </Label>
                        <Textarea
                          rows={3}
                          placeholder="Giải thích ngắn gọn quy tắc hoặc cách dùng..."
                          value={row.summary}
                          onChange={(e) => {
                            const v = e.target.value;
                            setGrammarStructures((prev) =>
                              prev.map((r) =>
                                r.id === row.id ? { ...r, summary: v } : r,
                              ),
                            );
                          }}
                          className="text-sm leading-relaxed bg-muted/5 min-h-[100px] resize-none border-border/40"
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div className="space-y-1.5">
                          <Label className="text-[10px] font-bold uppercase text-muted-foreground ml-1">
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
                            className="h-9 text-xs italic font-serif border-border/40"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <Label className="text-[10px] font-bold uppercase text-muted-foreground ml-1">
                            Bản dịch (Tiếng Việt)
                          </Label>
                          <Input
                            placeholder="Dịch nghĩa tương ứng..."
                            value={row.exampleVi ?? ""}
                            onChange={(e) => {
                              const v = e.target.value;
                              setGrammarStructures((prev) =>
                                prev.map((r) =>
                                  r.id === row.id ? { ...r, exampleVi: v } : r,
                                ),
                              );
                            }}
                            className="h-9 text-xs border-border/40"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-between items-center pt-4 border-t border-border/40">
                      <span className="text-[10px] text-muted-foreground/40 font-mono italic">
                        Reference ID: #{row.id}
                      </span>
                      <div className="flex gap-2">
                        <Button
                          type="button"
                          size="sm"
                          variant="ghost"
                          className="h-9 px-4 text-xs text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
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
                          <Trash2 className="h-4 w-4 mr-2 opacity-70" />
                          Gỡ bỏ
                        </Button>
                        <Button
                          type="button"
                          size="sm"
                          variant="outline"
                          className="h-9 px-4 text-xs font-bold border-primary/20 hover:border-primary/40 hover:bg-primary/5 transition-all shadow-sm"
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
                          <Save className="h-4 w-4 mr-2 text-primary" />
                          Cập nhật
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Add New Section */}
              <div className="relative p-8 rounded-2xl border-2 border-dashed border-primary/20 bg-primary/5 space-y-6">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <Plus className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <h5 className="text-sm font-black uppercase tracking-widest text-primary/80">
                      Cấu trúc mới
                    </h5>
                    <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-tight opacity-70">
                      Thêm lý thuyết ngữ pháp bổ trợ cho bài học
                    </p>
                  </div>
                </div>

                <div className="space-y-5">
                  <div className="space-y-1.5">
                    <Label className="text-[10px] font-bold uppercase text-primary/60 ml-1">
                      Tiêu đề ngữ pháp
                    </Label>
                    <Input
                      placeholder="VD: Modal Verbs, Passive Voice..."
                      value={newStructure.title}
                      onChange={(e) =>
                        setNewStructure((s) => ({
                          ...s,
                          title: e.target.value,
                        }))
                      }
                      className="h-10 text-sm border-primary/10 focus:border-primary/30"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-[10px] font-bold uppercase text-primary/60 ml-1">
                      Lý thuyết / Cách dùng
                    </Label>
                    <Textarea
                      rows={2}
                      placeholder="Giải thích tóm tắt cấu trúc này..."
                      value={newStructure.summary}
                      onChange={(e) =>
                        setNewStructure((s) => ({
                          ...s,
                          summary: e.target.value,
                        }))
                      }
                      className="text-sm border-primary/10 focus:border-primary/30 resize-none min-h-[80px]"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label className="text-[10px] font-bold uppercase text-primary/60 ml-1">
                        Ví dụ EN
                      </Label>
                      <Input
                        placeholder="VD: I can speak English."
                        value={newStructure.exampleEn}
                        onChange={(e) =>
                          setNewStructure((s) => ({
                            ...s,
                            exampleEn: e.target.value,
                          }))
                        }
                        className="h-9 text-xs border-primary/10 focus:border-primary/30"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-[10px] font-bold uppercase text-primary/60 ml-1">
                        Dịch VI
                      </Label>
                      <Input
                        placeholder="VD: Tôi có thể nói tiếng Anh."
                        value={newStructure.exampleVi}
                        onChange={(e) =>
                          setNewStructure((s) => ({
                            ...s,
                            exampleVi: e.target.value,
                          }))
                        }
                        className="h-9 text-xs border-primary/10 focus:border-primary/30"
                      />
                    </div>
                  </div>

                  <Button
                    type="button"
                    size="sm"
                    className="w-full h-11 uppercase tracking-widest text-xs font-black shadow-md primary-gradient hover:opacity-90 transition-opacity mt-2"
                    onClick={() => {
                      void (async () => {
                        try {
                          if (!newStructure.title || !newStructure.summary) {
                            notifyError("Vui lòng nhập tiêu đề & tóm tắt", "");
                            return;
                          }
                          const res =
                            await lessonService.createGrammarStructure(
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
                    Xác nhận thêm ngữ pháp
                  </Button>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
