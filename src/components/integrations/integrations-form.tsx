"use client";

import { useState } from "react";
import { Card, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Field, Input, Select, Textarea } from "@/components/ui/input";

const LLM_MODELS = [
  "auto",
  "meta-llama/Llama-3.1-8B-Instruct",
  "meta-llama/Llama-3.1-70B-Instruct",
  "deepseek-ai/DeepSeek-V3-0324",
];

export interface IntegrationsValues {
  llmModel: string;
  transcriptionLang: string;
  customPrompt: string | null;
}

export function IntegrationsForm({ settings }: { settings: IntegrationsValues }) {
  const [values, setValues] = useState<IntegrationsValues>(settings);
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [testingConnection, setTestingConnection] = useState(false);
  const [testResult, setTestResult] = useState<{
    huggingface?: { success: boolean; message: string };
    whisper?: { success: boolean; message: string };
  } | null>(null);

  function set<K extends keyof IntegrationsValues>(key: K, value: IntegrationsValues[K]) {
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
        huggingface: { success: false, message: "An unexpected error occurred." },
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
          <CardHeader title="AI Settings" />
          <div className="grid gap-3">
            <Field label="LLM model">
              <Select
                value={LLM_MODELS.includes(values.llmModel) ? values.llmModel : "meta-llama/Llama-3.1-8B-Instruct"}
                onChange={(event) => set("llmModel", event.target.value)}
              >
                {LLM_MODELS.map((model) => (
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
                  {testResult.huggingface ? (
                    <div className="flex items-start gap-2">
                      <span className="text-muted font-medium w-24">LLM (Hugging Face):</span>
                      <span className={testResult.huggingface.success ? "text-success" : "text-danger"}>
                        {testResult.huggingface.message}
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
          <CardHeader title="Upcoming Integrations" />
          <div className="grid gap-3">
            {[
              { name: "Google Calendar", description: "Auto-import scheduled meetings" },
              { name: "Zoom / Google Meet", description: "One-click meeting capture" },
              { name: "Slack / Teams", description: "Push action items to channels" },
              { name: "Jira / Linear", description: "Sync action items to your board" },
            ].map((integration) => (
              <div
                key={integration.name}
                className="flex items-center justify-between rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2.5"
              >
                <div>
                  <p className="text-sm font-medium text-white">{integration.name}</p>
                  <p className="text-xs text-muted">{integration.description}</p>
                </div>
                <span className="rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-muted">
                  Planned
                </span>
              </div>
            ))}
            <p className="text-xs text-muted">
              These integrations are planned but not part of this version.
            </p>
          </div>
        </Card>
      </div>

      <div className="flex items-center gap-3">
        <Button onClick={save} disabled={saving}>
          {saving ? "Saving…" : "Save integrations"}
        </Button>
        {saved ? <span className="text-xs text-success">Integrations saved.</span> : null}
      </div>
    </div>
  );
}

