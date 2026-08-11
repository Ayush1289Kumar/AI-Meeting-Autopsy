import OpenAI from "openai";
import { OPENAI_API_KEY, OPENAI_MODEL, OPENAI_WHISPER_MODEL } from "@/lib/env";

let client: OpenAI | null = null;

export function isAIEnabled(): boolean {
  return Boolean(OPENAI_API_KEY);
}

export function getOpenAI(): OpenAI | null {
  if (!isAIEnabled()) return null;
  if (!client) client = new OpenAI({ apiKey: OPENAI_API_KEY });
  return client;
}

export function chatModel(): string {
  return OPENAI_MODEL;
}

export function whisperModel(): string {
  return OPENAI_WHISPER_MODEL;
}

/** Calls the chat model expecting a JSON object response; returns null when AI is unavailable or fails. */
export async function jsonCompletion<T>(system: string, user: string): Promise<T | null> {
  const openai = getOpenAI();
  if (!openai) return null;
  try {
    const response = await openai.chat.completions.create({
      model: chatModel(),
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: system },
        { role: "user", content: user },
      ],
    });
    const content = response.choices[0]?.message?.content;
    if (!content) return null;
    return JSON.parse(content) as T;
  } catch (error) {
    console.error("[openai] completion failed, falling back to heuristics", error);
    return null;
  }
}
