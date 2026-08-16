import OpenAI from "openai";
import { HUGGINGFACE_API_KEY, HUGGINGFACE_MODEL, WHISPER_API_KEY, WHISPER_MODEL } from "@/lib/env";

let client: OpenAI | null = null;
let cachedModel: string | null = null;

export function isAIEnabled(): boolean {
  return Boolean(HUGGINGFACE_API_KEY);
}

export function getOpenAI(): OpenAI | null {
  if (!isAIEnabled()) return null;
  if (!client) {
    client = new OpenAI({
      apiKey: HUGGINGFACE_API_KEY,
      baseURL: "https://router.huggingface.co/v1",
      timeout: 30000,
    });
  }
  return client;
}

/**
 * Dynamically lists models from Hugging Face and auto-selects the best available
 * model, falling back to meta-llama/Llama-3.1-8B-Instruct.
 */
export async function getActiveModelName(requested?: string): Promise<string> {
  const isInvalid = (m?: string) => !m || m === "auto" || m === "mock" || m.toLowerCase().includes("gpt-");

  if (requested && !isInvalid(requested)) return requested;
  if (HUGGINGFACE_MODEL && !isInvalid(HUGGINGFACE_MODEL)) return HUGGINGFACE_MODEL;
  if (cachedModel) return cachedModel;

  const openai = getOpenAI();
  if (!openai) return "meta-llama/Llama-3.1-8B-Instruct";

  try {
    const list = await openai.models.list();
    const ids = list.data.map((m) => m.id);

    // Prioritize active and fast models on Hugging Face
    const preferred =
      ids.find((id) => id === "meta-llama/Llama-3.1-8B-Instruct") ||
      ids.find((id) => id === "deepseek-ai/DeepSeek-V3-0324") ||
      ids.find((id) => id.includes("Llama-3.1-8B") || id.includes("Llama-3")) ||
      ids[0];

    if (preferred) {
      cachedModel = preferred;
      return preferred;
    }
  } catch (err) {
    console.error("[huggingface] failed to auto-select model, using fallback", err);
  }

  return "meta-llama/Llama-3.1-8B-Instruct";
}

export function chatModel(): string {
  return !HUGGINGFACE_MODEL || HUGGINGFACE_MODEL === "auto" || HUGGINGFACE_MODEL.toLowerCase().includes("gpt-")
    ? "meta-llama/Llama-3.1-8B-Instruct"
    : HUGGINGFACE_MODEL;
}

export function whisperModel(): string {
  return WHISPER_MODEL || "openai/whisper-large-v3";
}

function parseJsonSafe<T>(content: string): T | null {
  try {
    return JSON.parse(content) as T;
  } catch {
    const jsonMatch = content.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
    if (jsonMatch) {
      try {
        return JSON.parse(jsonMatch[1]) as T;
      } catch {
        return null;
      }
    }
    return null;
  }
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
      temperature: 0.2,
    });
    const content = response.choices[0]?.message?.content;
    if (!content) return null;
    return parseJsonSafe<T>(content);
  } catch (error) {
    console.error("[huggingface] completion failed, falling back to heuristics", error);
    return null;
  }
}
