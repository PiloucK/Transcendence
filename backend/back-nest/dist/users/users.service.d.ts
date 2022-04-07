import { User, UserInfos } from './user.entity';
import { CreateUserDto } from './dto/create-user.dto';
export declare class UsersService {
    private users;
    getAllUsers(): User[];
    createUser(createUserDto: CreateUserDto): User;
    private searchUser;
    getUserInfos(login: string): UserInfos;
}
