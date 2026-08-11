import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(_request: Request, { params }: { params: { id: string } }) {
  const problems = await prisma.problem.findMany({ where: { meetingId: params.id } });
  return NextResponse.json({ problems });
}
