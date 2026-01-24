import { INoteRepository } from '../../domain/repositories/INoteRepository';
import { Note } from '../../domain/entities/Note';

export class GetNoteByIdUseCase {
  constructor(private noteRepository: INoteRepository) {}

  async execute(input: { id: string, userId: string }): Promise<Note | null> {
    if (!input.id || !input.userId) {
      throw new Error('Note ID and User ID are required.');
    }
    return this.noteRepository.findById(input.id, input.userId);
  }
}
