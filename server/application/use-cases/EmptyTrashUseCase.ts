import { INoteRepository } from '../../domain/repositories/INoteRepository';

export class EmptyTrashUseCase {
  constructor(private noteRepository: INoteRepository) {}

  async execute(userId: string): Promise<void> {
    if (!userId) {
      throw new Error('User ID is required.');
    }
    await this.noteRepository.emptyTrash(userId);
  }
}
