import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { actionItemSchema } from "@/lib/validations";

export async function GET(_request: Request, { params }: { params: { id: string } }) {
  const actionItems = await prisma.actionItem.findMany({ where: { meetingId: params.id } });
  return NextResponse.json({ actionItems });
}

export async function POST(request: Request, { params }: { params: { id: string } }) {
  const parsed = actionItemSchema.safeParse(await request.json());
  if (!parsed.success) return NextResponse.json({ error: "Invalid action item" }, { status: 400 });

  const owner = parsed.data.owner ?? null;
  const actionItem = await prisma.actionItem.create({
    data: {
      meetingId: params.id,
      task: parsed.data.task,
      owner,
      dueDate: parsed.data.dueDate ? new Date(parsed.data.dueDate) : null,
      priority: parsed.data.priority ?? "medium",
      status: owner ? parsed.data.status : "no_owner",
      source: parsed.data.source ?? null,
    },
  });
  return NextResponse.json({ actionItem }, { status: 201 });
}
