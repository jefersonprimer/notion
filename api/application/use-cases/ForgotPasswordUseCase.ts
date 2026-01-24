import { IUserRepository } from '../../domain/repositories/IUserRepository';
import { EmailService } from '../../infrastructure/services/EmailService';
import crypto from 'crypto';

export class ForgotPasswordUseCase {
  constructor(
    private userRepository: IUserRepository,
    private emailService: EmailService
  ) {}

  async execute(email: string): Promise<void> {
    if (!email) {
      throw new Error('Email is required.');
    }

    // Basic email validation
    const emailRegex = /^[\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new Error('Invalid email format.');
    }

    const user = await this.userRepository.findByEmail(email);
    if (!user) {
        // Silently return to avoid email enumeration
        console.log(`[ForgotPassword] Email ${email} not found.`);
        return; 
    }

    const token = crypto.randomBytes(20).toString('hex');
    const now = new Date();
    now.setHours(now.getHours() + 1); // 1 hour expiry

    user.resetPasswordToken = token;
    user.resetPasswordExpires = now;

    await this.userRepository.update(user);

    const resetLink = `http://localhost:8081/reset-password?token=${token}`;

    await this.emailService.sendMail({
      to: email,
      subject: 'Password Reset Request',
      text: `You requested a password reset. Please click on the following link to reset your password: ${resetLink}\n\nIf you did not request this, please ignore this email.`,
      html: `<p>You requested a password reset.</p><p>Please click on the following link to reset your password:</p><a href="${resetLink}">${resetLink}</a><p>If you did not request this, please ignore this email.</p>`
    });

    console.log(`[Email Sent] Password reset link for ${email}`);
  }
}