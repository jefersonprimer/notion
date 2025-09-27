import { INoteRepository } from '../../domain/repositories/INoteRepository';
import { Note } from '../../domain/entities/Note';

export class SearchNotesUseCase {
  constructor(private noteRepository: INoteRepository) {}

  async execute(input: { userId: string, query: string }): Promise<Note[]> {
    if (!input.userId) {
      throw new Error('User ID is required.');
    }
    // Return empty array if query is empty to avoid unnecessary db calls
    if (!input.query || input.query.trim() === '') {
      return []; 
    }
    return this.noteRepository.search(input.userId, input.query);
  }
}
