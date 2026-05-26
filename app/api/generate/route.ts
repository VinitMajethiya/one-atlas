import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { GenerateAppSchema } from '@/lib/validations/appSchema';
import { matchTemplate } from '@/lib/services/templateMatcher';
import { createAppFromTemplate } from '@/lib/services/schemaService';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = GenerateAppSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: { code: 'VALIDATION_ERROR', message: parsed.error.flatten() } },
        { status: 400 }
      );
    }

    const { prompt } = parsed.data;
    const templates = await prisma.template.findMany({
      select: { id: true, slug: true, name: true, tags: true, description: true, category: true },
    });

    const match = matchTemplate(prompt, templates);

    if (!match.templateId) {
      return NextResponse.json(
        { error: { code: 'NO_TEMPLATE_MATCH', message: match.suggestion } },
        { status: 422 }
      );
    }

    const templateMeta = templates.find((t: any) => t.id === match.templateId);
    const appName = `My ${templateMeta!.name}`;
    const result = await createAppFromTemplate(match.templateId, appName);

    return NextResponse.json({
      data: {
        appId: result.app.id,
        appName: result.app.name,
        schema: result.schema,
        templateUsed: result.templateUsed,
        confidence: match.confidence,
        matchedKeywords: match.matchedKeywords,
      },
    });
  } catch (err) {
    console.error('[/api/generate]', err);
    return NextResponse.json(
      { error: { code: 'INTERNAL_ERROR', message: 'Something went wrong.' } },
      { status: 500 }
    );
  }
}
