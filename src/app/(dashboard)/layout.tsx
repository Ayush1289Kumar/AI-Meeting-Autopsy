import { getActiveUser } from "@/lib/auth";
import { AppShell } from "@/components/layout/app-shell";
import { MeetingIntro } from "@/components/intro/MeetingIntro";



export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const user = await getActiveUser();

  return (
    <>
      {/* Plays once on first load, then unmounts itself. Leaves the dashboard untouched. */}
      <MeetingIntro />
      <AppShell userName={user?.name ?? "Guest"}>{children}</AppShell>
    </>
  );
}
