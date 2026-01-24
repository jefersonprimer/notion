import { SupabaseNoteRepository } from '../../infrastructure/database/supabase/repositories/SupabaseNoteRepository';

// Import all use cases
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

// 1. Instantiate Repository
const supabaseNoteRepository = new SupabaseNoteRepository();

// 2. Instantiate Use Cases
const createNoteUseCase = new CreateNoteUseCase(supabaseNoteRepository);
const listNotesUseCase = new ListNotesUseCase(supabaseNoteRepository);
const getNoteByIdUseCase = new GetNoteByIdUseCase(supabaseNoteRepository);
const updateNoteUseCase = new UpdateNoteUseCase(supabaseNoteRepository);
const softDeleteNoteUseCase = new SoftDeleteNoteUseCase(supabaseNoteRepository);
const restoreNoteUseCase = new RestoreNoteUseCase(supabaseNoteRepository);
const permanentDeleteNoteUseCase = new PermanentDeleteNoteUseCase(supabaseNoteRepository);
const listDeletedNotesUseCase = new ListDeletedNotesUseCase(supabaseNoteRepository);
const searchNotesUseCase = new SearchNotesUseCase(supabaseNoteRepository);
const favoriteNoteUseCase = new FavoriteNoteUseCase(supabaseNoteRepository);
const listFavoriteNotesUseCase = new ListFavoriteNotesUseCase(supabaseNoteRepository);
const listChildNotesUseCase = new ListChildNotesUseCase(supabaseNoteRepository);

export { 
  createNoteUseCase,
  listNotesUseCase,
  getNoteByIdUseCase,
  updateNoteUseCase,
  softDeleteNoteUseCase,
  restoreNoteUseCase,
  permanentDeleteNoteUseCase,
  listDeletedNotesUseCase,
  searchNotesUseCase,
  favoriteNoteUseCase,
  listFavoriteNotesUseCase,
  listChildNotesUseCase
};