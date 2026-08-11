"use client";

import { useMemo, useRef, useState } from "react";
import { Copy, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input, Select } from "@/components/ui/input";
import { AudioPlayer } from "@/components/transcript/audio-player";
import { formatTimestamp } from "@/lib/utils";

export interface ViewerSegment {
  id: string;
  speaker: string;
  text: string;
  startTime: number;
  endTime: number;
}

export interface Highlight {
  type: "decision" | "action" | "waste";
  startTime: number;
  endTime: number;
  detail: string;
}

const HIGHLIGHT_STYLE = {
  decision: "border-l-2 border-brand bg-brand/10",
  action: "border-l-2 border-success bg-success/10",
  waste: "border-l-2 border-danger bg-danger/10",
} as const;

export function TranscriptViewer({
  segments,
  speakers,
  highlights,
  audioUrl,
}: {
  segments: ViewerSegment[];
  speakers: { name: string; color: string | null }[];
  highlights: Highlight[];
  audioUrl: string | null;
}) {
  const [query, setQuery] = useState("");
  const [speaker, setSpeaker] = useState("all");
  const [currentTime, setCurrentTime] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);

  const colors = useMemo(
    () => new Map(speakers.map((entry) => [entry.name, entry.color ?? "#8b8d9e"])),
    [speakers]
  );

  const visible = segments.filter((segment) => {
    const matchesSpeaker = speaker === "all" || segment.speaker === speaker;
    const matchesQuery = !query || segment.text.toLowerCase().includes(query.toLowerCase());
    return matchesSpeaker && matchesQuery;
  });

  function highlightFor(segment: ViewerSegment): Highlight | undefined {
    return highlights.find(
      (highlight) => segment.startTime >= highlight.startTime - 1 && segment.startTime <= highlight.endTime + 1
    );
  }

  function seek(seconds: number) {
    const audio = audioRef.current;
    if (!audio) return;
    audio.currentTime = seconds;
    void audio.play();
  }

  async function copyAll() {
    await navigator.clipboard.writeText(
      segments.map((segment) => `[${formatTimestamp(segment.startTime)}] ${segment.speaker}: ${segment.text}`).join("\n")
    );
  }

  return (
    <div className="space-y-4">
      {audioUrl ? <AudioPlayer ref={audioRef} src={audioUrl} onTime={setCurrentTime} /> : null}

      <div className="flex flex-wrap items-center gap-2">
        <Input
          className="max-w-xs"
          placeholder="Search transcript…"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />
        <Select className="max-w-[200px]" value={speaker} onChange={(event) => setSpeaker(event.target.value)}>
          <option value="all">All speakers</option>
          {speakers.map((entry) => (
            <option key={entry.name} value={entry.name}>
              {entry.name}
            </option>
          ))}
        </Select>
        <Button variant="secondary" size="sm" onClick={copyAll}>
          <Copy size={13} /> Copy
        </Button>
        <a
          href="?download=txt"
          download
          className="inline-flex h-8 items-center gap-2 rounded-lg border border-border px-3 text-xs text-white hover:bg-card-hover"
        >
          <Download size={13} /> .txt
        </a>
        <span className="text-xs text-muted">
          {visible.length} of {segments.length} segments
        </span>
      </div>

      <div className="max-h-[70vh] space-y-1 overflow-y-auto rounded-card border border-border bg-card p-3">
        {visible.map((segment) => {
          const highlight = highlightFor(segment);
          const active = currentTime >= segment.startTime && currentTime < segment.endTime;
          return (
            <p
              key={segment.id}
              className={`rounded px-3 py-2 text-sm ${highlight ? HIGHLIGHT_STYLE[highlight.type] : ""} ${
                active ? "ring-1 ring-brand" : ""
              }`}
              title={highlight?.detail}
            >
              <button
                type="button"
                onClick={() => seek(segment.startTime)}
                className="mr-2 text-xs text-muted hover:text-brand"
              >
                {formatTimestamp(segment.startTime)}
              </button>
              <span className="font-medium" style={{ color: colors.get(segment.speaker) ?? "#8b8d9e" }}>
                {segment.speaker}:
              </span>{" "}
              <span className="text-white">{highlightQuery(segment.text, query)}</span>
            </p>
          );
        })}
        {!visible.length ? <p className="p-4 text-sm text-muted">No matching transcript lines.</p> : null}
      </div>

      <div className="flex flex-wrap gap-3 text-[11px] text-muted">
        <span className="flex items-center gap-1">
          <span className="h-2 w-2 rounded-full bg-brand" /> Decision
        </span>
        <span className="flex items-center gap-1">
          <span className="h-2 w-2 rounded-full bg-success" /> Action item
        </span>
        <span className="flex items-center gap-1">
          <span className="h-2 w-2 rounded-full bg-danger" /> Wasted time
        </span>
      </div>
    </div>
  );
}

function highlightQuery(text: string, query: string) {
  if (!query) return text;
  const parts = text.split(new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`, "ig"));
  return parts.map((part, index) =>
    part.toLowerCase() === query.toLowerCase() ? (
      <mark key={index} className="rounded bg-warning/40 px-0.5 text-white">
        {part}
      </mark>
    ) : (
      <span key={index}>{part}</span>
    )
  );
}
