import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import type { Question, LessonTestLane } from "@/types";
import { QUESTION_TYPES } from "@/pages/admin/LessonEditorUtils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Trash2,
  HelpCircle,
  MessageSquare,
  ListTodo,
  Settings2,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const TEST_LANE_OPTIONS: { label: string; value: LessonTestLane | "UNSET" }[] =
  [
    { label: "Tự động phân loại", value: "UNSET" },
    { label: "Trắc nghiệm từ vựng", value: "VOCAB_MCQ" },
    { label: "Ghép cặp từ/câu", value: "MATCHING" },
    { label: "Tình huống giao tiếp", value: "PHRASE_SCENARIO" },
    { label: "Sắp xếp & Điền từ", value: "FILL_ARRANGE" },
  ];

export function QuestionEditor({
  q,
  onUpdate,
  onDelete,
}: {
  q: Question;
  onUpdate: (updated: Question) => void;
  onDelete: () => void;
}) {
  return (
    <Card className="border border-border/60 shadow-none bg-background/50 overflow-hidden group/q">
      <div className="bg-muted/30 px-3 py-2 border-b border-border/40 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="space-y-0.5">
            <Label className="text-[9px] font-black uppercase text-muted-foreground/60 block px-1">
              Dạng câu hỏi
            </Label>
            <Select
              value={q.type}
              onValueChange={(val) => {
                onUpdate({ ...q, type: val as Question["type"] });
              }}
            >
              <SelectTrigger className="h-7 min-w-32 text-[10px] font-bold uppercase bg-background">
                <SelectValue placeholder="Loại" />
              </SelectTrigger>
              <SelectContent position="popper">
                {QUESTION_TYPES.map((t) => (
                  <SelectItem
                    key={t}
                    value={t}
                    className="text-[10px] uppercase font-bold"
                  >
                    {t}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-0.5">
            <Label className="text-[9px] font-black uppercase text-muted-foreground/60 block px-1">
              Nhóm bài tập
            </Label>
            <Select
              value={q.testLane ?? "UNSET"}
              onValueChange={(val) => {
                onUpdate({
                  ...q,
                  testLane:
                    val === "UNSET" ? undefined : (val as LessonTestLane),
                });
              }}
            >
              <SelectTrigger className="h-7 min-w-44 text-[10px] font-bold uppercase bg-background">
                <SelectValue placeholder="Làn" />
              </SelectTrigger>
              <SelectContent position="popper">
                {TEST_LANE_OPTIONS.map((opt) => (
                  <SelectItem
                    key={opt.value}
                    value={opt.value}
                    className="text-[10px] uppercase font-bold"
                  >
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="h-7 w-7 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
          onClick={onDelete}
        >
          <Trash2 className="h-3.5 w-3.5" />
        </Button>
      </div>

      <CardContent className="p-4 space-y-4">
        <div className="space-y-1.5">
          <div className="flex items-center gap-1.5 ml-1">
            <HelpCircle className="h-3 w-3 text-primary/60" />
            <Label className="text-[10px] font-bold uppercase text-muted-foreground/60">
              Đề bài / Nội dung hiển thị
            </Label>
          </div>
          <Textarea
            rows={2}
            placeholder="Nhập câu hỏi hoặc nội dung chính..."
            value={q.prompt}
            onChange={(e) => onUpdate({ ...q, prompt: e.target.value })}
            className="text-xs bg-background/50 focus:bg-background"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label className="text-[10px] font-bold uppercase text-muted-foreground/60 ml-1">
              Ngữ cảnh (Context)
            </Label>
            <Textarea
              rows={2}
              placeholder="Giải thích bối cảnh câu hỏi..."
              value={q.circumstance ?? ""}
              onChange={(e) => onUpdate({ ...q, circumstance: e.target.value })}
              className="text-xs bg-background/50 focus:bg-background"
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-[10px] font-bold uppercase text-muted-foreground/60 ml-1">
              Gợi ý tiếng Việt
            </Label>
            <Textarea
              rows={2}
              placeholder="Dịch nghĩa hoặc gợi ý cho học viên..."
              value={q.vnPrompt ?? ""}
              onChange={(e) => onUpdate({ ...q, vnPrompt: e.target.value })}
              className="text-xs bg-background/50 focus:bg-background"
            />
          </div>
        </div>

        {q.type === "Scenario" && (
          <div className="space-y-1.5">
            <div className="flex items-center gap-1.5 ml-1">
              <MessageSquare className="h-3 w-3 text-primary/60" />
              <Label className="text-[10px] font-bold uppercase text-muted-foreground/60">
                Mô tả tình huống hội thoại
              </Label>
            </div>
            <Textarea
              rows={2}
              placeholder="Dùng cho bài luyện Speaking hoặc Scenario..."
              value={q.scenarioDescription ?? ""}
              onChange={(e) =>
                onUpdate({ ...q, scenarioDescription: e.target.value })
              }
              className="text-xs bg-background/50 focus:bg-background italic"
            />
          </div>
        )}

        {(q.type === "MCQ" || q.type === "Scenario") && (
          <div className="space-y-1.5">
            <div className="flex items-center gap-1.5 ml-1">
              <ListTodo className="h-3 w-3 text-primary/60" />
              <Label className="text-[10px] font-bold uppercase text-muted-foreground/60">
                Các lựa chọn đáp án (Mỗi dòng một ý)
              </Label>
            </div>
            <Textarea
              rows={4}
              placeholder="Option A\nOption B\nOption C..."
              value={(q.options ?? []).join("\n")}
              onChange={(e) => {
                const opts = e.target.value
                  .split("\n")
                  .map((s) => s.trim())
                  .filter(Boolean);
                onUpdate({ ...q, options: opts });
              }}
              className="text-xs bg-background/50 focus:bg-background font-medium"
            />
          </div>
        )}

        {q.type === "Matching" && (
          <div className="space-y-1.5">
            <div className="flex items-center gap-1.5 ml-1">
              <ListTodo className="h-3 w-3 text-primary/60" />
              <Label className="text-[10px] font-bold uppercase text-muted-foreground/60">
                Các cặp ghép (Vế trái | Vế phải)
              </Label>
            </div>
            <Textarea
              rows={4}
              placeholder="Apple | Quả táo\nOrange | Quả cam..."
              value={(q.pairs ?? [])
                .map((pair) => `${pair.left} | ${pair.right}`)
                .join("\n")}
              onChange={(e) => {
                const lines = e.target.value.split("\n");
                const pairs = lines
                  .map((line) => {
                    const [l, r] = line.split("|").map((s) => s.trim());
                    if (!l || !r) return null;
                    return { left: l, right: r };
                  })
                  .filter(Boolean) as { left: string; right: string }[];
                onUpdate({ ...q, pairs });
              }}
              className="text-xs bg-background/50 focus:bg-background font-medium"
            />
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-border/40">
          <div className="space-y-1.5">
            <Label className="text-[10px] font-bold uppercase text-primary/70 ml-1">
              Đáp án đúng
            </Label>
            <Input
              placeholder="Chính xác 100%"
              value={
                typeof q.answer === "string"
                  ? q.answer
                  : JSON.stringify(q.answer ?? "")
              }
              onChange={(e) => {
                const raw = e.target.value;
                let answer: string | string[] = raw;
                if (raw.trim().startsWith("[")) {
                  try {
                    answer = JSON.parse(raw) as string[];
                  } catch {
                    answer = raw;
                  }
                }
                onUpdate({ ...q, answer });
              }}
              className="h-9 text-xs font-bold border-primary/20"
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-[10px] font-bold uppercase text-muted-foreground/60 ml-1">
              Đáp án mẫu (Gợi ý tốt nhất)
            </Label>
            <Input
              placeholder="Best sample answer..."
              value={q.bestAnswer ?? ""}
              onChange={(e) => onUpdate({ ...q, bestAnswer: e.target.value })}
              className="h-9 text-xs"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <div className="flex items-center gap-1.5 ml-1">
            <Settings2 className="h-3 w-3 text-muted-foreground/60" />
            <Label className="text-[10px] font-bold uppercase text-muted-foreground/60">
              Giải thích chi tiết
            </Label>
          </div>
          <Textarea
            rows={2}
            placeholder="Lý do vì sao đáp án này đúng..."
            value={q.explanation ?? ""}
            onChange={(e) => onUpdate({ ...q, explanation: e.target.value })}
            className="text-xs bg-background/50 focus:bg-background italic"
          />
        </div>
      </CardContent>
    </Card>
  );
}
