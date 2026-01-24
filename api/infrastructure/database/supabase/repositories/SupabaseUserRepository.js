"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SupabaseUserRepository = void 0;
const User_1 = require("../../../../domain/entities/User");
const IUserRepository_1 = require("../../../../domain/repositories/IUserRepository");
const client_1 = require("../client");
class SupabaseUserRepository {
    mapToUser(data) {
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
    async findById(id) {
        const { data, error } = await client_1.supabase
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
    async create(data) {
        console.log("Attempting to create user in public.users table...");
        const { data: newUser, error } = await client_1.supabase
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
    async findByEmail(email) {
        const { data, error } = await client_1.supabase
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
    async findByResetToken(token) {
        const { data, error } = await client_1.supabase
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
    async update(user) {
        const { error } = await client_1.supabase
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
    async delete(id) {
        const { error } = await client_1.supabase
            .from('users')
            .delete()
            .eq('id', id);
        if (error) {
            console.error("Supabase delete user error:", error.message);
            throw new Error("Could not delete user.");
        }
    }
}
exports.SupabaseUserRepository = SupabaseUserRepository;
//# sourceMappingURL=SupabaseUserRepository.js.map