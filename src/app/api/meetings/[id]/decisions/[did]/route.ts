import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { decisionUpdateSchema } from "@/lib/validations";

export async function PUT(request: Request, { params }: { params: { id: string; did: string } }) {
  const parsed = decisionUpdateSchema.safeParse(await request.json());
  if (!parsed.success) return NextResponse.json({ error: "Invalid decision" }, { status: 400 });

  const decision = await prisma.decision.update({
    where: { id: params.did },
    data: {
      ...(parsed.data.text !== undefined ? { text: parsed.data.text } : {}),
      ...(parsed.data.owner !== undefined ? { owner: parsed.data.owner ?? null } : {}),
      ...(parsed.data.timestamp !== undefined ? { timestamp: parsed.data.timestamp } : {}),
      ...(parsed.data.confidence !== undefined ? { confidence: parsed.data.confidence } : {}),
      ...(parsed.data.context !== undefined ? { context: parsed.data.context ?? null } : {}),
    },
  });
  return NextResponse.json({ decision });
}

export async function DELETE(_request: Request, { params }: { params: { id: string; did: string } }) {
  await prisma.decision.delete({ where: { id: params.did } });
  return NextResponse.json({ ok: true });
}
