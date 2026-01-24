"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeleteUserUseCase = void 0;
const IUserRepository_1 = require("../../domain/repositories/IUserRepository");
const INoteRepository_1 = require("../../domain/repositories/INoteRepository");
class DeleteUserUseCase {
    userRepository;
    noteRepository;
    constructor(userRepository, noteRepository) {
        this.userRepository = userRepository;
        this.noteRepository = noteRepository;
    }
    async execute(userId) {
        if (!userId) {
            throw new Error('User ID is required.');
        }
        // A ordem é importante por causa das chaves estrangeiras do banco de dados.
        // 1. Deleta todas as notas do usuário
        await this.noteRepository.deleteAllByUserId(userId);
        // 2. Deleta o perfil do usuário
        await this.userRepository.delete(userId);
    }
}
exports.DeleteUserUseCase = DeleteUserUseCase;
//# sourceMappingURL=DeleteUserUseCase.js.map