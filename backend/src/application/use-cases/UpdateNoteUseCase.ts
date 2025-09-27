import { INoteRepository } from '../../domain/repositories/INoteRepository';
import { Note } from '../../domain/entities/Note';

export class UpdateNoteUseCase {
  constructor(private noteRepository: INoteRepository) {}

  async execute(input: { 
    id: string; 
    userId: string; 
    data: Partial<Pick<Note, 'title' | 'description'>>;
  }): Promise<Note | null> {
    
    if (!input.id || !input.userId) {
      throw new Error('Note ID and User ID are required.');
    }

    if (Object.keys(input.data).length === 0) {
        throw new Error('No data provided for update.');
    }

    return this.noteRepository.update(input.id, input.userId, input.data);
  }
}
