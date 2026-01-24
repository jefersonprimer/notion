"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateNoteUseCase = void 0;
const INoteRepository_1 = require("../../domain/repositories/INoteRepository");
const Note_1 = require("../../domain/entities/Note");
class CreateNoteUseCase {
    noteRepository;
    constructor(noteRepository) {
        this.noteRepository = noteRepository;
    }
    async execute(input) {
        // if (!input.title) {
        //     throw new Error('Title is required.');
        // }
        const title = input.title && input.title.trim() !== "" ? input.title : "Sem título";
        const note = await this.noteRepository.create({
            userId: input.userId,
            title: title,
            description: input.description || null,
            parentId: input.parentId || null,
        });
        return note;
    }
}
exports.CreateNoteUseCase = CreateNoteUseCase;
//# sourceMappingURL=CreateNoteUseCase.js.map