import { NextRequest, NextResponse } from 'next/server';
import { createUserUseCase } from '@/api/main/factories/userFactory';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, password } = body;
    const user = await createUserUseCase.execute({ displayName: name, email, password });
    return NextResponse.json(user, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 400 });
  }
}
