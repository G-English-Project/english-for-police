import { useCallback, useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  BookMarked,
  ChevronRight,
  ClipboardList,
  ExternalLink,
  Layers,
  LayoutDashboard,
  Loader2,
  PencilLine,
  Save,
} from "lucide-react";
import {
  LessonEditorForm,
  emptyUnit,
} from "@/pages/admin/AdminLessonsPage";
import { AdminPageLayout } from "@/components/admin/AdminPageLayout";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type {
  GrammarStructure,
  LessonTestLane,
  PhraseTemplate,
  Question,
  Unit,
} from "@/types";
import { lessonService } from "@/services/lesson.service";
import { useSonner } from "@/hooks/use-sonner";
import { cn } from "@/lib/utils";
import {
  SECTION_META,
  resolvedLane,
} from "@/components/practice/utils/testUtils";

const LANES: LessonTestLane[] = [
  "VOCAB_MCQ",
  "MATCHING",
  "PHRASE_SCENARIO",
  "FILL_ARRANGE",
];

type WorkspaceTab = "overview" | "editor";

export default function AdminLessonWorkspacePage({
  onLessonsUpdated,
}: {
  onLessonsUpdated: () => Promise<void>;
}) {
  const { unitId } = useParams<{ unitId: string }>();
  const navigate = useNavigate();
  const { notifyError, notifySuccess } = useSonner();
  const id = Number(unitId);

  const [tab, setTab] = useState<WorkspaceTab>("overview");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [draft, setDraft] = useState<Unit>(() => emptyUnit(1));
  const [phraseTemplates, setPhraseTemplates] = useState<PhraseTemplate[]>([]);
  const [grammarStructures, setGrammarStructures] = useState<GrammarStructure[]>(
    [],
  );

  const load = useCallback(async () => {
    if (!Number.isFinite(id) || id < 1) {
      notifyError("Chương không hợp lệ", "");
      navigate("/admin/lessons", { replace: true });
      return;
    }
    setLoading(true);
    try {
      const [full, templates, structures] = await Promise.all([
        lessonService.getLessonForAdmin(id),
        lessonService.listPhraseTemplates(id),
        lessonService.listGrammarStructures(id),
      ]);
      setDraft(full);
      setPhraseTemplates(templates);
      setGrammarStructures(structures);
    } catch (e) {
      console.error(e);
      notifyError("Không tải được chương", String((e as Error).message ?? e));
      navigate("/admin/lessons", { replace: true });
    } finally {
      setLoading(false);
    }
  }, [id, navigate, notifyError]);

  useEffect(() => {
    void load();
  }, [load]);

  const practiceByLane = useMemo(() => {
    const map: Record<LessonTestLane, Question[]> = {
      VOCAB_MCQ: [],
      MATCHING: [],
      PHRASE_SCENARIO: [],
      FILL_ARRANGE: [],
    };
    for (const q of draft.practice) {
      map[resolvedLane(q as Question)].push(q as Question);
    }
    return map;
  }, [draft.practice]);

  const persist = async () => {
    setSaving(true);
    try {
      await lessonService.updateLesson(draft.id, draft);
      notifySuccess("Đã lưu chương", `Chương ${draft.id}`);
      await load();
      await onLessonsUpdated();
    } catch (e) {
      console.error(e);
      notifyError("Lưu thất bại", String((e as Error).message ?? e));
    } finally {
      setSaving(false);
    }
  };

  if (loading && !draft.title) {
    return (
      <AdminPageLayout title="Đang tải…" description="">
        <div className="flex justify-center py-24">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
        </div>
      </AdminPageLayout>
    );
  }

  return (
    <AdminPageLayout
      title="Không gian soạn chương"
      description="Tổng quan từ vựng, mẫu câu, câu hỏi theo từng dạng thi; soạn thảo đầy đủ ở tab bên dưới."
      actions={null}
    >
      <div className="space-y-6 max-w-[1400px] mx-auto w-full">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="space-y-2 min-w-0">
            <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
              <Link
                to="/admin/lessons"
                className="inline-flex items-center gap-1 hover:text-primary transition-colors"
              >
                <ArrowLeft className="h-4 w-4" />
                Danh sách chương
              </Link>
              <ChevronRight className="h-4 w-4 opacity-50" />
              <span className="font-mono text-primary font-semibold">
                Chương {draft.id}
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground leading-tight">
              {draft.title || `Chương ${draft.id}`}
            </h1>
            <p className="text-muted-foreground text-sm md:text-base max-w-3xl leading-relaxed">
              {draft.description || "Chưa có mô tả — chỉnh trong tab Soạn thảo."}
            </p>
          </div>
          <div className="flex flex-wrap gap-2 shrink-0">
            <Button variant="outline" size="sm" asChild className="gap-2">
              <a
                href={`/lesson/${draft.id}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <ExternalLink className="h-4 w-4" />
                Xem như học viên
              </a>
            </Button>
            <Button
              size="sm"
              className="gap-2"
              disabled={saving}
              onClick={() => void persist()}
            >
              {saving ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Save className="h-4 w-4" />
              )}
              Lưu chương
            </Button>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 border-b border-border pb-1">
          {(
            [
              ["overview", "Tổng quan", LayoutDashboard],
              ["editor", "Soạn thảo chi tiết", PencilLine],
            ] as const
          ).map(([key, label, Icon]) => (
            <button
              key={key}
              type="button"
              onClick={() => setTab(key)}
              className={cn(
                "inline-flex items-center gap-2 rounded-md px-4 py-2 text-sm font-semibold transition-colors",
                tab === key
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground",
              )}
            >
              <Icon className="h-4 w-4" />
              {label}
            </button>
          ))}
        </div>

        {tab === "overview" && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
              <Card className="police-shadow border-border/80">
                <CardHeader className="pb-2">
                  <CardDescription className="flex items-center gap-2 text-xs font-medium uppercase tracking-wide">
                    <BookMarked className="h-4 w-4 text-primary" />
                    Từ vựng
                  </CardDescription>
                  <CardTitle className="text-3xl tabular-nums">
                    {draft.vocabulary.length}
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-xs text-muted-foreground leading-snug">
                  Các mục trong bài học; hệ thống có thể sinh thêm trắc nghiệm từ
                  ngân hàng này.
                </CardContent>
              </Card>
              <Card className="police-shadow border-border/80">
                <CardHeader className="pb-2">
                  <CardDescription className="flex items-center gap-2 text-xs font-medium uppercase tracking-wide">
                    <Layers className="h-4 w-4 text-primary" />
                    Mẫu câu
                  </CardDescription>
                  <CardTitle className="text-3xl tabular-nums">
                    {draft.phrases.length}
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-xs text-muted-foreground leading-snug">
                  Câu mẫu theo ngữ cảnh; dùng cho luyện mẫu câu / tình huống.
                </CardContent>
              </Card>
              <Card className="police-shadow border-border/80">
                <CardHeader className="pb-2">
                  <CardDescription className="flex items-center gap-2 text-xs font-medium uppercase tracking-wide">
                    <ClipboardList className="h-4 w-4 text-primary" />
                    Cấu trúc / grammar
                  </CardDescription>
                  <CardTitle className="text-3xl tabular-nums">
                    {grammarStructures.length}
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-xs text-muted-foreground leading-snug">
                  Tiểu mục ngữ pháp (API riêng), không gộp vào mẫu câu chính.
                </CardContent>
              </Card>
              <Card className="police-shadow border-border/80">
                <CardHeader className="pb-2">
                  <CardDescription className="flex items-center gap-2 text-xs font-medium uppercase tracking-wide">
                    <PencilLine className="h-4 w-4 text-primary" />
                    Câu luyện (DB)
                  </CardDescription>
                  <CardTitle className="text-3xl tabular-nums">
                    {draft.practice.length}
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-xs text-muted-foreground leading-snug">
                  Câu lưu trong{" "}
                  <span className="font-mono text-foreground/90">
                    practice_questions
                  </span>
                  ; bổ sung cho MCQ/ghép tự sinh.
                </CardContent>
              </Card>
            </div>

            <div>
              <h2 className="text-lg font-bold mb-3 flex items-center gap-2">
                <ClipboardList className="h-5 w-5 text-primary" />
                Bài kiểm tra theo từng dạng (UI &quot;Luyện tập&quot;)
              </h2>
              <p className="text-sm text-muted-foreground mb-4 max-w-3xl">
                Mỗi ô là nhóm câu trong chương sau khi gán{" "}
                <strong className="text-foreground">Lành kiểm tra</strong> (hoặc
                hệ thống suy ra từ loại câu). Thêm / sửa trực tiếp ở tab{" "}
                <button
                  type="button"
                  className="text-primary font-semibold underline-offset-2 hover:underline"
                  onClick={() => setTab("editor")}
                >
                  Soạn thảo chi tiết
                </button>
                → phần &quot;Bài kiểm tra &amp; câu hỏi luyện tập&quot;.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {LANES.map((lane) => {
                  const meta = SECTION_META[lane];
                  const items = practiceByLane[lane];
                  return (
                    <Card
                      key={lane}
                      className="border-border/90 overflow-hidden police-shadow"
                    >
                      <CardHeader className="bg-muted/40 pb-3">
                        <CardTitle className="text-base flex items-center justify-between gap-2">
                          <span>{meta.title}</span>
                          <span className="text-sm font-mono font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-md">
                            {items.length}
                          </span>
                        </CardTitle>
                        <CardDescription className="text-xs leading-snug">
                          {meta.description}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="pt-4 space-y-2 max-h-[280px] overflow-y-auto">
                        {items.length === 0 ? (
                          <p className="text-sm text-muted-foreground italic">
                            Chưa có câu thủ công cho lane này.
                          </p>
                        ) : (
                          <ul className="space-y-2 text-sm">
                            {items.map((q) => (
                              <li
                                key={q.id}
                                className="rounded-md border border-border/60 bg-background px-3 py-2"
                              >
                                <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">
                                  {q.type}
                                  {q.testLane ? ` · ${q.testLane}` : ""}
                                </span>
                                <p className="mt-1 line-clamp-3 text-foreground/90">
                                  {q.prompt || "(Không có đề)"}
                                </p>
                              </li>
                            ))}
                          </ul>
                        )}
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>

            <div className="flex justify-end">
              <Button
                type="button"
                size="lg"
                className="gap-2"
                onClick={() => setTab("editor")}
              >
                Mở soạn thảo đầy đủ
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}

        {tab === "editor" && (
          <div className="rounded-xl border border-border bg-card police-shadow overflow-hidden animate-in fade-in duration-200">
            <div className="max-h-[min(85vh,1200px)] overflow-y-auto overscroll-contain p-4 md:p-6">
              <LessonEditorForm
                mode="edit"
                draft={draft}
                setDraft={setDraft}
                phraseTemplates={phraseTemplates}
                setPhraseTemplates={setPhraseTemplates}
                grammarStructures={grammarStructures}
                setGrammarStructures={setGrammarStructures}
                idPrefix={`workspace-${draft.id}`}
                saving={saving}
                onCancel={() => navigate("/admin/lessons")}
                onSave={() => void persist()}
              />
            </div>
          </div>
        )}
      </div>
    </AdminPageLayout>
  );
}
