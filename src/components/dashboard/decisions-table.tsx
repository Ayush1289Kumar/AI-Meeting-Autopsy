import { Card, CardFooterLink, CardHeader } from "@/components/ui/card";
import { Badge, type BadgeTone } from "@/components/ui/badge";
import { Table, Td, Th } from "@/components/ui/table";
import { confidenceColor } from "@/lib/constants";
import { formatTimestamp } from "@/lib/utils";

export interface DecisionRow {
  id: string;
  text: string;
  owner: string | null;
  timestamp: number;
  confidence: number;
}

export function DecisionsTable({
  decisions,
  href,
  limit = 5,
}: {
  decisions: DecisionRow[];
  href: string;
  limit?: number;
}) {
  return (
    <Card>
      <CardHeader
        title="Decisions Made"
        info="Statements the analyzer classified as decisions, with the confidence of that classification."
      />
      {decisions.length ? (
        <Table>
          <thead>
            <tr>
              <Th className="w-8">#</Th>
              <Th>Decision</Th>
              <Th className="w-28">Owner</Th>
              <Th className="w-20">Time</Th>
              <Th className="w-24">Confidence</Th>
            </tr>
          </thead>
          <tbody>
            {decisions.slice(0, limit).map((decision, index) => (
              <tr key={decision.id}>
                <Td className="text-muted">{index + 1}</Td>
                <Td className="text-white">{decision.text}</Td>
                <Td className="text-muted">{decision.owner ?? "—"}</Td>
                <Td className="text-muted">{formatTimestamp(decision.timestamp)}</Td>
                <Td>
                  <Badge tone={confidenceColor(decision.confidence) as BadgeTone}>
                    {Math.round(decision.confidence * 100)}%
                  </Badge>
                </Td>
              </tr>
            ))}
          </tbody>
        </Table>
      ) : (
        <p className="text-sm text-muted">No decisions were detected in this meeting.</p>
      )}
      <CardFooterLink href={href} label="View all decisions" />
    </Card>
  );
}
