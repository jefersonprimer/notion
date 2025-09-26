import { User } from "../entities/User";

export interface IUserRepository {
  findById(id: string): Promise<User | null>;
  create(data: { email: string; password: string }): Promise<User>;
}