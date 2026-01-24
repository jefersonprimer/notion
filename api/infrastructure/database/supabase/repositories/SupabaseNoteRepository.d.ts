import { INoteRepository } from "../../../../domain/repositories/INoteRepository";
import { Note } from "../../../../domain/entities/Note";
export declare class SupabaseNoteRepository implements INoteRepository {
    create(noteData: Omit<Note, 'id' | 'createdAt' | 'is_deleted' | 'deleted_at'> & {
        parentId?: string | null;
    }): Promise<Note>;
    findTopLevelByUserId(userId: string): Promise<Note[]>;
    findByParentId(parentId: string): Promise<Note[]>;
    findByUserId(userId: string, sortBy?: 'created_at' | 'updated_at', sortDirection?: 'asc' | 'desc'): Promise<Note[]>;
    findById(id: string, userId: string): Promise<Note | null>;
    update(id: string, userId: string, data: Partial<Pick<Note, 'title' | 'description'>>): Promise<Note | null>;
    softDelete(id: string, userId: string): Promise<void>;
    restore(id: string, userId: string): Promise<void>;
    permanentDelete(id: string, userId: string): Promise<void>;
    findDeletedByUserId(userId: string): Promise<Note[]>;
    search(userId: string, query: string, titleOnly?: boolean, sortBy?: 'created_at' | 'updated_at', sortDirection?: 'asc' | 'desc'): Promise<Note[]>;
    deleteAllByUserId(userId: string): Promise<void>;
    favorite(id: string, userId: string, isFavorite: boolean): Promise<Note | null>;
    findFavoritesByUserId(userId: string): Promise<Note[]>;
    private mapToNote;
}
//# sourceMappingURL=SupabaseNoteRepository.d.ts.map