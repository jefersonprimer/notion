"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateUserUseCase = void 0;
const IUserRepository_1 = require("../../domain/repositories/IUserRepository");
const CreateUserDTO_1 = require("../dtos/CreateUserDTO");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
class CreateUserUseCase {
    userRepository;
    // Usamos Injeção de Dependência para desacoplar o caso de uso do banco de dados
    constructor(userRepository) {
        this.userRepository = userRepository;
    }
    async execute({ email, password, displayName }) {
        // 1. Verificar se o usuário já existe
        const existingUser = await this.userRepository.findByEmail(email);
        if (existingUser) {
            throw new Error("User already exists.");
        }
        // 2. Hash da senha
        const passwordHash = await bcryptjs_1.default.hash(password, 8);
        // 3. Criar usuário com senha hash
        const newUser = await this.userRepository.create({
            email,
            password: passwordHash,
            displayName
        });
        return {
            id: newUser.id,
            email: newUser.email,
        };
    }
}
exports.CreateUserUseCase = CreateUserUseCase;
//# sourceMappingURL=CreateUserUseCase.js.map