export interface User {
    id: string;
    login: string;
    pass: string;
    status: UserStatus;
    level: number;
    ranking: number;
    gamesWin: number;
    gamesLost: number;
    twoFa: number;
    profilPicture: string;
}
export interface Friend {
    id: string;
    login: string;
    UserRelation: UsersRelations;
}
export declare enum UserStatus {
    IS_GUEST = "IS_GUEST",
    IS_42API = "IS_42API"
}
export declare enum UsersRelations {
    FRIEND_NO = "NO_FRIEND",
    FRIEND_REQ = "FRIEND_REQ",
    FRIEND_VALID_NEED = "FRIEND_VALID_NEED",
    FRIEND_VALID = "FRIEND_VALID",
    FRIEND_BLOCK = "FRIEND_BLOCK"
}
