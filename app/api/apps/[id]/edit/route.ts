import { NextRequest, NextResponse } from 'next/server';
import { EditInstructionSchema } from '@/lib/validations/appSchema';
import { parseInstruction } from '@/lib/services/mutationEngine';
import { applyAndPersistMutation } from '@/lib/services/schemaService';

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
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

    const result = await applyAndPersistMutation(id, mutation, instruction);

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
