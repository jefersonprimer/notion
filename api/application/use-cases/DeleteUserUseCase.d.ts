import { IUserRepository } from '../../domain/repositories/IUserRepository';
import { INoteRepository } from '../../domain/repositories/INoteRepository';
export declare class DeleteUserUseCase {
    private userRepository;
    private noteRepository;
    constructor(userRepository: IUserRepository, noteRepository: INoteRepository);
    execute(userId: string): Promise<void>;
}
//# sourceMappingURL=DeleteUserUseCase.d.ts.map