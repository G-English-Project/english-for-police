import React, { Fragment } from "react";
import { BookOpen, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { LessonEditorForm } from "@/components/admin/lessons/LessonEditorForm";
import type { Unit, PhraseTemplate, GrammarStructure } from "@/types";

export function UnitTable({
  units,
  loading,
  expanded,
  draft,
  setDraft,
  phraseTemplates,
  setPhraseTemplates,
  grammarStructures,
  setGrammarStructures,
  saving,
  closePanel,
  persist,
  removeUnit,
  navigate,
}: {
  units: Unit[];
  loading: boolean;
  expanded: null | "create";
  toggleCreatePanel: () => void;
  draft: Unit;
  setDraft: React.Dispatch<React.SetStateAction<Unit>>;
  phraseTemplates: PhraseTemplate[];
  setPhraseTemplates: React.Dispatch<React.SetStateAction<PhraseTemplate[]>>;
  grammarStructures: GrammarStructure[];
  setGrammarStructures: React.Dispatch<
    React.SetStateAction<GrammarStructure[]>
  >;
  saving: boolean;
  closePanel: () => void;
  persist: () => void;
  removeUnit: (id: number) => void;
  navigate: (path: string) => void;
}) {
  return (
    <Card className="border-border police-shadow overflow-hidden">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <BookOpen className="h-5 w-5 text-primary" />
          Danh sách chương
        </CardTitle>
        <CardDescription>
          {loading ? "Đang tải…" : `${units.length} chương`}
        </CardDescription>
      </CardHeader>
      <CardContent className="overflow-x-auto px-0 sm:px-6">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="border-b border-border bg-muted/30 text-left text-muted-foreground">
              <th className="py-3 pl-4 sm:pl-6 pr-4 font-semibold w-18">Mã</th>
              <th className="py-3 pr-4 font-semibold">Tiêu đề</th>
              <th className="py-3 pr-4 sm:pr-6 font-semibold text-right min-w-60">
                Thao tác
              </th>
            </tr>
          </thead>
          <tbody>
            {expanded === "create" && (
              <tr className="bg-primary/5">
                <td colSpan={3} className="p-0 align-top">
                  <div className="border-b border-primary/30 bg-linear-to-b from-primary/10 to-muted/20">
                    <div className="max-h-[min(75vh,900px)] overflow-y-auto overscroll-contain p-4 md:p-6">
                      <LessonEditorForm
                        key={draft.id}
                        mode="create"
                        draft={draft}
                        setDraft={setDraft}
                        phraseTemplates={phraseTemplates}
                        setPhraseTemplates={setPhraseTemplates}
                        grammarStructures={grammarStructures}
                        setGrammarStructures={setGrammarStructures}
                        idPrefix="create"
                        saving={saving}
                        onCancel={closePanel}
                        onSave={persist}
                      />
                    </div>
                  </div>
                </td>
              </tr>
            )}
            {units.map((u) => (
              <Fragment key={u.id}>
                <tr className="border-b border-border/60 transition-colors">
                  <td className="py-3 pl-4 sm:pl-6 pr-4 font-mono font-semibold text-primary">
                    {u.id}
                  </td>
                  <td className="py-3 pr-4 font-medium">{u.title}</td>
                  <td className="py-3 pr-4 sm:pr-6 text-right whitespace-nowrap space-x-2">
                    <Button
                      type="button"
                      variant="default"
                      size="sm"
                      className="gap-1"
                      onClick={() =>
                        navigate(`/admin/lessons/${u.id}/workspace`)
                      }
                    >
                      Soạn chương
                    </Button>
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      className="gap-1"
                      onClick={() => void removeUnit(u.id)}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                      Xóa
                    </Button>
                  </td>
                </tr>
              </Fragment>
            ))}
          </tbody>
        </table>
      </CardContent>
    </Card>
  );
}
