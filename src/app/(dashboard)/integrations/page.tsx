import { EmptyState } from "@/components/common/empty-state";
import { IntegrationsForm } from "@/components/integrations/integrations-form";
import { getActiveUser } from "@/lib/auth";
import { prisma } from "@/lib/db";



export default async function IntegrationsPage() {
  const user = await getActiveUser();
  if (!user) return <EmptyState />;

  const settings =
    (await prisma.settings.findUnique({ where: { userId: user.id } })) ??
    (await prisma.settings.create({ data: { userId: user.id } }));

  return (
    <IntegrationsForm
      settings={{
        llmModel: settings.llmModel,
        transcriptionLang: settings.transcriptionLang,
        customPrompt: settings.customPrompt,
      }}
    />
  );
}
