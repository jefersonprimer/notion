import { NextRequest, NextResponse } from 'next/server';
import { listChildNotesUseCase } from '@/api/main/factories/noteFactory';
import { getUserId } from '@/lib/auth';

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const userId = getUserId(req);
  if (!userId) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

  try {
    const { id } = await params;
    const notes = await listChildNotesUseCase.execute(id);
    return NextResponse.json(notes);
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 400 });
  }
}
