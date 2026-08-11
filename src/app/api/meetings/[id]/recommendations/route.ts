import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(_request: Request, { params }: { params: { id: string } }) {
  const recommendations = await prisma.recommendation.findMany({ where: { meetingId: params.id } });
  return NextResponse.json({ recommendations });
}
