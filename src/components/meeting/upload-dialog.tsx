"use client";

import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { Dialog } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Field, Input, Select, Textarea } from "@/components/ui/input";
import { ProcessingStatus } from "@/components/meeting/processing-status";
import { ACCEPTED_FILE_EXTENSIONS, MEETING_TYPES, PROCESSING_STAGES } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { ClipboardPaste, FileAudio, Link as LinkIcon, UploadCloud, X } from "lucide-react";

type Mode = "file" | "text" | "url";

const MODE_TABS: { value: Mode; label: string; icon: typeof ClipboardPaste }[] = [
  { value: "text", label: "Paste transcript", icon: ClipboardPaste },
  { value: "file", label: "Upload file", icon: FileAudio },
  { value: "url", label: "Recording URL", icon: LinkIcon },
];

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

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
  const [dragging, setDragging] = useState(false);
  const [stage, setStage] = useState(-1);
  const [error, setError] = useState<string | null>(null);
  const dropzoneInputRef = useRef<HTMLInputElement>(null);

  const submitting = stage >= 0;
  const wordCount = transcript.trim() ? transcript.trim().split(/\s+/).length : 0;

  function handleDrop(event: React.DragEvent<HTMLLabelElement>) {
    event.preventDefault();
    setDragging(false);
    const dropped = event.dataTransfer.files?.[0];
    if (dropped) setFile(dropped);
  }

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

        {/* Mode tabs — proper pill tabs with icons and a clear active state */}
        <div className="flex gap-1.5 rounded-xl border border-border bg-white/[0.03] p-1" role="tablist" aria-label="Input mode">
          {MODE_TABS.map(({ value, label, icon: Icon }) => (
            <button
              key={value}
              type="button"
              role="tab"
              aria-selected={mode === value}
              onClick={() => setMode(value)}
              className={cn(
                "flex flex-1 items-center justify-center gap-1.5 rounded-lg px-2 py-1.5 text-xs font-medium transition-all duration-200",
                mode === value
                  ? "bg-brand/20 text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]"
                  : "text-muted hover:bg-white/5 hover:text-white"
              )}
            >
              <Icon size={13} className={mode === value ? "text-brand" : undefined} />
              {label}
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
            <span className="block text-right text-[10px] text-muted">
              {wordCount.toLocaleString()} {wordCount === 1 ? "word" : "words"}
            </span>
          </Field>
        ) : null}

        {mode === "file" ? (
          <div className="space-y-2">
            {file ? (
              /* File chip — name, size, and a way to clear the selection */
              <div className="flex items-center gap-2.5 rounded-xl border border-brand/30 bg-brand/10 px-3 py-2.5">
                <FileAudio size={16} className="shrink-0 text-brand" />
                <span className="min-w-0 flex-1 truncate text-xs font-medium text-white">{file.name}</span>
                <span className="shrink-0 text-[10px] text-muted">{formatBytes(file.size)}</span>
                <button
                  type="button"
                  aria-label="Remove selected file"
                  onClick={() => setFile(null)}
                  className="shrink-0 rounded-md p-1 text-muted transition-colors hover:bg-white/10 hover:text-white"
                >
                  <X size={13} />
                </button>
              </div>
            ) : (
              /* Drag-and-drop dropzone — first interaction new users hit */
              <label
                onDragOver={(event) => {
                  event.preventDefault();
                  setDragging(true);
                }}
                onDragLeave={() => setDragging(false)}
                onDrop={handleDrop}
                className={cn(
                  "flex cursor-pointer flex-col items-center gap-1.5 rounded-xl border border-dashed px-4 py-7 text-center transition-all duration-200",
                  dragging
                    ? "border-brand bg-brand/15 shadow-[0_0_24px_-6px_rgba(139,92,246,0.7)]"
                    : "border-border bg-white/[0.02] hover:border-brand/50 hover:bg-brand/5"
                )}
              >
                <UploadCloud
                  size={22}
                  className={cn("transition-transform duration-200", dragging ? "scale-110 text-brand" : "text-muted")}
                />
                <span className="text-xs font-semibold text-white">
                  {dragging ? "Drop to upload" : "Drag & drop a file here"}
                </span>
                <span className="text-[10px] text-muted">
                  or <span className="font-semibold text-brand">browse</span> — {ACCEPTED_FILE_EXTENSIONS.join(", ")}
                </span>
                <input
                  ref={dropzoneInputRef}
                  required
                  type="file"
                  accept={ACCEPTED_FILE_EXTENSIONS.join(",")}
                  onChange={(event) => setFile(event.target.files?.[0] ?? null)}
                  className="sr-only"
                />
              </label>
            )}
          </div>
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
