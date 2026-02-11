import { INoteRepository } from '../../domain/repositories/INoteRepository';
import { Note } from '../../domain/entities/Note';

export class DuplicateNoteUseCase {
  constructor(private noteRepository: INoteRepository) {}

  async execute(input: {
    id: string;
    userId: string;
  }): Promise<Note> {
    const originalNote = await this.noteRepository.findById(input.id, input.userId);

    if (!originalNote) {
      throw new Error("Note not found or unauthorized.");
    }

    const duplicatedNote = await this.noteRepository.create({
      userId: input.userId,
      title: `Cópia de ${originalNote.title}`,
      description: originalNote.description,
      parentId: originalNote.parentId,
      is_favorite: originalNote.is_favorite,
    });

    return duplicatedNote;
  }
}
