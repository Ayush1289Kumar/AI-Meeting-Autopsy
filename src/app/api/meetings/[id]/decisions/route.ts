import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { decisionSchema } from "@/lib/validations";

export async function GET(_request: Request, { params }: { params: { id: string } }) {
  const decisions = await prisma.decision.findMany({
    where: { meetingId: params.id },
    orderBy: { timestamp: "asc" },
  });
  return NextResponse.json({ decisions });
}

export async function POST(request: Request, { params }: { params: { id: string } }) {
  const parsed = decisionSchema.safeParse(await request.json());
  if (!parsed.success) return NextResponse.json({ error: "Invalid decision" }, { status: 400 });

  const decision = await prisma.decision.create({
    data: {
      meetingId: params.id,
      text: parsed.data.text,
      owner: parsed.data.owner ?? null,
      timestamp: parsed.data.timestamp,
      confidence: parsed.data.confidence,
      context: parsed.data.context ?? null,
    },
  });
  return NextResponse.json({ decision }, { status: 201 });
}
