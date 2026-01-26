import { NextRequest, NextResponse } from 'next/server';
import { listNotesUseCase, createNoteUseCase, searchNotesUseCase, listFavoriteNotesUseCase } from '@/api/main/factories/noteFactory';
import { getUserId } from '@/lib/auth';

export async function GET(req: NextRequest) {
  const userId = getUserId(req);
  if (!userId) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const search = searchParams.get('search');
  const favorites = searchParams.get('favorites');

  try {
    if (search) {
      const notes = await searchNotesUseCase.execute({ userId, query: search });
      return NextResponse.json(notes);
    }
    if (favorites === 'true') {
      const notes = await listFavoriteNotesUseCase.execute(userId);
      return NextResponse.json(notes);
    }
    const notes = await listNotesUseCase.execute(userId);
    return NextResponse.json(notes);
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 400 });
  }
}

export async function POST(req: NextRequest) {
  const userId = getUserId(req);
  if (!userId) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { title, description, parentId } = body;
    const note = await createNoteUseCase.execute({ userId, title, description, parentId });
    return NextResponse.json(note, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 400 });
  }
}
