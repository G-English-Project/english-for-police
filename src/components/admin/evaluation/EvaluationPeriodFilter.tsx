import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { EvaluationPeriodResponse } from "@/models/evaluation.model";

interface EvaluationPeriodFilterProps {
  period: EvaluationPeriodResponse;
  onPeriodChange: (period: EvaluationPeriodResponse) => void;
  onPreset: (days: number) => void;
}

export function EvaluationPeriodFilter({
  period,
  onPeriodChange,
  onPreset,
}: EvaluationPeriodFilterProps) {
  return (
    <div className="flex flex-wrap items-end gap-3">
      <div className="flex flex-wrap gap-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="h-8 text-xs font-bold"
          onClick={() => onPreset(7)}
        >
          7 ngày
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="h-8 text-xs font-bold"
          onClick={() => onPreset(30)}
        >
          30 ngày
        </Button>
      </div>
      <div className="space-y-1">
        <Label htmlFor="eval-from" className="text-[10px] font-bold uppercase">
          Từ ngày
        </Label>
        <Input
          id="eval-from"
          type="date"
          className="h-9 w-[150px] text-xs"
          value={period.from}
          onChange={(e) =>
            onPeriodChange({ ...period, from: e.target.value })
          }
        />
      </div>
      <div className="space-y-1">
        <Label htmlFor="eval-to" className="text-[10px] font-bold uppercase">
          Đến ngày
        </Label>
        <Input
          id="eval-to"
          type="date"
          className="h-9 w-[150px] text-xs"
          value={period.to}
          onChange={(e) => onPeriodChange({ ...period, to: e.target.value })}
        />
      </div>
    </div>
  );
}
