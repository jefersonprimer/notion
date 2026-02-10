import { IUserRepository } from "../../domain/repositories/IUserRepository";
import { LoginInputDTO, LoginOutputDTO } from "../dtos/LoginDTO";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export class LoginUserCase {
  constructor(
    private userRepository: IUserRepository
  ) {}

  async execute({ email, password }: LoginInputDTO): Promise<LoginOutputDTO> {
    // 1. Busca o usuário pelo email
    const user = await this.userRepository.findByEmail(email);

    if (!user) {
      throw new Error("Invalid email or password.");
    }

    // 2. Verifica a senha
    if (!user.password) {
        // Se o usuário não tem senha (login social antigo?), falha.
        throw new Error("Invalid email or password.");
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new Error("Invalid email or password.");
    }

    // 3. Gera o token JWT
    const secret = process.env.JWT_SECRET;
    if (!secret) {
        throw new Error("JWT_SECRET is not defined.");
    }

    const token = jwt.sign(
        { sub: user.id, email: user.email },
        secret,
        { expiresIn: '90d' } // Token válido por 90 dias
    );

    return {
      user: {
        id: user.id,
        email: user.email,
        displayName: user.displayName,
        avatarUrl: user.avatarUrl,
      },
      accessToken: token,
    };
  }
}
