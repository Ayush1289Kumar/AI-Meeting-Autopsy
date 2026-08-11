import { formatDuration, formatTimestamp } from "@/lib/utils";
import type { FullMeeting } from "@/services/meeting.service";

function csvCell(value: unknown): string {
  const text = value === null || value === undefined ? "" : String(value);
  return `"${text.replace(/"/g, '""')}"`;
}

export function meetingToCsv(meeting: FullMeeting): string {
  const rows: string[][] = [["section", "field1", "field2", "field3", "field4"]];
  rows.push(["meeting", meeting.title, meeting.type, formatDuration(meeting.duration), String(meeting.healthScore ?? "")]);
  for (const decision of meeting.decisions) {
    rows.push(["decision", decision.text, decision.owner ?? "", formatTimestamp(decision.timestamp), `${Math.round(decision.confidence * 100)}%`]);
  }
  for (const item of meeting.actionItems) {
    rows.push(["action_item", item.task, item.owner ?? "", item.dueDate ? item.dueDate.toISOString().slice(0, 10) : "", item.status]);
  }
  for (const problem of meeting.problems) {
    rows.push(["problem", problem.description, problem.severity, problem.timeImpact ? formatDuration(problem.timeImpact) : "", problem.recommendation ?? ""]);
  }
  for (const participant of meeting.participants) {
    rows.push(["participant", participant.name, formatDuration(participant.speakingTime ?? 0), `${(participant.speakingPct ?? 0).toFixed(1)}%`, ""]);
  }
  return rows.map((row) => row.map(csvCell).join(",")).join("\n");
}

/** Plain-text report used for the "PDF" export (printable from the browser). */
export function meetingToText(meeting: FullMeeting): string {
  const lines: string[] = [];
  lines.push(`AI MEETING AUTOPSY — ${meeting.title}`);
  lines.push(`Date: ${meeting.date.toISOString().slice(0, 10)}   Type: ${meeting.type}   Duration: ${formatDuration(meeting.duration)}`);
  lines.push(`Health score: ${meeting.healthScore ?? "n/a"}/100`);
  lines.push("");
  lines.push("SUMMARY");
  lines.push(meeting.aiSummary ?? "—");
  lines.push("");
  lines.push("DECISIONS");
  meeting.decisions.forEach((decision, index) => {
    lines.push(`${index + 1}. [${formatTimestamp(decision.timestamp)}] ${decision.text} — ${decision.owner ?? "unassigned"} (${Math.round(decision.confidence * 100)}%)`);
  });
  lines.push("");
  lines.push("ACTION ITEMS");
  meeting.actionItems.forEach((item, index) => {
    lines.push(`${index + 1}. ${item.task} — ${item.owner ?? "NO OWNER"} [${item.status}]`);
  });
  lines.push("");
  lines.push("PROBLEMS");
  meeting.problems.forEach((problem, index) => {
    lines.push(`${index + 1}. (${problem.severity}) ${problem.description}`);
  });
  lines.push("");
  lines.push("RECOMMENDATIONS");
  meeting.recommendations.forEach((recommendation, index) => {
    lines.push(`${index + 1}. ${recommendation.text}`);
  });
  return lines.join("\n");
}

/** HTML report used for the "PDF" export (printable from the browser). */
export function meetingToHtml(meeting: FullMeeting): string {
  const date = meeting.date.toISOString().slice(0, 10);
  const duration = formatDuration(meeting.duration);
  const score = meeting.healthScore ?? "n/a";

  const renderList = (items: string[]) => items.length ? `<ul>${items.map(i => `<li>${i}</li>`).join('')}</ul>` : '<p>None</p>';

  const decisions = meeting.decisions.map(d => `[${formatTimestamp(d.timestamp)}] <strong>${d.text}</strong> &mdash; ${d.owner ?? "unassigned"}`);
  const actions = meeting.actionItems.map(a => `<strong>${a.task}</strong> &mdash; ${a.owner ?? "NO OWNER"} [${a.status}]`);
  const problems = meeting.problems.map(p => `(${p.severity}) ${p.description}`);
  const recommendations = meeting.recommendations.map(r => r.text);

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>${meeting.title} - Meeting Autopsy Report</title>
  <style>
    body { font-family: system-ui, sans-serif; line-height: 1.6; color: #111; max-width: 800px; margin: 0 auto; padding: 40px 20px; }
    h1 { border-bottom: 2px solid #111; padding-bottom: 10px; margin-bottom: 30px; font-size: 2em; }
    h2 { color: #4f7cff; margin-top: 30px; border-bottom: 1px solid #eee; padding-bottom: 5px; font-size: 1.3em; }
    .meta { display: flex; gap: 20px; background: #f5f6fa; padding: 15px; border-radius: 8px; margin-bottom: 30px; }
    .meta div { flex: 1; }
    .meta strong { display: block; font-size: 0.8em; text-transform: uppercase; color: #666; margin-bottom: 4px; }
    ul { padding-left: 20px; }
    li { margin-bottom: 10px; }
    @media print {
      body { padding: 0; max-width: 100%; color: #000; }
      .meta { border: 1px solid #ddd; background: transparent; }
      h2 { color: #000; }
    }
  </style>
</head>
<body onload="window.print()">
  <h1>${meeting.title}</h1>
  <div class="meta">
    <div><strong>Date</strong> ${date}</div>
    <div><strong>Type</strong> ${meeting.type}</div>
    <div><strong>Duration</strong> ${duration}</div>
    <div><strong>Health Score</strong> ${score}/100</div>
  </div>
  
  <h2>Summary</h2>
  <p>${meeting.aiSummary ?? "&mdash;"}</p>
  
  <h2>Decisions</h2>
  ${renderList(decisions)}
  
  <h2>Action Items</h2>
  ${renderList(actions)}
  
  <h2>Problems Identified</h2>
  ${renderList(problems)}
  
  <h2>Recommendations</h2>
  ${renderList(recommendations)}
</body>
</html>`;
}
