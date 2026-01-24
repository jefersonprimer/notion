import { INoteRepository } from '../../domain/repositories/INoteRepository';
export declare class RestoreNoteUseCase {
    private noteRepository;
    constructor(noteRepository: INoteRepository);
    execute(input: {
        id: string;
        userId: string;
    }): Promise<void>;
}
//# sourceMappingURL=RestoreNoteUseCase.d.ts.map