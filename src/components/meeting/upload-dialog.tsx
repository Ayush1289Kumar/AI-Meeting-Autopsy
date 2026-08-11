"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Dialog } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Field, Input, Select, Textarea } from "@/components/ui/input";
import { ProcessingStatus } from "@/components/meeting/processing-status";
import { ACCEPTED_FILE_EXTENSIONS, MEETING_TYPES, PROCESSING_STAGES } from "@/lib/constants";

type Mode = "file" | "text" | "url";

export function UploadDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const router = useRouter();
  const [mode, setMode] = useState<Mode>("text");
  const [title, setTitle] = useState("");
  const [type, setType] = useState<string>("Team Sync");
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [participants, setParticipants] = useState("");
  const [transcript, setTranscript] = useState("");
  const [url, setUrl] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [stage, setStage] = useState(-1);
  const [error, setError] = useState<string | null>(null);

  const submitting = stage >= 0;

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setError(null);
    setStage(0);

    const ticker = setInterval(
      () => setStage((current) => Math.min(current + 1, PROCESSING_STAGES.length - 1)),
      900
    );

    try {
      const body = new FormData();
      body.set("title", title || "Untitled Meeting");
      body.set("type", type);
      body.set("date", date);
      body.set("participants", participants);
      if (mode === "text") body.set("transcript", transcript);
      if (mode === "url") body.set("audioUrl", url);
      if (mode === "file" && file) body.set("file", file);

      const response = await fetch("/api/meetings", { method: "POST", body });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error ?? "Upload failed");

      onClose();
      router.push(`/dashboard?meeting=${payload.id}`);
      router.refresh();
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Upload failed");
    } finally {
      clearInterval(ticker);
      setStage(-1);
    }
  }

  return (
    <Dialog
      open={open}
      onClose={onClose}
      title="Upload New Meeting"
      description="Upload audio, paste a transcript, or link a recording. Analysis runs immediately."
    >
      <form className="space-y-4" onSubmit={submit}>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Meeting title">
            <Input value={title} onChange={(event) => setTitle(event.target.value)} placeholder="Weekly Team Sync" />
          </Field>
          <Field label="Meeting type">
            <Select value={type} onChange={(event) => setType(event.target.value)}>
              {MEETING_TYPES.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </Select>
          </Field>
          <Field label="Date">
            <Input type="date" value={date} onChange={(event) => setDate(event.target.value)} />
          </Field>
          <Field label="Participants (comma separated)">
            <Input
              value={participants}
              onChange={(event) => setParticipants(event.target.value)}
              placeholder="John, Sarah, Mike"
            />
          </Field>
        </div>

        <div className="flex gap-2">
          {(["text", "file", "url"] as Mode[]).map((value) => (
            <button
              key={value}
              type="button"
              onClick={() => setMode(value)}
              className={`rounded-lg border px-3 py-1.5 text-xs capitalize ${
                mode === value ? "border-brand bg-brand/15 text-white" : "border-border text-muted"
              }`}
            >
              {value === "text" ? "Paste transcript" : value === "file" ? "Upload file" : "Recording URL"}
            </button>
          ))}
        </div>

        {mode === "text" ? (
          <Field label="Transcript">
            <Textarea
              required
              value={transcript}
              onChange={(event) => setTranscript(event.target.value)}
              placeholder={"John: Let's start with project updates.\nSarah: The API is almost done."}
            />
          </Field>
        ) : null}

        {mode === "file" ? (
          <Field label={`Audio or transcript file (${ACCEPTED_FILE_EXTENSIONS.join(", ")})`}>
            <Input
              required
              type="file"
              accept={ACCEPTED_FILE_EXTENSIONS.join(",")}
              onChange={(event) => setFile(event.target.files?.[0] ?? null)}
            />
          </Field>
        ) : null}

        {mode === "url" ? (
          <Field label="Recording URL">
            <Input
              required
              type="url"
              value={url}
              onChange={(event) => setUrl(event.target.value)}
              placeholder="https://example.com/recording.mp3"
            />
          </Field>
        ) : null}

        {submitting ? <ProcessingStatus stage={stage} /> : null}
        {error ? <p className="text-xs text-danger">{error}</p> : null}

        <div className="flex justify-end gap-2 pt-2">
          <Button type="button" variant="secondary" onClick={onClose} disabled={submitting}>
            Cancel
          </Button>
          <Button type="submit" disabled={submitting}>
            {submitting ? "Analyzing…" : "Analyze Meeting"}
          </Button>
        </div>
      </form>
    </Dialog>
  );
}
