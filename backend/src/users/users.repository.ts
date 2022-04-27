import { EntityRepository, Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './user.entity';

@EntityRepository(User)
export class UsersRepository extends Repository<User> {
  async createUser(createUserDto: CreateUserDto): Promise<User> {
    const { login42 } = createUserDto;

    let user = await this.findOne(login42);
    if (!user) {
      user = this.create({
        login42,
        token42: '', // to fill
        username: login42,
      });

      await this.save(user);
    }

    return user;
  }
}
