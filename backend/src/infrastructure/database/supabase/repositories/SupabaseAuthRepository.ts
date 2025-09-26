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
}
