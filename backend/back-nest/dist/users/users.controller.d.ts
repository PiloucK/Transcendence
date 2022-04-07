import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { User, UserInfos } from './user.entity';
export declare class UsersController {
    private usersService;
    constructor(usersService: UsersService);
    createUser(createUserDto: CreateUserDto): User;
    getUserById(login: string): UserInfos;
}
