import { UsersService } from './users.service';
import { User } from './user.model';
import { CreateUserDto } from './dto/create-user.dto';
export declare class UsersController {
    private usersService;
    constructor(usersService: UsersService);
    getAllTask(): User[];
    createUser(createUserDto: CreateUserDto): User;
}
