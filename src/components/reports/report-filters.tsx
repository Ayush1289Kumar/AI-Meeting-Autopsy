"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Card, CardHeader } from "@/components/ui/card";
import { Field, Input, Select } from "@/components/ui/input";

export function ReportFilters({ types }: { types: string[] }) {
  const router = useRouter();
  const params = useSearchParams();

  function update(key: string, value: string) {
    const next = new URLSearchParams(params.toString());
    if (value) next.set(key, value);
    else next.delete(key);
    router.push(`/reports?${next.toString()}`);
  }

  return (
    <Card>
      <CardHeader title="Report Filters" />
      <div className="grid gap-3 sm:grid-cols-3">
        <Field label="From">
          <Input type="date" defaultValue={params.get("from") ?? ""} onChange={(event) => update("from", event.target.value)} />
        </Field>
        <Field label="To">
          <Input type="date" defaultValue={params.get("to") ?? ""} onChange={(event) => update("to", event.target.value)} />
        </Field>
        <Field label="Meeting type">
          <Select defaultValue={params.get("type") ?? "all"} onChange={(event) => update("type", event.target.value)}>
            <option value="all">All types</option>
            {types.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </Select>
        </Field>
      </div>
    </Card>
  );
}
