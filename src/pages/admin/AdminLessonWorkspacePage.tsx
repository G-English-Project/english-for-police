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
import { AdminPageLayout } from "@/components/admin/AdminPageLayout";
import type { GrammarStructure, LessonTestLane, Question, Unit } from "@/types";
import { lessonService } from "@/services/lesson.service";
import { useSonner } from "@/hooks/use-sonner";
import { resolvedLane } from "@/components/practice/utils/testUtils";
import { LessonEditorForm } from "@/components/admin/lessons/LessonEditorForm";
import { emptyUnit, type LessonEditorScope } from "./LessonEditorUtils";
import { WorkspaceHeader } from "./lessons-workspace-components/WorkspaceHeader";
import { WorkspaceOverview } from "./lessons-workspace-components/WorkspaceOverview";
import { WorkspacePracticeLanes } from "./lessons-workspace-components/WorkspacePracticeLanes";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const VIEW_LIST: {
  key: Exclude<LessonEditorScope, "full">;
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

  const activeView = searchParams.get("view") ?? "overview";

  const setView = (v: string) => {
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
      title="Soạn thảo chương"
      description={`Đang chỉnh sửa: ${draft.title}. Các thay đổi sẽ được lưu khi nhấn nút Lưu trên Header.`}
      actions={
        <WorkspaceHeader draft={draft} saving={saving} persist={persist} />
      }
    >
      <div className="w-full space-y-6">
        <Tabs
          value={activeView}
          onValueChange={setView}
          className="w-full space-y-6"
        >
          <TabsList className="bg-muted/50 border border-border/50 p-1">
            <TabsTrigger value="overview" className="gap-2">
              <LayoutDashboard className="h-3.5 w-3.5" />
              Tổng quan
            </TabsTrigger>
            {VIEW_LIST.map(({ key, label, Icon }) => (
              <TabsTrigger key={key} value={key} className="gap-2">
                <Icon className="h-3.5 w-3.5" />
                {label}
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent
            value="overview"
            className="animate-in fade-in duration-300"
          >
            <div className="space-y-6">
              <WorkspaceOverview
                draft={draft}
                setView={(v) => setView(v as string)}
              />
              <WorkspacePracticeLanes practiceByLane={practiceByLane} />
            </div>
          </TabsContent>

          {VIEW_LIST.map(({ key }) => (
            <TabsContent
              key={key}
              value={key}
              className="animate-in fade-in duration-300"
            >
              <LessonEditorForm
                key={`${draft.id}-${key}`}
                mode="edit"
                draft={draft}
                setDraft={setDraft}
                grammarStructures={grammarStructures}
                setGrammarStructures={setGrammarStructures}
                idPrefix={`workspace-${draft.id}`}
                saving={saving}
                onCancel={() => navigate("/admin/lessons")}
                onSave={() => void persist()}
                scope={key}
              />
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </AdminPageLayout>
  );
}
