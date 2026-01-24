import { INoteRepository } from '../../domain/repositories/INoteRepository';
import { Note } from '../../domain/entities/Note';
export declare class CreateNoteUseCase {
    private noteRepository;
    constructor(noteRepository: INoteRepository);
    execute(input: {
        userId: string;
        title: string;
        description?: string | null;
        parentId?: string | null;
    }): Promise<Note>;
}
//# sourceMappingURL=CreateNoteUseCase.d.ts.map