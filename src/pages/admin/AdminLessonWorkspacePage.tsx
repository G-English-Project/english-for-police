import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import {
  BookMarked,
  Layers,
  LayoutDashboard,
  Loader2,
  HelpCircle,
  BookOpenCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { AdminPageLayout } from "@/components/admin/AdminPageLayout";
import type {
  GrammarStructure,
  LessonTestLane,
  Question,
  Unit,
} from "@/types";
import { lessonService } from "@/services/lesson.service";
import { useSonner } from "@/hooks/use-sonner";
import { cn } from "@/lib/utils";
import { resolvedLane } from "@/components/practice/utils/testUtils";
import { LessonEditorForm } from "@/components/admin/lessons/LessonEditorForm";
import { emptyUnit, type LessonEditorScope } from "./LessonEditorUtils";
import { WorkspaceHeader } from "./lessons-workspace-components/WorkspaceHeader";
import { WorkspaceOverview } from "./lessons-workspace-components/WorkspaceOverview";
import { WorkspacePracticeLanes } from "./lessons-workspace-components/WorkspacePracticeLanes";

type ViewKey = "overview" | LessonEditorScope;

const VIEW_LIST: {
  key: Exclude<ViewKey, "overview" | "full">;
  label: string;
  Icon: typeof BookMarked;
}[] = [
  { key: "meta", label: "Thông tin chương", Icon: HelpCircle },
  { key: "vocabulary", label: "Từ vựng", Icon: BookMarked },
  { key: "phrases", label: "Mẫu câu", Icon: Layers },
  { key: "practice", label: "Bài kiểm tra", Icon: BookOpenCheck },
];

export default function AdminLessonWorkspacePage({
  onLessonsUpdated,
}: {
  onLessonsUpdated: () => Promise<void>;
}) {
  const { unitId } = useParams<{ unitId: string }>();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { notifyError, notifySuccess } = useSonner();
  const id = Number(unitId);

  const viewParam = searchParams.get("view") ?? "overview";
  const activeView: ViewKey =
    viewParam === "overview" ||
    viewParam === "meta" ||
    viewParam === "vocabulary" ||
    viewParam === "phrases" ||
    viewParam === "practice"
      ? (viewParam as ViewKey)
      : "overview";

  const setView = (v: ViewKey) => {
    if (v === "overview") {
      setSearchParams({}, { replace: true });
    } else {
      setSearchParams({ view: v }, { replace: true });
    }
  };

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [draft, setDraft] = useState<Unit>(() => emptyUnit(1));

  const [grammarStructures, setGrammarStructures] = useState<
    GrammarStructure[]
  >([]);

  useEffect(() => {
    const fetchData = async () => {
      if (!Number.isFinite(id) || id < 1) {
        notifyError("Chương không hợp lệ", "");
        navigate("/admin/lessons", { replace: true });
        return;
      }
      try {
        const [full, structures] = await Promise.all([
          lessonService.getLessonForAdmin(id),
          lessonService.listGrammarStructures(id),
        ]);
        setDraft(full);
        setGrammarStructures(structures);
      } catch (e) {
        console.error(e);
        notifyError("Không tải được chương", String((e as Error).message ?? e));
        navigate("/admin/lessons", { replace: true });
      } finally {
        setLoading(false);
      }
    };
    void fetchData();
  }, [id, navigate, notifyError]);

  const load = useCallback(async () => {
    if (!Number.isFinite(id) || id < 1) {
      notifyError("Chương không hợp lệ", "");
      navigate("/admin/lessons", { replace: true });
      return;
    }
    try {
      const [full, structures] = await Promise.all([
        lessonService.getLessonForAdmin(id),
        lessonService.listGrammarStructures(id),
      ]);
      setDraft(full);
      setGrammarStructures(structures);
    } catch (e) {
      console.error(e);
      notifyError("Không tải được chương", String((e as Error).message ?? e));
      navigate("/admin/lessons", { replace: true });
    } finally {
      setLoading(false);
    }
  }, [id, navigate, notifyError]);

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
      setLoading(true);
      await load();
      await onLessonsUpdated();
    } catch (e) {
      console.error(e);
      notifyError("Lưu thất bại", String((e as Error).message ?? e));
    } finally {
      setSaving(false);
    }
  };

  const editorScope: LessonEditorScope | null =
    activeView === "overview" ? null : (activeView as LessonEditorScope);

  if (loading) {
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
      description="Chọn mục bên dưới để soạn từng phần; chỉ có một nút Lưu trên header."
      actions={null}
    >
      <div className="mx-auto w-full max-w-350 space-y-8">
        <WorkspaceHeader draft={draft} saving={saving} persist={persist} />

        <div className="flex flex-wrap gap-2 rounded-xl border border-border/80 bg-card p-2">
          <button
            type="button"
            onClick={() => setView("overview")}
            aria-current={activeView === "overview" ? "page" : undefined}
            className={cn(
              "inline-flex min-h-11 items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
              activeView === "overview"
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-muted-foreground hover:bg-muted hover:text-foreground",
            )}
          >
            <LayoutDashboard className="h-4 w-4" />
            Tổng quan
          </button>
          {VIEW_LIST.map(({ key, label, Icon }) => (
            <button
              key={key}
              type="button"
              onClick={() => setView(key)}
              aria-current={activeView === key ? "page" : undefined}
              className={cn(
                "inline-flex min-h-11 items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                activeView === key
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground",
              )}
            >
              <Icon className="h-4 w-4" />
              {label}
            </button>
          ))}
        </div>

        {activeView === "overview" && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <WorkspaceOverview draft={draft} setView={setView} />
            <WorkspacePracticeLanes practiceByLane={practiceByLane} />

            <div className="flex flex-wrap gap-2 justify-end">
              <Button
                type="button"
                variant="outline"
                onClick={() => setView("meta")}
              >
                Thông tin chương
              </Button>
              <Button type="button" onClick={() => setView("vocabulary")}>
                Bắt đầu soạn từ vựng
              </Button>
            </div>
          </div>
        )}

        {editorScope != null && editorScope !== "full" && (
          <div className="animate-in fade-in duration-200 overflow-hidden rounded-xl border border-border bg-card police-shadow">
            <div className="max-h-[min(85vh,1200px)] overflow-y-auto overscroll-contain p-5 md:p-7">
              <LessonEditorForm
                key={`${draft.id}-${editorScope}`}
                mode="edit"
                draft={draft}
                setDraft={setDraft}

                grammarStructures={grammarStructures}
                setGrammarStructures={setGrammarStructures}
                idPrefix={`workspace-${draft.id}`}
                saving={saving}
                onCancel={() => navigate("/admin/lessons")}
                onSave={() => void persist()}
                scope={editorScope}
              />
            </div>
          </div>
        )}
      </div>
    </AdminPageLayout>
  );
}
