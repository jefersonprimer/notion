import { User } from "../../../../domain/entities/User";
import { IUserRepository } from "../../../../domain/repositories/IUserRepository";
export declare class SupabaseUserRepository implements IUserRepository {
    private mapToUser;
    findById(id: string): Promise<User | null>;
    create(data: {
        email: string;
        password: string;
        displayName: string;
    }): Promise<User>;
    findByEmail(email: string): Promise<User | null>;
    findByResetToken(token: string): Promise<User | null>;
    update(user: User): Promise<void>;
    delete(id: string): Promise<void>;
}
//# sourceMappingURL=SupabaseUserRepository.d.ts.map