import { Request, Response } from 'express';
import { CreateNoteUseCase } from '../../application/use-cases/CreateNoteUseCase';
import { ListNotesUseCase } from '../../application/use-cases/ListNotesUseCase';
import { GetNoteByIdUseCase } from '../../application/use-cases/GetNoteByIdUseCase';
import { UpdateNoteUseCase } from '../../application/use-cases/UpdateNoteUseCase';
import { SoftDeleteNoteUseCase } from '../../application/use-cases/SoftDeleteNoteUseCase';
import { RestoreNoteUseCase } from '../../application/use-cases/RestoreNoteUseCase';
import { PermanentDeleteNoteUseCase } from '../../application/use-cases/PermanentDeleteNoteUseCase';
import { ListDeletedNotesUseCase } from '../../application/use-cases/ListDeletedNotesUseCase';
import { SearchNotesUseCase } from '../../application/use-cases/SearchNotesUseCase';
import { FavoriteNoteUseCase } from '../../application/use-cases/FavoriteNoteUseCase';
import { ListFavoriteNotesUseCase } from '../../application/use-cases/ListFavoriteNotesUseCase';
import { ListChildNotesUseCase } from '../../application/use-cases/ListChildNotesUseCase';

export class NoteController {
  constructor(
    private createNoteUseCase: CreateNoteUseCase,
    private listNotesUseCase: ListNotesUseCase,
    private getNoteByIdUseCase: GetNoteByIdUseCase,
    private updateNoteUseCase: UpdateNoteUseCase,
    private softDeleteNoteUseCase: SoftDeleteNoteUseCase,
    private restoreNoteUseCase: RestoreNoteUseCase,
    private permanentDeleteNoteUseCase: PermanentDeleteNoteUseCase,
    private listDeletedNotesUseCase: ListDeletedNotesUseCase,
    private searchNotesUseCase: SearchNotesUseCase,
    private favoriteNoteUseCase: FavoriteNoteUseCase,
    private listFavoriteNotesUseCase: ListFavoriteNotesUseCase,
    private listChildNotesUseCase: ListChildNotesUseCase
  ) {}

  async create(req: Request, res: Response): Promise<Response> {
    try {
      const userId = req.user!.id;
      const { title, description, parentId } = req.body;
      const note = await this.createNoteUseCase.execute({ userId, title, description, parentId });
      return res.status(201).json(note);
    } catch (error: any) {
      return res.status(400).json({ message: error.message });
    }
  }

  async list(req: Request, res: Response): Promise<Response> {
    try {
      const userId = req.user!.id;
      const notes = await this.listNotesUseCase.execute(userId);
      return res.status(200).json(notes);
    } catch (error: any) {
      return res.status(400).json({ message: error.message });
    }
  }

  async listChildren(req: Request, res: Response): Promise<Response> {
    try {
      const { parentId } = req.params;
      const notes = await this.listChildNotesUseCase.execute(parentId);
      return res.status(200).json(notes);
    } catch (error: any) {
      return res.status(400).json({ message: error.message });
    }
  }
  
  async getById(req: Request, res: Response): Promise<Response> {
    try {
      const userId = req.user!.id;
      const { id } = req.params;
      const note = await this.getNoteByIdUseCase.execute({ id, userId });
      if (!note) {
        return res.status(404).json({ message: 'Note not found.' });
      }
      return res.status(200).json(note);
    } catch (error: any) {
      return res.status(400).json({ message: error.message });
    }
  }

  async update(req: Request, res: Response): Promise<Response> {
    try {
      const userId = req.user!.id;
      const { id } = req.params;
      const { title, description } = req.body;
      const note = await this.updateNoteUseCase.execute({ id, userId, data: { title, description } });
      if (!note) {
        return res.status(404).json({ message: 'Note not found.' });
      }
      return res.status(200).json(note);
    } catch (error: any) {
      return res.status(400).json({ message: error.message });
    }
  }

  async softDelete(req: Request, res: Response): Promise<Response> {
    try {
      const userId = req.user!.id;
      const { id } = req.params;
      await this.softDeleteNoteUseCase.execute({ id, userId });
      return res.status(204).send();
    } catch (error: any) {
      return res.status(400).json({ message: error.message });
    }
  }

  async listDeleted(req: Request, res: Response): Promise<Response> {
    try {
      const userId = req.user!.id;
      const notes = await this.listDeletedNotesUseCase.execute(userId);
      return res.status(200).json(notes);
    } catch (error: any) {
      return res.status(400).json({ message: error.message });
    }
  }

  async restore(req: Request, res: Response): Promise<Response> {
    try {
      const userId = req.user!.id;
      const { id } = req.params;
      await this.restoreNoteUseCase.execute({ id, userId });
      return res.status(204).send();
    } catch (error: any) {
      return res.status(400).json({ message: error.message });
    }
  }

  async permanentDelete(req: Request, res: Response): Promise<Response> {
    try {
      const userId = req.user!.id;
      const { id } = req.params;
      await this.permanentDeleteNoteUseCase.execute({ id, userId });
      return res.status(204).send();
    } catch (error: any) {
      return res.status(400).json({ message: error.message });
    }
  }

  async search(req: Request, res: Response): Promise<Response> {
    try {
      const userId = req.user!.id;
      const query = req.query.q as string;
      const titleOnly = req.query.titleOnly === 'true';
      const sortBy = req.query.sortBy as 'created_at' | 'updated_at' | undefined;
      const sortDirection = req.query.sortDirection as 'asc' | 'desc' | undefined;

      const notes = await this.searchNotesUseCase.execute({ userId, query, titleOnly, sortBy, sortDirection });
      return res.status(200).json(notes);
    } catch (error: any) {
      return res.status(400).json({ message: error.message });
    }
  }

  async favorite(req: Request, res: Response): Promise<Response> {
    try {
      const userId = req.user!.id;
      const { id } = req.params;
      const { isFavorite } = req.body;
      const note = await this.favoriteNoteUseCase.execute({ id, userId, isFavorite });
      if (!note) {
        return res.status(404).json({ message: 'Note not found.' });
      }
      return res.status(200).json(note);
    } catch (error: any) {
      return res.status(400).json({ message: error.message });
    }
  }

  async listFavorites(req: Request, res: Response): Promise<Response> {
    try {
      const userId = req.user!.id;
      const notes = await this.listFavoriteNotesUseCase.execute(userId);
      return res.status(200).json(notes);
    } catch (error: any) {
      return res.status(400).json({ message: error.message });
    }
  }
}
