import { CreateUserUseCase } from "../../application/use-cases/CreateUserUseCase";
import { LoginUseCase } from "../../application/use-cases/LoginUseCase";
import { SupabaseAuthRepository } from "../../infrastructure/database/supabase/repositories/SupabaseAuthRepository";
import { SupabaseUserRepository } from "../../infrastructure/database/supabase/repositories/SupabaseUserRepository";
import { UserController } from "../../presentation/controllers/UserController";

// 1. Instanciar os repositórios
const supabaseUserRepository = new SupabaseUserRepository();
const supabaseAuthRepository = new SupabaseAuthRepository();

// 2. Instanciar os casos de uso com suas dependências
const createUserUseCase = new CreateUserUseCase(supabaseUserRepository);
const loginUseCase = new LoginUseCase(supabaseAuthRepository, supabaseUserRepository);

// 3. Instanciar o controller, injetando os casos de uso
const userController = new UserController(createUserUseCase, loginUseCase);

export { userController };
