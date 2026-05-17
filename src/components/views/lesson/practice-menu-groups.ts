/** Dạng bài luyện tập theo nhóm Từ vựng / Mẫu câu (khớp API). */
export const VOCAB_PRACTICE_TYPE_LABELS = [
  "Trắc nghiệm từ vựng",
  "Ghép từ - nghĩa",
] as const;

export const PHRASE_PRACTICE_TYPE_LABELS = [
  "Mẫu câu & tình huống",
  "Điền từ & sắp xếp câu",
] as const;

export function formatPracticeSubLessonLabel(
  id: string,
  title?: string,
): string {
  const t = title?.trim();
  return t ? `${id} — ${t}` : id;
}
