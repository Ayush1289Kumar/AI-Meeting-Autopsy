import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getMeeting } from "@/services/meeting.service";

export async function GET(_request: Request, { params }: { params: { id: string } }) {
  const meeting = await getMeeting(params.id);
  if (!meeting) return NextResponse.json({ error: "Meeting not found" }, { status: 404 });
  return NextResponse.json({ meeting });
}

export async function DELETE(_request: Request, { params }: { params: { id: string } }) {
  const meeting = await prisma.meeting.findUnique({ where: { id: params.id } });
  if (!meeting) return NextResponse.json({ error: "Meeting not found" }, { status: 404 });
  await prisma.meeting.delete({ where: { id: params.id } });
  return NextResponse.json({ ok: true });
}
