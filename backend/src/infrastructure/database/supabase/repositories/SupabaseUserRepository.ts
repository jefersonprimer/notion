import { User } from "../../../../domain/entities/User";
import { IUserRepository } from "../../../../domain/repositories/IUserRepository";
import { supabase } from "../client";

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
    const { data: authData, error: authError } = await supabase.auth.admin.getUserById(id);

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
    // 1. Cria o usuário no sistema de autenticação do Supabase
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
    });

    if (authError) {
      // O erro "User already registered" será lançado aqui
      throw new Error(authError.message);
    }

    if (!authData.user) {
      throw new Error("User could not be created in auth.");
    }

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
      // Se a criação do perfil falhar, idealmente deveríamos deletar o usuário da autenticação
      // para evitar dados inconsistentes.
      await supabase.auth.admin.deleteUser(authData.user.id);
      throw new Error(`Could not create user profile: ${profileError.message}`);
    }

    // Retorna o novo usuário combinando informações de ambos os locais
    return {
      id: authData.user.id,
      email: authData.user.email!,
      displayName: null, // O perfil inicial não terá um display name
      avatarUrl: null,   // Nem um avatar
    };
  }
}