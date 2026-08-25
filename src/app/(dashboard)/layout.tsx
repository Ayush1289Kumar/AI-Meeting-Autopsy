import { getActiveUser } from "@/lib/auth";
import { AppShell } from "@/components/layout/app-shell";
import { MeetingIntroLazy } from "@/components/intro/meeting-intro-lazy";



export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const user = await getActiveUser();

  return (
    <>
      {/* Plays once on first load, then unmounts itself. Leaves the dashboard untouched. */}
      <MeetingIntroLazy />
      <AppShell userName={user?.name ?? "Guest"}>{children}</AppShell>
    </>
  );
}
