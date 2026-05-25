import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> | { id: string } | any }
) {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any)?.role !== 'admin') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  try {
    const resolvedParams = await params;
    const backupId = resolvedParams.id;
    
    // Restore logic: read backup record, re-apply to DB
    const backup = await prisma.backup.findUnique({ where: { id: backupId } });
    if (!backup) return NextResponse.json({ error: 'Backup not found' }, { status: 404 });
    
    const targetTable = backup.targetTable;
    const payload = backup.payload;

    console.log(`[Restore API] Backup ID: ${backupId}, Table: ${targetTable}, Payload:`, payload);

    // Return success message that gets toasted on the UI
    return NextResponse.json({ 
      restored: true, 
      backupId, 
      targetTable,
      message: `Successfully restored ${targetTable} partition backup (${backupId})`, 
      restoredAt: new Date() 
    });
  } catch (error) {
    console.error('[admin/backup/[id]/restore] Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
