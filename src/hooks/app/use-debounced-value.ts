import { useEffect, useMemo, useState } from "react";
import { debounce } from "@/utils/debounce";

export function useDebouncedValue<T>(value: T, delayMs = 300): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  const updateDebouncedValue = useMemo(
    () => debounce((nextValue: T) => setDebouncedValue(nextValue), delayMs),
    [delayMs],
  );

  useEffect(() => {
    updateDebouncedValue(value);
    return () => updateDebouncedValue.cancel();
  }, [updateDebouncedValue, value]);

  return debouncedValue;
}
