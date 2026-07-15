import { useEffect, useCallback, useRef } from "react";
import { toast } from "sonner";
import { speak as baseSpeak, onTTSApiStatusChange } from "@/lib/speech";

type SpeakOptions = {
  onend?: () => void;
};

/**
 * Hook for text-to-speech with integrated error notifications
 * Automatically shows toast when TTS API is unavailable
 */
export function useTTS() {
  const notificationShownRef = useRef(false);

  useEffect(() => {
    // Subscribe to TTS API status changes
    const unsubscribe = onTTSApiStatusChange((apiDown) => {
      if (apiDown && !notificationShownRef.current) {
        notificationShownRef.current = true;
        toast.warning(
          "🎙️ Giọng nói (TTS) không khả dụng",
          {
            description:
              "Đang sử dụng giọng nói của trình duyệt. Dịch vụ TTS sẽ khôi phục sớm.",
            duration: 5000,
          },
        );
      } else if (!apiDown && notificationShownRef.current) {
        notificationShownRef.current = false;
        toast.success(
          "✓ Dịch vụ giọng nói đã khôi phục",
          {
            duration: 3000,
          },
        );
      }
    });

    return unsubscribe;
  }, []);

  const speak = useCallback(
    (text: string, opts?: SpeakOptions) => {
      return baseSpeak(text, opts);
    },
    [],
  );

  return { speak };
}
