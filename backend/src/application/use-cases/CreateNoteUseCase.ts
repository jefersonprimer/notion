import { INoteRepository } from '../../domain/repositories/INoteRepository';
import { Note } from '../../domain/entities/Note';

export class CreateNoteUseCase {
  constructor(private noteRepository: INoteRepository) {}

  async execute(input: {
    userId: string;
    title: string;
    description?: string | null;
    parentId?: string | null;
  }): Promise<Note> {
    if (!input.title) {
      throw new Error('Title is required.');
    }

    const note = await this.noteRepository.create({
      userId: input.userId,
      title: input.title,
      description: input.description || null,
      parentId: input.parentId || null,
    });

    return note;
  }
}
