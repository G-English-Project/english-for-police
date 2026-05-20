import React, {
  useState,
  useEffect,
  useCallback,
  useMemo,
  useRef,
} from "react";
import type { Unit, FlashcardStatus } from "../../types";
import { FlashcardHeader } from "./flashcard/FlashcardHeader";
import { FlashcardStats } from "./flashcard/FlashcardStats";
import { Flashcard } from "./flashcard/Flashcard";
import { getFlashcardStatusStorageKey } from "./flashcardStorage";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { speak } from "@/lib/speech";
import { Progress } from "@/components/ui/progress";
import {
  buildFlashcardCatalogFromUnit,
  phraseFromCardKey,
  vocabularyFromCardKey,
  type FlashcardCardKind,
  type FlashcardCatalogItem,
} from "@/lib/flashcard-keys";
import { lessonService } from "@/services/lesson.service";
import { useProgress } from "@/hooks/use-progress";
import type { FlashcardViewItem, UnitProgress } from "@/models/progress.model";
import { unitProgressPercent } from "@/lib/unit-progress";

const VIEW_FLUSH_MS = 2500;

export interface FlashcardSessionSummary {
  unitId: number;
  unitTitle: string;
  totalCards: number;
  reviewedCount: number;
  knownCount: number;
  reviewCount: number;
  completionPercent: number;
  weakCards: { id: string; front: string; back: string }[];
  currentKnownRate: number;
  previousKnownRate: number;
  deckMode: "vocabulary" | "sentencePatterns";
  chapterFlashcardsViewed?: number;
  chapterFlashcardsTotal?: number;
  chapterProgressPercent?: number;
}

export interface FlashcardReviewProps {
  unit: Unit;
  onBack: () => void;
  onComplete: (summary: FlashcardSessionSummary) => void;
  initialMode?: "vocabulary" | "sentencePatterns";
}

type DeckCard = {
  cardKey: string;
  cardKind: FlashcardCardKind;
  front: string;
  back: string;
  phonetic?: string;
  example?: string;
  context?: string;
  category: string;
  hint: string;
};

function catalogToDeckCards(
  unit: Unit,
  catalog: FlashcardCatalogItem[],
  deckMode: "vocabulary" | "sentencePatterns",
): DeckCard[] {
  const kind: FlashcardCardKind =
    deckMode === "vocabulary" ? "VOCAB" : "PHRASE";
  return catalog
    .filter((item) => item.cardKind === kind)
    .map((item) => {
      if (item.cardKind === "VOCAB") {
        const v = vocabularyFromCardKey(unit, item.cardKey);
        if (!v) return null;
        return {
          cardKey: item.cardKey,
          cardKind: "VOCAB" as const,
          front: v.word,
          back: v.meaning,
          phonetic: v.phonetic,
          example: v.example,
          category: "Vocabulary",
          hint: v.type,
        };
      }
      const p = phraseFromCardKey(unit, item.cardKey);
      if (!p) return null;
      return {
        cardKey: item.cardKey,
        cardKind: "PHRASE" as const,
        front: p.text,
        back: p.translation,
        context: p.context,
        category: "Phrase",
        hint: "Phrase",
      };
    })
    .filter((c): c is DeckCard => c != null);
}

export const FlashcardReview: React.FC<FlashcardReviewProps> = ({
  unit,
  onBack,
  onComplete,
  initialMode = "vocabulary",
}) => {
  const { markFlashcardViews, unitsProgress, fetchUnitsProgress } =
    useProgress();

  const [deckMode, setDeckMode] = useState<"vocabulary" | "sentencePatterns">(
    initialMode,
  );
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [catalog, setCatalog] = useState<FlashcardCatalogItem[]>(() =>
    buildFlashcardCatalogFromUnit(unit),
  );

  const pendingViewsRef = useRef<Map<string, FlashcardViewItem>>(new Map());
  const syncedViewKeysRef = useRef<Set<string>>(new Set());
  const flushInFlightRef = useRef(false);

  useEffect(() => {
    let cancelled = false;
    lessonService
      .getFlashcardCatalog(unit.id)
      .then((items) => {
        if (!cancelled && items.length > 0) {
          setCatalog(items);
        }
      })
      .catch(() => {
        /* fallback catalog from unit */
      });
    return () => {
      cancelled = true;
    };
  }, [unit.id]);

  useEffect(() => {
    fetchUnitsProgress();
  }, [fetchUnitsProgress]);

  const unitProgress = useMemo(
    () => unitsProgress.find((u) => u.unitNumber === unit.id),
    [unitsProgress, unit.id],
  );

  const chapterProgressPercent = unitProgressPercent(unitProgress);
  const chapterViewed = unitProgress?.flashcardsViewed;
  const chapterTotal = unitProgress?.flashcardsTotal;

  const cards = useMemo(
    () => catalogToDeckCards(unit, catalog, deckMode),
    [unit, catalog, deckMode],
  );

  const [cardStatuses, setCardStatuses] = useState<{
    [key: string]: FlashcardStatus;
  }>(() => {
    const key = getFlashcardStatusStorageKey(unit.id, initialMode);
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : {};
  });

  useEffect(() => {
    const key = getFlashcardStatusStorageKey(unit.id, deckMode);
    localStorage.setItem(key, JSON.stringify(cardStatuses));
  }, [cardStatuses, unit.id, deckMode]);

  const flushPendingViews = useCallback(
    async (force = false): Promise<UnitProgress | null> => {
      if (pendingViewsRef.current.size === 0) return null;
      if (flushInFlightRef.current && !force) return null;

      const batch = [...pendingViewsRef.current.values()].filter(
        (item) => !syncedViewKeysRef.current.has(item.cardKey),
      );
      if (batch.length === 0) {
        pendingViewsRef.current.clear();
        return null;
      }

      flushInFlightRef.current = true;
      batch.forEach((item) => syncedViewKeysRef.current.add(item.cardKey));
      pendingViewsRef.current.clear();

      try {
        return await markFlashcardViews(unit.id, batch);
      } finally {
        flushInFlightRef.current = false;
      }
    },
    [markFlashcardViews, unit.id],
  );

  const queueCardViewed = useCallback(
    (cardKey: string, cardKind: FlashcardCardKind) => {
      if (syncedViewKeysRef.current.has(cardKey)) return;
      pendingViewsRef.current.set(cardKey, { cardKey, cardKind });
    },
    [],
  );

  const currentCard = cards[currentIndex];

  useEffect(() => {
    if (!currentCard) return;
    queueCardViewed(currentCard.cardKey, currentCard.cardKind);
  }, [currentCard, queueCardViewed]);

  useEffect(() => {
    const timer = window.setInterval(() => {
      void flushPendingViews();
    }, VIEW_FLUSH_MS);
    return () => window.clearInterval(timer);
  }, [flushPendingViews]);

  useEffect(() => {
    const onBeforeUnload = () => {
      void flushPendingViews(true);
    };
    window.addEventListener("beforeunload", onBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", onBeforeUnload);
      void flushPendingViews(true);
    };
  }, [flushPendingViews]);

  const nextCard = useCallback(() => {
    if (currentIndex < cards.length - 1) {
      setIsFlipped(false);
      setTimeout(() => {
        setCurrentIndex((prev) => prev + 1);
      }, 50);
    }
  }, [currentIndex, cards.length]);

  const finishSession = useCallback(
    async (newStatuses: Record<string, FlashcardStatus>) => {
      const updated =
        (await flushPendingViews(true)) ??
        unitsProgress.find((u) => u.unitNumber === unit.id);

      const currentCardKeys = new Set(cards.map((c) => c.cardKey));
      const relevantStatuses = Object.entries(newStatuses)
        .filter(([id]) => currentCardKeys.has(id))
        .map(([, s]) => s);

      const knownCount = relevantStatuses.filter((s) => s === "known").length;
      const reviewCount = relevantStatuses.filter((s) => s === "review").length;

      const latest = updated;

      const summary: FlashcardSessionSummary = {
        unitId: unit.id,
        unitTitle: unit.title,
        totalCards: cards.length,
        reviewedCount: cards.length,
        knownCount,
        reviewCount,
        completionPercent: Math.round((knownCount / cards.length) * 100),
        weakCards: cards
          .filter((c) => newStatuses[c.cardKey] === "review")
          .map((c) => ({ id: c.cardKey, front: c.front, back: c.back })),
        currentKnownRate: Math.round((knownCount / cards.length) * 100),
        previousKnownRate: 0,
        deckMode,
        chapterFlashcardsViewed: latest?.flashcardsViewed,
        chapterFlashcardsTotal: latest?.flashcardsTotal,
        chapterProgressPercent: unitProgressPercent(latest),
      };

      onComplete(summary);
    },
    [cards, unit, onComplete, deckMode, flushPendingViews, unitsProgress],
  );

  const markCard = useCallback(
    (status: FlashcardStatus) => {
      if (!currentCard || cards.length === 0) {
        return;
      }

      setCardStatuses((prev) => {
        const newStatuses = {
          ...prev,
          [currentCard.cardKey]: status,
        };

        if (currentIndex === cards.length - 1) {
          setTimeout(() => void finishSession(newStatuses), 0);
        } else {
          nextCard();
        }

        return newStatuses;
      });
    },
    [currentCard, currentIndex, cards, nextCard, finishSession],
  );

  const playAudio = (text: string) => {
    speak(text);
  };

  useEffect(() => {
    if (!currentCard) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === "Space") {
        e.preventDefault();
        setIsFlipped((prev) => !prev);
      } else if (e.code === "ArrowRight") {
        markCard("known");
      } else if (e.code === "ArrowLeft") {
        markCard("review");
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [markCard, currentCard]);

  const stats = useMemo(() => {
    const currentCardKeys = new Set(cards.map((c) => c.cardKey));
    const relevantStatuses = Object.entries(cardStatuses).filter(([id]) =>
      currentCardKeys.has(id),
    );

    return {
      learning:
        cards.length -
        relevantStatuses.filter((item) => item[1] === "known").length,
      known: relevantStatuses.filter((item) => item[1] === "known").length,
    };
  }, [cards, cardStatuses]);

  if (cards.length === 0) {
    return (
      <div className="max-w-2xl mx-auto py-20 text-center px-4 text-muted-foreground">
        Chưa có thẻ flashcard cho phần này.
      </div>
    );
  }

  if (!currentCard) return null;

  return (
    <div className="flex flex-col items-center w-full max-w-5xl mx-auto px-4 py-0">
      <FlashcardHeader
        onBack={onBack}
        deckMode={deckMode}
        onModeChange={(mode) => {
          void flushPendingViews(true);
          setDeckMode(mode);
          setCurrentIndex(0);
          setIsFlipped(false);
        }}
      />

      {typeof chapterTotal === "number" && chapterTotal > 0 && (
        <div className="w-full max-w-2xl mb-4 space-y-1">
          <div className="flex justify-between text-[10px] font-bold uppercase tracking-wider text-slate-500">
            <span>Tiến độ chương (flashcard)</span>
            <span>
              {chapterViewed ?? 0}/{chapterTotal} · {chapterProgressPercent}%
            </span>
          </div>
          <Progress value={chapterProgressPercent} className="h-1.5" />
        </div>
      )}

      <FlashcardStats learningCount={stats.learning} knownCount={stats.known} />

      <div className="w-full flex flex-col lg:flex-row items-center justify-center gap-6 lg:gap-8 mt-4 lg:mt-6">
        <div className="w-full flex-1 max-w-3xl order-1 lg:order-2">
          <Flashcard
            front={currentCard.front}
            back={currentCard.back}
            unitId={unit.id}
            phonetic={currentCard.phonetic}
            example={currentCard.example}
            context={currentCard.context}
            isFlipped={isFlipped}
            onFlip={() => setIsFlipped(!isFlipped)}
            onPlayAudio={playAudio}
          />
        </div>

        <div className="w-full flex items-center justify-center gap-8 order-2 lg:contents mt-2 lg:mt-0">
          <button
            onClick={() => markCard("review")}
            className="h-16 w-16 lg:h-20 lg:w-20 rounded-full flex items-center justify-center transition-all bg-orange-500 text-white hover:bg-orange-600 hover:scale-110 active:scale-90 shadow-[0_15px_30px_-10px_rgba(249,115,22,0.5)] lg:order-1 group/btn"
            title="Học lại (Phím ←)"
          >
            <ChevronLeft className="h-8 w-8 lg:h-10 lg:w-10 transition-transform group-hover/btn:-translate-x-1" />
          </button>

          <button
            onClick={() => markCard("known")}
            className="h-16 w-16 lg:h-20 lg:w-20 rounded-full flex items-center justify-center transition-all bg-emerald-500 text-white hover:bg-emerald-600 hover:scale-110 active:scale-90 shadow-[0_15px_30px_-10px_rgba(16,185,129,0.5)] lg:order-3 group/btn"
            title="Đã thuộc (Phím →)"
          >
            <ChevronRight className="h-8 w-8 lg:h-10 lg:w-10 transition-transform group-hover/btn:translate-x-1" />
          </button>
        </div>
      </div>
    </div>
  );
};
