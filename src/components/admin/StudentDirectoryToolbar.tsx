import { ArrowUpDown, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

type ReadinessFilter = "all" | "ready" | "watch";
type SortMode = "progress" | "name" | "activity";

export function StudentDirectoryToolbar({
  searchQuery,
  onSearchQueryChange,
  readinessFilter,
  onReadinessFilterChange,
  sortMode,
  onSortModeChange,
}: {
  searchQuery: string;
  onSearchQueryChange: (value: string) => void;
  readinessFilter: ReadinessFilter;
  onReadinessFilterChange: (value: ReadinessFilter) => void;
  sortMode: SortMode;
  onSortModeChange: (value: SortMode) => void;
}) {
  return (
    <div className="grid grid-cols-1 gap-3 xl:grid-cols-[minmax(0,1fr)_auto_auto]">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Tìm theo tên hoặc email..."
          className="pl-10 h-11 rounded-md border-border bg-background"
          value={searchQuery}
          onChange={(e) => onSearchQueryChange(e.target.value)}
        />
      </div>
      <div className="flex gap-2">
        <Button
          variant={readinessFilter === "all" ? "default" : "outline"}
          className="rounded-md h-11"
          onClick={() => onReadinessFilterChange("all")}
        >
          Tất cả
        </Button>
        <Button
          variant={readinessFilter === "ready" ? "default" : "outline"}
          className="rounded-xl h-11"
          onClick={() => onReadinessFilterChange("ready")}
        >
          Sẵn sàng
        </Button>
        <Button
          variant={readinessFilter === "watch" ? "default" : "outline"}
          className="rounded-xl h-11"
          onClick={() => onReadinessFilterChange("watch")}
        >
          Cần theo dõi
        </Button>
      </div>
      <Button
        variant="outline"
        className="rounded-md h-11 justify-between min-w-52"
        onClick={() =>
          onSortModeChange(
            sortMode === "progress"
              ? "name"
              : sortMode === "name"
                ? "activity"
                : "progress",
          )
        }
      >
        <span className="font-semibold capitalize">
          Sắp xếp:{" "}
          {sortMode === "progress"
            ? "tiến độ"
            : sortMode === "name"
              ? "tên"
              : "hoạt động"}
        </span>
        <ArrowUpDown className="h-4 w-4" />
      </Button>
    </div>
  );
}
