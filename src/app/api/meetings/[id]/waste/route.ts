import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(_request: Request, { params }: { params: { id: string } }) {
  const wasteSegments = await prisma.wasteSegment.findMany({
    where: { meetingId: params.id },
    orderBy: { startTime: "asc" },
  });
  const total = wasteSegments.reduce(
    (sum, segment) => sum + (segment.endTime - segment.startTime) * (1 - segment.valueLevel),
    0
  );
  return NextResponse.json({ wasteSegments, wastedSeconds: Math.round(total) });
}
