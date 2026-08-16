import { prisma } from "@/lib/db";
import { getActiveUser } from "@/lib/auth";
import { AppShell } from "@/components/layout/app-shell";



export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const user = await getActiveUser();

  const meetings = user
    ? await prisma.meeting.findMany({
        where: { uploadedById: user.id },
        orderBy: { date: "desc" },
        select: {
          id: true,
          title: true,
          date: true,
          _count: { select: { decisions: true, actionItems: true } },
        },
      })
    : [];

  return (
    <AppShell
      userName={user?.name ?? "Guest"}
      meetings={meetings.map((meeting) => ({
        id: meeting.id,
        title: meeting.title,
        date: meeting.date.toISOString().slice(0, 10),
        decisions: meeting._count.decisions,
        actionItems: meeting._count.actionItems,
      }))}
    >
      {children}
    </AppShell>
  );
}
