import { INoteRepository } from "../../../../domain/repositories/INoteRepository";
import { Note } from "../../../../domain/entities/Note";
import { supabase } from "../client";

export class SupabaseNoteRepository implements INoteRepository {

  async create(noteData: Omit<Note, 'id' | 'createdAt' | 'is_deleted' | 'deleted_at'> & { parentId?: string | null }): Promise<Note> {
    const { userId, title, description, parentId } = noteData;
    const { data, error } = await supabase
      .from('notes')
      .insert({
        user_id: userId,
        title,
        description,
        parent_id: parentId,
        is_deleted: false, 
        is_favorite: false,
      })
      .select()
      .single();

    if (error) {
      console.error("Supabase create note error:", error.message);
      throw new Error("Could not create note.");
    }

    return this.mapToNote(data);
  }

  async findTopLevelByUserId(userId: string): Promise<Note[]> {
    const { data, error } = await supabase
      .from('notes')
      .select('*')
      .eq('user_id', userId)
      .eq('is_deleted', false)
      .is('parent_id', null)
      .order('updated_at', { ascending: false });

    if (error) {
      console.error("Supabase find top-level notes error:", error.message);
      throw new Error("Could not find notes.");
    }

    return data.map(this.mapToNote);
  }

  async findByParentId(parentId: string): Promise<Note[]> {
    const { data, error } = await supabase
      .from('notes')
      .select('*')
      .eq('parent_id', parentId)
      .eq('is_deleted', false)
      .order('updated_at', { ascending: false });

    if (error) {
      console.error("Supabase find child notes error:", error.message);
      throw new Error("Could not find child notes.");
    }

    return data.map(this.mapToNote);
  }

  async findByUserId(userId: string, sortBy: 'created_at' | 'updated_at' = 'updated_at', sortDirection: 'asc' | 'desc' = 'desc'): Promise<Note[]> {
    const { data, error } = await supabase
      .from('notes')
      .select('*')
      .eq('user_id', userId)
      .eq('is_deleted', false)
      .order(sortBy, { ascending: sortDirection === 'asc' });

    if (error) {
      console.error("Supabase find notes error:", error.message);
      throw new Error("Could not find notes.");
    }

    return data.map(this.mapToNote);
  }

  async findById(id: string, userId: string): Promise<Note | null> {
    const { data, error } = await supabase
      .from('notes')
      .select('*')
      .eq('id', id)
      .eq('user_id', userId)
      .single();

    if (error && error.code !== 'PGRST116') { // PGRST116 = no rows found
      console.error("Supabase find note by id error:", error.message);
      throw new Error("Could not find note.");
    }

    if (!data) return null;

    return this.mapToNote(data);
  }

  async update(id: string, userId: string, data: Partial<Pick<Note, 'title' | 'description'>>): Promise<Note | null> {
    const updateData = {
      ...data,
      updated_at: new Date().toISOString(),
    };

    const { data: updatedData, error } = await supabase
      .from('notes')
      .update(updateData)
      .match({ id, user_id: userId })
      .select()
      .single();

    if (error) {
      console.error("Supabase update note error:", error.message);
      throw new Error("Could not update note.");
    }

    return this.mapToNote(updatedData);
  }

  async softDelete(id: string, userId: string): Promise<void> {
    const { error } = await supabase
      .from('notes')
      .update({ is_deleted: true, deleted_at: new Date().toISOString() })
      .match({ id, user_id: userId });

    if (error) {
      console.error("Supabase soft delete error:", error.message);
      throw new Error("Could not move note to trash.");
    }
  }

  async restore(id: string, userId: string): Promise<void> {
    const { error } = await supabase
      .from('notes')
      .update({ is_deleted: false, deleted_at: null })
      .match({ id, user_id: userId });

    if (error) {
      console.error("Supabase restore note error:", error.message);
      throw new Error("Could not restore note.");
    }
  }

  async permanentDelete(id: string, userId: string): Promise<void> {
    const { error } = await supabase
      .from('notes')
      .delete()
      .match({ id, user_id: userId, is_deleted: true }); // Extra safety: only delete if it is already in trash

    if (error) {
      console.error("Supabase permanent delete error:", error.message);
      throw new Error("Could not permanently delete note.");
    }
  }

  async findDeletedByUserId(userId: string): Promise<Note[]> {
    const { data, error } = await supabase
      .from('notes')
      .select('*')
      .eq('user_id', userId)
      .eq('is_deleted', true)
      .order('deleted_at', { ascending: false });

    if (error) {
      console.error("Supabase find deleted notes error:", error.message);
      throw new Error("Could not find deleted notes.");
    }

    return data.map(this.mapToNote);
  }

  async search(userId: string, query: string, titleOnly?: boolean, sortBy?: 'created_at' | 'updated_at', sortDirection?: 'asc' | 'desc'): Promise<Note[]> {
    let filter;
    if (titleOnly) {
      filter = `title.ilike.%${query}%`;
    } else {
      filter = `title.ilike.%${query}%,description.ilike.%${query}%`;
    }

    let queryBuilder = supabase
      .from('notes')
      .select('*')
      .eq('user_id', userId)
      .eq('is_deleted', false)
      .or(filter);

    if (sortBy) {
      queryBuilder = queryBuilder.order(sortBy, { ascending: sortDirection === 'asc' });
    }

    const { data, error } = await queryBuilder;

    if (error) {
      console.error("Supabase search notes error:", error.message);
      throw new Error("Could not perform search.");
    }

    return data.map(this.mapToNote);
  }

  async deleteAllByUserId(userId: string): Promise<void> {
    const { error } = await supabase
      .from('notes')
      .delete()
      .eq('user_id', userId);

    if (error) {
      console.error("Supabase delete all notes error:", error.message);
      throw new Error("Could not delete all notes for the user.");
    }
  }

  async emptyTrash(userId: string): Promise<void> {
    const { error } = await supabase
      .from('notes')
      .delete()
      .eq('user_id', userId)
      .eq('is_deleted', true);

    if (error) {
      console.error("Supabase empty trash error:", error.message);
      throw new Error("Could not empty trash.");
    }
  }

  async favorite(id: string, userId: string, isFavorite: boolean): Promise<Note | null> {
    const { data, error } = await supabase
      .from('notes')
      .update({ is_favorite: isFavorite })
      .match({ id, user_id: userId })
      .select()
      .single();

    if (error) {
      console.error("Supabase favorite note error:", error.message);
      throw new Error("Could not favorite note.");
    }

    return this.mapToNote(data);
  }

  async findFavoritesByUserId(userId: string): Promise<Note[]> {
    const { data, error } = await supabase
      .from('notes')
      .select('*')
      .eq('user_id', userId)
      .eq('is_deleted', false)
      .eq('is_favorite', true)
      .order('updated_at', { ascending: false });

    if (error && error.code !== 'PGRST116') { // PGRST116 = no rows found
      console.error("Supabase find favorite notes error:", error.message);
      throw new Error("Could not find favorite notes.");
    }

    if (!data) {
        return [];
    }

    return data.map(this.mapToNote);
  }

  // Helper to map database result to Note entity
  private mapToNote(data: any): Note {
    return {
        id: data.id,
        userId: data.user_id,
        title: data.title,
        description: data.description,
        createdAt: new Date(data.created_at),
        is_deleted: data.is_deleted,
        deleted_at: data.deleted_at ? new Date(data.deleted_at) : null,
        updated_at: new Date(data.updated_at),
        is_favorite: data.is_favorite,
        parentId: data.parent_id,
    };
  }
}
