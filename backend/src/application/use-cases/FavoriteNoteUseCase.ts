import { INoteRepository } from '../../domain/repositories/INoteRepository';
import { Note } from '../../domain/entities/Note';

export class FavoriteNoteUseCase {
  constructor(private noteRepository: INoteRepository) {}

  async execute(input: { 
    id: string; 
    userId: string; 
    isFavorite: boolean;
  }): Promise<Note | null> {
    
    if (!input.id || !input.userId) {
      throw new Error('Note ID and User ID are required.');
    }

    return this.noteRepository.favorite(input.id, input.userId, input.isFavorite);
  }
}
