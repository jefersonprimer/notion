"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetNoteByIdUseCase = void 0;
const INoteRepository_1 = require("../../domain/repositories/INoteRepository");
const Note_1 = require("../../domain/entities/Note");
class GetNoteByIdUseCase {
    noteRepository;
    constructor(noteRepository) {
        this.noteRepository = noteRepository;
    }
    async execute(input) {
        if (!input.id || !input.userId) {
            throw new Error('Note ID and User ID are required.');
        }
        return this.noteRepository.findById(input.id, input.userId);
    }
}
exports.GetNoteByIdUseCase = GetNoteByIdUseCase;
//# sourceMappingURL=GetNoteByIdUseCase.js.map