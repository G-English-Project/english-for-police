import { ASR_API_BASE_URL } from "@/config/api";

/** Filename extension must match container/codec (ffmpeg); fake .wav breaks openai-whisper-asr-webservice load_audio. */
function filenameForAudioBlob(blob: Blob): string {
  const mime = (blob.type || "").split(";")[0].trim().toLowerCase();
  if (!mime) return "recording.mp4";
  if (mime.includes("webm")) return "recording.webm";
  if (mime.includes("ogg")) return "recording.ogg";
  if (mime.includes("wav")) return "recording.wav";
  if (mime.includes("mpeg") || mime === "audio/mp3") return "recording.mp3";
  if (mime.includes("mp4") || mime.includes("aac") || mime.includes("caf"))
    return "recording.m4a";
  return "recording.webm";
}

export async function transcribeAudio(audioBlob: Blob): Promise<string> {
  const formData = new FormData();
  formData.append("audio_file", audioBlob, filenameForAudioBlob(audioBlob));

  const url = new URL(`${ASR_API_BASE_URL}/asr`, window.location.origin);
  // Must be true: server treats encode=false as raw s16le PCM (no ffmpeg) — browser blobs are WebM/M4A.
  url.searchParams.append("encode", "true");
  url.searchParams.append("task", "transcribe");
  url.searchParams.append("output", "json");

  const response = await fetch(url.toString(), {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`ASR API failed: ${response.status} ${errorText}`);
  }

  const data = await response.json();
  return typeof data === "string" ? data : data.text || "";
}

export async function detectLanguage(audioBlob: Blob): Promise<string> {
  const formData = new FormData();
  formData.append("audio_file", audioBlob, filenameForAudioBlob(audioBlob));

  const url = new URL(
    `${ASR_API_BASE_URL}/detect-language`,
    window.location.origin,
  );
  url.searchParams.append("encode", "true");

  const response = await fetch(url.toString(), {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    throw new Error(`Detect Language API failed: ${response.status}`);
  }

  return await response.json();
}
