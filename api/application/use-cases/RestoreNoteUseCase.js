"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RestoreNoteUseCase = void 0;
const INoteRepository_1 = require("../../domain/repositories/INoteRepository");
class RestoreNoteUseCase {
    noteRepository;
    constructor(noteRepository) {
        this.noteRepository = noteRepository;
    }
    async execute(input) {
        if (!input.id || !input.userId) {
            throw new Error('Note ID and User ID are required.');
        }
        await this.noteRepository.restore(input.id, input.userId);
    }
}
exports.RestoreNoteUseCase = RestoreNoteUseCase;
//# sourceMappingURL=RestoreNoteUseCase.js.map