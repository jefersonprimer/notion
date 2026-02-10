import { CreateUserUseCase } from "../../application/use-cases/CreateUserUseCase";
import { LoginUserCase } from "../../application/use-cases/LoginUserCase";
import { ForgotPasswordUseCase } from "../../application/use-cases/ForgotPasswordUseCase";
import { ResetPasswordUseCase } from "../../application/use-cases/ResetPasswordUseCase";
import { DeleteUserUseCase } from "../../application/use-cases/DeleteUserUseCase";
import { SupabaseUserRepository } from "../../infrastructure/database/supabase/repositories/SupabaseUserRepository";
import { SupabaseNoteRepository } from "../../infrastructure/database/supabase/repositories/SupabaseNoteRepository";
import { EmailService } from "../../infrastructure/services/EmailService";

// 1. Instanciar os repositórios
const supabaseUserRepository = new SupabaseUserRepository();
const supabaseNoteRepository = new SupabaseNoteRepository();
const emailService = new EmailService();

// 2. Instanciar os casos de uso com suas dependências
const createUserUseCase = new CreateUserUseCase(supabaseUserRepository);
const loginUseCase = new LoginUserCase(supabaseUserRepository);
const forgotPasswordUseCase = new ForgotPasswordUseCase(supabaseUserRepository, emailService);
const resetPasswordUseCase = new ResetPasswordUseCase(supabaseUserRepository);
const deleteUserUseCase = new DeleteUserUseCase(
  supabaseUserRepository,
  supabaseNoteRepository
);

export { 
  createUserUseCase,
  loginUseCase,
  forgotPasswordUseCase,
  resetPasswordUseCase,
  deleteUserUseCase
};