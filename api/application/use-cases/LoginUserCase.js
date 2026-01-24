"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoginUserCase = void 0;
const IUserRepository_1 = require("../../domain/repositories/IUserRepository");
const LoginDTO_1 = require("../dtos/LoginDTO");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
class LoginUserCase {
    userRepository;
    constructor(userRepository) {
        this.userRepository = userRepository;
    }
    async execute({ email, password }) {
        // 1. Busca o usuário pelo email
        const user = await this.userRepository.findByEmail(email);
        if (!user) {
            throw new Error("Invalid email or password.");
        }
        // 2. Verifica a senha
        if (!user.password) {
            // Se o usuário não tem senha (login social antigo?), falha.
            throw new Error("Invalid email or password.");
        }
        const isPasswordValid = await bcryptjs_1.default.compare(password, user.password);
        if (!isPasswordValid) {
            throw new Error("Invalid email or password.");
        }
        // 3. Gera o token JWT
        const secret = process.env.JWT_SECRET;
        if (!secret) {
            throw new Error("JWT_SECRET is not defined.");
        }
        const token = jsonwebtoken_1.default.sign({ sub: user.id, email: user.email }, secret, { expiresIn: '7d' } // Token válido por 7 dias
        );
        return {
            user: {
                id: user.id,
                email: user.email,
                displayName: user.displayName,
                avatarUrl: user.avatarUrl,
            },
            accessToken: token,
        };
    }
}
exports.LoginUserCase = LoginUserCase;
//# sourceMappingURL=LoginUserCase.js.map