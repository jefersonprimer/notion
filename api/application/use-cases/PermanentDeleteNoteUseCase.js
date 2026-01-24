"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PermanentDeleteNoteUseCase = void 0;
const INoteRepository_1 = require("../../domain/repositories/INoteRepository");
class PermanentDeleteNoteUseCase {
    noteRepository;
    constructor(noteRepository) {
        this.noteRepository = noteRepository;
    }
    async execute(input) {
        if (!input.id || !input.userId) {
            throw new Error('Note ID and User ID are required.');
        }
        await this.noteRepository.permanentDelete(input.id, input.userId);
    }
}
exports.PermanentDeleteNoteUseCase = PermanentDeleteNoteUseCase;
//# sourceMappingURL=PermanentDeleteNoteUseCase.js.map