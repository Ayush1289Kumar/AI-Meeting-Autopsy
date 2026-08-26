"use client";

import { useState } from "react";
import { Card, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Field, Input, Select } from "@/components/ui/input";
import { MEETING_TYPES } from "@/lib/constants";

export interface SettingsValues {
  defaultMeetingType: string;
  defaultParticipants: string | null;
  llmModel: string;
  transcriptionLang: string;
  customPrompt: string | null;
  theme: string;
  accentColor: string;
}

export function SettingsForm({
  user,
  org,
  settings,
  usage,
}: {
  user: { name: string; email: string };
  org: { name: string; members: string[] } | null;
  settings: SettingsValues;
  usage: { meetings: number; minutes: number };
}) {
  const [values, setValues] = useState<SettingsValues>(settings);
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);

  function set<K extends keyof SettingsValues>(key: K, value: SettingsValues[K]) {
    setValues((current) => ({ ...current, [key]: value }));
    setSaved(false);
  }

  async function save() {
    setSaving(true);
    try {
      await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      setSaved(true);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-4">
      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader title="Profile" />
          <div className="grid gap-3">
            <Field label="Name">
              <Input defaultValue={user.name} readOnly />
            </Field>
            <Field label="Email">
              <Input defaultValue={user.email} readOnly />
            </Field>
          </div>
        </Card>

        <Card>
          <CardHeader title="Organization" />
          {org ? (
            <div className="space-y-2 text-sm">
              <p className="text-white">{org.name}</p>
              <p className="text-xs text-muted">Members: {org.members.join(", ")}</p>
            </div>
          ) : (
            <p className="text-sm text-muted">No organization linked to this account.</p>
          )}
        </Card>

        <Card>
          <CardHeader title="Meeting Defaults" />
          <div className="grid gap-3">
            <Field label="Default meeting type">
              <Select
                value={values.defaultMeetingType}
                onChange={(event) => set("defaultMeetingType", event.target.value)}
              >
                {MEETING_TYPES.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </Select>
            </Field>
            <Field label="Default participants (comma separated)">
              <Input
                value={values.defaultParticipants ?? ""}
                onChange={(event) => set("defaultParticipants", event.target.value)}
              />
            </Field>
          </div>
        </Card>

        <Card>
          <CardHeader title="Usage" />
          <dl className="grid grid-cols-2 gap-3 text-sm">
            <div className="rounded-lg bg-white/5 p-3">
              <dt className="text-xs text-muted">Meetings analyzed</dt>
              <dd className="text-lg font-semibold text-white">{usage.meetings}</dd>
            </div>
            <div className="rounded-lg bg-white/5 p-3">
              <dt className="text-xs text-muted">Minutes transcribed</dt>
              <dd className="text-lg font-semibold text-white">{usage.minutes}</dd>
            </div>
          </dl>
          <p className="mt-3 text-xs text-muted">
            AI and API settings live on the <a href="/integrations" className="text-brand hover:underline">Integrations</a> page.
          </p>
        </Card>
      </div>

      <div className="flex items-center gap-3">
        <Button onClick={save} disabled={saving}>
          {saving ? "Saving…" : "Save settings"}
        </Button>
        {saved ? <span className="text-xs text-success">Settings saved.</span> : null}
      </div>
    </div>
  );
}
