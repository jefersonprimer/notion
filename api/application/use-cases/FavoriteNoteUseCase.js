"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FavoriteNoteUseCase = void 0;
const INoteRepository_1 = require("../../domain/repositories/INoteRepository");
const Note_1 = require("../../domain/entities/Note");
class FavoriteNoteUseCase {
    noteRepository;
    constructor(noteRepository) {
        this.noteRepository = noteRepository;
    }
    async execute(input) {
        if (!input.id || !input.userId) {
            throw new Error('Note ID and User ID are required.');
        }
        return this.noteRepository.favorite(input.id, input.userId, input.isFavorite);
    }
}
exports.FavoriteNoteUseCase = FavoriteNoteUseCase;
//# sourceMappingURL=FavoriteNoteUseCase.js.map