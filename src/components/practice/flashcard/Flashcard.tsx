import React from "react";
import { Button } from "@/components/ui/button";
import { Volume2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface FlashcardProps {
  front: string;
  back: string;
  unitId?: number;
  phonetic?: string;
  example?: string;
  context?: string;
  isFlipped: boolean;
  onFlip: () => void;
  onPlayAudio: (text: string) => void;
}

export const Flashcard: React.FC<FlashcardProps> = ({
  front,
  back,
  unitId,
  phonetic,
  example,
  context,
  isFlipped,
  onFlip,
  onPlayAudio,
}) => {
  return (
    <div
      className="flashcard-scene w-full max-w-4xl mx-auto h-[430px] sm:h-[400px] md:h-[380px] relative group cursor-pointer"
      onClick={onFlip}
    >
      {/* Decorative Glow Effect */}
      <div className="absolute -inset-4 bg-primary/20 rounded-[32px] blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 -z-10" />

      <div
        className={cn(
          "flashcard-inner relative w-full h-full",
          isFlipped && "is-flipped",
        )}
      >
        {/* Front Side — transform/backface only here; overflow on inner avoids Safari 3D bugs */}
        <div className="flashcard-face absolute inset-0">
          <div className="absolute inset-0 bg-[#1a1f35] rounded-3xl shadow-[0_30px_60px_-15px_rgba(0,0,0,0.5)] flex flex-col p-6 md:p-8 overflow-hidden border border-white/10 group-hover:border-primary/30 transition-colors duration-500">
            {/* Grain Overlay */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />

            <div className="flex justify-between items-start relative z-10">
              <div className="flex flex-col gap-1">
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-primary/80">
                  Unit {unitId ?? "1"}
                </span>
                <span className="text-[9px] font-bold uppercase tracking-widest text-white/20">
                  Flashcard Practice
                </span>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="text-white/40 hover:text-white hover:bg-white/10 h-10 w-10 transition-all rounded-full border border-white/5 backdrop-blur-md"
                onClick={(e) => {
                  e.stopPropagation();
                  onPlayAudio(front);
                }}
              >
                <Volume2 className="h-5 w-5" />
              </Button>
            </div>

            <div className="flex-1 flex flex-col items-center justify-center text-center relative z-10 py-8">
              <h2 className="text-3xl md:text-5xl font-normal tracking-tight text-white mb-4 drop-shadow-[0_10px_10px_rgba(0,0,0,0.5)] leading-tight">
                {front}
              </h2>
              {phonetic && (
                <div className="bg-primary/10 px-5 py-2 rounded-2xl border border-primary/20 backdrop-blur-xl">
                  <p className="text-emerald-400 text-xl md:text-2xl font-mono tracking-widest">
                    {phonetic}
                  </p>
                </div>
              )}
            </div>

            <div className="relative z-10 mt-auto pt-6 border-t border-white/5">
              <div className="flex items-center justify-center gap-3">
                <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md shadow-inner">
                  <span className="text-white/40 text-[9px] font-black uppercase tracking-widest">
                    {isFlipped ? "ĐÁNH GIÁ" : "TRẢI NGHIỆM"}
                  </span>
                  <div className="h-3 w-px bg-white/10" />
                  <span className="text-white/80 text-[10px] font-bold">
                    <span className="md:hidden">Chạm</span>
                    <span className="hidden md:inline">Phím Space</span>
                  </span>
                  <span className="text-white/40 text-[10px] font-medium">
                    để lật
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Back Side */}
        <div className="flashcard-face flashcard-face--back absolute inset-0">
          <div className="absolute inset-0 bg-[#0f1225] rounded-3xl shadow-[0_40px_80px_-20px_rgba(0,0,0,0.6)] flex flex-col p-6 md:p-8 overflow-hidden border border-emerald-500/20">
            {/* Gradient Highlight */}
            <div className="absolute -top-24 -right-24 w-64 h-64 bg-emerald-500/10 rounded-full blur-[100px]" />

            <div className="flex justify-between items-start relative z-10">
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-400/80 bg-emerald-400/5 px-4 py-1.5 rounded-full border border-emerald-400/10">
                KẾT QUẢ
              </span>
            </div>

            <div className="flex-1 flex flex-col items-center justify-center text-center relative z-10 py-6 overflow-y-auto custom-scrollbar">
              <h3 className="text-2xl md:text-4xl font-normal text-transparent bg-clip-text bg-linear-to-r from-emerald-400 to-teal-300 mb-4 py-1 drop-shadow-sm leading-tight">
                {back}
              </h3>

              {(example || context) && (
                <div className="space-y-4 max-w-xl">
                  <div className="h-px w-12 bg-emerald-500/20 mx-auto" />
                  {example && (
                    <div className="relative px-6">
                      <span className="absolute top-0 left-0 text-emerald-500/30 text-4xl font-serif">
                        “
                      </span>
                      <p className="text-white/90 text-lg md:text-2xl italic font-medium leading-relaxed py-2">
                        {example}
                      </p>
                      <span className="absolute bottom-0 right-0 text-emerald-500/30 text-4xl font-serif">
                        ”
                      </span>
                    </div>
                  )}
                  {context && (
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-white/5 border border-white/5">
                      <span className="text-[10px] font-black text-emerald-400/40 uppercase">
                        Context
                      </span>
                      <p className="text-white/40 text-xs md:text-sm font-medium">
                        {context}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="relative z-10 mt-auto pt-6 border-t border-white/5">
              <div className="flex items-center justify-center gap-4">
                <div className="flex items-center gap-2 bg-orange-500/10 px-4 py-1.5 rounded-full border border-orange-500/20 shadow-sm">
                  <div className="h-1.5 w-1.5 rounded-full bg-orange-500 animate-pulse" />
                  <span className="text-orange-400 text-[10px] font-black uppercase tracking-widest">
                    Cần ôn tập
                  </span>
                </div>
                <div className="h-4 w-px bg-white/10" />
                <div className="flex items-center gap-2 bg-emerald-500/10 px-4 py-1.5 rounded-full border border-emerald-500/20 shadow-sm">
                  <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  <span className="text-emerald-400 text-[10px] font-black uppercase tracking-widest">
                    Đã thuộc
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
