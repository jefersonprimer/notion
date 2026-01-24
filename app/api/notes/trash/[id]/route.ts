import { NextRequest, NextResponse } from 'next/server';
import { permanentDeleteNoteUseCase, restoreNoteUseCase } from '@/api/main/factories/noteFactory';
import { getUserId } from '@/lib/auth';

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const userId = getUserId(req);
  if (!userId) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { id } = await params;
    await permanentDeleteNoteUseCase.execute({ id, userId });
    return new Response(null, { status: 204 });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 400 });
  }
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const userId = getUserId(req);
  if (!userId) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { id } = await params;
    // We assume PATCH to the trash endpoint means restore
    await restoreNoteUseCase.execute({ id, userId });
    return new Response(null, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 400 });
  }
}
