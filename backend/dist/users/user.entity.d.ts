import { UserStatus } from "./user-status.enum";
export declare class User {
    id: string;
    login: string;
    password: string;
    status: UserStatus;
    level: number;
    ranking: number;
    gamesWin: number;
    gamesLost: number;
    twoFa: boolean;
}
export declare class UserInfos {
    id: string;
    login: string;
    level: number;
    ranking: number;
    gamesWin: number;
    gamesLost: number;
}
