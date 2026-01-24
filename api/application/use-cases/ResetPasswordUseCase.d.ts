import { IUserRepository } from '../../domain/repositories/IUserRepository';
export declare class ResetPasswordUseCase {
    private userRepository;
    constructor(userRepository: IUserRepository);
    execute(token: string, newPassword: string): Promise<void>;
}
//# sourceMappingURL=ResetPasswordUseCase.d.ts.map