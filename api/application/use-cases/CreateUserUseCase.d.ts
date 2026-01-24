import { IUserRepository } from "../../domain/repositories/IUserRepository";
import { CreateUserInputDTO, CreateUserOutputDTO } from "../dtos/CreateUserDTO";
export declare class CreateUserUseCase {
    private userRepository;
    constructor(userRepository: IUserRepository);
    execute({ email, password, displayName }: CreateUserInputDTO): Promise<CreateUserOutputDTO>;
}
//# sourceMappingURL=CreateUserUseCase.d.ts.map