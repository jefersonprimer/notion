"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ListDeletedNotesUseCase = void 0;
const INoteRepository_1 = require("../../domain/repositories/INoteRepository");
const Note_1 = require("../../domain/entities/Note");
class ListDeletedNotesUseCase {
    noteRepository;
    constructor(noteRepository) {
        this.noteRepository = noteRepository;
    }
    async execute(userId) {
        if (!userId) {
            throw new Error('User ID is required.');
        }
        return this.noteRepository.findDeletedByUserId(userId);
    }
}
exports.ListDeletedNotesUseCase = ListDeletedNotesUseCase;
//# sourceMappingURL=ListDeletedNotesUseCase.js.map