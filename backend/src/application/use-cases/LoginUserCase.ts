import { IAuthRepository } from "../../domain/repositories/IAuthRepository";
import { IUserRepository } from "../../domain/repositories/IUserRepository";
import { LoginInputDTO, LoginOutputDTO } from "../dtos/LoginDTO";

export class LoginUseCase {
  constructor(
    private authRepository: IAuthRepository,
    private userRepository: IUserRepository
  ) {}

  async execute({ email, password }: LoginInputDTO): Promise<LoginOutputDTO> {
    // 1. Tenta autenticar e obter o token e o ID do usuário
    const sessionData = await this.authRepository.signIn(email, password);

    if (!sessionData) {
      throw new Error("Invalid email or password.");
    }

    // 2. Com o ID, busca os dados do perfil do usuário
    const userProfile = await this.userRepository.findById(sessionData.userId);

    if (!userProfile) {
      // Este erro é improvável se a autenticação funcionou, mas é uma boa prática verificar
      throw new Error("User profile not found after authentication.");
    }

    return {
      user: userProfile,
      accessToken: sessionData.accessToken,
    };
  }
}
