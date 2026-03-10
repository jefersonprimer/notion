import { IUserRepository } from '../../domain/repositories/IUserRepository';

export class ValidateResetTokenUseCase {
  constructor(private userRepository: IUserRepository) {}

  async execute(token: string): Promise<void> {
    if (!token) {
      throw new Error('Reset token is required.');
    }

    const user = await this.userRepository.findByResetToken(token);

    if (!user) {
      throw new Error('Invalid or expired password reset token.');
    }

    if (!user.resetPasswordExpires || user.resetPasswordExpires < new Date()) {
      throw new Error('Invalid or expired password reset token.');
    }
  }
}

