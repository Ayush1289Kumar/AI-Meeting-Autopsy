import { EmptyState } from "@/components/common/empty-state";
import { PageHero } from "@/components/common/page-hero";
import { SettingsForm } from "@/components/settings/settings-form";
import { getActiveUser } from "@/lib/auth";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  const user = await getActiveUser();
  if (!user) return <EmptyState />;

  const settings =
    (await prisma.settings.findUnique({ where: { userId: user.id } })) ??
    (await prisma.settings.create({ data: { userId: user.id } }));

  const org = user.orgId ? await prisma.org.findUnique({ where: { id: user.orgId }, include: { members: true } }) : null;
  const stats = await prisma.meeting.aggregate({
    where: { uploadedById: user.id },
    _count: true,
    _sum: { duration: true },
  });

  return (
    <div className="space-y-4">
      <PageHero
        icon="settings"
        eyebrow="Your workspace"
        title="Settings"
        subtitle="Preferences, AI behavior, and account details for your organization."
      />
      <SettingsForm
      user={{ name: user.name, email: user.email }}
      org={org ? { name: org.name, members: org.members.map((member) => member.name) } : null}
      settings={{
        defaultMeetingType: settings.defaultMeetingType,
        defaultParticipants: settings.defaultParticipants,
        llmModel: settings.llmModel,
        transcriptionLang: settings.transcriptionLang,
        customPrompt: settings.customPrompt,
        theme: settings.theme,
        accentColor: settings.accentColor,
      }}
      usage={{ meetings: stats._count, minutes: Math.round((stats._sum.duration ?? 0) / 60) }}
    />
    </div>
  );
}
