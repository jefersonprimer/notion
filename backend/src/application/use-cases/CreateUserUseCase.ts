import { IUserRepository } from "../../domain/repositories/IUserRepository";
import { CreateUserInputDTO, CreateUserOutputDTO } from "../dtos/CreateUserDTO";

export class CreateUserUseCase {
  // Usamos Injeção de Dependência para desacoplar o caso de uso do banco de dados
  constructor(private userRepository: IUserRepository) {}

  async execute({ email, password }: CreateUserInputDTO): Promise<CreateUserOutputDTO> {
    // 1. Validar se o usuário já existe
    const userAlreadyExists = await this.userRepository.findByEmail(email);

    if (userAlreadyExists) {
      throw new Error("User with this email already exists.");
    }

    // 2. Criar o usuário (a lógica de hash de senha etc. ficará na implementação do repositório)
    // Por enquanto, nosso repositório não lida com senha, vamos ajustar isso na camada de infra.
    const newUser = await this.userRepository.create({ email, displayName: null, avatarUrl: null });

    return {
      id: newUser.id,
      email: newUser.email,
    };
  }
}
