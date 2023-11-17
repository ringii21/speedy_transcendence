import { UserService } from './user.service';
import { User as UserModel } from '@prisma/client';
export declare class AppController {
    private readonly userService;
    constructor(userService: UserService);
    getUserByEmail(email: string): Promise<UserModel>;
    signupUser(userData: {
        name?: string;
        email: string;
    }): Promise<UserModel>;
}
