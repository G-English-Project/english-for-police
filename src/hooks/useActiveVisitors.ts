import { useEffect, useState } from "react";

const UMAMI_BASE_URL = "https://umami.espforpolice.vn";
const UMAMI_WEBSITE_ID = "f8861508-a4d3-4ea1-b5f2-ce0da43751db";
const UMAMI_SHARE_TOKEN = "BbTKY49R11vXXKuS";
const POLL_MS = 30_000;

export function useActiveVisitors(): number | null {
  const [count, setCount] = useState<number | null>(null);

  useEffect(() => {
    const fetch_ = async () => {
      try {
        const res = await fetch(
          `${UMAMI_BASE_URL}/api/websites/${UMAMI_WEBSITE_ID}/active`,
          { headers: { "x-umami-share-token": UMAMI_SHARE_TOKEN } },
        );
        if (!res.ok) return;
        const data = (await res.json()) as { x?: number; visitors?: number };
        const v = data.x ?? data.visitors ?? null;
        if (v !== null) setCount(v);
      } catch {
        // silently ignore network errors
      }
    };

    void fetch_();
    const id = setInterval(() => void fetch_(), POLL_MS);
    return () => clearInterval(id);
  }, []);

  return count;
}
