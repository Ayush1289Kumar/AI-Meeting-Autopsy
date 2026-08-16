import { whisperModel } from "@/lib/openai";
import { WHISPER_API_KEY } from "@/lib/env";
import type { TranscriptSegmentInput } from "@/types";

const SPEAKER_LINE = /^\s*(?:\[?(\d{1,2}:\d{2}(?::\d{2})?)\]?\s*)?([A-Z][\w .'-]{1,40}?)\s*:\s*(.+)$/;

function parseClock(value: string): number {
  const parts = value.split(":").map(Number);
  if (parts.length === 3) return parts[0] * 3600 + parts[1] * 60 + parts[2];
  return parts[0] * 60 + parts[1];
}

/** Rough speaking pace used when a transcript has no timestamps. */
const WORDS_PER_SECOND = 2.5;

/**
 * Parses a pasted transcript into timestamped, speaker-labelled segments.
 * Supports "Speaker: text" and "[00:12] Speaker: text" lines; unlabelled text is
 * attributed to the previous speaker.
 */
export function parseTranscriptText(raw: string): TranscriptSegmentInput[] {
  const segments: TranscriptSegmentInput[] = [];
  let cursor = 0;
  let lastSpeaker = "Speaker 1";

  for (const line of raw.split(/\r?\n/)) {
    const text = line.trim();
    if (!text) continue;

    const match = SPEAKER_LINE.exec(text);
    const speaker = match ? match[2].trim() : lastSpeaker;
    const body = match ? match[3].trim() : text;
    const explicitStart = match?.[1] ? parseClock(match[1]) : null;

    const start = explicitStart ?? cursor;
    const words = body.split(/\s+/).length;
    const end = start + Math.max(2, Math.round(words / WORDS_PER_SECOND));

    segments.push({ speaker, text: body, start, end });
    lastSpeaker = speaker;
    cursor = end + 1;
  }

  return segments;
}

/** Transcribes audio with Hugging Face Inference API. Returns null when unavailable. */
export async function transcribeAudio(file: File): Promise<TranscriptSegmentInput[] | null> {
  if (!WHISPER_API_KEY) return null;

  try {
    const arrayBuffer = await file.arrayBuffer();
    const model = whisperModel() || "openai/whisper-large-v3";
    
    console.log(`[huggingface] transcribing via model: ${model}`);
    
    const response = await fetch(
      `https://api-inference.huggingface.co/models/${model}`,
      {
        headers: {
          Authorization: `Bearer ${WHISPER_API_KEY}`,
          "Content-Type": file.type || "audio/wav",
        },
        method: "POST",
        body: Buffer.from(arrayBuffer),
      }
    );

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`Hugging Face inference failed (${response.status}): ${errText}`);
    }

    interface HFResponse {
      text?: string;
      chunks?: { timestamp: [number, number | null]; text: string }[];
    }

    const payload = (await response.json()) as HFResponse;
    
    if (payload.chunks && payload.chunks.length > 0) {
      // If Hugging Face returns segmented chunks with timestamps, map them
      let speakerIndex = 1;
      let previousEnd = 0;
      return payload.chunks.map((chunk) => {
        const start = chunk.timestamp[0];
        const end = chunk.timestamp[1] ?? (start + 3);
        if (start - previousEnd > 2) {
          speakerIndex = (speakerIndex % 4) + 1;
        }
        previousEnd = end;
        return {
          speaker: `Speaker ${speakerIndex}`,
          text: chunk.text.trim(),
          start: Math.round(start),
          end: Math.round(end),
        };
      });
    }

    if (payload.text) {
      // Fallback: parse full transcript text into speaker chunks
      return parseTranscriptText(payload.text);
    }

    return null;
  } catch (error) {
    console.error("[huggingface] transcription failed", error);
    return null;
  }
}
