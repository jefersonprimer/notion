export interface IAuthRepository {
  signIn(
    email: string,
    password: string
  ): Promise<{ userId: string; accessToken: string } | null>;
  sendPasswordResetEmail(email: string): Promise<void>;
  resetPassword(accessToken: string, newPassword: string): Promise<void>;
  delete(id: string): Promise<void>;
}
