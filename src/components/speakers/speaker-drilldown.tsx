"use client";

import { useState } from "react";
import { Card, CardHeader } from "@/components/ui/card";
import { formatTimestamp } from "@/lib/utils";

export function SpeakerDrilldown({
  participants,
  segments,
  decisions,
  actionItems,
}: {
  participants: string[];
  segments: { id: string; speaker: string; text: string; startTime: number }[];
  decisions: { id: string; text: string; owner: string | null }[];
  actionItems: { id: string; task: string; owner: string | null }[];
}) {
  const [selected, setSelected] = useState(participants[0] ?? "");

  const statements = segments.filter((segment) => segment.speaker === selected);
  const ownedDecisions = decisions.filter((decision) => decision.owner === selected);
  const ownedActions = actionItems.filter((item) => item.owner === selected);

  return (
    <Card>
      <CardHeader title="Individual Speaker Drilldown" />
      <div className="mb-4 flex flex-wrap gap-2">
        {participants.map((name) => (
          <button
            key={name}
            type="button"
            onClick={() => setSelected(name)}
            className={`rounded-lg border px-3 py-1.5 text-xs ${
              selected === name ? "border-brand bg-brand/15 text-white" : "border-border text-muted"
            }`}
          >
            {name}
          </button>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <h3 className="mb-2 text-xs font-medium uppercase tracking-wide text-muted">Statements</h3>
          <div
            data-lenis-prevent
            className="max-h-72 space-y-1 overflow-y-auto rounded-lg border border-border p-2"
          >
            {statements.length ? (
              statements.map((segment) => (
                <p key={segment.id} className="text-sm text-white">
                  <span className="mr-2 text-xs text-muted">{formatTimestamp(segment.startTime)}</span>
                  {segment.text}
                </p>
              ))
            ) : (
              <p className="p-2 text-sm text-muted">This participant never spoke.</p>
            )}
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <h3 className="mb-2 text-xs font-medium uppercase tracking-wide text-muted">Decisions owned</h3>
            <ul className="space-y-1 text-sm text-white">
              {ownedDecisions.length ? (
                ownedDecisions.map((decision) => <li key={decision.id}>• {decision.text}</li>)
              ) : (
                <li className="text-muted">None</li>
              )}
            </ul>
          </div>
          <div>
            <h3 className="mb-2 text-xs font-medium uppercase tracking-wide text-muted">Action items</h3>
            <ul className="space-y-1 text-sm text-white">
              {ownedActions.length ? (
                ownedActions.map((item) => <li key={item.id}>• {item.task}</li>)
              ) : (
                <li className="text-muted">None</li>
              )}
            </ul>
          </div>
        </div>
      </div>
    </Card>
  );
}
