import { IUserRepository } from '../../domain/repositories/IUserRepository';
import bcrypt from 'bcryptjs';

export class ResetPasswordUseCase {
  constructor(private userRepository: IUserRepository) {}

  async execute(token: string, newPassword: string): Promise<void> {
    if (!token || !newPassword) {
      throw new Error('Access token and new password are required.');
    }

    const user = await this.userRepository.findByResetToken(token);

    if (!user) {
        throw new Error("Invalid or expired password reset token.");
    }

    if (!user.resetPasswordExpires || new Date(user.resetPasswordExpires) < new Date()) {
        throw new Error("Invalid or expired password reset token.");
    }

    if (newPassword.length < 6) {
        throw new Error("Password must be at least 6 characters long.");
    }

    const passwordHash = await bcrypt.hash(newPassword, 8);

    user.password = passwordHash;
    user.resetPasswordToken = null;
    user.resetPasswordExpires = null;

    await this.userRepository.update(user);
  }
}