import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(_request: Request, { params }: { params: { id: string } }) {
  const meeting = await prisma.meeting.findUnique({
    where: { id: params.id },
    select: { id: true, status: true, healthScore: true, updatedAt: true },
  });
  if (!meeting) return NextResponse.json({ error: "Meeting not found" }, { status: 404 });
  return NextResponse.json(meeting);
}
