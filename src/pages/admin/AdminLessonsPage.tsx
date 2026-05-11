import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronUp, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { GrammarStructure, Unit } from "@/types";
import { lessonService } from "@/services/lesson.service";
import { useSonner } from "@/hooks/use-sonner";
import { AdminPageLayout } from "@/components/admin/AdminPageLayout";
import { emptyUnit } from "./LessonEditorUtils";
import { UnitTable } from "./lessons-page-components/UnitTable";

interface AdminLessonsPageProps {
  onLessonsUpdated: () => Promise<void>;
}

export default function AdminLessonsPage({
  onLessonsUpdated,
}: AdminLessonsPageProps) {
  const navigate = useNavigate();
  const { notifyError, notifySuccess } = useSonner();
  const [units, setUnits] = useState<Unit[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [expanded, setExpanded] = useState<null | "create">(null);
  const [draft, setDraft] = useState<Unit>(emptyUnit(1));

  const [grammarStructures, setGrammarStructures] = useState<
    GrammarStructure[]
  >([]);

  const suggestedNextId = useMemo(() => {
    if (!units.length) return 1;
    return Math.max(...units.map((u) => u.id)) + 1;
  }, [units]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const list = await lessonService.getLessons();
        setUnits(list);
      } catch (e) {
        console.error(e);
        notifyError(
          "Không tải được danh sách chương",
          String((e as Error).message ?? e),
        );
      } finally {
        setLoading(false);
      }
    };
    void fetchData();
  }, [notifyError]);

  const loadUnits = useCallback(async () => {
    try {
      const list = await lessonService.getLessons();
      setUnits(list);
    } catch (e) {
      console.error(e);
      notifyError(
        "Không tải được danh sách chương",
        String((e as Error).message ?? e),
      );
    } finally {
      setLoading(false);
    }
  }, [notifyError]);

  const closePanel = () => {
    setExpanded(null);

    setGrammarStructures([]);
  };

  const toggleCreatePanel = () => {
    if (expanded === "create") {
      closePanel();
      return;
    }
    setExpanded("create");

    setGrammarStructures([]);
    setDraft(emptyUnit(suggestedNextId));
  };

  const persist = async () => {
    setSaving(true);
    try {
      if (expanded === "create") {
        await lessonService.createLesson(draft);
        notifySuccess("Đã tạo chương", `Chương ${draft.id}`);
        const newId = draft.id;
        closePanel();
        await onLessonsUpdated();
        setLoading(true);
        await loadUnits();
        navigate(`/admin/lessons/${newId}/workspace`);
        return;
      }
      closePanel();
      setLoading(true);
      await loadUnits();
      await onLessonsUpdated();
    } catch (e) {
      console.error(e);
      notifyError("Lưu thất bại", String((e as Error).message ?? e));
    } finally {
      setSaving(false);
    }
  };

  const removeUnit = async (unitNumber: number) => {
    if (!window.confirm(`Xóa chương ${unitNumber}? Thao tác không hoàn tác.`)) {
      return;
    }
    try {
      await lessonService.deleteLesson(unitNumber);
      notifySuccess("Đã xóa chương", String(unitNumber));
      setLoading(true);
      await loadUnits();
      await onLessonsUpdated();
    } catch (e) {
      console.error(e);
      notifyError("Xóa thất bại", String((e as Error).message ?? e));
    }
  };

  return (
    <AdminPageLayout
      title="Quản lý bài học"
      description="Thêm chương mới tại đây; soạn thảo chi tiết (từ vựng, mẫu câu, bài kiểm tra) mở trang không gian riêng cho từng chương."
      actions={
        <Button
          onClick={toggleCreatePanel}
          variant={expanded === "create" ? "secondary" : "default"}
          className="gap-2"
        >
          {expanded === "create" ? (
            <ChevronUp className="h-4 w-4" />
          ) : (
            <Plus className="h-4 w-4" />
          )}
          {expanded === "create" ? "Đóng form thêm" : "Thêm chương"}
        </Button>
      }
    >
      <UnitTable
        units={units}
        loading={loading}
        expanded={expanded}
        toggleCreatePanel={toggleCreatePanel}
        draft={draft}
        setDraft={setDraft}
        grammarStructures={grammarStructures}
        setGrammarStructures={setGrammarStructures}
        saving={saving}
        closePanel={closePanel}
        persist={persist}
        removeUnit={removeUnit}
        navigate={navigate}
      />
    </AdminPageLayout>
  );
}
