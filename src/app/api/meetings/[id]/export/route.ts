import { NextResponse } from "next/server";
import { getMeeting } from "@/services/meeting.service";
import { meetingToCsv, meetingToHtml } from "@/services/export.service";

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const meeting = await getMeeting(params.id);
  if (!meeting) return NextResponse.json({ error: "Meeting not found" }, { status: 404 });

  const format = new URL(request.url).searchParams.get("format") ?? "json";
  const slug = meeting.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

  if (format === "csv") {
    return new NextResponse(meetingToCsv(meeting), {
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="${slug}.csv"`,
      },
    });
  }

  if (format === "pdf") {
    // Served as a printable HTML report; the browser print dialog produces the PDF.
    return new NextResponse(meetingToHtml(meeting), {
      headers: {
        "Content-Type": "text/html; charset=utf-8",
      },
    });
  }

  return NextResponse.json(meeting, {
    headers: { "Content-Disposition": `attachment; filename="${slug}.json"` },
  });
}
