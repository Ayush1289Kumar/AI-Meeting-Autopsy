import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getActiveUser } from "@/lib/auth";
import { settingsSchema } from "@/lib/validations";

export async function GET() {
  const user = await getActiveUser();
  if (!user) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

  const settings =
    (await prisma.settings.findUnique({ where: { userId: user.id } })) ??
    (await prisma.settings.create({ data: { userId: user.id } }));

  return NextResponse.json({ settings });
}

export async function PUT(request: Request) {
  const user = await getActiveUser();
  if (!user) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

  const parsed = settingsSchema.safeParse(await request.json());
  if (!parsed.success) return NextResponse.json({ error: "Invalid settings" }, { status: 400 });

  const settings = await prisma.settings.upsert({
    where: { userId: user.id },
    create: { userId: user.id, ...parsed.data },
    update: parsed.data,
  });

  return NextResponse.json({ settings });
}
