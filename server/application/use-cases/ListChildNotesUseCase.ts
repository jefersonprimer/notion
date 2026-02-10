import { INoteRepository } from '../../domain/repositories/INoteRepository';
import { Note } from '../../domain/entities/Note';

export class ListChildNotesUseCase {
  constructor(private noteRepository: INoteRepository) {}

  async execute(parentId: string): Promise<Note[]> {
    if (!parentId) {
      throw new Error('Parent ID is required.');
    }
    return this.noteRepository.findByParentId(parentId);
  }
}
