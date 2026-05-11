import React from "react";
import { BookOpen, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { LessonEditorForm } from "@/components/admin/lessons/LessonEditorForm";
import type { Unit, GrammarStructure } from "@/types";

export function UnitTable({
  units,
  loading,
  expanded,
  draft,
  setDraft,
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
    <Card className="border-border shadow-sm overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <CardTitle className="flex items-center gap-2 text-lg">
              <BookOpen className="h-4 w-4 text-primary" />
              Học phần hiện có
            </CardTitle>
            <CardDescription>
              {loading ? "Đang tải dữ liệu…" : `Tổng số ${units.length} chương`}
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="px-0">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="w-20 pl-6">ID</TableHead>
              <TableHead>Tiêu đề học phần</TableHead>
              <TableHead className="text-right pr-6">Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {expanded === "create" && (
              <TableRow className="bg-primary/5 hover:bg-primary/5 border-primary/20">
                <TableCell colSpan={3} className="p-0">
                  <div className="animate-in slide-in-from-top-2 duration-200">
                    <div className="max-h-[min(75vh,900px)] overflow-y-auto p-4 md:p-6 border-b border-primary/10">
                      <LessonEditorForm
                        key={draft.id}
                        mode="create"
                        draft={draft}
                        setDraft={setDraft}
                        grammarStructures={grammarStructures}
                        setGrammarStructures={setGrammarStructures}
                        idPrefix="create"
                        saving={saving}
                        onCancel={closePanel}
                        onSave={persist}
                      />
                    </div>
                  </div>
                </TableCell>
              </TableRow>
            )}
            {units.length === 0 && !loading && (
              <TableRow>
                <TableCell
                  colSpan={3}
                  className="h-24 text-center text-muted-foreground"
                >
                  Chưa có chương nào. Nhấn "Thêm chương mới" để bắt đầu.
                </TableCell>
              </TableRow>
            )}
            {units.map((u) => (
              <TableRow key={u.id}>
                <TableCell className="pl-6">
                  <Badge
                    variant="outline"
                    className="font-mono px-1.5 py-0 rounded-md"
                  >
                    {u.id}
                  </Badge>
                </TableCell>
                <TableCell className="font-medium text-foreground/90">
                  {u.title}
                </TableCell>
                <TableCell className="text-right pr-6 space-x-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="hover:bg-primary/10 hover:text-primary transition-colors"
                    onClick={() => navigate(`/admin/lessons/${u.id}/workspace`)}
                  >
                    Mở soạn thảo
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                    onClick={() => void removeUnit(u.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
