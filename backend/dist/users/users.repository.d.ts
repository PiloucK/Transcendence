import { Repository } from "typeorm";
import { CreateUserDto } from "./dto/create-user.dto";
import { User } from "./user.entity";
export declare class UserRepository extends Repository<User> {
    createUser(createUserDto: CreateUserDto): Promise<User>;
}
