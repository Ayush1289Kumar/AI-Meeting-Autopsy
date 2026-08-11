import { getOpenAI, whisperModel } from "@/lib/openai";
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

/** Transcribes audio with Whisper when configured. Returns null when unavailable. */
export async function transcribeAudio(file: File): Promise<TranscriptSegmentInput[] | null> {
  const openai = getOpenAI();
  if (!openai) return null;

  try {
    const response = await openai.audio.transcriptions.create({
      file,
      model: whisperModel(),
      response_format: "verbose_json",
      timestamp_granularities: ["segment"],
    });

    const raw = response as unknown as {
      segments?: { text: string; start: number; end: number }[];
      text?: string;
    };

    if (!raw.segments?.length) {
      return raw.text ? parseTranscriptText(raw.text) : null;
    }

    // Whisper has no diarization: alternate labels on long pauses as a best effort.
    let speakerIndex = 1;
    let previousEnd = 0;
    return raw.segments.map((segment) => {
      if (segment.start - previousEnd > 2) speakerIndex = (speakerIndex % 4) + 1;
      previousEnd = segment.end;
      return {
        speaker: `Speaker ${speakerIndex}`,
        text: segment.text.trim(),
        start: Math.round(segment.start),
        end: Math.round(segment.end),
      };
    });
  } catch (error) {
    console.error("[transcription] whisper failed", error);
    return null;
  }
}
