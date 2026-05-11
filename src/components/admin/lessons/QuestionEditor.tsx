import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { Question, LessonTestLane } from "@/types";
import { QUESTION_TYPES } from "@/pages/admin/LessonEditorUtils";

const selectClass =
  "flex h-11 w-full rounded-md border border-input bg-background px-3 py-2 text-sm md:text-base ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2";

const TEST_LANE_OPTIONS: { label: string; value: LessonTestLane | "" }[] = [
  { label: "(Tự suy dạng)", value: "" },
  { label: "Trắc nghiệm vựng (VOCAB_MCQ)", value: "VOCAB_MCQ" },
  { label: "Ghép cặp (MATCHING)", value: "MATCHING" },
  { label: "Tình huống (PHRASE_SCENARIO)", value: "PHRASE_SCENARIO" },
  { label: "Sắp xếp/Điền từ (FILL_ARRANGE)", value: "FILL_ARRANGE" },
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
    <div className="border border-border rounded-lg p-3 space-y-2 bg-muted/30">
      <div className="flex flex-wrap gap-2 items-end">
        <div className="space-y-1">
          <Label className="text-xs text-muted-foreground">Loại</Label>
          <select
            className={cn(selectClass, "min-w-35")}
            value={q.type}
            onChange={(e) => {
              onUpdate({ ...q, type: e.target.value as Question["type"] });
            }}
          >
            {QUESTION_TYPES.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>
        <div className="space-y-1">
          <Label className="text-xs text-muted-foreground">
            Làn kiểm tra (UI luyện tập)
          </Label>
          <select
            className={cn(selectClass, "min-w-55")}
            value={q.testLane ?? ""}
            onChange={(e) => {
              const v = e.target.value;
              onUpdate({
                ...q,
                testLane: v === "" ? undefined : (v as LessonTestLane),
              });
            }}
          >
            {TEST_LANE_OPTIONS.map((opt) => (
              <option key={opt.value || "unset"} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="ml-auto"
          onClick={onDelete}
        >
          Xóa câu
        </Button>
      </div>
      <div className="space-y-1">
        <Label className="text-xs text-muted-foreground">Đề bài</Label>
        <Textarea
          rows={2}
          value={q.prompt}
          onChange={(e) => onUpdate({ ...q, prompt: e.target.value })}
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
        <div className="space-y-1">
          <Label className="text-xs text-muted-foreground">
            Ngữ cảnh (circumstance)
          </Label>
          <Textarea
            rows={2}
            value={q.circumstance ?? ""}
            onChange={(e) => onUpdate({ ...q, circumstance: e.target.value })}
          />
        </div>
        <div className="space-y-1">
          <Label className="text-xs text-muted-foreground">
            Gợi ý tiếng Việt (vnPrompt)
          </Label>
          <Textarea
            rows={2}
            value={q.vnPrompt ?? ""}
            onChange={(e) => onUpdate({ ...q, vnPrompt: e.target.value })}
          />
        </div>
      </div>
      <div className="space-y-1">
        <Label className="text-xs text-muted-foreground">
          Mô tả tình huống (Scenario / Speaking)
        </Label>
        <Textarea
          rows={2}
          value={q.scenarioDescription ?? ""}
          onChange={(e) =>
            onUpdate({ ...q, scenarioDescription: e.target.value })
          }
        />
      </div>
      {(q.type === "MCQ" || q.type === "Scenario") && (
        <div className="space-y-1">
          <Label className="text-xs text-muted-foreground">
            Lựa chọn (mỗi dòng một)
          </Label>
          <Textarea
            rows={3}
            value={(q.options ?? []).join("\n")}
            onChange={(e) => {
              const opts = e.target.value
                .split("\n")
                .map((s) => s.trim())
                .filter(Boolean);
              onUpdate({ ...q, options: opts });
            }}
          />
        </div>
      )}
      {q.type === "Matching" && (
        <div className="space-y-1">
          <Label className="text-xs text-muted-foreground">
            Cặp (mỗi dòng: trái | phải)
          </Label>
          <Textarea
            rows={3}
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
          />
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
        <div className="space-y-1">
          <Label className="text-xs text-muted-foreground">
            Đáp án (chuỗi hoặc JSON)
          </Label>
          <Input
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
          />
        </div>
        <div className="space-y-1">
          <Label className="text-xs text-muted-foreground">
            Đáp án mẫu (bestAnswer)
          </Label>
          <Input
            value={q.bestAnswer ?? ""}
            onChange={(e) => onUpdate({ ...q, bestAnswer: e.target.value })}
          />
        </div>
      </div>
      <div className="space-y-1">
        <Label className="text-xs text-muted-foreground">
          Đáp án chấp nhận được (mỗi dòng một, FillInBlank / Dictation)
        </Label>
        <Textarea
          rows={3}
          value={(q.acceptableAnswers ?? []).join("\n")}
          onChange={(e) => {
            const list = e.target.value
              .split("\n")
              .map((s) => s.trim())
              .filter(Boolean);
            onUpdate({ ...q, acceptableAnswers: list });
          }}
        />
      </div>
      <div className="space-y-1">
        <Label className="text-xs text-muted-foreground">Giải thích</Label>
        <Textarea
          rows={2}
          value={q.explanation ?? ""}
          onChange={(e) => onUpdate({ ...q, explanation: e.target.value })}
        />
      </div>
    </div>
  );
}
