import { INoteRepository } from '../../domain/repositories/INoteRepository';
import { Note } from '../../domain/entities/Note';

export class ListFavoriteNotesUseCase {
  constructor(private noteRepository: INoteRepository) {}

  async execute(userId: string): Promise<Note[]> {
    if (!userId) {
      throw new Error('User ID is required.');
    }
    return this.noteRepository.findFavoritesByUserId(userId);
  }
}
