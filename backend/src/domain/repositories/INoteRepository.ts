import { Note } from "../entities/Note";

export interface INoteRepository {
  create(data: Omit<Note, 'id' | 'createdAt'>): Promise<Note>;
  findById(id: string): Promise<Note | null>;
  findByUser(userId: string): Promise<Note[]>;
  update(id: string, data: Partial<Omit<Note, 'id' | 'userId'>>): Promise<Note | null>;
  delete(id: string): Promise<void>;
}
