import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const template = await prisma.template.findUnique({
      where: { id },
      select: { workflows: true }
    });

    if (!template) {
      return NextResponse.json(
        { error: { code: 'NOT_FOUND', message: 'Template not found' } },
        { status: 404 }
      );
    }

    const rawWorkflows = template.workflows || [];
    const workflowNodes = (rawWorkflows as string[]).map((flowString: string, index: number) => {
      const parts = flowString.split('->').map((p: string) => p.trim());
      const trigger = parts[0] || 'Trigger Event';
      const action = parts[1] || 'Action Execution';

      return {
        id: `flow-${index}`,
        trigger: {
          id: `trigger-${index}`,
          label: trigger,
          type: trigger.toLowerCase().includes('click') || trigger.toLowerCase().includes('created') ? 'trigger' : 'event'
        },
        action: {
          id: `action-${index}`,
          label: action,
          type: action.toLowerCase().includes('send') || action.toLowerCase().includes('create') ? 'action' : 'task'
        }
      };
    });

    return NextResponse.json({ workflows: workflowNodes });
  } catch (error) {
    console.error('Error fetching template workflow:', error);
    return NextResponse.json(
      { error: { code: 'INTERNAL_ERROR', message: 'Internal server error' } },
      { status: 500 }
    );
  }
}
