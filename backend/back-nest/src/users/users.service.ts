import { Injectable } from '@nestjs/common';
import { User, UserStatus } from './user.model'; 
import {v4 as uuid } from 'uuid';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
    private users: User[] = [];  

    getAllUsers() {
        return this.users; 
    }

    createUser(createUserDto: CreateUserDto) : User {
        const { login, pass} = createUserDto; 
        const user: User = {
            id: uuid(), 
            login, 
            pass,
            status: UserStatus.IS_GUEST, 
            level: 0,
            ranking: 0, 
            gamesWin: 0,
            gamesLost: 0, 
            profilPicture: null,
            twoFa: 0 


        }; 
        if(!this.searchUser(login)) {
           this.users.push(user); 
            return user; 
        }
    }

    private searchUser(login:string) : User { 
        return this.users.find((user) => user.login ==login); 
    } 




}