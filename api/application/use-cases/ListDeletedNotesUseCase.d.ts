import { INoteRepository } from '../../domain/repositories/INoteRepository';
import { Note } from '../../domain/entities/Note';
export declare class ListDeletedNotesUseCase {
    private noteRepository;
    constructor(noteRepository: INoteRepository);
    execute(userId: string): Promise<Note[]>;
}
//# sourceMappingURL=ListDeletedNotesUseCase.d.ts.map