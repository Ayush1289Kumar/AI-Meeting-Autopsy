import { NextResponse } from "next/server";
import { getOpenAI, chatModel, whisperModel, getActiveModelName } from "@/lib/openai";
import { WHISPER_API_KEY } from "@/lib/env";

export async function POST(request: Request) {
  const nvidia = getOpenAI();

  const body = await request.json().catch(() => ({}));
  const requestedModel = body.model || chatModel();
  
  // Resolve the actual model name (including auto-selection)
  const targetModel = await getActiveModelName(requestedModel);

  const results: {
    nvidia?: { success: boolean; message: string };
    whisper?: { success: boolean; message: string };
  } = {};

  // 1. Test NVIDIA LLM connection
  if (nvidia) {
    try {
      const startTime = Date.now();
      const response = await nvidia.chat.completions.create({
        model: targetModel,
        max_tokens: 10,
        messages: [{ role: "user", content: "Write one word: Success" }],
      });
      const latency = Date.now() - startTime;
      const reply = response.choices[0]?.message?.content?.trim() ?? "";
      results.nvidia = {
        success: true,
        message: `Connected successfully using "${targetModel}"! Latency: ${latency}ms. Response: "${reply}"`,
      };
    } catch (error: unknown) {
      let availableModels: string[] = [];
      try {
        const list = await nvidia.models.list();
        availableModels = list.data
          .map((m) => m.id)
          .filter((id) => id.toLowerCase().includes("nemotron") || id.toLowerCase().includes("llama"));
      } catch (listErr) {
        console.error("Failed to list NVIDIA models", listErr);
      }

      const errorMessage = error instanceof Error ? error.message : "Connection failed.";
      results.nvidia = {
        success: false,
        message: `Failed to connect using "${targetModel}": ${errorMessage}${availableModels.length ? `. Matching models: ${availableModels.slice(0, 15).join(", ")}` : ""}`,
      };
    }
  } else {
    results.nvidia = {
      success: false,
      message: "NVIDIA_API_KEY is not configured.",
    };
  }

  // 2. Test Hugging Face Whisper connection
  if (WHISPER_API_KEY) {
    const model = whisperModel() || "openai/whisper-large-v3";
    try {
      const startTime = Date.now();
      
      // Create a tiny 1-second silent WAV file in memory (approx 1600 bytes)
      const wavHeader = Buffer.from([
        0x52, 0x49, 0x46, 0x46, // "RIFF"
        0x24, 0x06, 0x00, 0x00, // file size (1572 bytes)
        0x57, 0x41, 0x56, 0x45, // "WAVE"
        0x66, 0x6d, 0x74, 0x20, // "fmt "
        0x10, 0x00, 0x00, 0x00, // chunk size (16)
        0x01, 0x00,             // format (1 = PCM)
        0x01, 0x00,             // channels (1)
        0x40, 0x1f, 0x00, 0x00, // sample rate (8000)
        0x80, 0x3e, 0x00, 0x00, // byte rate (16000)
        0x02, 0x00,             // block align (2)
        0x10, 0x00,             // bits per sample (16)
        0x64, 0x61, 0x74, 0x61, // "data"
        0x00, 0x06, 0x00, 0x00  // data chunk size (1536)
      ]);
      const silentSamples = Buffer.alloc(1536);
      const wavBuffer = Buffer.concat([wavHeader, silentSamples]);

      const response = await fetch(
        `https://api-inference.huggingface.co/models/${model}`,
        {
          headers: {
            Authorization: `Bearer ${WHISPER_API_KEY}`,
            "Content-Type": "audio/wav",
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
