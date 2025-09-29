import { INoteRepository } from "../../../../domain/repositories/INoteRepository";
import { Note } from "../../../../domain/entities/Note";
import { supabase } from "../client";

export class SupabaseNoteRepository implements INoteRepository {

  async create(noteData: Omit<Note, 'id' | 'createdAt' | 'is_deleted' | 'deleted_at'>): Promise<Note> {
    const { userId, title, description } = noteData;
    const { data, error } = await supabase
      .from('notes')
      .insert({
        user_id: userId,
        title,
        description,
        is_deleted: false, // New notes are not deleted by default
      })
      .select()
      .single();

    if (error) {
      console.error("Supabase create note error:", error.message);
      throw new Error("Could not create note.");
    }

    return this.mapToNote(data);
  }

  async findByUserId(userId: string): Promise<Note[]> {
    const { data, error } = await supabase
      .from('notes')
      .select('*')
      .eq('user_id', userId)
      .eq('is_deleted', false)
      .order('updated_at', { ascending: false });

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
    const { data: updatedData, error } = await supabase
      .from('notes')
      .update(data)
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

  async search(userId: string, query: string): Promise<Note[]> {
    const { data, error } = await supabase
      .from('notes')
      .select('*')
      .eq('user_id', userId)
      .eq('is_deleted', false)
      .or(`title.ilike.%${query}%,description.ilike.%${query}%`);

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
        updated_at: new Date(data.updated_at)
    };
  }
}
