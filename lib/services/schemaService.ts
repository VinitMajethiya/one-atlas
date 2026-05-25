import { prisma } from '@/lib/db';
import { applyMutation, type AppSchemaContent } from './mutationEngine';
import type { MutationPayload } from '@/lib/validations/appSchema';

export async function createAppFromTemplate(
  templateId: string,
  appName: string,
  userId?: string
) {
  const template = await prisma.template.findUniqueOrThrow({
    where: { id: templateId },
  });

  return prisma.$transaction(async (tx) => {
    const app = await tx.app.create({
      data: {
        name: appName,
        templateId,
        userId: userId ?? null,
        currentVersion: 1,
      },
    });

    const schemaContent = template.schemaDefaults as unknown as AppSchemaContent;

    await tx.runtimeSchema.create({
      data: { appId: app.id, content: schemaContent as any, version: 1 },
    });

    await tx.schemaVersion.create({
      data: { appId: app.id, version: 1, content: schemaContent as any },
    });

    return { app, schema: schemaContent, templateUsed: template.slug };
  });
}

export async function getAppWithSchema(appId: string) {
  return prisma.app.findUniqueOrThrow({
    where: { id: appId },
    include: { schema: true, template: true },
  });
}

export async function applyAndPersistMutation(
  appId: string,
  mutation: MutationPayload,
  instruction: string
) {
  return prisma.$transaction(async (tx) => {
    const runtimeSchema = await tx.runtimeSchema.findUniqueOrThrow({
      where: { appId },
    });

    const currentContent = runtimeSchema.content as unknown as AppSchemaContent;
    const nextContent = applyMutation(currentContent, mutation);
    const nextVersion = runtimeSchema.version + 1;

    await tx.runtimeSchema.update({
      where: { appId },
      data: { content: nextContent as any, version: nextVersion },
    });

    await tx.schemaVersion.create({
      data: { appId, version: nextVersion, content: nextContent as any },
    });

    await tx.schemaMutation.create({
      data: {
        appId,
        instruction,
        mutationType: mutation.type,
        result: 'success',
        version: nextVersion,
      },
    });

    await tx.app.update({
      where: { id: appId },
      data: { currentVersion: nextVersion },
    });

    return { schema: nextContent, version: nextVersion };
  });
}

export async function rollbackToVersion(appId: string, targetVersion: number) {
  return prisma.$transaction(async (tx) => {
    const snapshot = await tx.schemaVersion.findFirstOrThrow({
      where: { appId, version: targetVersion },
    });

    const current = await tx.runtimeSchema.findUniqueOrThrow({ where: { appId } });
    const nextVersion = current.version + 1;

    await tx.runtimeSchema.update({
      where: { appId },
      data: { content: snapshot.content as any, version: nextVersion },
    });

    await tx.schemaVersion.create({
      data: { appId, version: nextVersion, content: snapshot.content as any },
    });

    await tx.app.update({
      where: { id: appId },
      data: { currentVersion: nextVersion },
    });

    return { schema: snapshot.content as unknown as AppSchemaContent, version: nextVersion };
  });
}
