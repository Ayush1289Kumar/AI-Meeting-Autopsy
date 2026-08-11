import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getActiveUser } from "@/lib/auth";
import { AUDIO_EXTENSIONS, MAX_FILE_SIZE_MB, MEETING_TYPES } from "@/lib/constants";
import { analyzeTranscript, persistAnalysis } from "@/services/analysis.service";
import { parseTranscriptText, transcribeAudio } from "@/services/transcription.service";
import { listMeetings } from "@/services/meeting.service";

export const maxDuration = 300;

export async function GET() {
  const user = await getActiveUser();
  if (!user) return NextResponse.json({ meetings: [] });
  return NextResponse.json({ meetings: await listMeetings(user.id) });
}

export async function POST(request: Request) {
  const user = await getActiveUser();
  if (!user) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

  const form = await request.formData();
  const title = String(form.get("title") ?? "Untitled Meeting");
  const rawType = String(form.get("type") ?? "Team Sync");
  const type = (MEETING_TYPES as readonly string[]).includes(rawType) ? rawType : "Custom";
  const dateValue = String(form.get("date") ?? "");
  const date = dateValue ? new Date(dateValue) : new Date();
  const declaredParticipants = String(form.get("participants") ?? "")
    .split(",")
    .map((name) => name.trim())
    .filter(Boolean);

  const transcriptText = String(form.get("transcript") ?? "");
  const audioUrl = String(form.get("audioUrl") ?? "");
  const file = form.get("file");

  let segments = transcriptText ? parseTranscriptText(transcriptText) : [];
  let rawTranscript = transcriptText;

  if (!segments.length && file instanceof File) {
    if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
      return NextResponse.json({ error: `File exceeds ${MAX_FILE_SIZE_MB}MB` }, { status: 413 });
    }
    const extension = `.${file.name.split(".").pop()?.toLowerCase() ?? ""}`;
    if (AUDIO_EXTENSIONS.includes(extension)) {
      const transcribed = await transcribeAudio(file);
      if (!transcribed) {
        return NextResponse.json(
          { error: "Audio transcription requires OPENAI_API_KEY. Paste a transcript instead." },
          { status: 422 }
        );
      }
      segments = transcribed;
    } else {
      rawTranscript = await file.text();
      segments = parseTranscriptText(rawTranscript);
    }
  }

  if (!segments.length) {
    return NextResponse.json(
      { error: audioUrl ? "Recording URLs need a transcript or OPENAI_API_KEY to analyze." : "No transcript content provided." },
      { status: 400 }
    );
  }

  const meeting = await prisma.meeting.create({
    data: {
      title,
      type,
      date,
      duration: 0,
      status: "processing",
      audioUrl: audioUrl || null,
      transcriptRaw: rawTranscript || null,
      uploadedById: user.id,
      orgId: user.orgId,
    },
  });

  try {
    const analysis = await analyzeTranscript({ title, segments, declaredParticipants });
    await persistAnalysis(meeting.id, user.id, analysis);
  } catch (error) {
    console.error("[meetings] analysis failed", error);
    await prisma.meeting.update({ where: { id: meeting.id }, data: { status: "failed" } });
    return NextResponse.json({ error: "Analysis failed", id: meeting.id }, { status: 500 });
  }

  return NextResponse.json({ id: meeting.id, status: "ready" }, { status: 201 });
}
