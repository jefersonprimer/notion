"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SearchNotesUseCase = void 0;
const INoteRepository_1 = require("../../domain/repositories/INoteRepository");
const Note_1 = require("../../domain/entities/Note");
class SearchNotesUseCase {
    noteRepository;
    constructor(noteRepository) {
        this.noteRepository = noteRepository;
    }
    async execute(input) {
        if (!input.userId) {
            throw new Error('User ID is required.');
        }
        if (!input.query || input.query.trim() === '') {
            return [];
        }
        return this.noteRepository.search(input.userId, input.query, input.titleOnly, input.sortBy, input.sortDirection);
    }
}
exports.SearchNotesUseCase = SearchNotesUseCase;
//# sourceMappingURL=SearchNotesUseCase.js.map