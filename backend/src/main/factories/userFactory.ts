import { CreateUserUseCase } from "../../application/use-cases/CreateUserUseCase";
import { LoginUserCase } from "../../application/use-cases/LoginUserCase";
import { ForgotPasswordUseCase } from "../../application/use-cases/ForgotPasswordUseCase";
import { ResetPasswordUseCase } from "../../application/use-cases/ResetPasswordUseCase";
import { DeleteUserUseCase } from "../../application/use-cases/DeleteUserUseCase";
import { SupabaseAuthRepository } from "../../infrastructure/database/supabase/repositories/SupabaseAuthRepository";
import { SupabaseUserRepository } from "../../infrastructure/database/supabase/repositories/SupabaseUserRepository";
import { SupabaseNoteRepository } from "../../infrastructure/database/supabase/repositories/SupabaseNoteRepository";
import { UserController } from "../../presentation/controllers/UserController";

// 1. Instanciar os repositórios
const supabaseUserRepository = new SupabaseUserRepository();
const supabaseAuthRepository = new SupabaseAuthRepository();
const supabaseNoteRepository = new SupabaseNoteRepository();

// 2. Instanciar os casos de uso com suas dependências
const createUserUseCase = new CreateUserUseCase(supabaseUserRepository);
const loginUseCase = new LoginUserCase(supabaseAuthRepository, supabaseUserRepository);
const forgotPasswordUseCase = new ForgotPasswordUseCase(supabaseAuthRepository);
const resetPasswordUseCase = new ResetPasswordUseCase(supabaseAuthRepository);
const deleteUserUseCase = new DeleteUserUseCase(
  supabaseAuthRepository,
  supabaseUserRepository,
  supabaseNoteRepository
);

// 3. Instanciar o controller, injetando os casos de uso
const userController = new UserController(
  createUserUseCase,
  loginUseCase,
  forgotPasswordUseCase,
  resetPasswordUseCase,
  deleteUserUseCase
);

export { userController };
