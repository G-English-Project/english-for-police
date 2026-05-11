import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Book, MessageSquare } from "lucide-react";

interface FlashcardHeaderProps {
  onBack: () => void;
  deckMode: "vocabulary" | "sentencePatterns";
  onModeChange: (mode: "vocabulary" | "sentencePatterns") => void;
}

export const FlashcardHeader: React.FC<FlashcardHeaderProps> = ({
  onBack,
  deckMode,
  onModeChange,
}) => {
  return (
    <div className="w-full flex items-center justify-between mb-6 gap-2">
      <Button
        variant="ghost"
        className="text-slate-600 hover:text-slate-900 hover:bg-slate-100/80 rounded-xl transition-all px-2 lg:px-4"
        onClick={onBack}
      >
        <ArrowLeft className="lg:mr-2 h-4 w-4" />
        <span className="font-semibold hidden lg:inline">Quay lại bài học</span>
        <span className="font-semibold lg:hidden">Quay lại</span>
      </Button>

      <div className="flex bg-slate-100 p-1 lg:p-1.5 rounded-2xl border border-slate-200/60 shadow-inner">
        <Button
          variant="ghost"
          className={`h-8 lg:h-9 px-2 lg:px-4 rounded-xl transition-all duration-300 font-bold text-xs lg:text-sm ${
            deckMode === "vocabulary"
              ? "primary-gradient text-white shadow-md scale-100"
              : "text-slate-500 hover:text-slate-700 hover:bg-slate-200/50 scale-95"
          }`}
          onClick={() => onModeChange("vocabulary")}
        >
          <Book
            className={`mr-1 lg:mr-2 h-3.5 lg:h-4 w-3.5 lg:w-4 ${deckMode === "vocabulary" ? "text-white" : "text-slate-400"}`}
          />
          Từ vựng
        </Button>
        <Button
          variant="ghost"
          className={`h-8 lg:h-9 px-2 lg:px-4 rounded-xl transition-all duration-300 font-bold text-xs lg:text-sm ${
            deckMode === "sentencePatterns"
              ? "primary-gradient text-white shadow-md scale-100"
              : "text-slate-500 hover:text-slate-700 hover:bg-slate-200/50 scale-95"
          }`}
          onClick={() => onModeChange("sentencePatterns")}
        >
          <MessageSquare
            className={`mr-1 lg:mr-2 h-3.5 lg:h-4 w-3.5 lg:w-4 ${deckMode === "sentencePatterns" ? "text-white" : "text-slate-400"}`}
          />
          Mẫu câu
        </Button>
      </div>
    </div>
  );
};
