"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.noteController = void 0;
const SupabaseNoteRepository_1 = require("../../infrastructure/database/supabase/repositories/SupabaseNoteRepository");
const NoteController_1 = require("../../presentation/controllers/NoteController");
// Import all use cases
const CreateNoteUseCase_1 = require("../../application/use-cases/CreateNoteUseCase");
const ListNotesUseCase_1 = require("../../application/use-cases/ListNotesUseCase");
const GetNoteByIdUseCase_1 = require("../../application/use-cases/GetNoteByIdUseCase");
const UpdateNoteUseCase_1 = require("../../application/use-cases/UpdateNoteUseCase");
const SoftDeleteNoteUseCase_1 = require("../../application/use-cases/SoftDeleteNoteUseCase");
const RestoreNoteUseCase_1 = require("../../application/use-cases/RestoreNoteUseCase");
const PermanentDeleteNoteUseCase_1 = require("../../application/use-cases/PermanentDeleteNoteUseCase");
const ListDeletedNotesUseCase_1 = require("../../application/use-cases/ListDeletedNotesUseCase");
const SearchNotesUseCase_1 = require("../../application/use-cases/SearchNotesUseCase");
const FavoriteNoteUseCase_1 = require("../../application/use-cases/FavoriteNoteUseCase");
const ListFavoriteNotesUseCase_1 = require("../../application/use-cases/ListFavoriteNotesUseCase");
const ListChildNotesUseCase_1 = require("../../application/use-cases/ListChildNotesUseCase");
// 1. Instantiate Repository
const supabaseNoteRepository = new SupabaseNoteRepository_1.SupabaseNoteRepository();
// 2. Instantiate Use Cases
const createNoteUseCase = new CreateNoteUseCase_1.CreateNoteUseCase(supabaseNoteRepository);
const listNotesUseCase = new ListNotesUseCase_1.ListNotesUseCase(supabaseNoteRepository);
const getNoteByIdUseCase = new GetNoteByIdUseCase_1.GetNoteByIdUseCase(supabaseNoteRepository);
const updateNoteUseCase = new UpdateNoteUseCase_1.UpdateNoteUseCase(supabaseNoteRepository);
const softDeleteNoteUseCase = new SoftDeleteNoteUseCase_1.SoftDeleteNoteUseCase(supabaseNoteRepository);
const restoreNoteUseCase = new RestoreNoteUseCase_1.RestoreNoteUseCase(supabaseNoteRepository);
const permanentDeleteNoteUseCase = new PermanentDeleteNoteUseCase_1.PermanentDeleteNoteUseCase(supabaseNoteRepository);
const listDeletedNotesUseCase = new ListDeletedNotesUseCase_1.ListDeletedNotesUseCase(supabaseNoteRepository);
const searchNotesUseCase = new SearchNotesUseCase_1.SearchNotesUseCase(supabaseNoteRepository);
const favoriteNoteUseCase = new FavoriteNoteUseCase_1.FavoriteNoteUseCase(supabaseNoteRepository);
const listFavoriteNotesUseCase = new ListFavoriteNotesUseCase_1.ListFavoriteNotesUseCase(supabaseNoteRepository);
const listChildNotesUseCase = new ListChildNotesUseCase_1.ListChildNotesUseCase(supabaseNoteRepository);
// 3. Instantiate Controller
const noteController = new NoteController_1.NoteController(createNoteUseCase, listNotesUseCase, getNoteByIdUseCase, updateNoteUseCase, softDeleteNoteUseCase, restoreNoteUseCase, permanentDeleteNoteUseCase, listDeletedNotesUseCase, searchNotesUseCase, favoriteNoteUseCase, listFavoriteNotesUseCase, listChildNotesUseCase);
exports.noteController = noteController;
//# sourceMappingURL=noteFactory.js.map