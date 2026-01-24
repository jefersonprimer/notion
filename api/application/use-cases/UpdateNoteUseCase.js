"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateNoteUseCase = void 0;
const INoteRepository_1 = require("../../domain/repositories/INoteRepository");
const Note_1 = require("../../domain/entities/Note");
class UpdateNoteUseCase {
    noteRepository;
    constructor(noteRepository) {
        this.noteRepository = noteRepository;
    }
    async execute(input) {
        if (!input.id || !input.userId) {
            throw new Error('Note ID and User ID are required.');
        }
        if (Object.keys(input.data).length === 0) {
            throw new Error('No data provided for update.');
        }
        return this.noteRepository.update(input.id, input.userId, input.data);
    }
}
exports.UpdateNoteUseCase = UpdateNoteUseCase;
//# sourceMappingURL=UpdateNoteUseCase.js.map