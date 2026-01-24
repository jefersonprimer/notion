import { IUserRepository } from '../../domain/repositories/IUserRepository';
import { EmailService } from '../../infrastructure/services/EmailService';
export declare class ForgotPasswordUseCase {
    private userRepository;
    private emailService;
    constructor(userRepository: IUserRepository, emailService: EmailService);
    execute(email: string): Promise<void>;
}
//# sourceMappingURL=ForgotPasswordUseCase.d.ts.map