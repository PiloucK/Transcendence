import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { Friend, UserStatus } from "./user.model";

@Entity()

export class User {
    @PrimaryGeneratedColumn('uuid')
    id: string; 

    @Column({unique:true})
    login: string; 

    @Column()
    password: string; 

    @Column()
    level: number; 

    @Column()
    ranking: number;

    @Column()
    gamesWin: number; 

    @Column()
    gamesLost: number; 

    @Column()
    status: UserStatus; 

    @Column()
    relations: Friend[]; 


}