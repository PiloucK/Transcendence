import { Friend, UserStatus } from "./user.model";
export declare class User {
    id: string;
    login: string;
    password: string;
    level: number;
    ranking: number;
    gamesWin: number;
    gamesLost: number;
    status: UserStatus;
    relations: Friend[];
}
