import { INoteRepository } from '../../domain/repositories/INoteRepository';
import { Note } from '../../domain/entities/Note';
export declare class UpdateNoteUseCase {
    private noteRepository;
    constructor(noteRepository: INoteRepository);
    execute(input: {
        id: string;
        userId: string;
        data: Partial<Pick<Note, 'title' | 'description'>>;
    }): Promise<Note | null>;
}
//# sourceMappingURL=UpdateNoteUseCase.d.ts.map