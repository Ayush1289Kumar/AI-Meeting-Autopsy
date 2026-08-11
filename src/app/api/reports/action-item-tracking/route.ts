import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getActiveUser } from "@/lib/auth";

export async function GET() {
  const user = await getActiveUser();
  if (!user) return NextResponse.json({ tracking: null });

  const items = await prisma.actionItem.findMany({
    where: { meeting: { uploadedById: user.id } },
    select: { status: true, dueDate: true },
  });

  const done = items.filter((item) => item.status === "done").length;
  const overdue = items.filter(
    (item) => item.dueDate && item.status !== "done" && item.dueDate < new Date()
  ).length;

  return NextResponse.json({
    tracking: {
      total: items.length,
      done,
      overdue,
      completionRate: items.length ? Math.round((done / items.length) * 100) : 0,
    },
  });
}
