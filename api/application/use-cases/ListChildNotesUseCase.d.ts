import { INoteRepository } from '../../domain/repositories/INoteRepository';
import { Note } from '../../domain/entities/Note';
export declare class ListChildNotesUseCase {
    private noteRepository;
    constructor(noteRepository: INoteRepository);
    execute(parentId: string): Promise<Note[]>;
}
//# sourceMappingURL=ListChildNotesUseCase.d.ts.map