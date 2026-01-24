import { User } from "../../../../domain/entities/User";
import { IUserRepository } from "../../../../domain/repositories/IUserRepository";
import { supabase } from "../client";

export class SupabaseUserRepository implements IUserRepository {
  private mapToUser(data: any): User {
    return {
      id: data.id,
      email: data.email,
      displayName: data.display_name,
      avatarUrl: data.avatar_url,
      password: data.password_hash,
      resetPasswordToken: data.reset_password_token,
      resetPasswordExpires: data.reset_password_expires ? new Date(data.reset_password_expires) : null,
    };
  }

  async findById(id: string): Promise<User | null> {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code !== 'PGRST116') {
        console.error("Error fetching user by id:", error.message);
      }
      return null;
    }

    return this.mapToUser(data);
  }

  async create(data: { email: string; password: string; displayName: string }): Promise<User> {
    console.log("Attempting to create user in public.users table...");
    
    const { data: newUser, error } = await supabase
      .from('users')
      .insert({
        email: data.email,
        password_hash: data.password, 
        display_name: data.displayName
      })
      .select()
      .single();

    if (error) {
      console.error("Supabase create user error:", error.message);
      throw new Error(error.message);
    }

    return this.mapToUser(newUser);
  }

  async findByEmail(email: string): Promise<User | null> {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single();

    if (error) {
      if (error.code !== 'PGRST116') {
        console.error("Error fetching user by email:", error.message);
      }
      return null;
    }

    return this.mapToUser(data);
  }

  async findByResetToken(token: string): Promise<User | null> {
    const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('reset_password_token', token)
        .single();
    
    if (error) {
        if (error.code !== 'PGRST116') {
            console.error("Error fetching user by reset token:", error.message);
        }
        return null;
    }

    return this.mapToUser(data);
  }

  async update(user: User): Promise<void> {
      const { error } = await supabase
        .from('users')
        .update({
            display_name: user.displayName,
            avatar_url: user.avatarUrl,
            password_hash: user.password,
            reset_password_token: user.resetPasswordToken,
            reset_password_expires: user.resetPasswordExpires,
            updated_at: new Date()
        })
        .eq('id', user.id);

        if (error) {
            console.error("Error updating user:", error.message);
            throw new Error("Could not update user.");
        }
  }

  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('users')
      .delete()
      .eq('id', id);

    if (error) {
      console.error("Supabase delete user error:", error.message);
      throw new Error("Could not delete user.");
    }
  }
}
