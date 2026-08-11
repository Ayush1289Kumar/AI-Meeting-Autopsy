"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { Badge, type BadgeTone } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardHeader } from "@/components/ui/card";
import { Field, Input, Select } from "@/components/ui/input";
import { Table, Td, Th } from "@/components/ui/table";
import { confidenceColor } from "@/lib/constants";
import { formatTimestamp } from "@/lib/utils";

export interface DecisionRecord {
  id: string;
  text: string;
  owner: string | null;
  timestamp: number;
  confidence: number;
  context: string | null;
}

type SortKey = "text" | "owner" | "timestamp" | "confidence";

export function DecisionsManager({
  meetingId,
  decisions,
  owners,
}: {
  meetingId: string;
  decisions: DecisionRecord[];
  owners: string[];
}) {
  const router = useRouter();
  const [sortKey, setSortKey] = useState<SortKey>("timestamp");
  const [ownerFilter, setOwnerFilter] = useState("all");
  const [minConfidence, setMinConfidence] = useState(0);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [newText, setNewText] = useState("");
  const [busy, setBusy] = useState(false);

  const rows = useMemo(() => {
    const filtered = decisions.filter((decision) => {
      const matchesOwner = ownerFilter === "all" || (decision.owner ?? "") === ownerFilter;
      return matchesOwner && decision.confidence * 100 >= minConfidence;
    });
    return [...filtered].sort((a, b) => {
      if (sortKey === "timestamp") return a.timestamp - b.timestamp;
      if (sortKey === "confidence") return b.confidence - a.confidence;
      return String(a[sortKey] ?? "").localeCompare(String(b[sortKey] ?? ""));
    });
  }, [decisions, ownerFilter, minConfidence, sortKey]);

  async function call(path: string, init: RequestInit) {
    setBusy(true);
    try {
      await fetch(path, { headers: { "Content-Type": "application/json" }, ...init });
      router.refresh();
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader title="Filters" />
        <div className="grid gap-3 sm:grid-cols-3">
          <Field label="Owner">
            <Select value={ownerFilter} onChange={(event) => setOwnerFilter(event.target.value)}>
              <option value="all">All owners</option>
              {owners.map((owner) => (
                <option key={owner} value={owner}>
                  {owner}
                </option>
              ))}
            </Select>
          </Field>
          <Field label={`Minimum confidence (${minConfidence}%)`}>
            <input
              type="range"
              min={0}
              max={100}
              value={minConfidence}
              onChange={(event) => setMinConfidence(Number(event.target.value))}
              className="w-full accent-brand"
            />
          </Field>
          <Field label="Sort by">
            <Select value={sortKey} onChange={(event) => setSortKey(event.target.value as SortKey)}>
              <option value="timestamp">Timestamp</option>
              <option value="confidence">Confidence</option>
              <option value="owner">Owner</option>
              <option value="text">Decision</option>
            </Select>
          </Field>
        </div>
      </Card>

      <Card>
        <CardHeader
          title={`Decisions (${rows.length})`}
          action={
            <div className="flex gap-2">
              <a
                href={`/api/meetings/${meetingId}/export?format=csv`}
                className="rounded-lg border border-border px-3 py-1.5 text-xs text-white hover:bg-card-hover"
              >
                Export CSV
              </a>
              <a
                href={`/api/meetings/${meetingId}/export?format=json`}
                className="rounded-lg border border-border px-3 py-1.5 text-xs text-white hover:bg-card-hover"
              >
                Export JSON
              </a>
            </div>
          }
        />
        <Table>
          <thead>
            <tr>
              <Th className="w-8">#</Th>
              <Th>Decision</Th>
              <Th className="w-32">Owner</Th>
              <Th className="w-20">Time</Th>
              <Th className="w-24">Confidence</Th>
              <Th className="w-20" />
            </tr>
          </thead>
          <tbody>
            {rows.map((decision, index) => (
              <tr key={decision.id}>
                <Td className="text-muted">{index + 1}</Td>
                <Td>
                  <input
                    defaultValue={decision.text}
                    onBlur={(event) =>
                      event.target.value !== decision.text &&
                      call(`/api/meetings/${meetingId}/decisions/${decision.id}`, {
                        method: "PUT",
                        body: JSON.stringify({ text: event.target.value }),
                      })
                    }
                    className="w-full bg-transparent text-sm text-white focus:outline-none"
                  />
                  <button
                    type="button"
                    className="mt-1 text-[11px] text-muted hover:text-brand"
                    onClick={() => setExpanded(expanded === decision.id ? null : decision.id)}
                  >
                    {expanded === decision.id ? "Hide context" : "Show context"}
                  </button>
                  {expanded === decision.id ? (
                    <p className="mt-1 border-l-2 border-border pl-2 text-xs italic text-muted">
                      {decision.context ?? "No surrounding context stored."}
                    </p>
                  ) : null}
                </Td>
                <Td>
                  <input
                    defaultValue={decision.owner ?? ""}
                    placeholder="Unassigned"
                    onBlur={(event) =>
                      event.target.value !== (decision.owner ?? "") &&
                      call(`/api/meetings/${meetingId}/decisions/${decision.id}`, {
                        method: "PUT",
                        body: JSON.stringify({ owner: event.target.value || null }),
                      })
                    }
                    className="w-full bg-transparent text-sm text-muted focus:outline-none"
                  />
                </Td>
                <Td className="text-muted">{formatTimestamp(decision.timestamp)}</Td>
                <Td>
                  <Badge tone={confidenceColor(decision.confidence) as BadgeTone}>
                    {Math.round(decision.confidence * 100)}%
                  </Badge>
                </Td>
                <Td>
                  <button
                    type="button"
                    aria-label="Delete decision"
                    disabled={busy}
                    onClick={() =>
                      call(`/api/meetings/${meetingId}/decisions/${decision.id}`, { method: "DELETE" })
                    }
                    className="text-muted hover:text-danger"
                  >
                    <Trash2 size={15} />
                  </button>
                </Td>
              </tr>
            ))}
          </tbody>
        </Table>

        <form
          className="mt-4 flex flex-wrap items-end gap-2"
          onSubmit={(event) => {
            event.preventDefault();
            if (!newText.trim()) return;
            void call(`/api/meetings/${meetingId}/decisions`, {
              method: "POST",
              body: JSON.stringify({ text: newText, confidence: 1, timestamp: 0 }),
            });
            setNewText("");
          }}
        >
          <Input
            className="max-w-md"
            placeholder="Add a decision the AI missed…"
            value={newText}
            onChange={(event) => setNewText(event.target.value)}
          />
          <Button type="submit" size="sm" disabled={busy}>
            <Plus size={14} /> Add decision
          </Button>
        </form>
      </Card>
    </div>
  );
}
