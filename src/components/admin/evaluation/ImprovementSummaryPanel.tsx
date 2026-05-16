import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { ImprovementBlockResponse, UnitImprovementResponse } from "@/models/evaluation.model";
import { EvaluationEmptyState } from "./EvaluationEmptyState";
import {
  deltaScoreClassName,
  formatDeltaScore,
  formatScore,
  trendBadgeClass,
  trendLabel,
} from "./evaluation-display";
import { UnitScoresBarChart } from "./UnitScoresBarChart";

interface ImprovementSummaryPanelProps {
  improvement: ImprovementBlockResponse;
  selectedUnitNumber: number | null;
  onSelectUnit: (unitNumber: number) => void;
}

export function ImprovementSummaryPanel({
  improvement,
  selectedUnitNumber,
  onSelectUnit,
}: ImprovementSummaryPanelProps) {
  const units = improvement.units;
  const empty = units.length === 0;

  return (
    <Card className="min-w-0 border border-slate-200 bg-white shadow-sm">
      <CardHeader className="border-b border-slate-100 bg-slate-50 px-5 py-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <CardTitle className="text-base font-bold text-slate-900">
            Cải thiện
          </CardTitle>
          {improvement.overallDeltaPercent !== null ? (
            <Badge
              variant="outline"
              className={`text-xs font-bold ${deltaScoreClassName(improvement.overallDeltaPercent)}`}
            >
              Δ trung bình: {formatDeltaScore(improvement.overallDeltaPercent)}
            </Badge>
          ) : null}
        </div>
      </CardHeader>
      <CardContent className="space-y-5 p-5">
        {empty ? (
          <EvaluationEmptyState variant="improvement" />
        ) : (
          <>
            <UnitScoresBarChart units={units} />
            <div className="overflow-x-auto rounded-md border border-slate-200">
              <Table>
                <TableHeader>
                  <TableRow className="bg-slate-50">
                    <TableHead className="text-xs font-bold">Chương</TableHead>
                    <TableHead className="text-xs font-bold">Lần</TableHead>
                    <TableHead className="text-xs font-bold">Đầu</TableHead>
                    <TableHead className="text-xs font-bold">Cuối</TableHead>
                    <TableHead className="text-xs font-bold">Cao</TableHead>
                    <TableHead className="text-xs font-bold">Δ</TableHead>
                    <TableHead className="text-xs font-bold">Xu hướng</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {units.map((unit) => (
                    <UnitRow
                      key={unit.unitNumber}
                      unit={unit}
                      selected={selectedUnitNumber === unit.unitNumber}
                      onSelect={() => onSelectUnit(unit.unitNumber)}
                    />
                  ))}
                </TableBody>
              </Table>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}

function UnitRow({
  unit,
  selected,
  onSelect,
}: {
  unit: UnitImprovementResponse;
  selected: boolean;
  onSelect: () => void;
}) {
  return (
    <TableRow
      className={`cursor-pointer transition-colors hover:bg-slate-50 ${selected ? "bg-primary/5" : ""}`}
      onClick={onSelect}
    >
      <TableCell className="text-xs font-semibold">
        {unit.unitNumber}
        {unit.unitTitle ? (
          <span className="ml-1 font-normal text-slate-500">
            {unit.unitTitle}
          </span>
        ) : null}
      </TableCell>
      <TableCell className="text-xs">{unit.attemptCount}</TableCell>
      <TableCell className="text-xs">{formatScore(unit.firstScore)}</TableCell>
      <TableCell className="text-xs">{formatScore(unit.lastScore)}</TableCell>
      <TableCell className="text-xs">{formatScore(unit.bestScore)}</TableCell>
      <TableCell
        className={`text-xs font-bold ${deltaScoreClassName(unit.deltaScore)}`}
      >
        {formatDeltaScore(unit.deltaScore)}
      </TableCell>
      <TableCell>
        <Badge
          variant="outline"
          className={`text-[10px] font-bold ${trendBadgeClass(unit.trendDirection)}`}
          title={
            unit.trendDirection === "INSUFFICIENT_DATA"
              ? "Cần ít nhất 2 lần làm trong kỳ"
              : undefined
          }
        >
          {trendLabel(unit.trendDirection)}
        </Badge>
      </TableCell>
    </TableRow>
  );
}
