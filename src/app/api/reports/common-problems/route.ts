import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getActiveUser } from "@/lib/auth";

export async function GET() {
  const user = await getActiveUser();
  if (!user) return NextResponse.json({ problems: [] });

  const problems = await prisma.problem.findMany({
    where: { meeting: { uploadedById: user.id } },
    select: { description: true, severity: true },
  });

  const counts = new Map<string, number>();
  for (const problem of problems) {
    const key = problem.description.replace(/\(.*?\)/g, "").replace(/\d+/g, "N").trim();
    counts.set(key, (counts.get(key) ?? 0) + 1);
  }

  return NextResponse.json({
    problems: [...counts.entries()]
      .map(([description, count]) => ({ description, count }))
      .sort((a, b) => b.count - a.count),
  });
}
