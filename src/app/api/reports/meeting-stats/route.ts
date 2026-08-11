import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getActiveUser } from "@/lib/auth";

export async function GET() {
  const user = await getActiveUser();
  if (!user) return NextResponse.json({ stats: null });

  const aggregate = await prisma.meeting.aggregate({
    where: { uploadedById: user.id, status: "ready" },
    _count: true,
    _avg: { duration: true, healthScore: true },
    _sum: { duration: true },
  });

  return NextResponse.json({
    stats: {
      meetings: aggregate._count,
      totalSeconds: aggregate._sum.duration ?? 0,
      averageSeconds: Math.round(aggregate._avg.duration ?? 0),
      averageHealthScore: Math.round(aggregate._avg.healthScore ?? 0),
    },
  });
}
