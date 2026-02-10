import { IUserRepository } from '../../domain/repositories/IUserRepository';
import { INoteRepository } from '../../domain/repositories/INoteRepository';

export class DeleteUserUseCase {
  constructor(
    private userRepository: IUserRepository,
    private noteRepository: INoteRepository
  ) {}

  async execute(userId: string): Promise<void> {
    if (!userId) {
      throw new Error('User ID is required.');
    }

    // A ordem é importante por causa das chaves estrangeiras do banco de dados.
    
    // 1. Deleta todas as notas do usuário
    await this.noteRepository.deleteAllByUserId(userId);

    // 2. Deleta o perfil do usuário
    await this.userRepository.delete(userId);
  }
}