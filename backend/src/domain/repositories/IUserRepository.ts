import { User } from "../entities/User";

export interface IUserRepository {
  create(data: { email: string; password: string; displayName: string }): Promise<User>;
  findByEmail(email: string): Promise<User | null>;
  findById(id: string): Promise<User | null>;
  delete(id: string): Promise<void>;
}