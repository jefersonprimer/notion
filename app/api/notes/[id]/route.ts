import { NextRequest, NextResponse } from 'next/server';
import { getNoteByIdUseCase, updateNoteUseCase, softDeleteNoteUseCase } from '@/api/main/factories/noteFactory';
import { getUserId } from '@/lib/auth';

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const userId = getUserId(req);
  if (!userId) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

  try {
    const { id } = await params;
    const note = await getNoteByIdUseCase.execute({ id, userId });
    if (!note) return NextResponse.json({ message: 'Note not found' }, { status: 404 });
    return NextResponse.json(note);
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 400 });
  }
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const userId = getUserId(req);
  if (!userId) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

  try {
    const { id } = await params;
    const body = await req.json();
    const { title, description } = body;
    const note = await updateNoteUseCase.execute({ id, userId, data: { title, description } });
    if (!note) return NextResponse.json({ message: 'Note not found' }, { status: 404 });
    return NextResponse.json(note);
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 400 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const userId = getUserId(req);
  if (!userId) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

  try {
    const { id } = await params;
    await softDeleteNoteUseCase.execute({ id, userId });
    return new Response(null, { status: 204 });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 400 });
  }
}