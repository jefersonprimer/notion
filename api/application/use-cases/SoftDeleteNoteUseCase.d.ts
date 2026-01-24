import { INoteRepository } from '../../domain/repositories/INoteRepository';
export declare class SoftDeleteNoteUseCase {
    private noteRepository;
    constructor(noteRepository: INoteRepository);
    execute(input: {
        id: string;
        userId: string;
    }): Promise<void>;
}
//# sourceMappingURL=SoftDeleteNoteUseCase.d.ts.map