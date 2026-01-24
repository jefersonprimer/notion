import { INoteRepository } from '../../domain/repositories/INoteRepository';
import { Note } from '../../domain/entities/Note';
export declare class SearchNotesUseCase {
    private noteRepository;
    constructor(noteRepository: INoteRepository);
    execute(input: {
        userId: string;
        query: string;
        titleOnly?: boolean;
        sortBy?: 'created_at' | 'updated_at';
        sortDirection?: 'asc' | 'desc';
    }): Promise<Note[]>;
}
//# sourceMappingURL=SearchNotesUseCase.d.ts.map