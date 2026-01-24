import { INoteRepository } from '../../domain/repositories/INoteRepository';
import { Note } from '../../domain/entities/Note';
export declare class FavoriteNoteUseCase {
    private noteRepository;
    constructor(noteRepository: INoteRepository);
    execute(input: {
        id: string;
        userId: string;
        isFavorite: boolean;
    }): Promise<Note | null>;
}
//# sourceMappingURL=FavoriteNoteUseCase.d.ts.map