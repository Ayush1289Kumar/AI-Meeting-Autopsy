import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getActiveUser } from "@/lib/auth";

export async function GET() {
  const user = await getActiveUser();
  if (!user) return NextResponse.json({ trend: [] });

  const meetings = await prisma.meeting.findMany({
    where: { uploadedById: user.id, status: "ready" },
    orderBy: { date: "asc" },
    select: { id: true, title: true, date: true, healthScore: true },
  });
  return NextResponse.json({ trend: meetings });
}
