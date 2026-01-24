"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userController = void 0;
const CreateUserUseCase_1 = require("../../application/use-cases/CreateUserUseCase");
const LoginUserCase_1 = require("../../application/use-cases/LoginUserCase");
const ForgotPasswordUseCase_1 = require("../../application/use-cases/ForgotPasswordUseCase");
const ResetPasswordUseCase_1 = require("../../application/use-cases/ResetPasswordUseCase");
const DeleteUserUseCase_1 = require("../../application/use-cases/DeleteUserUseCase");
const SupabaseUserRepository_1 = require("../../infrastructure/database/supabase/repositories/SupabaseUserRepository");
const SupabaseNoteRepository_1 = require("../../infrastructure/database/supabase/repositories/SupabaseNoteRepository");
const UserController_1 = require("../../presentation/controllers/UserController");
const EmailService_1 = require("../../infrastructure/services/EmailService");
// 1. Instanciar os repositórios
const supabaseUserRepository = new SupabaseUserRepository_1.SupabaseUserRepository();
const supabaseNoteRepository = new SupabaseNoteRepository_1.SupabaseNoteRepository();
const emailService = new EmailService_1.EmailService();
// 2. Instanciar os casos de uso com suas dependências
const createUserUseCase = new CreateUserUseCase_1.CreateUserUseCase(supabaseUserRepository);
const loginUseCase = new LoginUserCase_1.LoginUserCase(supabaseUserRepository);
const forgotPasswordUseCase = new ForgotPasswordUseCase_1.ForgotPasswordUseCase(supabaseUserRepository, emailService);
const resetPasswordUseCase = new ResetPasswordUseCase_1.ResetPasswordUseCase(supabaseUserRepository);
const deleteUserUseCase = new DeleteUserUseCase_1.DeleteUserUseCase(supabaseUserRepository, supabaseNoteRepository);
// 3. Instanciar o controller, injetando os casos de uso
const userController = new UserController_1.UserController(createUserUseCase, loginUseCase, forgotPasswordUseCase, resetPasswordUseCase, deleteUserUseCase);
exports.userController = userController;
//# sourceMappingURL=userFactory.js.map