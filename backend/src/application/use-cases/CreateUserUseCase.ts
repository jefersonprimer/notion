import { IUserRepository } from "../../domain/repositories/IUserRepository";
import { CreateUserInputDTO, CreateUserOutputDTO } from "../dtos/CreateUserDTO";

export class CreateUserUseCase {
  // Usamos Injeção de Dependência para desacoplar o caso de uso do banco de dados
  constructor(private userRepository: IUserRepository) {}

  async execute({ email, password, displayName }: CreateUserInputDTO): Promise<CreateUserOutputDTO> {
    // A lógica de verificar se o usuário já existe foi removida.
    // O Supabase (camada de infra) já faz essa validação e retornará um erro se o e-mail for duplicado.
    // O controller será responsável por capturar e tratar esse erro.

    // Criamos o usuário passando o email, a senha e o displayName.
    const newUser = await this.userRepository.create({ email, password, displayName });

    return {
      id: newUser.id,
      email: newUser.email,
    };
  }
}
