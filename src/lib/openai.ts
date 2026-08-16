import OpenAI from "openai";
import { NVIDIA_API_KEY, NVIDIA_MODEL, WHISPER_API_KEY, WHISPER_MODEL } from "@/lib/env";

let client: OpenAI | null = null;
let cachedModel: string | null = null;

export function isAIEnabled(): boolean {
  return Boolean(NVIDIA_API_KEY);
}

export function getOpenAI(): OpenAI | null {
  if (!isAIEnabled()) return null;
  if (!client) {
    client = new OpenAI({
      apiKey: NVIDIA_API_KEY,
      baseURL: "https://integrate.api.nvidia.com/v1",
    });
  }
  return client;
}

/**
 * Dynamically lists models from NVIDIA NIM and auto-selects the best available
 * Llama or Nemotron model, falling back to env/default.
 */
export async function getActiveModelName(requested?: string): Promise<string> {
  if (requested && requested !== "auto") return requested;
  if (cachedModel) return cachedModel;

  const openai = getOpenAI();
  if (!openai) return NVIDIA_MODEL;

  try {
    const list = await openai.models.list();
    const ids = list.data.map((m) => m.id);

    // Filter and prioritize
    const preferred = ids.find((id) =>
      id.includes("nemotron-70b") ||
      id.includes("nemotron-51b") ||
      id.includes("llama-3.1-70b") ||
      id.includes("llama3-70b") ||
      id.includes("llama-3.1")
    ) || ids.find((id) => id.includes("llama") || id.includes("nemotron")) || ids[0];

    if (preferred) {
      cachedModel = preferred;
      return preferred;
    }
  } catch (err) {
    console.error("[nvidia] failed to auto-select model, using fallback", err);
  }

  return NVIDIA_MODEL;
}

export function chatModel(): string {
  return NVIDIA_MODEL;
}

export function whisperModel(): string {
  return WHISPER_MODEL;
}

/** Calls the chat model expecting a JSON object response; returns null when AI is unavailable or fails. */
export async function jsonCompletion<T>(system: string, user: string): Promise<T | null> {
  const openai = getOpenAI();
  if (!openai) return null;
  try {
    const model = await getActiveModelName();
    const response = await openai.chat.completions.create({
      model: model,
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
    console.error("[nvidia] completion failed, falling back to heuristics", error);
    return null;
  }
}
