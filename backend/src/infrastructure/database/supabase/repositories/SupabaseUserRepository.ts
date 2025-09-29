import { User } from "../../../../domain/entities/User";
import { IUserRepository } from "../../../../domain/repositories/IUserRepository";
import { supabase, supabaseAdmin } from "../client";

export class SupabaseUserRepository implements IUserRepository {
  async findById(id: string): Promise<User | null> {
    // 1. Busca o perfil na tabela 'profiles'
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .select('id, display_name, avatar_url')
      .eq('id', id)
      .single();

    if (profileError) {
      console.error("Error fetching profile:", profileError.message);
      return null;
    }

    // 2. Busca os dados de autenticação para obter o e-mail
    // Esta operação requer privilégios de admin para ser executada no backend.
    // Certifique-se de que o cliente Supabase no backend usa a 'service_role' key.
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.getUserById(id);

    if (authError) {
      console.error("Error fetching auth user:", authError.message);
      return null;
    }

    return {
      id: profileData.id,
      email: authData.user.email!,
      displayName: profileData.display_name,
      avatarUrl: profileData.avatar_url,
    };
  }

    async create(data: { email: string; password: string; displayName: string }): Promise<User> {
      console.log("Attempting to create user in Supabase auth with metadata...");
      // 1. Cria o usuário no Supabase Auth. 
      // O `displayName` é passado nos metadados para que o gatilho do banco de dados possa usá-lo.
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            display_name: data.displayName
          }
        }
      });
  
      if (authError) {
        console.error("Supabase auth signUp error:", authError.message);
        throw new Error(authError.message);
      }
      if (!authData.user) {
        console.error("Supabase auth signUp returned no user.");
        throw new Error("User could not be created in auth.");
      }

      console.log("User created successfully. Database trigger will handle profile creation.");

      // O gatilho no banco de dados cuidará da criação do perfil. 
      // Retornamos os dados do usuário conforme recebido do Supabase.
      return {
        id: authData.user.id,
        email: authData.user.email!,
        displayName: authData.user.user_metadata.display_name || null,
        avatarUrl: authData.user.user_metadata.avatar_url || null,
      };
    }

  async findByEmail(email: string): Promise<User | null> {
    console.warn("WARNING: SupabaseUserRepository.findByEmail is not implemented efficiently and should not be used in production without optimization (e.g., a database function).");
    // This is a workaround. A proper implementation would need a database function or view.
    const { data: { users }, error } = await supabaseAdmin.auth.admin.listUsers();
    if (error) {
      console.error("Error listing users to find by email:", error.message);
      return null;
    }
    const authUser = users.find(u => u.email === email);
    if (!authUser) {
      return null;
    }
    return this.findById(authUser.id);
  }

  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('profiles')
      .delete()
      .eq('id', id);

    if (error) {
      console.error("Supabase delete profile error:", error.message);
      // Not throwing an error here, as the primary goal is to delete the auth user.
      // If the profile is already gone, that's fine.
    }
  }
}