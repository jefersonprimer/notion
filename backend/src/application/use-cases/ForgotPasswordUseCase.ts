import { IAuthRepository } from '../../domain/repositories/IAuthRepository';

export class ForgotPasswordUseCase {
  constructor(private authRepository: IAuthRepository) {}

  async execute(email: string): Promise<void> {
    if (!email) {
      throw new Error('Email is required.');
    }

    // Basic email validation
    const emailRegex = /^[\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new Error('Invalid email format.');
    }

    await this.authRepository.sendPasswordResetEmail(email);
  }
}
