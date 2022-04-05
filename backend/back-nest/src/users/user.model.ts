
export interface User {
    id: string; 
    login: string; 
    pass: string,
    status: UserStatus;
    level: number; 
    ranking: number; 
    gamesWin: number;     
    gamesLost: number; 
    twoFa: number; 

}

export enum UserStatus {
    IS_GUEST="IS_GUEST", 
    IS_42API ="IS_42API", 
}