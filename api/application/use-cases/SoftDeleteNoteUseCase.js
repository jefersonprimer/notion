"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SoftDeleteNoteUseCase = void 0;
const INoteRepository_1 = require("../../domain/repositories/INoteRepository");
class SoftDeleteNoteUseCase {
    noteRepository;
    constructor(noteRepository) {
        this.noteRepository = noteRepository;
    }
    async execute(input) {
        if (!input.id || !input.userId) {
            throw new Error('Note ID and User ID are required.');
        }
        await this.noteRepository.softDelete(input.id, input.userId);
    }
}
exports.SoftDeleteNoteUseCase = SoftDeleteNoteUseCase;
//# sourceMappingURL=SoftDeleteNoteUseCase.js.map