import { Card, CardFooterLink, CardHeader } from "@/components/ui/card";
import { Badge, statusLabel, statusTone } from "@/components/ui/badge";
import { Table, Td, Th } from "@/components/ui/table";

export interface ActionItemRow {
  id: string;
  task: string;
  owner: string | null;
  dueDate: Date | null;
  status: string;
}

export function ActionItemsTable({
  actionItems,
  href,
  limit = 5,
}: {
  actionItems: ActionItemRow[];
  href: string;
  limit?: number;
}) {
  return (
    <Card>
      <CardHeader
        title="Action Items"
        info="Follow-ups extracted from the transcript. Items without an owner are flagged in red."
      />
      {actionItems.length ? (
        <Table>
          <thead>
            <tr>
              <Th className="w-8">#</Th>
              <Th>Task</Th>
              <Th className="w-28">Owner</Th>
              <Th className="w-28">Due Date</Th>
              <Th className="w-28">Status</Th>
            </tr>
          </thead>
          <tbody>
            {actionItems.slice(0, limit).map((item, index) => (
              <tr key={item.id}>
                <Td className="text-muted">{index + 1}</Td>
                <Td className="text-white">{item.task}</Td>
                <Td>
                  {item.owner ? (
                    <span className="text-muted">{item.owner}</span>
                  ) : (
                    <Badge tone="red">No Owner</Badge>
                  )}
                </Td>
                <Td className="text-muted">
                  {item.dueDate ? new Date(item.dueDate).toISOString().slice(0, 10) : "—"}
                </Td>
                <Td>
                  <Badge tone={statusTone(item.status)}>{statusLabel(item.status)}</Badge>
                </Td>
              </tr>
            ))}
          </tbody>
        </Table>
      ) : (
        <p className="text-sm text-muted">No action items were detected in this meeting.</p>
      )}
      <CardFooterLink href={href} label="View all action items" />
    </Card>
  );
}
