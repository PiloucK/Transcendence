import { UserRelation, UserStatus } from "./user-status.enum";
export interface User {
    id: string;
    login: string;
    password: string;
    status: UserStatus;
    level: number;
    ranking: number;
    gamesWin: number;
    gamesLost: number;
    twoFa: number;
}
export interface interactions {
    login1: string;
    login2: string;
    relation: UserRelation;
}
