import React, { useState, useEffect } from "react";
import { Volume2, Star, ChevronLeft, ChevronRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { AudioRecorderButton } from "@/components/common/AudioRecorderButton";
import type { Unit, FlaggedItem } from "@/types";

interface LessonVocabularySectionProps {
  readonly unit: Unit;
  readonly flaggedItems: FlaggedItem[];
  readonly onToggleFlag: (item: FlaggedItem) => void;
  readonly onPlayAudio: (text: string, element?: HTMLButtonElement) => void;
  readonly sectionRef?: (el: HTMLElement | null) => void;
}

export const LessonVocabularySection: React.FC<
  LessonVocabularySectionProps
> = ({ unit, flaggedItems, onToggleFlag, onPlayAudio, sectionRef }) => {
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 6;
  const totalPages = Math.max(
    1,
    Math.ceil(unit.vocabulary.length / itemsPerPage),
  );

  useEffect(() => {
    queueMicrotask(() => {
      setCurrentPage(0);
    });
  }, [unit.id]);

  const isFlagged = (word: string) =>
    flaggedItems.some(
      (f) => f.unitId === unit.id && f.type === "vocabulary" && f.key === word,
    );

  const startIndex = currentPage * itemsPerPage;
  const visibleItems = unit.vocabulary.slice(
    startIndex,
    startIndex + itemsPerPage,
  );

  return (
    <section
      id="vocabulary"
      data-section="vocabulary"
      ref={sectionRef}
      className="max-w-full min-w-0 scroll-mt-24 overflow-x-hidden"
    >
      <div className="mb-6 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex min-w-0 items-center gap-3 sm:gap-4">
            <Badge
              variant="outline"
              className="border-primary bg-primary/5 px-3 py-1 text-lg font-bold text-primary"
            >
              01
            </Badge>
            <h2 className="font-heading text-xl font-extrabold tracking-tight sm:text-2xl">
              TỪ VỰNG
            </h2>
          </div>

          {totalPages > 1 ? (
            <div className="ml-auto flex shrink-0 items-center gap-1 rounded-full border border-slate-200 bg-white px-1.5 py-1 shadow-sm sm:gap-2 sm:px-2 sm:py-1.5">
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 rounded-full transition-all duration-200 hover:bg-primary/10"
                onClick={() => setCurrentPage((p) => Math.max(0, p - 1))}
                disabled={currentPage === 0}
                aria-label="Previous page"
              >
                <ChevronLeft
                  className={`h-4 w-4 transition-colors ${
                    currentPage === 0 ? "text-slate-300" : "text-primary"
                  }`}
                />
              </Button>

              <div className="flex flex-col items-center gap-1 px-1">
                <span className="min-w-8 text-center text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">
                  {currentPage + 1} / {totalPages}
                </span>
                <div className="flex items-center gap-1">
                  {Array.from({ length: totalPages }).map((_, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setCurrentPage(i)}
                      className={`rounded-full transition-all duration-300 ${
                        i === currentPage
                          ? "h-2.5 w-5 bg-primary shadow-[0_0_0_3px_rgba(31,58,110,0.08)]"
                          : "h-2 w-2 bg-slate-300 hover:bg-slate-400"
                      }`}
                      aria-label={`Go to page ${i + 1}`}
                      aria-current={i === currentPage ? "page" : undefined}
                    />
                  ))}
                </div>
              </div>

              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 rounded-full transition-all duration-200 hover:bg-primary/10"
                onClick={() =>
                  setCurrentPage((p) => Math.min(totalPages - 1, p + 1))
                }
                disabled={currentPage === totalPages - 1}
                aria-label="Next page"
              >
                <ChevronRight
                  className={`h-4 w-4 transition-colors ${
                    currentPage === totalPages - 1
                      ? "text-slate-300"
                      : "text-primary"
                  }`}
                />
              </Button>
            </div>
          ) : null}
        </div>
      </div>

      <div className="grid min-h-400px w-full min-w-0 grid-cols-1 gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-3">
        {visibleItems.map((v, i) => {
          const flagged = isFlagged(v.word);
          return (
            <Card
              key={`${v.word}-${startIndex + i}`}
              className={`group relative w-full min-w-0 max-w-full overflow-hidden border-l-4 transition-all hover:police-shadow ${flagged ? "border-l-secondary" : "border-l-primary/20 hover:border-l-primary"}`}
            >
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0 flex-1 space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="wrap-break-word text-xl font-bold text-primary">
                        {v.word}
                      </h3>
                      <Badge variant="outline" className="text-[10px] py-0">
                        {v.type}
                      </Badge>
                      {v.subLessonId ? (
                        <Badge
                          variant="secondary"
                          className="text-[9px] py-0 font-black"
                        >
                          {v.subLessonId}
                        </Badge>
                      ) : null}
                    </div>
                    <p className="text-xs text-muted-foreground font-medium">
                      {v.phonetic}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className={`h-8 w-8 rounded-full ${flagged ? "text-secondary" : "text-muted-foreground"}`}
                    onClick={() =>
                      onToggleFlag({
                        unitId: unit.id,
                        type: "vocabulary",
                        key: v.word,
                      })
                    }
                  >
                    <Star
                      className={`h-4 w-4 ${flagged ? "fill-current" : ""}`}
                    />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="wrap-break-word text-base font-bold leading-tight">
                  {v.meaning}
                </p>
                <div className="flex flex-wrap items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8 shrink-0 rounded-full text-xs font-bold transition-all group-hover:bg-primary group-hover:text-white hover:bg-primary hover:text-white"
                    onClick={(e) => onPlayAudio(v.word, e.currentTarget)}
                  >
                    <Volume2 className="h-3 w-3 mr-1.5" />
                    PHÁT ÂM
                  </Button>
                  <AudioRecorderButton className="h-8 text-xs font-bold" />
                </div>
                <div className="bg-muted/50 p-3 rounded-lg border italic text-xs leading-relaxed">
                  "Ex: {v.example}"
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </section>
  );
};

export default LessonVocabularySection;
