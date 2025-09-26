import { User } from "../entities/User";

export interface IUserRepository {
  findById(id: string): Promise<User | null>;
  // O método de criação espera email e senha para o processo de sign up.
  create(data: { email: string; password: string }): Promise<User>;
}
