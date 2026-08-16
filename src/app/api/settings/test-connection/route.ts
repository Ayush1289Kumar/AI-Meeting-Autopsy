import { NextResponse } from "next/server";
import { getOpenAI, chatModel, whisperModel, getActiveModelName } from "@/lib/openai";
import { WHISPER_API_KEY } from "@/lib/env";

export async function POST(request: Request) {
  const huggingface = getOpenAI();

  const body = await request.json().catch(() => ({}));
  const requestedModel = body.model || chatModel();
  
  // Resolve the actual model name (including auto-selection)
  const targetModel = await getActiveModelName(requestedModel);

  const results: {
    huggingface?: { success: boolean; message: string };
    whisper?: { success: boolean; message: string };
  } = {};

  // 1. Test Hugging Face LLM connection
  if (huggingface) {
    try {
      const startTime = Date.now();
      const response = await huggingface.chat.completions.create({
        model: targetModel,
        max_tokens: 10,
        messages: [{ role: "user", content: "Write one word: Success" }],
      });
      const latency = Date.now() - startTime;
      const reply = response.choices[0]?.message?.content?.trim() ?? "";
      results.huggingface = {
        success: true,
        message: `Connected successfully using "${targetModel}"! Latency: ${latency}ms. Response: "${reply}"`,
      };
    } catch (error: unknown) {
      let availableModels: string[] = [];
      try {
        const list = await huggingface.models.list();
        availableModels = list.data
          .map((m) => m.id)
          .filter((id) => id.toLowerCase().includes("llama"));
      } catch (listErr) {
        console.error("Failed to list Hugging Face models", listErr);
      }

      const errorMessage = error instanceof Error ? error.message : "Connection failed.";
      results.huggingface = {
        success: false,
        message: `Failed to connect using "${targetModel}": ${errorMessage}${availableModels.length ? `. Matching models: ${availableModels.slice(0, 15).join(", ")}` : ""}`,
      };
    }
  } else {
    results.huggingface = {
      success: false,
      message: "HUGGINGFACE_API_KEY is not configured.",
    };
  }

  // 2. Test Hugging Face Whisper connection
  if (WHISPER_API_KEY) {
    const model = whisperModel() || "openai/whisper-large-v3";
    try {
      const startTime = Date.now();
      
      // Create a valid 0.5-second 16kHz 16-bit mono PCM WAV file (16,044 bytes)
      const sampleRate = 16000;
      const numSamples = 8000;
      const dataSize = numSamples * 2;
      const fileSize = 36 + dataSize;

      const header = Buffer.alloc(44);
      header.write("RIFF", 0);
      header.writeUInt32LE(fileSize, 4);
      header.write("WAVE", 8);
      header.write("fmt ", 12);
      header.writeUInt32LE(16, 16);
      header.writeUInt16LE(1, 20);
      header.writeUInt16LE(1, 22);
      header.writeUInt32LE(sampleRate, 24);
      header.writeUInt32LE(sampleRate * 2, 28);
      header.writeUInt16LE(2, 32);
      header.writeUInt16LE(16, 34);
      header.write("data", 36);
      header.writeUInt32LE(dataSize, 40);

      const data = Buffer.alloc(dataSize);
      const wavBuffer = Buffer.concat([header, data]);

      const response = await fetch(
        `https://router.huggingface.co/hf-inference/models/${model}`,
        {
          headers: {
            Authorization: `Bearer ${WHISPER_API_KEY}`,
            "Content-Type": "audio/wav",
            "x-wait-for-model": "true",
          },
          method: "POST",
          body: wavBuffer,
        }
      );

      if (!response.ok) {
        const errText = await response.text();
        throw new Error(`Hugging Face failed (${response.status}): ${errText}`);
      }

      const latency = Date.now() - startTime;
      results.whisper = {
        success: true,
        message: `Connected successfully to model "${model}"! Latency: ${latency}ms.`,
      };
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "Connection failed.";
      results.whisper = {
        success: false,
        message: `Failed: ${errorMessage}`,
      };
    }
  } else {
    results.whisper = {
      success: false,
      message: "WHISPER_API_KEY is not configured.",
    };
  }

  return NextResponse.json(results);
}
