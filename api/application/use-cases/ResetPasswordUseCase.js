"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResetPasswordUseCase = void 0;
const IUserRepository_1 = require("../../domain/repositories/IUserRepository");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
class ResetPasswordUseCase {
    userRepository;
    constructor(userRepository) {
        this.userRepository = userRepository;
    }
    async execute(token, newPassword) {
        if (!token || !newPassword) {
            throw new Error('Access token and new password are required.');
        }
        const user = await this.userRepository.findByResetToken(token);
        if (!user) {
            throw new Error("Invalid or expired password reset token.");
        }
        if (!user.resetPasswordExpires || new Date(user.resetPasswordExpires) < new Date()) {
            throw new Error("Invalid or expired password reset token.");
        }
        if (newPassword.length < 6) {
            throw new Error("Password must be at least 6 characters long.");
        }
        const passwordHash = await bcryptjs_1.default.hash(newPassword, 8);
        user.password = passwordHash;
        user.resetPasswordToken = null;
        user.resetPasswordExpires = null;
        await this.userRepository.update(user);
    }
}
exports.ResetPasswordUseCase = ResetPasswordUseCase;
//# sourceMappingURL=ResetPasswordUseCase.js.map