# OneAtlas — Full-Stack Conversion Plan

> This document instructs the agent on exactly how to convert the existing OneAtlas frontend into a full-stack application with two core features working end-to-end:
>
> **Feature 1 — App Generation from Prompt** (prompt → template match → real app in DB → builder loads real schema)
> **Feature 2 — Conversational Schema Editing** (instruction → mutation engine → DB update → UI reflects change)
>
> The existing frontend (all 8 pages, builder shell, preview system) stays intact. We are adding a real database, API layer, and service logic on top of it.

---

## 0. Prerequisites

### Install new dependencies

```bash
npm install prisma @prisma/client zod nanoid
npm install -D @types/nanoid
npx prisma init
```

### Environment variables

Create `.env.local` in the project root:

```env
DATABASE_URL=postgresql://<user>:<password>@<host>/oneatlas?sslmode=require
NEXT_PUBLIC_APP_URL=http://localhost:3000
ADMIN_API_KEY=oneatlas-admin-secret
```

> `DATABASE_URL` is your Neon PostgreSQL connection string.
> `ADMIN_API_KEY` is used to protect the template creation endpoint.

---

## 1. Database Schema

### File: `prisma/schema.prisma`

Replace the default contents with:

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model Organization {
  id        String   @id @default(cuid())
  name      String
  slug      String   @unique
  users     User[]
  apps      App[]
  createdAt DateTime @default(now())
}

model User {
  id             String        @id @default(cuid())
  email          String        @unique
  name           String?
  organizationId String?
  organization   Organization? @relation(fields: [organizationId], references: [id])
  apps           App[]
  createdAt      DateTime      @default(now())
}

model App {
  id             String           @id @default(cuid())
  name           String
  userId         String?
  user           User?            @relation(fields: [userId], references: [id])
  organizationId String?
  organization   Organization?    @relation(fields: [organizationId], references: [id])
  templateId     String
  template       Template         @relation(fields: [templateId], references: [id])
  currentVersion Int              @default(1)
  schema         RuntimeSchema?
  versions       SchemaVersion[]
  mutations      SchemaMutation[]
  previews       PreviewSnapshot[]
  createdAt      DateTime         @default(now())
  updatedAt      DateTime         @updatedAt
}

model Template {
  id             String     @id @default(cuid())
  name           String
  slug           String     @unique
  category       String
  complexity     String
  description    String
  components     String[]
  tags           String[]
  schemaDefaults Json
  parentId       String?
  parent         Template?  @relation("TemplateInheritance", fields: [parentId], references: [id])
  children       Template[] @relation("TemplateInheritance")
  apps           App[]
  createdAt      DateTime   @default(now())
}

model RuntimeSchema {
  id        String   @id @default(cuid())
  appId     String   @unique
  app       App      @relation(fields: [appId], references: [id])
  content   Json
  version   Int      @default(1)
  updatedAt DateTime @updatedAt
}

model SchemaVersion {
  id        String   @id @default(cuid())
  appId     String
  app       App      @relation(fields: [appId], references: [id])
  version   Int
  content   Json
  createdAt DateTime @default(now())
}

model SchemaMutation {
  id           String   @id @default(cuid())
  appId        String
  app          App      @relation(fields: [appId], references: [id])
  instruction  String
  mutationType String
  result       String
  version      Int
  createdAt    DateTime @default(now())
}

model PreviewSnapshot {
  id        String    @id @default(cuid())
  appId     String
  app       App       @relation(fields: [appId], references: [id])
  token     String    @unique
  schema    Json
  expiresAt DateTime?
  createdAt DateTime  @default(now())
}
```

### Push schema to database

```bash
npx prisma db push
```

---

## 2. Prisma Client Singleton

### File: `lib/db.ts` ← NEW

```typescript
import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
```

> Always import Prisma from `@/lib/db`, never instantiate `new PrismaClient()` anywhere else.

---

## 3. Zod Validation Schemas

### File: `lib/validations/appSchema.ts` ← NEW

```typescript
import { z } from 'zod';

export const GenerateAppSchema = z.object({
  prompt: z.string().min(3).max(500),
});

export const EditInstructionSchema = z.object({
  instruction: z.string().min(2).max(300),
});

export const MutationPayloadSchema = z.object({
  type: z.enum([
    'add_field',
    'remove_field',
    'rename_field',
    'update_component_prop',
    'reorder_components',
  ]),
  componentId: z.string().optional(),
  fieldName: z.string().optional(),
  newFieldName: z.string().optional(),
  fieldType: z.string().optional(),
  propKey: z.string().optional(),
  propValue: z.unknown().optional(),
  order: z.array(z.string()).optional(),
});

export type GenerateAppInput = z.infer<typeof GenerateAppSchema>;
export type EditInstructionInput = z.infer<typeof EditInstructionSchema>;
export type MutationPayload = z.infer<typeof MutationPayloadSchema>;
```

---

## 4. Service Layer

These are pure functions with no HTTP logic. They are independently testable.

### File: `lib/services/templateMatcher.ts` ← NEW

```typescript
// Scores each template against the user's prompt using keyword matching.
// Returns the best match above a 0.3 confidence threshold.
// Returns null with a suggestion string if no template matches.

interface MatchResult {
  templateId: string | null;
  templateSlug: string | null;
  confidence: number;
  matchedKeywords: string[];
  suggestion: string | null;
}

interface TemplateMeta {
  id: string;
  slug: string;
  name: string;
  tags: string[];
  description: string;
  category: string;
}

const KEYWORD_MAP: Record<string, string[]> = {
  'crm-workspace':       ['crm', 'customer', 'contact', 'deal', 'sales', 'pipeline', 'lead'],
  'hr-dashboard':        ['hr', 'human resources', 'employee', 'hiring', 'onboarding', 'payroll', 'staff'],
  'admin-panel':         ['admin', 'panel', 'management', 'control', 'settings', 'users', 'roles'],
  'analytics-dashboard': ['analytics', 'chart', 'metrics', 'dashboard', 'revenue', 'kpi', 'report', 'data'],
  'inventory-system':    ['inventory', 'stock', 'warehouse', 'product', 'supply', 'sku', 'items'],
  'support-workspace':   ['support', 'ticket', 'helpdesk', 'customer service', 'issue', 'request'],
};

export function matchTemplate(prompt: string, templates: TemplateMeta[]): MatchResult {
  const lower = prompt.toLowerCase();
  let bestMatch: MatchResult = {
    templateId: null,
    templateSlug: null,
    confidence: 0,
    matchedKeywords: [],
    suggestion: null,
  };

  for (const template of templates) {
    const keywords = KEYWORD_MAP[template.slug] ?? template.tags;
    const matched = keywords.filter((kw) => lower.includes(kw));
    const confidence = matched.length / keywords.length;

    if (confidence > bestMatch.confidence) {
      bestMatch = {
        templateId: template.id,
        templateSlug: template.slug,
        confidence,
        matchedKeywords: matched,
        suggestion: null,
      };
    }
  }

  if (bestMatch.confidence < 0.3) {
    return {
      templateId: null,
      templateSlug: null,
      confidence: 0,
      matchedKeywords: [],
      suggestion:
        'Try describing what your app manages — e.g. "a dashboard to track sales deals" or "an HR tool for employee onboarding".',
    };
  }

  return bestMatch;
}
```

---

### File: `lib/services/mutationEngine.ts` ← NEW

```typescript
// Pure mutation engine — no DB access, no HTTP.
// Takes an existing schema object + a mutation payload.
// Returns a NEW schema object (never mutates in place).
// Also contains the instruction parser that maps natural language to MutationPayload.

import type { MutationPayload } from '@/lib/validations/appSchema';

// ── Types ──────────────────────────────────────────────────────────────────

export interface SchemaField {
  id: string;
  name: string;
  type: 'text' | 'number' | 'boolean' | 'date' | 'select';
  label: string;
  required: boolean;
  visible: boolean;
}

export interface ComponentNode {
  id: string;
  name: string;
  type: string;
  children: ComponentNode[];
  fields: SchemaField[];
  props: Record<string, string | number | boolean>;
}

export interface AppSchemaContent {
  appName: string;
  templateSlug: string;
  components: ComponentNode[];
}

// ── Instruction Parser ─────────────────────────────────────────────────────
// Maps natural language instructions to typed MutationPayload objects.
// Supports at least 5 distinct patterns.

export function parseInstruction(instruction: string): MutationPayload | null {
  const lower = instruction.toLowerCase().trim();

  // Pattern 1: "add a <fieldName> field" / "add <fieldName> column"
  const addMatch = lower.match(/add (?:a |an )?(.+?) (?:field|column)/);
  if (addMatch) {
    return {
      type: 'add_field',
      fieldName: addMatch[1].trim(),
      fieldType: 'text',
    };
  }

  // Pattern 2: "remove the <fieldName> field" / "delete <fieldName> column"
  const removeMatch = lower.match(/(?:remove|delete) (?:the )?(.+?) (?:field|column)/);
  if (removeMatch) {
    return { type: 'remove_field', fieldName: removeMatch[1].trim() };
  }

  // Pattern 3: "rename <oldName> to <newName>"
  const renameMatch = lower.match(/rename (.+?) to (.+)/);
  if (renameMatch) {
    return {
      type: 'rename_field',
      fieldName: renameMatch[1].trim(),
      newFieldName: renameMatch[2].trim(),
    };
  }

  // Pattern 4: "update <componentId> <propKey> to <propValue>"
  const updateMatch = lower.match(/update (.+?) (.+?) to (.+)/);
  if (updateMatch) {
    return {
      type: 'update_component_prop',
      componentId: updateMatch[1].trim(),
      propKey: updateMatch[2].trim(),
      propValue: updateMatch[3].trim(),
    };
  }

  // Pattern 5: "move <componentId> to top" / "reorder ..."
  const reorderMatch = lower.match(/(?:move|reorder) (.+?) to (top|bottom)/);
  if (reorderMatch) {
    return {
      type: 'reorder_components',
      componentId: reorderMatch[1].trim(),
      propValue: reorderMatch[2].trim(),
    };
  }

  return null;
}

// ── Mutation Applier ───────────────────────────────────────────────────────

export function applyMutation(
  schema: AppSchemaContent,
  mutation: MutationPayload
): AppSchemaContent {
  // Deep clone — never mutate in place
  const next: AppSchemaContent = JSON.parse(JSON.stringify(schema));

  switch (mutation.type) {
    case 'add_field': {
      if (!mutation.fieldName) break;
      const newField: SchemaField = {
        id: `field_${Date.now()}`,
        name: mutation.fieldName,
        type: (mutation.fieldType as SchemaField['type']) ?? 'text',
        label: mutation.fieldName.charAt(0).toUpperCase() + mutation.fieldName.slice(1),
        required: false,
        visible: true,
      };
      // Add to first component that has a fields array
      const target = next.components.find((c) => c.fields?.length >= 0);
      if (target) target.fields.push(newField);
      break;
    }

    case 'remove_field': {
      if (!mutation.fieldName) break;
      for (const comp of next.components) {
        comp.fields = comp.fields.filter(
          (f) => f.name.toLowerCase() !== mutation.fieldName!.toLowerCase()
        );
      }
      break;
    }

    case 'rename_field': {
      if (!mutation.fieldName || !mutation.newFieldName) break;
      for (const comp of next.components) {
        for (const field of comp.fields) {
          if (field.name.toLowerCase() === mutation.fieldName!.toLowerCase()) {
            field.name = mutation.newFieldName!;
            field.label =
              mutation.newFieldName!.charAt(0).toUpperCase() +
              mutation.newFieldName!.slice(1);
          }
        }
      }
      break;
    }

    case 'update_component_prop': {
      if (!mutation.componentId || !mutation.propKey) break;
      const comp = next.components.find(
        (c) => c.id === mutation.componentId || c.name.toLowerCase() === mutation.componentId!.toLowerCase()
      );
      if (comp && mutation.propValue !== undefined) {
        comp.props[mutation.propKey] = mutation.propValue as string | number | boolean;
      }
      break;
    }

    case 'reorder_components': {
      if (!mutation.componentId) break;
      const idx = next.components.findIndex(
        (c) => c.id === mutation.componentId || c.name.toLowerCase() === mutation.componentId!.toLowerCase()
      );
      if (idx === -1) break;
      const [moved] = next.components.splice(idx, 1);
      if (mutation.propValue === 'top') next.components.unshift(moved);
      else next.components.push(moved);
      break;
    }
  }

  return next;
}
```

---

### File: `lib/services/schemaService.ts` ← NEW

```typescript
// Handles DB operations for app schema: create, read, mutate, version, rollback.
// All mutations run inside Prisma transactions — partial writes never persist.

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

    const schemaContent = template.schemaDefaults as AppSchemaContent;

    await tx.runtimeSchema.create({
      data: { appId: app.id, content: schemaContent, version: 1 },
    });

    await tx.schemaVersion.create({
      data: { appId: app.id, version: 1, content: schemaContent },
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

    const currentContent = runtimeSchema.content as AppSchemaContent;
    const nextContent = applyMutation(currentContent, mutation);
    const nextVersion = runtimeSchema.version + 1;

    await tx.runtimeSchema.update({
      where: { appId },
      data: { content: nextContent, version: nextVersion },
    });

    await tx.schemaVersion.create({
      data: { appId, version: nextVersion, content: nextContent },
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
      data: { content: snapshot.content, version: nextVersion },
    });

    await tx.schemaVersion.create({
      data: { appId, version: nextVersion, content: snapshot.content },
    });

    await tx.app.update({
      where: { id: appId },
      data: { currentVersion: nextVersion },
    });

    return { schema: snapshot.content, version: nextVersion };
  });
}
```

---

## 5. API Routes

### File: `app/api/generate/route.ts` ← NEW

```typescript
// POST /api/generate
// Body: { prompt: string }
// Returns: { appId, appName, schema, templateUsed, confidence, matchedKeywords }

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

    const appName = `My ${templates.find((t) => t.id === match.templateId)!.name}`;
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
```

---

### File: `app/api/apps/[id]/route.ts` ← NEW

```typescript
// GET /api/apps/:id
// Returns: { app metadata, current schema, template info }

import { NextRequest, NextResponse } from 'next/server';
import { getAppWithSchema } from '@/lib/services/schemaService';

export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const app = await getAppWithSchema(params.id);
    return NextResponse.json({ data: app });
  } catch {
    return NextResponse.json(
      { error: { code: 'NOT_FOUND', message: 'App not found.' } },
      { status: 404 }
    );
  }
}
```

---

### File: `app/api/apps/[id]/edit/route.ts` ← NEW

```typescript
// POST /api/apps/:id/edit
// Body: { instruction: string }
// Returns: { schema, version, mutationType, instruction }

import { NextRequest, NextResponse } from 'next/server';
import { EditInstructionSchema } from '@/lib/validations/appSchema';
import { parseInstruction } from '@/lib/services/mutationEngine';
import { applyAndPersistMutation } from '@/lib/services/schemaService';

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await req.json();
    const parsed = EditInstructionSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: { code: 'VALIDATION_ERROR', message: parsed.error.flatten() } },
        { status: 400 }
      );
    }

    const { instruction } = parsed.data;
    const mutation = parseInstruction(instruction);

    if (!mutation) {
      return NextResponse.json(
        {
          error: {
            code: 'UNRECOGNIZED_INSTRUCTION',
            message:
              'Could not understand that instruction. Try: "Add a priority field", "Remove the notes column", or "Rename contact to client".',
          },
        },
        { status: 422 }
      );
    }

    const result = await applyAndPersistMutation(params.id, mutation, instruction);

    return NextResponse.json({
      data: {
        schema: result.schema,
        version: result.version,
        mutationType: mutation.type,
        instruction,
      },
    });
  } catch (err) {
    console.error('[/api/apps/edit]', err);
    return NextResponse.json(
      { error: { code: 'INTERNAL_ERROR', message: 'Something went wrong.' } },
      { status: 500 }
    );
  }
}
```

---

### File: `app/api/apps/[id]/history/route.ts` ← NEW

```typescript
// GET /api/apps/:id/history
// Returns: ordered list of mutations with instruction, type, version, timestamp

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const mutations = await prisma.schemaMutation.findMany({
      where: { appId: params.id },
      orderBy: { createdAt: 'asc' },
    });
    return NextResponse.json({ data: mutations });
  } catch {
    return NextResponse.json(
      { error: { code: 'NOT_FOUND', message: 'App not found.' } },
      { status: 404 }
    );
  }
}
```

---

### File: `app/api/apps/[id]/undo/route.ts` ← NEW

```typescript
// POST /api/apps/:id/undo
// Reverts to the previous schema version (currentVersion - 1)
// Returns: { schema, version }

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { rollbackToVersion } from '@/lib/services/schemaService';

export async function POST(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const app = await prisma.app.findUniqueOrThrow({ where: { id: params.id } });

    if (app.currentVersion <= 1) {
      return NextResponse.json(
        { error: { code: 'NO_HISTORY', message: 'Already at the initial version.' } },
        { status: 400 }
      );
    }

    const result = await rollbackToVersion(params.id, app.currentVersion - 1);
    return NextResponse.json({ data: result });
  } catch {
    return NextResponse.json(
      { error: { code: 'NOT_FOUND', message: 'App not found.' } },
      { status: 404 }
    );
  }
}
```

---

### File: `app/api/apps/[id]/preview/route.ts` ← NEW

```typescript
// POST /api/apps/:id/preview
// Freezes the current schema as a snapshot, returns a shareable token
// Returns: { previewUrl, token, createdAt }

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { nanoid } from 'nanoid';

export async function POST(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const runtimeSchema = await prisma.runtimeSchema.findUniqueOrThrow({
      where: { appId: params.id },
    });

    const token = nanoid(12);

    const snapshot = await prisma.previewSnapshot.create({
      data: {
        appId: params.id,
        token,
        schema: runtimeSchema.content,
      },
    });

    const previewUrl = `${process.env.NEXT_PUBLIC_APP_URL}/preview/${token}`;

    return NextResponse.json({
      data: { previewUrl, token, createdAt: snapshot.createdAt },
    });
  } catch {
    return NextResponse.json(
      { error: { code: 'NOT_FOUND', message: 'App not found.' } },
      { status: 404 }
    );
  }
}
```

---

### File: `app/api/preview/[token]/route.ts` ← NEW

```typescript
// GET /api/preview/:token
// Returns frozen schema for that snapshot (no auth required)

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(
  _req: NextRequest,
  { params }: { params: { token: string } }
) {
  try {
    const snapshot = await prisma.previewSnapshot.findUniqueOrThrow({
      where: { token: params.token },
    });
    return NextResponse.json({ data: { schema: snapshot.schema, createdAt: snapshot.createdAt } });
  } catch {
    return NextResponse.json(
      { error: { code: 'NOT_FOUND', message: 'Preview not found or token is invalid.' } },
      { status: 404 }
    );
  }
}
```

---

### File: `app/api/templates/route.ts` ← NEW

```typescript
// GET /api/templates?category=crm&complexity=moderate&page=1&limit=12
// Returns: paginated template list

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const category   = searchParams.get('category') ?? undefined;
  const complexity = searchParams.get('complexity') ?? undefined;
  const page       = parseInt(searchParams.get('page') ?? '1');
  const limit      = parseInt(searchParams.get('limit') ?? '12');

  const where = {
    ...(category   ? { category:   { equals: category,   mode: 'insensitive' as const } } : {}),
    ...(complexity ? { complexity: { equals: complexity, mode: 'insensitive' as const } } : {}),
  };

  const [templates, total] = await Promise.all([
    prisma.template.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { createdAt: 'desc' },
    }),
    prisma.template.count({ where }),
  ]);

  return NextResponse.json({
    data: templates,
    meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
  });
}
```

---

## 6. Seed Script

### File: `prisma/seed.ts` ← NEW

```typescript
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const templates = [
    {
      name: 'CRM Workspace',
      slug: 'crm-workspace',
      category: 'CRM',
      complexity: 'Moderate',
      description: 'A full CRM workspace with contacts, deals pipeline, and activity feed.',
      components: ['ContactsTable', 'DealsKanban', 'ActivityFeed', 'StatsBar'],
      tags: ['crm', 'customer', 'contact', 'deal', 'sales', 'pipeline', 'lead'],
      schemaDefaults: {
        appName: 'CRM Workspace',
        templateSlug: 'crm-workspace',
        components: [
          {
            id: 'stats-bar',
            name: 'StatsBar',
            type: 'layout',
            children: [],
            fields: [],
            props: { title: 'Overview' },
          },
          {
            id: 'contacts-table',
            name: 'ContactsTable',
            type: 'table',
            children: [],
            fields: [
              { id: 'f1', name: 'name',   type: 'text',   label: 'Name',   required: true,  visible: true },
              { id: 'f2', name: 'email',  type: 'text',   label: 'Email',  required: true,  visible: true },
              { id: 'f3', name: 'status', type: 'select', label: 'Status', required: false, visible: true },
            ],
            props: { title: 'Contacts' },
          },
          {
            id: 'deals-kanban',
            name: 'DealsKanban',
            type: 'kanban',
            children: [],
            fields: [
              { id: 'f4', name: 'deal',  type: 'text',   label: 'Deal',  required: true,  visible: true },
              { id: 'f5', name: 'value', type: 'number', label: 'Value', required: false, visible: true },
            ],
            props: { title: 'Deals Pipeline' },
          },
        ],
      },
    },
    {
      name: 'HR Dashboard',
      slug: 'hr-dashboard',
      category: 'HR',
      complexity: 'Simple',
      description: 'Manage employees, track hiring status, and run onboarding workflows.',
      components: ['EmployeeTable', 'HiringTracker', 'OnboardingChecklist'],
      tags: ['hr', 'human resources', 'employee', 'hiring', 'onboarding', 'payroll', 'staff'],
      schemaDefaults: {
        appName: 'HR Dashboard',
        templateSlug: 'hr-dashboard',
        components: [
          {
            id: 'employee-table',
            name: 'EmployeeTable',
            type: 'table',
            children: [],
            fields: [
              { id: 'f1', name: 'name',       type: 'text',   label: 'Name',       required: true,  visible: true },
              { id: 'f2', name: 'department', type: 'select', label: 'Department', required: false, visible: true },
              { id: 'f3', name: 'startDate',  type: 'date',   label: 'Start Date', required: false, visible: true },
            ],
            props: { title: 'Employees' },
          },
        ],
      },
    },
    {
      name: 'Admin Panel',
      slug: 'admin-panel',
      category: 'Admin',
      complexity: 'Simple',
      description: 'User management, role assignments, and system settings in one place.',
      components: ['UsersTable', 'RoleManager', 'SettingsPanel'],
      tags: ['admin', 'panel', 'management', 'control', 'settings', 'users', 'roles'],
      schemaDefaults: {
        appName: 'Admin Panel',
        templateSlug: 'admin-panel',
        components: [
          {
            id: 'users-table',
            name: 'UsersTable',
            type: 'table',
            children: [],
            fields: [
              { id: 'f1', name: 'name',  type: 'text',   label: 'Name',  required: true,  visible: true },
              { id: 'f2', name: 'email', type: 'text',   label: 'Email', required: true,  visible: true },
              { id: 'f3', name: 'role',  type: 'select', label: 'Role',  required: false, visible: true },
            ],
            props: { title: 'Users' },
          },
        ],
      },
    },
    {
      name: 'Analytics Dashboard',
      slug: 'analytics-dashboard',
      category: 'Analytics',
      complexity: 'Advanced',
      description: 'Revenue charts, KPI metrics, and user growth analytics with Recharts.',
      components: ['RevenueChart', 'KPIBar', 'UserGrowthLine', 'TrafficPie'],
      tags: ['analytics', 'chart', 'metrics', 'dashboard', 'revenue', 'kpi', 'report', 'data'],
      schemaDefaults: {
        appName: 'Analytics Dashboard',
        templateSlug: 'analytics-dashboard',
        components: [
          {
            id: 'kpi-bar',
            name: 'KPIBar',
            type: 'layout',
            children: [],
            fields: [],
            props: { title: 'KPIs' },
          },
          {
            id: 'revenue-chart',
            name: 'RevenueChart',
            type: 'chart',
            children: [],
            fields: [
              { id: 'f1', name: 'month',   type: 'text',   label: 'Month',   required: true, visible: true },
              { id: 'f2', name: 'revenue', type: 'number', label: 'Revenue', required: true, visible: true },
            ],
            props: { title: 'Revenue Over Time', chartType: 'area' },
          },
        ],
      },
    },
    {
      name: 'Inventory System',
      slug: 'inventory-system',
      category: 'Inventory',
      complexity: 'Moderate',
      description: 'Track stock levels, manage SKUs, and monitor warehouse supply.',
      components: ['ProductsTable', 'StockAlerts', 'WarehouseMap'],
      tags: ['inventory', 'stock', 'warehouse', 'product', 'supply', 'sku', 'items'],
      schemaDefaults: {
        appName: 'Inventory System',
        templateSlug: 'inventory-system',
        components: [
          {
            id: 'products-table',
            name: 'ProductsTable',
            type: 'table',
            children: [],
            fields: [
              { id: 'f1', name: 'sku',      type: 'text',   label: 'SKU',      required: true,  visible: true },
              { id: 'f2', name: 'name',     type: 'text',   label: 'Name',     required: true,  visible: true },
              { id: 'f3', name: 'quantity', type: 'number', label: 'Quantity', required: false, visible: true },
              { id: 'f4', name: 'status',   type: 'select', label: 'Status',   required: false, visible: true },
            ],
            props: { title: 'Products' },
          },
        ],
      },
    },
    {
      name: 'Support Workspace',
      slug: 'support-workspace',
      category: 'Support',
      complexity: 'Moderate',
      description: 'Helpdesk ticket management, customer request tracking, and issue resolution.',
      components: ['TicketsTable', 'StatusKanban', 'ResponseForm'],
      tags: ['support', 'ticket', 'helpdesk', 'customer service', 'issue', 'request'],
      schemaDefaults: {
        appName: 'Support Workspace',
        templateSlug: 'support-workspace',
        components: [
          {
            id: 'tickets-table',
            name: 'TicketsTable',
            type: 'table',
            children: [],
            fields: [
              { id: 'f1', name: 'subject',  type: 'text',   label: 'Subject',  required: true,  visible: true },
              { id: 'f2', name: 'status',   type: 'select', label: 'Status',   required: false, visible: true },
              { id: 'f3', name: 'priority', type: 'select', label: 'Priority', required: false, visible: true },
            ],
            props: { title: 'Support Tickets' },
          },
        ],
      },
    },
  ];

  for (const t of templates) {
    await prisma.template.upsert({
      where: { slug: t.slug },
      update: t,
      create: t,
    });
    console.log(`✓ Seeded: ${t.name}`);
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
```

Add to `package.json`:
```json
"prisma": {
  "seed": "ts-node --compiler-options {\"module\":\"CommonJS\"} prisma/seed.ts"
}
```

Run:
```bash
npx prisma db seed
```

---

## 7. Frontend Wiring — Modify Existing Files

### 7a. Builder page — load real schema on mount

**File: `app/builder/[appId]/page.tsx` ← MODIFY**

Replace the mock schema lookup with a real API fetch on mount:

```typescript
useEffect(() => {
  async function loadSchema() {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/apps/${appId}`);
      if (!res.ok) throw new Error('App not found');
      const { data } = await res.json();
      useBuilderStore.getState().setSchema(data.schema.content);
      useBuilderStore.getState().updateAppName(data.name);
    } catch {
      // Fallback to mock schema from data/builder.ts if API fails
      const fallback = BUILDER_SCHEMAS[templateSlug ?? 'crm-workspace'];
      useBuilderStore.getState().setSchema(fallback);
    } finally {
      // Let GeneratingOverlay finish its animation, then reveal builder
      setTimeout(() => setIsLoading(false), 2200);
    }
  }
  loadSchema();
}, [appId]);
```

### 7b. Conversational input — real POST /edit

**File: `components/builder/ConversationalInput.tsx` ← MODIFY**

Replace the mock submit with:

```typescript
async function handleSubmit() {
  if (!input.trim() || !appId) return;
  
  // Optimistic UI: add to history immediately
  addConversationEntry(input);
  setInput('');
  setProcessing(true);

  try {
    const res = await fetch(`/api/apps/${appId}/edit`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ instruction: input }),
    });

    const { data, error } = await res.json();

    if (!res.ok) {
      // Show error inline — did you mean suggestion
      setLastError(error?.message ?? 'Could not apply that instruction.');
      return;
    }

    // Update schema in Zustand with server response
    useBuilderStore.getState().setSchema(data.schema);
  } catch {
    setLastError('Network error. Please try again.');
  } finally {
    setProcessing(false);
  }
}
```

### 7c. TopBar — real preview snapshot

**File: `components/builder/TopBar.tsx` ← MODIFY**

Replace the localStorage preview with:

```typescript
async function handleShare() {
  setShareLoading(true);
  try {
    const res = await fetch(`/api/apps/${appId}/preview`, { method: 'POST' });
    const { data } = await res.json();
    await navigator.clipboard.writeText(data.previewUrl);
    setShareFeedback('Link copied!');
    setTimeout(() => setShareFeedback(null), 2000);
  } finally {
    setShareLoading(false);
  }
}
```

### 7d. Preview page — fetch from API not localStorage

**File: `app/preview/[token]/page.tsx` ← MODIFY**

Replace the Zustand localStorage lookup with:

```typescript
useEffect(() => {
  async function loadPreview() {
    try {
      const res = await fetch(`/api/preview/${token}`);
      if (!res.ok) { setNotFound(true); return; }
      const { data } = await res.json();
      setSchema(data.schema);
    } catch {
      setNotFound(true);
    } finally {
      setMounted(true);
    }
  }
  loadPreview();
}, [token]);
```

Remove the `usePreviewStore` import from this page entirely — it is no longer needed.

---

## 8. API Response Envelope

Every API route returns the same envelope shape. Frontend should always destructure `{ data, error }`:

```typescript
// Success
{ data: { ... } }

// Validation error
{ error: { code: 'VALIDATION_ERROR', message: { ... } } }

// Not found
{ error: { code: 'NOT_FOUND', message: 'string' } }

// Unrecognized instruction
{ error: { code: 'UNRECOGNIZED_INSTRUCTION', message: 'string' } }

// Internal error
{ error: { code: 'INTERNAL_ERROR', message: 'string' } }
```

---

## 9. What Stays Mock vs What Is Now Real

| Area | Before | After |
|---|---|---|
| Template list | `data/templates.ts` static | `GET /api/templates` from Neon DB |
| App creation | `nanoid` + no persistence | `POST /api/generate` → DB row + schema |
| Schema loading | `data/builder.ts` static | `GET /api/apps/[id]` from DB (fallback to static) |
| Conversational edit | Mock "Processing..." | `POST /api/apps/[id]/edit` → mutation engine → DB |
| Edit history | Zustand memory only | `GET /api/apps/[id]/history` from DB |
| Undo | Zustand state revert | `POST /api/apps/[id]/undo` → DB rollback |
| Preview snapshot | `localStorage` via Zustand | `POST /api/apps/[id]/preview` → DB token |
| Preview page | localStorage lookup | `GET /api/preview/[token]` from DB |

---

## 10. Final Setup Commands

```bash
# 1. Install new dependencies
npm install prisma @prisma/client zod nanoid

# 2. Push schema to Neon
npx prisma db push

# 3. Seed templates
npx prisma db seed

# 4. Run dev server
npm run dev

# 5. Verify build
npm run build
```
