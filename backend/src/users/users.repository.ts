import { EntityRepository, Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './user.entity';

@EntityRepository(User)
export class UsersRepository extends Repository<User> {
  async createUser(createUserDto: CreateUserDto): Promise<User> {
    const { login42 } = createUserDto;
    const user = this.create({
      login42,
      token42: '',
      username: login42,
      elo: 0,
      gamesWon: 0,
      gamesLost: 0,
      twoFa: false,
    });

    // if (login42 does not exist)
    await this.save(user);
    return user;
  }
}
