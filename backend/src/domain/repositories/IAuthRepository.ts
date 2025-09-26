export interface IAuthRepository {
  signIn(
    email: string,
    password: string
  ): Promise<{ userId: string; accessToken: string } | null>;
}
