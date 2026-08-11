"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { Badge, statusLabel, statusTone } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardHeader } from "@/components/ui/card";
import { Field, Input, Select } from "@/components/ui/input";
import { Table, Td, Th } from "@/components/ui/table";

export interface ActionItemRecord {
  id: string;
  task: string;
  owner: string | null;
  dueDate: string | null;
  priority: string | null;
  status: string;
  source: string | null;
}

export function ActionItemsManager({
  meetingId,
  items,
  owners,
}: {
  meetingId: string;
  items: ActionItemRecord[];
  owners: string[];
}) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [bulkOwner, setBulkOwner] = useState("");
  const [newTask, setNewTask] = useState("");
  const [busy, setBusy] = useState(false);

  const rows = useMemo(
    () =>
      items.filter((item) => {
        const matchesQuery = !query || item.task.toLowerCase().includes(query.toLowerCase());
        const matchesStatus = statusFilter === "all" || item.status === statusFilter;
        return matchesQuery && matchesStatus;
      }),
    [items, query, statusFilter]
  );

  async function call(path: string, init: RequestInit) {
    setBusy(true);
    try {
      await fetch(path, { headers: { "Content-Type": "application/json" }, ...init });
      router.refresh();
    } finally {
      setBusy(false);
    }
  }

  async function update(id: string, patch: Record<string, unknown>) {
    await call(`/api/meetings/${meetingId}/action-items/${id}`, { method: "PUT", body: JSON.stringify(patch) });
  }

  async function bulkAssign() {
    if (!bulkOwner) return;
    setBusy(true);
    try {
      await Promise.all(
        items
          .filter((item) => !item.owner)
          .map((item) =>
            fetch(`/api/meetings/${meetingId}/action-items/${item.id}`, {
              method: "PUT",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ owner: bulkOwner, status: "todo" }),
            })
          )
      );
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
          <Field label="Search">
            <Input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search tasks…" />
          </Field>
          <Field label="Status">
            <Select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)}>
              <option value="all">All statuses</option>
              <option value="todo">To Do</option>
              <option value="in_progress">In Progress</option>
              <option value="done">Done</option>
              <option value="no_owner">No Owner</option>
            </Select>
          </Field>
          <Field label="Bulk assign unowned items">
            <div className="flex gap-2">
              <Select value={bulkOwner} onChange={(event) => setBulkOwner(event.target.value)}>
                <option value="">Select owner…</option>
                {owners.map((owner) => (
                  <option key={owner} value={owner}>
                    {owner}
                  </option>
                ))}
              </Select>
              <Button size="sm" variant="secondary" onClick={bulkAssign} disabled={busy || !bulkOwner}>
                Assign
              </Button>
            </div>
          </Field>
        </div>
      </Card>

      <Card>
        <CardHeader
          title={`Action Items (${rows.length})`}
          action={
            <a
              href={`/api/meetings/${meetingId}/export?format=csv`}
              className="rounded-lg border border-border px-3 py-1.5 text-xs text-white hover:bg-card-hover"
            >
              Export CSV
            </a>
          }
        />
        <Table>
          <thead>
            <tr>
              <Th className="w-8">#</Th>
              <Th className="w-10">Done</Th>
              <Th>Task</Th>
              <Th className="w-32">Owner</Th>
              <Th className="w-36">Due Date</Th>
              <Th className="w-28">Priority</Th>
              <Th className="w-28">Status</Th>
              <Th className="w-10" />
            </tr>
          </thead>
          <tbody>
            {rows.map((item, index) => (
              <tr key={item.id}>
                <Td className="text-muted">{index + 1}</Td>
                <Td>
                  <input
                    type="checkbox"
                    aria-label="Mark done"
                    className="accent-success"
                    checked={item.status === "done"}
                    onChange={(event) =>
                      update(item.id, { status: event.target.checked ? "done" : item.owner ? "todo" : "no_owner" })
                    }
                  />
                </Td>
                <Td>
                  <input
                    defaultValue={item.task}
                    onBlur={(event) => event.target.value !== item.task && update(item.id, { task: event.target.value })}
                    className="w-full bg-transparent text-sm text-white focus:outline-none"
                  />
                  {item.source ? <p className="mt-1 text-[11px] italic text-muted">“{item.source}”</p> : null}
                </Td>
                <Td>
                  <input
                    defaultValue={item.owner ?? ""}
                    placeholder="No owner"
                    onBlur={(event) =>
                      event.target.value !== (item.owner ?? "") &&
                      update(item.id, { owner: event.target.value || null })
                    }
                    className="w-full bg-transparent text-sm text-muted focus:outline-none"
                  />
                </Td>
                <Td>
                  <input
                    type="date"
                    defaultValue={item.dueDate ?? ""}
                    onChange={(event) => update(item.id, { dueDate: event.target.value || null })}
                    className="bg-transparent text-sm text-muted focus:outline-none"
                  />
                </Td>
                <Td>
                  <select
                    value={item.priority ?? "medium"}
                    onChange={(event) => update(item.id, { priority: event.target.value })}
                    className="bg-transparent text-sm text-muted focus:outline-none"
                  >
                    <option value="high">High</option>
                    <option value="medium">Medium</option>
                    <option value="low">Low</option>
                  </select>
                </Td>
                <Td>
                  <Badge tone={statusTone(item.status)}>{statusLabel(item.status)}</Badge>
                </Td>
                <Td>
                  <button
                    type="button"
                    aria-label="Delete action item"
                    disabled={busy}
                    onClick={() => call(`/api/meetings/${meetingId}/action-items/${item.id}`, { method: "DELETE" })}
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
            if (!newTask.trim()) return;
            void call(`/api/meetings/${meetingId}/action-items`, {
              method: "POST",
              body: JSON.stringify({ task: newTask }),
            });
            setNewTask("");
          }}
        >
          <Input
            className="max-w-md"
            placeholder="Add an action item…"
            value={newTask}
            onChange={(event) => setNewTask(event.target.value)}
          />
          <Button type="submit" size="sm" disabled={busy}>
            <Plus size={14} /> Add action item
          </Button>
        </form>
      </Card>
    </div>
  );
}
