import type { Phrase, Unit, Vocabulary } from "@/types";

export type FlashcardCardKind = "VOCAB" | "PHRASE";

export interface FlashcardCatalogItem {
  cardKey: string;
  cardKind: FlashcardCardKind;
  label?: string;
}

/** VOCAB: `{unit}-vocab-{index}` */
export function buildVocabCardKey(unitNumber: number, index: number): string {
  return `${unitNumber}-vocab-${index}`;
}

/** PHRASE: `{unit}-phrase-{subLessonId|all}-{index}` (index trong mảng phrases). */
export function buildPhraseCardKey(
  unitNumber: number,
  phrase: Phrase,
  index: number,
): string {
  const sub = phrase.subLessonId?.trim() || "all";
  return `${unitNumber}-phrase-${sub}-${index}`;
}

export function buildFlashcardCatalogFromUnit(unit: Unit): FlashcardCatalogItem[] {
  const vocab: FlashcardCatalogItem[] = unit.vocabulary.map((v, index) => ({
    cardKey: buildVocabCardKey(unit.id, index),
    cardKind: "VOCAB",
    label: v.word,
  }));
  const phrases: FlashcardCatalogItem[] = unit.phrases.map((p, index) => ({
    cardKey: buildPhraseCardKey(unit.id, p, index),
    cardKind: "PHRASE",
    label: p.text,
  }));
  return [...vocab, ...phrases];
}

export function vocabIndexFromCardKey(cardKey: string): number | null {
  const match = cardKey.match(/-vocab-(\d+)$/);
  return match ? Number(match[1]) : null;
}

export function phraseIndexFromCardKey(cardKey: string): number | null {
  const match = cardKey.match(/-phrase-.+-(\d+)$/);
  return match ? Number(match[1]) : null;
}

export function vocabularyFromCardKey(
  unit: Unit,
  cardKey: string,
): Vocabulary | undefined {
  const index = vocabIndexFromCardKey(cardKey);
  return index != null ? unit.vocabulary[index] : undefined;
}

export function phraseFromCardKey(unit: Unit, cardKey: string): Phrase | undefined {
  const index = phraseIndexFromCardKey(cardKey);
  return index != null ? unit.phrases[index] : undefined;
}
