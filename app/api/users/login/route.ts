import { NextRequest, NextResponse } from 'next/server';
import { loginUseCase } from '@/api/main/factories/userFactory';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, password } = body;
    const result = await loginUseCase.execute({ email, password });
    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 400 });
  }
}
