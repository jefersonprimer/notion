import { NextRequest, NextResponse } from 'next/server';
import { loginUseCase, createUserUseCase } from '@/server/main/factories/userFactory';

export async function POST(req: NextRequest, { params }: { params: Promise<{ action: string }> }) {
  const { action } = await params;
  
  try {
    const body = await req.json();

    if (action === 'login') {
      const { email, password } = body;
      const result = await loginUseCase.execute({ email, password });
      return NextResponse.json(result);
    } 
    
    if (action === 'signup') {
      const { name, email, password } = body;
      const user = await createUserUseCase.execute({ displayName: name, email, password });
      return NextResponse.json(user, { status: 201 });
    }

    return NextResponse.json({ message: 'Invalid action' }, { status: 404 });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 400 });
  }
}
