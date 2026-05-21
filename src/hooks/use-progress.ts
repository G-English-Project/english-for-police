import { useProgressContext } from "@/contexts/progress-context";

export function useProgress() {
  return useProgressContext();
}
