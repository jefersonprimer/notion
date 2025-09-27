import { IAuthRepository } from "../../../../domain/repositories/IAuthRepository";
import { supabase } from "../client";

export class SupabaseAuthRepository implements IAuthRepository {
  async signIn(
    email: string,
    password: string
  ): Promise<{ userId: string; accessToken: string } | null> {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error || !data.session || !data.user) {
      // Não retorne o erro do Supabase diretamente por segurança
      console.error("Supabase sign in error:", error?.message);
      return null;
    }

    return {
      userId: data.user.id,
      accessToken: data.session.access_token,
    };
  }

  async sendPasswordResetEmail(email: string): Promise<void> {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: 'http://localhost:8081/reset-password', // URL da sua tela de redefinição de senha no frontend
    });

    if (error) {
      // Idealmente, logar o erro sem expor detalhes ao usuário
      console.error('Error sending password reset email:', error.message);
      // Lançar um erro genérico para a camada de aplicação
      throw new Error('Could not send password reset email.');
    }
  }

  async resetPassword(accessToken: string, newPassword: string): Promise<void> {
    // 1. Verify the token and get the user
    const { data: { user }, error: getUserError } = await supabase.auth.getUser(accessToken);

    if (getUserError || !user) {
      console.error('Error getting user from access token:', getUserError?.message);
      throw new Error('Invalid or expired access token.');
    }

    // 2. Update the user's password using the admin client
    const { error: updateUserError } = await supabase.auth.admin.updateUserById(
      user.id,
      { password: newPassword }
    );

    if (updateUserError) {
      console.error('Error updating user password:', updateUserError.message);
      throw new Error('Could not update password.');
    }
  }

  async delete(id: string): Promise<void> {
    const { error } = await supabase.auth.admin.deleteUser(id);

    if (error) {
      console.error("Supabase delete auth user error:", error.message);
      throw new Error("Could not delete user from authentication system.");
    }
  }
}
