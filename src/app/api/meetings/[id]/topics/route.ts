import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(_request: Request, { params }: { params: { id: string } }) {
  const topics = await prisma.topic.findMany({ where: { meetingId: params.id }, orderBy: { startTime: "asc" } });
  return NextResponse.json({ topics });
}
