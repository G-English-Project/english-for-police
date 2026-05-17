import { PHRASE_PRACTICE_TYPE_LABELS } from "./practice-menu-groups";
import { PracticeMenuRow } from "./PracticeMenuRows";

interface PracticePhraseDialogMenuProps {
  availableLabels: Set<string>;
  emptyMessage?: string;
  onSelectType: (typeLabel: string) => void;
}

/** Dialog luyện tập: chỉ 2 dạng mẫu câu (tiêu đề phần nằm ở header dialog). */
export function PracticePhraseDialogMenu({
  availableLabels,
  emptyMessage = "Chưa có bài tập cho phần này.",
  onSelectType,
}: PracticePhraseDialogMenuProps) {
  const types = PHRASE_PRACTICE_TYPE_LABELS.filter((label) =>
    availableLabels.has(label),
  );

  if (types.length === 0) {
    return (
      <p className="px-2 py-6 text-center text-sm italic text-muted-foreground">
        {emptyMessage}
      </p>
    );
  }

  return (
    <div className="space-y-1">
      {types.map((typeLabel) => (
        <PracticeMenuRow
          key={typeLabel}
          variant="dialog"
          label={typeLabel}
          isAvailable
          onSelect={() => onSelectType(typeLabel)}
        />
      ))}
    </div>
  );
}
