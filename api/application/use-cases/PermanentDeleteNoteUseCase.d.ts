import { INoteRepository } from '../../domain/repositories/INoteRepository';
export declare class PermanentDeleteNoteUseCase {
    private noteRepository;
    constructor(noteRepository: INoteRepository);
    execute(input: {
        id: string;
        userId: string;
    }): Promise<void>;
}
//# sourceMappingURL=PermanentDeleteNoteUseCase.d.ts.map