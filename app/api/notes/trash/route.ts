import { NextRequest, NextResponse } from 'next/server';
import { listDeletedNotesUseCase } from '@/api/main/factories/noteFactory';
import { getUserId } from '@/lib/auth';

export async function GET(req: NextRequest) {
  const userId = getUserId(req);
  if (!userId) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const notes = await listDeletedNotesUseCase.execute(userId);
    return NextResponse.json(notes);
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 400 });
  }
}
