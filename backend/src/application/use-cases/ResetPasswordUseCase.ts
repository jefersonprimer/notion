import { IAuthRepository } from '../../domain/repositories/IAuthRepository';

export class ResetPasswordUseCase {
  constructor(private authRepository: IAuthRepository) {}

  async execute(accessToken: string, newPassword: string): Promise<void> {
    if (!accessToken || !newPassword) {
      throw new Error('Access token and new password are required.');
    }

    if (newPassword.length < 6) {
        throw new Error('Password must be at least 6 characters long.');
    }

    await this.authRepository.resetPassword(accessToken, newPassword);
  }
}
