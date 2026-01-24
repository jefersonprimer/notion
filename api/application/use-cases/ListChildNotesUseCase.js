"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ListChildNotesUseCase = void 0;
const INoteRepository_1 = require("../../domain/repositories/INoteRepository");
const Note_1 = require("../../domain/entities/Note");
class ListChildNotesUseCase {
    noteRepository;
    constructor(noteRepository) {
        this.noteRepository = noteRepository;
    }
    async execute(parentId) {
        if (!parentId) {
            throw new Error('Parent ID is required.');
        }
        return this.noteRepository.findByParentId(parentId);
    }
}
exports.ListChildNotesUseCase = ListChildNotesUseCase;
//# sourceMappingURL=ListChildNotesUseCase.js.map