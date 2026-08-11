import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { actionItemUpdateSchema } from "@/lib/validations";

export async function PUT(request: Request, { params }: { params: { id: string; aid: string } }) {
  const parsed = actionItemUpdateSchema.safeParse(await request.json());
  if (!parsed.success) return NextResponse.json({ error: "Invalid action item" }, { status: 400 });

  const existing = await prisma.actionItem.findUnique({ where: { id: params.aid } });
  if (!existing) return NextResponse.json({ error: "Action item not found" }, { status: 404 });

  const owner = parsed.data.owner !== undefined ? parsed.data.owner ?? null : existing.owner;
  const requestedStatus = parsed.data.status ?? existing.status;
  // Business rule 3: an item without an owner is always no_owner.
  const status = owner ? (requestedStatus === "no_owner" ? "todo" : requestedStatus) : "no_owner";

  const actionItem = await prisma.actionItem.update({
    where: { id: params.aid },
    data: {
      ...(parsed.data.task !== undefined ? { task: parsed.data.task } : {}),
      owner,
      status,
      ...(parsed.data.dueDate !== undefined
        ? { dueDate: parsed.data.dueDate ? new Date(parsed.data.dueDate) : null }
        : {}),
      ...(parsed.data.priority !== undefined ? { priority: parsed.data.priority ?? null } : {}),
      ...(parsed.data.source !== undefined ? { source: parsed.data.source ?? null } : {}),
    },
  });
  return NextResponse.json({ actionItem });
}

export async function DELETE(_request: Request, { params }: { params: { id: string; aid: string } }) {
  await prisma.actionItem.delete({ where: { id: params.aid } });
  return NextResponse.json({ ok: true });
}
