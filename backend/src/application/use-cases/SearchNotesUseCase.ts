import { INoteRepository } from '../../domain/repositories/INoteRepository';
import { Note } from '../../domain/entities/Note';

export class SearchNotesUseCase {
  constructor(private noteRepository: INoteRepository) {}

  async execute(input: { userId: string, query: string, titleOnly?: boolean, sortBy?: 'created_at' | 'updated_at', sortDirection?: 'asc' | 'desc' }): Promise<Note[]> {
    if (!input.userId) {
      throw new Error('User ID is required.');
    }
    
    if (!input.query || input.query.trim() === '') {
      return [];
    }

    return this.noteRepository.search(input.userId, input.query, input.titleOnly, input.sortBy, input.sortDirection);
  }
}
