import { IUserRepository } from "../../domain/repositories/IUserRepository";
import { CreateUserInputDTO, CreateUserOutputDTO } from "../dtos/CreateUserDTO";
import bcrypt from 'bcryptjs';

export class CreateUserUseCase {
  // Usamos Injeção de Dependência para desacoplar o caso de uso do banco de dados
  constructor(private userRepository: IUserRepository) {}

  async execute({ email, password, displayName }: CreateUserInputDTO): Promise<CreateUserOutputDTO> {
    // 1. Verificar se o usuário já existe
    const existingUser = await this.userRepository.findByEmail(email);
    if (existingUser) {
      throw new Error("User already exists.");
    }

    // 2. Hash da senha
    const passwordHash = await bcrypt.hash(password, 8);

    // 3. Criar usuário com senha hash
    const newUser = await this.userRepository.create({ 
      email, 
      password: passwordHash, 
      displayName 
    });

    return {
      id: newUser.id,
      email: newUser.email,
    };
  }
}
