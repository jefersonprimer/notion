import { INoteRepository } from '../../domain/repositories/INoteRepository';
import { Note } from '../../domain/entities/Note';
export declare class ListFavoriteNotesUseCase {
    private noteRepository;
    constructor(noteRepository: INoteRepository);
    execute(userId: string): Promise<Note[]>;
}
//# sourceMappingURL=ListFavoriteNotesUseCase.d.ts.map