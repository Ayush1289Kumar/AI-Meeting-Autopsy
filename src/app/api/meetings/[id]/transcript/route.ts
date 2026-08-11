import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(_request: Request, { params }: { params: { id: string } }) {
  const segments = await prisma.transcriptSegment.findMany({
    where: { meetingId: params.id },
    orderBy: { startTime: "asc" },
  });
  return NextResponse.json({ transcript: segments });
}
