import { IUserRepository } from "../../domain/repositories/IUserRepository";
import { LoginInputDTO, LoginOutputDTO } from "../dtos/LoginDTO";
export declare class LoginUserCase {
    private userRepository;
    constructor(userRepository: IUserRepository);
    execute({ email, password }: LoginInputDTO): Promise<LoginOutputDTO>;
}
//# sourceMappingURL=LoginUserCase.d.ts.map