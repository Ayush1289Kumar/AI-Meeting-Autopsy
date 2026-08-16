"use client";

import { useState } from "react";
import { Card, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Field, Input, Select, Textarea } from "@/components/ui/input";
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
  const [testingConnection, setTestingConnection] = useState(false);
  const [testResult, setTestResult] = useState<{
    nvidia?: { success: boolean; message: string };
    whisper?: { success: boolean; message: string };
  } | null>(null);

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
      document.documentElement.classList.toggle("light", values.theme === "light");
      setSaved(true);
    } finally {
      setSaving(false);
    }
  }

  async function testConnection() {
    setTestingConnection(true);
    setTestResult(null);
    try {
      const response = await fetch("/api/settings/test-connection", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ model: values.llmModel }),
      });
      const data = await response.json();
      setTestResult(data);
    } catch {
      setTestResult({
        nvidia: { success: false, message: "An unexpected error occurred." },
        whisper: { success: false, message: "An unexpected error occurred." },
      });
    } finally {
      setTestingConnection(false);
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
          <CardHeader title="AI Settings" />
          <div className="grid gap-3">
            <Field label="LLM model">
              <Select value={values.llmModel} onChange={(event) => set("llmModel", event.target.value)}>
                {[
                  "auto",
                  "nvidia/llama-3.1-nemotron-51b-instruct",
                  "meta/llama-3.1-70b-instruct",
                  "mock"
                ].map((model) => (
                  <option key={model} value={model}>
                    {model}
                  </option>
                ))}
              </Select>
            </Field>
            
            <div className="mt-1 flex flex-col gap-2">
              <div>
                <Button type="button" onClick={testConnection} disabled={testingConnection} className="bg-brand/20 border border-brand/40 hover:bg-brand/35 text-white text-xs px-3 py-1">
                  {testingConnection ? "Testing APIs..." : "Test AI Connections"}
                </Button>
              </div>
              {testResult ? (
                <div className="grid gap-1 text-xs">
                  {testResult.nvidia ? (
                    <div className="flex items-start gap-2">
                      <span className="text-muted font-medium w-24">LLM (NVIDIA):</span>
                      <span className={testResult.nvidia.success ? "text-success" : "text-danger"}>
                        {testResult.nvidia.message}
                      </span>
                    </div>
                  ) : null}
                  {testResult.whisper ? (
                    <div className="flex items-start gap-2">
                      <span className="text-muted font-medium w-24">Audio (Whisper):</span>
                      <span className={testResult.whisper.success ? "text-success" : "text-danger"}>
                        {testResult.whisper.message}
                      </span>
                    </div>
                  ) : null}
                </div>
              ) : null}
            </div>
            <Field label="Transcription language">
              <Input
                value={values.transcriptionLang}
                onChange={(event) => set("transcriptionLang", event.target.value)}
              />
            </Field>
            <Field label="Custom analysis focus prompt">
              <Textarea
                value={values.customPrompt ?? ""}
                onChange={(event) => set("customPrompt", event.target.value)}
                placeholder="e.g. focus on risks and blockers"
              />
            </Field>
          </div>
        </Card>

        <Card>
          <CardHeader title="Appearance" />
          <div className="grid gap-3">
            <Field label="Theme">
              <Select value={values.theme} onChange={(event) => set("theme", event.target.value)}>
                <option value="dark">Dark</option>
                <option value="light">Light</option>
              </Select>
            </Field>
            <Field label="Accent color">
              <Input type="color" value={values.accentColor} onChange={(event) => set("accentColor", event.target.value)} />
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
            Integrations (Google Calendar, Jira, Slack, Zoom) are planned but not part of this version.
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
