import { NextRequest, NextResponse } from 'next/server';
import { searchNotesUseCase } from '@/api/main/factories/noteFactory';
import { getUserId } from '@/lib/auth';

export async function GET(req: NextRequest) {
  const userId = getUserId(req);
  if (!userId) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get('q') || '';
    const titleOnly = searchParams.get('titleOnly') === 'true';
    const sortBy = searchParams.get('sortBy') as any;
    const sortDirection = searchParams.get('sortDirection') as any;

    const notes = await searchNotesUseCase.execute({ 
      userId, 
      query, 
      titleOnly, 
      sortBy, 
      sortDirection 
    });
    return NextResponse.json(notes);
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 400 });
  }
}
