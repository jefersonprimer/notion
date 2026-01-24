import { User } from "../entities/User";
export interface IUserRepository {
    create(data: {
        email: string;
        password: string;
        displayName: string;
    }): Promise<User>;
    findByEmail(email: string): Promise<User | null>;
    findById(id: string): Promise<User | null>;
    findByResetToken(token: string): Promise<User | null>;
    update(user: User): Promise<void>;
    delete(id: string): Promise<void>;
}
//# sourceMappingURL=IUserRepository.d.ts.map