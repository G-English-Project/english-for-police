import { useContext } from "react";
import { ProgressContext } from "@/contexts/progress-context-state";

export function useProgress() {
  const ctx = useContext(ProgressContext);
  if (!ctx) {
    throw new Error("useProgress must be used within ProgressProvider");
  }
  return ctx;
}
