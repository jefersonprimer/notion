import { INoteRepository } from '../../domain/repositories/INoteRepository';

export class SoftDeleteNoteUseCase {
  constructor(private noteRepository: INoteRepository) {}

  async execute(input: { id: string, userId: string }): Promise<void> {
    if (!input.id || !input.userId) {
      throw new Error('Note ID and User ID are required.');
    }
    await this.noteRepository.softDelete(input.id, input.userId);
  }
}
