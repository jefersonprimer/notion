import { INoteRepository } from '../../domain/repositories/INoteRepository';
import { Note } from '../../domain/entities/Note';
export declare class GetNoteByIdUseCase {
    private noteRepository;
    constructor(noteRepository: INoteRepository);
    execute(input: {
        id: string;
        userId: string;
    }): Promise<Note | null>;
}
//# sourceMappingURL=GetNoteByIdUseCase.d.ts.map