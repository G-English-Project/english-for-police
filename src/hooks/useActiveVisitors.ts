import { useEffect, useState } from "react";
import { API_BASE_URL } from "@/api/routes";

const POLL_MS = 30_000;

export function useActiveVisitors(): number | null {
  const [count, setCount] = useState<number | null>(null);

  useEffect(() => {
    const fetch_ = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/v1/analytics/active-visitors`);
        if (!res.ok) return;
        const data = (await res.json()) as { count?: number };
        if (data.count !== undefined) setCount(data.count);
      } catch {
        // silently ignore
      }
    };

    void fetch_();
    const id = setInterval(() => void fetch_(), POLL_MS);
    return () => clearInterval(id);
  }, []);

  return count;
}
