import { NextRequest, NextResponse } from 'next/server';
import { 
  loginUseCase,
  createUserUseCase,
  forgotPasswordUseCase,
  resetPasswordUseCase,
  validateResetTokenUseCase
} from '@/server/main/factories/userFactory';

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  return 'Unknown error';
}

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
      const user = await createUserUseCase.execute({ name, email, password });
      return NextResponse.json(user, { status: 201 });
    }

    if (action === 'forgot-password') {
      const { email } = body;
      await forgotPasswordUseCase.execute(email);
      return NextResponse.json({
        message: 'If an account exists for this email, a reset link has been sent.'
      });
    }

    if (action === 'reset-password') {
      const { token, newPassword } = body;
      await resetPasswordUseCase.execute(token, newPassword);
      return NextResponse.json({ message: 'Password updated successfully.' });
    }

    return NextResponse.json({ message: 'Invalid action' }, { status: 404 });
  } catch (error: unknown) {
    return NextResponse.json({ message: getErrorMessage(error) }, { status: 400 });
  }
}

export async function GET(req: NextRequest, { params }: { params: Promise<{ action: string }> }) {
  const { action } = await params;

  try {
    if (action === 'validate-reset-token') {
      const token = req.nextUrl.searchParams.get('token') ?? '';
      await validateResetTokenUseCase.execute(token);
      return NextResponse.json({ valid: true });
    }

    return NextResponse.json({ message: 'Invalid action' }, { status: 404 });
  } catch (error: unknown) {
    return NextResponse.json({ message: getErrorMessage(error) }, { status: 400 });
  }
}
