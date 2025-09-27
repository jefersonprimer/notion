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

    async create(data: { email: string; password: string }): Promise<User> {
      console.log("Attempting to create user in Supabase auth...");
      // 1. Cria o usuário no sistema de autenticação do Supabase
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
      });
  
      if (authError) {
        console.error("Supabase auth signUp error:", authError.message);
        throw new Error(authError.message);
      }
      console.log("Supabase auth signUp successful. Auth Data:", authData);
  
      if (!authData.user) {
        console.error("Supabase auth signUp returned no user.");
        throw new Error("User could not be created in auth.");
      }
  
      console.log("Attempting to insert profile into 'profiles' table for user ID:", authData.user.id);
      // 2. Insere um registro correspondente na tabela 'profiles'
      // O Supabase não faz isso automaticamente sem uma DB trigger.
      const { error: profileError } = await supabase
        .from('profiles')
        .insert({
          id: authData.user.id,
          // Você pode querer adicionar um 'username' ou 'display_name' padrão aqui
          // display_name: data.email.split('@')[0]
        });
  
      if (profileError) {
        console.error("Supabase profile insert error:", profileError.message);
        // Se a criação do perfil falhar, idealmente deveríamos deletar o usuário da autenticação
        // para evitar dados inconsistentes.
        await supabaseAdmin.auth.admin.deleteUser(authData.user.id);
        throw new Error(`Could not create user profile: ${profileError.message}`);
      }
      console.log("Supabase profile insert successful.");    // Retorna o novo usuário combinando informações de ambos os locais
    return {
      id: authData.user.id,
      email: authData.user.email!,
      displayName: null, // O perfil inicial não terá um display name
      avatarUrl: null,   // Nem um avatar
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