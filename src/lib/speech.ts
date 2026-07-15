import { TTS_API_BASE_URL, DEFAULT_TTS_VOICE } from "@/config/api";

let preferredVoice: SpeechSynthesisVoice | null = null;
let currentAudio: HTMLAudioElement | null = null;
let browserTtsTimeout: number | null = null;

// TTS API Status Tracking
let consecutiveApiFailures = 0;
let lastApiFailureNotified = 0;
const NOTIFICATION_COOLDOWN_MS = 30000; // Don't spam notifications more than every 30 seconds
let apiFailureCallbacks: ((apiDown: boolean) => void)[] = [];

// Register callback for when API status changes
export function onTTSApiStatusChange(callback: (apiDown: boolean) => void) {
  apiFailureCallbacks.push(callback);
  return () => {
    apiFailureCallbacks = apiFailureCallbacks.filter((cb) => cb !== callback);
  };
}

export function initSpeech() {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return;

  const loadVoices = () => {
    const voices = window.speechSynthesis.getVoices();
    if (voices && voices.length) {
      preferredVoice =
        voices.find((v) => v.lang === "en-US" && v.name.includes("Google")) ||
        voices.find((v) => v.lang === "en-US") ||
        voices.find((v) => v.lang.startsWith("en")) ||
        voices[0];
    }
  };

  loadVoices();
  if (window.speechSynthesis.onvoiceschanged !== undefined) {
    window.speechSynthesis.onvoiceschanged = loadVoices;
  }
}

export function unlockSpeech() {
  if (typeof window === "undefined") return;

  if ("speechSynthesis" in window) {
    const u = new SpeechSynthesisUtterance("");
    u.volume = 0;
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(u);
  }

  const audio = new Audio();
  audio.play().catch(() => {});
}

function notifyApiFailure() {
  const now = Date.now();
  if (now - lastApiFailureNotified > NOTIFICATION_COOLDOWN_MS) {
    lastApiFailureNotified = now;
    apiFailureCallbacks.forEach((cb) => cb(true));
    console.warn(
      "[TTS] API is unavailable. Falling back to browser TTS. Check if the TTS service is running.",
    );
  }
}

function notifyApiRecovery() {
  if (consecutiveApiFailures > 0) {
    apiFailureCallbacks.forEach((cb) => cb(false));
    console.log("[TTS] API is back online");
  }
  consecutiveApiFailures = 0;
}

export async function speak(text: string, opts?: { onend?: () => void }) {
  if (typeof window === "undefined") return;

  if (currentAudio) {
    currentAudio.pause();
    currentAudio = null;
  }

  let fallbackTriggered = false;
  const triggerFallback = () => {
    if (!fallbackTriggered) {
      fallbackTriggered = true;
      consecutiveApiFailures++;
      notifyApiFailure();
      speakWithBrowser(text, opts);
    }
  };

  try {
    const apiUrl = `${window.location.origin}${TTS_API_BASE_URL}/api/tts`;
    const url = new URL(apiUrl);
    url.searchParams.append("voice", DEFAULT_TTS_VOICE);
    url.searchParams.append("text", text);
    url.searchParams.append("vocoder", "high");

    const audio = new Audio(url.toString());
    currentAudio = audio;

    // Race: audio playback vs 1.5-second network timeout
    // This ensures quick fallback if API is unreachable
    const playPromise = audio.play();
    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(
        () => reject(new Error("[TTS] Network timeout - API not responding")),
        1500,
      ),
    );

    // Also set a longer timeout just in case
    const audioTimeout = setTimeout(() => {
      if (currentAudio === audio) {
        console.warn(
          "[TTS] Audio playback timeout, falling back to browser TTS",
        );
        audio.pause();
        triggerFallback();
      }
    }, 2000);

    audio.onended = () => {
      clearTimeout(audioTimeout);
      if (consecutiveApiFailures === 0) {
        notifyApiRecovery();
      }
      if (opts?.onend) opts.onend();
    };

    audio.onerror = (e) => {
      clearTimeout(audioTimeout);
      console.warn(
        "[TTS] Audio element error (code:",
        audio.error?.code,
        "), falling back to browser TTS",
        e,
      );
      triggerFallback();
    };

    audio.onloadstart = () => {
      clearTimeout(audioTimeout);
      // Reset failures on successful load start
      if (consecutiveApiFailures > 0) {
        notifyApiRecovery();
      }
    };

    // Race against timeout - whichever completes first
    try {
      await Promise.race([playPromise, timeoutPromise]);
    } catch (raceError) {
      if (
        raceError instanceof Error &&
        raceError.message.includes("Network timeout")
      ) {
        console.warn("[TTS]", raceError.message);
        audio.pause();
        triggerFallback();
      } else {
        throw raceError;
      }
    }

    return;
  } catch (error) {
    console.warn(
      "[TTS] Remote TTS execution failed, falling back to browser TTS:",
      error,
    );
    triggerFallback();
  }
}

function speakWithBrowser(text: string, opts?: { onend?: () => void }) {
  if (!("speechSynthesis" in window)) {
    if (opts?.onend) opts.onend();
    return;
  }

  window.speechSynthesis.cancel();
  if (browserTtsTimeout) {
    clearTimeout(browserTtsTimeout);
  }

  browserTtsTimeout = setTimeout(() => {
    const u = new SpeechSynthesisUtterance(text);
    u.lang = "en-US";
    u.rate = 0.9;
    u.pitch = 1;
    u.volume = 1;

    if (preferredVoice) {
      u.voice = preferredVoice;
    } else {
      const voices = window.speechSynthesis.getVoices();
      const voice = voices.find((v) => v.lang.startsWith("en"));
      if (voice) u.voice = voice;
    }

    if (opts?.onend) {
      u.onend = opts.onend;
    }

    u.onerror = (event) => {
      if (event.error !== "interrupted") {
        console.error("SpeechSynthesisUtterance error", event);
      }
      if (opts?.onend) opts.onend();
    };

    window.speechSynthesis.speak(u);
    browserTtsTimeout = null;
  }, 50);
}

export default { initSpeech, speak, unlockSpeech };
